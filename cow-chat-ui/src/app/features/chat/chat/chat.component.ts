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

  private userSub?: Subscription;

  isMobile = false;
  chatOpened = false;

  constructor(
    private userService: UserService,
    private chatSocketService: ChatSocketService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkScreenSize();

    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((event: any) => {
      this.chatOpened = event.urlAfterRedirects.includes('/chat/page');
    });

    this.chatSocketService.connect(() => {});

    this.userService.loadAllUsers();

    this.userSub = this.userService.users$.subscribe({
      next: (users) => this.users = users
    });

    this.userService.user$.subscribe({
      next: (user) => {
        if (user) this.user = user;
      }
    });

    this.userService.findUserLogged();
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
