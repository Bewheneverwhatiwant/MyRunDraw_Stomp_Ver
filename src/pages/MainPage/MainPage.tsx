import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainContainer } from './MainPage.styled';
import { createRoom, joinRoom } from '../../server/rooms';

const MainPage = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState('');

  const handleCreateRoom = async () => {
    try {
      const nickname = localStorage.getItem('nickname') || 'Guest';
      const room = await createRoom(nickname);
      alert(`방이 생성되었습니다. 방 번호: ${room.roomId}`);
      navigate(`/game/${room.roomId}`);
    } catch (e) {
      console.error(e);
      alert('방 생성 실패');
    }
  };

  const handleJoinRoom = async () => {
    if (!roomId.trim()) {
      alert('방 번호를 입력하세요.');
      return;
    }
    try {
      const nickname = localStorage.getItem('nickname') || 'Guest';
      const room = await joinRoom(roomId, nickname);
      if (room) {
        navigate(`/game/${roomId}`);
      } else {
        alert('방이 존재하지 않습니다.');
      }
    } catch (e) {
      console.error(e);
      alert('방 참가 실패');
    }
  };

  return (
    <MainContainer>
      <div className="title">메인 페이지</div>
      <div className="desc">
        방을 생성하거나 기존 방에 참가해보세요.
      </div>

      <div className="btn-group">
        <button className="btn" onClick={handleCreateRoom}>
          방 생성
        </button>

        <input
          className="room-input"
          type="text"
          placeholder="방 번호"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
        <button className="btn" onClick={handleJoinRoom}>
          방 참가
        </button>
      </div>
    </MainContainer>
  );
};

export default MainPage;
