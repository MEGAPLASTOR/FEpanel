import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as admin from 'firebase-admin';
import { Inject } from '@nestjs/common';
import { FIREBASE_ADMIN } from '../firebase/firebase-admin.module';

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  },
  namespace: '/console',
})
export class ConsoleGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  constructor(@Inject(FIREBASE_ADMIN) private readonly firebaseAdmin: admin.app.App) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token || client.handshake.headers.authorization?.split(' ')[1];
      if (!token) throw new Error('No token provided');
      
      const decodedToken = await this.firebaseAdmin.auth().verifyIdToken(token);
      client.data.user = decodedToken;
      console.log(`Client connected to console: ${client.id} (User: ${decodedToken.uid})`);
    } catch (e) {
      console.log(`Connection rejected: ${client.id}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinSlot')
  handleJoinSlot(@MessageBody() slotId: string, @ConnectedSocket() client: Socket) {
    // Should verify ownership before joining
    client.join(slotId);
    return { event: 'joined', data: slotId };
  }

  @SubscribeMessage('command')
  handleCommand(@MessageBody() data: { slotId: string; command: string }, @ConnectedSocket() client: Socket) {
    // Pass command to agent
    console.log(`Command received for slot ${data.slotId}: ${data.command}`);
  }
}
