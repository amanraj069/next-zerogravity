import { io, Socket } from "socket.io-client";
import API_BASE_URL from "@/config/api";

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(API_BASE_URL, {
      transports: ["websocket"],
      withCredentials: true,
    });
  }
  return socket;
};

export const joinQuizRoom = (quizId: string) => {
  const s = getSocket();
  s.emit("quiz:join-room", { quizId });
};
