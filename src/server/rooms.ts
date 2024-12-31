import axios from "axios";

export const createRoom = async (ownerNickname: string) => {
    const response = await axios.post(`https://api.myrundraw.klr.kr/api/rooms`,null,{params:{nickname : ownerNickname}});
    return response.data;
};
  
export const joinRoom = async (roomId: string, nickname: string) => {
    const response = await axios.post(`https://api.myrundraw.klr.kr/api/rooms/${roomId}/join`,null,{params:{nickname : nickname}});;
    return response.data;
};
  