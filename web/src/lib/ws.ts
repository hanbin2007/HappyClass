import { io } from 'socket.io-client';
export const socket = io('/room', { path: '/socket.io', autoConnect: true });
