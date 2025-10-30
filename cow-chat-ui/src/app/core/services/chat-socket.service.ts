import { Injectable } from '@angular/core';
import { Client, Frame, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { MessageResponseDto } from '../../models/message-response-dto';

@Injectable({
  providedIn: 'root'
})
export class ChatSocketService {

  // private url:string = "http://localhost:8080"
  private url:string = "http://192.168.1.2:8080"
  private stompClient: Client | null = null;
  private connected = false;

  connect(onConnected?: () => void): void {
    if (this.stompClient?.connected) {
      onConnected?.();
      return;
    }

    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(`${this.url}/ws`),
      reconnectDelay: 5000,
    });

    this.stompClient.onConnect = (frame: Frame) => {
      this.connected = true;
      onConnected?.();
    };

    this.stompClient.onStompError = (frame: Frame) => {
      console.error('Broker error:', frame.headers['message']);
      console.error('Details:', frame.body);
    };

    this.stompClient.activate();
  }

  disconnect(): void {
    if (this.stompClient && this.connected) {
      this.stompClient.deactivate();
      this.connected = false;
      console.log('WebSocket disconnected');
    }
  }

  sendMessage(chatId: string, payload: any): void {
    if (!this.connected || !this.stompClient) {
      console.warn('Not connected to WebSocket');
      return;
    }

    const destination = `/app/chat/${chatId}/send`;

    this.stompClient.publish({
      destination,
      body: JSON.stringify(payload)
    });
  }

  subscribeToChat(chatId: string, onMessage: (msg: MessageResponseDto) => void) {
    if (!this.connected || !this.stompClient) {
      console.warn("WebSocket no conectado aún");
      return;
    }

    const topic = `/topic/chat/${chatId}`;

    const subscription = this.stompClient.subscribe(topic, (msg: IMessage) => {
      const message = JSON.parse(msg.body) as MessageResponseDto;
      onMessage(message);
    });

    return subscription;
  }

  sendPresence(userId: string, online: boolean): void {
    if (!this.connected || !this.stompClient) return;

    this.stompClient.publish({
      destination: `/app/presence`,
      body: JSON.stringify({ userId, online })
    });
  }

  subscribeToPresence(onPresenceChange: (data: { userId: string; online: boolean }) => void) {
    if (!this.connected || !this.stompClient) {
      console.warn("WebSocket no conectado aún");
      return;
    }

    const subscription = this.stompClient.subscribe('/topic/presence', (msg: IMessage) => {
      const data = JSON.parse(msg.body);
      onPresenceChange(data);
    });

    return subscription;
  }

}
