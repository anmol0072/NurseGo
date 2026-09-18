import { Server as SocketIOServer } from 'socket.io';
import { Server as HttpServer } from 'http';

let io: SocketIOServer;

export const initSocket = (server: HttpServer) => {
  io = new SocketIOServer(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log("Socket connected: ${socket.id}");

    socket.on('join_nurse_room', () => {
      socket.join('nurses');
      console.log("Socket ${socket.id} joined nurses room");
    });

    socket.on('join_patient_room', (patientId: string) => {
      socket.join("patient_${patientId}");
      console.log("Socket ${socket.id} joined patient room: ${patientId}");
    });

    socket.on('join_booking_room', (bookingId: string) => {
      socket.join(`booking_${bookingId}`);
      console.log(`Socket ${socket.id} joined booking room: ${bookingId}`);
    });

    socket.on('update_nurse_location', (data: { bookingId: string; latitude: number; longitude: number }) => {
      // Broadcast the location to the patient in the booking room
      io.to(`booking_${data.bookingId}`).emit('nurse_location', {
        latitude: data.latitude,
        longitude: data.longitude
      });
    });

    socket.on('disconnect', () => {
      console.log("Socket disconnected: ${socket.id}");
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io is not initialized!');
  }
  return io;
};
