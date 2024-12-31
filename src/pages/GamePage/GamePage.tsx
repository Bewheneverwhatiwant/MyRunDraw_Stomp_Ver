import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GameContainer } from './GamePage.styled';
import { connectStomp, disconnectStomp, subscribeRoom, sendMessage } from '../../server/ws-connection';

declare global {
  interface Window {
    kakao: any;
  }
}

interface LocationData {
  userId: string;
  lat: number;
  lng: number;
  drawing: boolean;
}

const GamePage: React.FC = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  
  // 유저 닉네임 (주의: 다른 사람과 달라야 함)
  const nickname = localStorage.getItem('nickname') || 'Guest';
  
  // 내가 "그리기" 중인지 여부
  const [isDrawing, setIsDrawing] = useState(false);

  // 내 현재 위치, 상대방 최근 위치
  const [myPosition, setMyPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [otherPositions, setOtherPositions] = useState<{ [userId: string]: { lat: number; lng: number } }>({});
  
  // 카카오 지도 ref & 인스턴스 ref
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  // 내 폴리라인
  const myPolylineRef = useRef<any>(null);
  // 상대방 폴리라인: userId => Polyline
  const otherPolylinesRef = useRef<{ [userId: string]: any }>({});

  /**
   * (선택 사항) 유저별로 다른 색깔을 부여하고 싶다면, userColorMap을 사용
   */
  const userColorMap = useRef<{ [userId: string]: string }>({});

  useEffect(() => {
    if (!roomId) {
      alert('잘못된 방 번호입니다.');
      navigate('/main');
      return;
    }

    // 1) 지도 초기화
    initMap();
    // 2) STOMP WebSocket 연결 & 방 구독
    connectSocket();

    return () => {
      // 언마운트 시
      disconnectStomp();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  /** 지도 초기화 */
  const initMap = () => {
    const { kakao } = window;
    if (!mapRef.current) return;

    const mapContainer = mapRef.current;
    const options = {
      center: new kakao.maps.LatLng(37.5665, 126.9780), // 서울시청 근처
      level: 5,
    };
    const map = new kakao.maps.Map(mapContainer, options);
    mapInstanceRef.current = map;

    // "내" 경로용 폴리라인 (빨간색)
    myPolylineRef.current = new kakao.maps.Polyline({
      map,
      path: [],
      strokeWeight: 5,
      strokeColor: '#e84118', 
      strokeOpacity: 1,
      strokeStyle: 'solid',
    });
  };

  /** WebSocket 연결 후 방 구독 */
  const connectSocket = async () => {
    await connectStomp(); 
    // roomId 구독
    subscribeRoom(roomId as string, (messageBody: string) => {
      const data: LocationData = JSON.parse(messageBody);
      handleOtherUserData(data);
    });
  };

  /**
   * 서버로부터 받은 메시지 처리
   * - 상대방이 그리기 중(drawing=true)일 때만 경로를 그림
   * - userId === nickname이면 무시 (자기 자신)
   */
  const handleOtherUserData = (data: LocationData) => {
    const { kakao } = window;
    const { userId, lat, lng, drawing } = data;

    // 1) 같은 userId(즉, 같은 닉네임)인 경우 무시
    //    (여러 명이 동일한 닉네임을 사용하는 것을 방지해야 함)
    if (userId === nickname) {
      return;
    }

    // 2) 상대방 위치 업데이트 (포커싱용)
    setOtherPositions(prev => ({
      ...prev,
      [userId]: { lat, lng },
    }));

    // 3) 상대방이 그리기 중인지 확인
    if (!drawing) {
      return; 
    }

    // 4) userColorMap에 등록(없으면 생성)
    if (!userColorMap.current[userId]) {
      // 임의로 파란색, 또는 랜덤 색상
      userColorMap.current[userId] = getRandomColor();
    }
    const userColor = userColorMap.current[userId];

    // 5) 해당 유저의 폴리라인이 없으면 새로 생성
    if (!otherPolylinesRef.current[userId]) {
      const newPolyline = new kakao.maps.Polyline({
        map: mapInstanceRef.current,
        path: [],
        strokeWeight: 5,
        strokeColor: userColor, 
        strokeOpacity: 1,
        strokeStyle: 'solid',
      });
      otherPolylinesRef.current[userId] = newPolyline;
    }

    // 6) 폴리라인에 좌표 추가
    const polyline = otherPolylinesRef.current[userId];
    const path = polyline.getPath();
    path.push(new kakao.maps.LatLng(lat, lng));
    polyline.setPath(path);
  };

  /**
   * 내 위치를 주기적으로 전송
   */
  useEffect(() => {
    let intervalId: number | undefined;

    if (isDrawing) {
      // 그리기 시작되면 매초 내 위치 전송
      intervalId = window.setInterval(() => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              const { latitude, longitude } = pos.coords;
              setMyPosition({ lat: latitude, lng: longitude });
              // 내 지도에 경로
              drawMyPath(latitude, longitude);
              // 서버로 전송
              sendMyLocation(latitude, longitude, true);
            },
            (err) => console.error(err),
            { enableHighAccuracy: true }
          );
        }
      }, 1000);
    } else {
      // 그리기 중지 시, interval 해제 후 isDrawing=false로 마지막 위치 전송
      if (intervalId) {
        clearInterval(intervalId);
      }
      navigator.geolocation?.getCurrentPosition(
        (pos) => {
          sendMyLocation(pos.coords.latitude, pos.coords.longitude, false);
        },
        (err) => console.error(err)
      );
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isDrawing]);

  /** 내 경로 그리기 */
  const drawMyPath = (lat: number, lng: number) => {
    if (!myPolylineRef.current) return;
    const { kakao } = window;
    const path = myPolylineRef.current.getPath();
    path.push(new kakao.maps.LatLng(lat, lng));
    myPolylineRef.current.setPath(path);
  };

  /** 서버에 내 위치 + isDrawing 전송 */
  const sendMyLocation = (lat: number, lng: number, isDrawingValue: boolean) => {
    sendMessage(roomId as string, {
      userId: nickname,
      lat,
      lng,
      drawing: isDrawingValue,
    });
  };

  /** 그리기 시작 */
  const handleStartDrawing = () => {
    setIsDrawing(true);
  };

  /** 그리기 중지 */
  const handleStopDrawing = () => {
    setIsDrawing(false);
  };

  /** 게임 종료 */
  const handleEndGame = () => {
    alert('게임을 종료합니다.');
    navigate('/main');
  };

  /** 내 위치로 포커싱 */
  const focusOnMe = () => {
    if (!myPosition) {
      alert('아직 내 위치 정보를 불러오지 못했습니다.');
      return;
    }
    if (mapInstanceRef.current) {
      const { kakao } = window;
      mapInstanceRef.current.setCenter(
        new kakao.maps.LatLng(myPosition.lat, myPosition.lng)
      );
    }
  };

  /** 상대방 위치로 포커싱 */
  const focusOnOther = () => {
    // 여러 상대방 중 마지막 업데이트된 위치로 포커싱
    const userIds = Object.keys(otherPositions);
    if (userIds.length === 0) {
      alert('상대방 위치 정보가 없습니다. (상대방이 아직 그리기 중이 아닐 수도 있음)');
      return;
    }
    const lastUserId = userIds[userIds.length - 1];
    const position = otherPositions[lastUserId];
    if (!position) {
      alert('상대방 위치 정보가 없습니다.');
      return;
    }
    if (mapInstanceRef.current) {
      const { kakao } = window;
      mapInstanceRef.current.setCenter(
        new kakao.maps.LatLng(position.lat, position.lng)
      );
    }
  };

  return (
    <GameContainer>
      <div className="map-wrapper" ref={mapRef}></div>
      <div className="controls">
        <button onClick={handleStartDrawing} disabled={isDrawing}>
          그리기 시작
        </button>
        <button onClick={handleStopDrawing} disabled={!isDrawing}>
          그리기 중지
        </button>
        <button onClick={focusOnMe}>내 위치</button>
        <button onClick={focusOnOther}>상대방 위치</button>
        <button onClick={handleEndGame}>게임 종료</button>
      </div>
    </GameContainer>
  );
};

/** (선택) 다양한 색상 생성을 위한 유틸 함수 */
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export default GamePage;
