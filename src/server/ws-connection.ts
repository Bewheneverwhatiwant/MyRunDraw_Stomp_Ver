import { Client } from '@stomp/stompjs';

let stompClient: Client | null = null;

/**
 * STOMP 연결
 */

export const connectStomp = async () => {
    // const sockJS = new SockJS('https://api.myrundraw.klr.kr/ws-stomp'); 
    return new Promise<void>((resolve, reject) => {
        stompClient = new Client({
            // webSocketFactory: () => sockJS as any,
            brokerURL: "wss://api.myrundraw.klr.kr/ws-stomp",
            debug: (str) => console.log('STOMP: ' + str),
            onConnect: (frame) => {
                console.log('STOMP Connected:', frame);
                resolve();
            },
            onStompError: (frame) => {
                console.error('STOMP Error', frame);
                reject(frame);
            },
            onDisconnect: () => {
                console.log('STOMP Disconnected');
            },
        });

        stompClient.activate(); 
    });
};

/**
 * 방 구독
 */
export const subscribeRoom = (roomId: string, onMessage: (body: string) => void) => {
  if (!stompClient) return;
  stompClient.subscribe(`/room/${roomId}`, (message) => {
    onMessage(message.body);
  });
};

/**
 * 메시지 전송
 */
export const sendMessage = (roomId: string, payload: any) => {
  if (!stompClient) return;
  stompClient.publish({
    destination: `/send/room/${roomId}`,
    body: JSON.stringify(payload),
  });
};

/**
 * STOMP 연결 해제
 */
export const disconnectStomp = () => {
  if (stompClient && stompClient.active) {
    stompClient.deactivate();
  }
};
