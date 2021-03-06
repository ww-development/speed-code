import io from 'socket.io-client';
let socket:any;

export const initiateSocket = () => {
  socket = io('http://192.168.0.135:80', {
    withCredentials: true 
  });
}

export const disconnectSocket = () => {
  console.log('Disconnecting socket...');
  if(socket) socket.disconnect();
}

export const subscribeToSocket = (cb: (a: string) => void) => {
  if (!socket) return(true);
  socket.on('result', (msg: string) => {
    console.log('Websocket event received!');
    cb(msg);
  });
}
export const sendMessage = (message:string) => {
  if (socket) socket.emit('work', message);
}