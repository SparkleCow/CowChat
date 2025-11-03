import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListComponent } from "../user-list/user-list.component";
import { UserService } from '../../../core/services/user.service';
import { ChatSocketService } from '../../../core/services/chat-socket.service';
import { UserResponseDto } from '../../../models/user-response-dto';
import { ChatResponseDto } from '../../../models/chat-response-dto';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [UserListComponent, CommonModule, FormsModule, RouterOutlet],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {

  users: UserResponseDto[] = [];
  receiverUserId!: string;
  chat!: ChatResponseDto;
  newMessage: string = '';
  user!: UserResponseDto;
  isMobile = false;
  chatOpened = false;
  informationPanelOpened = false;


  private userSub?: Subscription;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private chatSocketService: ChatSocketService,
    private router: Router
  ) {}

  ngOnInit(): void {
  this.checkScreenSize();

  this.chatOpened = this.router.url.includes('/chat/page');
  this.informationPanelOpened = this.router.url.includes('/chat/information')

  this.router.events
    .pipe(filter(e => e instanceof NavigationEnd))
    .subscribe((event: any) => {
      this.chatOpened = event.urlAfterRedirects.includes('/chat/page');
      this.informationPanelOpened = event.urlAfterRedirects.includes('/chat/information');
    });

  this.userService.loadAllUsers();

  this.userSub = this.userService.users$.subscribe({
    next: (users) => (this.users = users),
  });

  this.chatSocketService.connect(() => {
    const userId = this.authService.getUserId();
    if (userId) {
      this.chatSocketService.sendPresence(userId, true);
    }

    this.chatSocketService.subscribeToPresence((data) => {
      console.log(`Usuario ${data.userId} está ${data.online ? 'online' : 'offline'}`);
      this.userService.updateUserPresence(data.userId, data.online);
    });
  });

  this.userService.user$.subscribe({
    next: (user) => {
      if (user) this.user = user;
    },
  });

  this.userService.findUserLogged();

  window.addEventListener('beforeunload', () => {
    const userId = this.authService.getUserId();
    if (userId) {
      this.chatSocketService.sendPresence(userId, false);
    }
  });
}

  @HostListener('window:resize')
  checkScreenSize() {
    this.isMobile = window.innerWidth <= 600;
  }

  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
    this.chatSocketService.disconnect();
  }
}
