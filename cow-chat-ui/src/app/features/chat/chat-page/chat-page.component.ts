import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatResponseDto } from '../../../models/chat-response-dto';
import { UserService } from '../../../core/services/user.service';
import { ChatService } from '../../../core/services/chat.service';
import { ChatSocketService } from '../../../core/services/chat-socket.service';
import { MessageRequestDto, MessageType } from '../../../models/message-request-dto';
import { Subscription } from 'rxjs';
import { UserResponseDto } from '../../../models/user-response-dto';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-chat-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-page.component.html',
  styleUrl: './chat-page.component.css'
})
export class ChatPageComponent implements OnInit, OnDestroy{

  chat!: ChatResponseDto;
  chatName: string = "";

  newMessage: string = "";

  receiverUserId: string | null = null;
  currentUserId: string = "";

  receiverUser!: UserResponseDto | null;

  currentChatSubscription: any = null;

  private chatSub?: Subscription;
  private loggedUserSub?: Subscription;

  constructor(
      private userService: UserService,
      private chatService: ChatService,
      private chatSocketService: ChatSocketService,
      private router:Router
  ){}

  ngOnInit(): void {

    this.loggedUserSub = this.userService.user$.subscribe({
      next: (user) => {
        this.currentUserId = user ? user.id : '';
      }
    });

    this.userService.findUserLogged();

    this.chatSub = this.chatService.chat$.subscribe({
      next: (chat) => {
        if (chat && (!this.chat || this.chat.id !== chat.id)) {

          this.chat = chat;
          this.receiverUserId = this.chat.participantsId.find(id => id !== this.currentUserId) || null;
          if(this.receiverUserId!=null){
            this.receiverUser = this.userService.getUserByIdFromCache(this.receiverUserId);
          }

          if (this.currentChatSubscription) {
            this.currentChatSubscription.unsubscribe();
          }

          this.currentChatSubscription = this.chatSocketService.subscribeToChat(this.chat.id, (message) => {
            if (this.chat && this.chat.id === message.chatId) {
              this.chat.messages.push(message);
            }
          });
        }
      }
    });

    this.userService.getReceiverId().subscribe({
    next: (receiverId) => {
      if (receiverId) {
        this.chatService.findChat(receiverId);
      }
    }
  });
  }

  ngOnDestroy(): void {
    if (this.currentChatSubscription) {
      this.currentChatSubscription.unsubscribe();
      this.currentChatSubscription = null;
    }
    this.chatSub?.unsubscribe();
    this.chatSocketService.disconnect();
    this.loggedUserSub?.unsubscribe();
  }

  sendMessage(): void {
    if (!this.newMessage || !this.chat) return;

    const dto: MessageRequestDto = {
      chatId: this.chat.id,
      senderId: this.currentUserId,
      content: this.newMessage,
      messageType: MessageType.TEXT,
      filePath: '',
      recipientIds: this.chat.participantsId.filter(id => id !== this.currentUserId)
    };

    this.chatSocketService.sendMessage(this.chat.id, dto);
    this.newMessage = '';
  }

  redirectAtGeneralChat(){
    this.router.navigate(["chat"]);
  }
}
