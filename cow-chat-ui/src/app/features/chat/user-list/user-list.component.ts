import { Component, Input, OnInit } from '@angular/core';
import { UserResponseDto } from '../../../models/user-response-dto';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit{

  @Input() loggedUser: UserResponseDto | null = null;

  users: UserResponseDto[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService:UserService
  ) {}

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe({
      next: (users:UserResponseDto[])=>{this.users = users}
    });

    this.userService.loadAllUsers();
  }

  openChat(user: UserResponseDto): void {
    this.userService.saveReceiverId(user.id)
    this.redirectAtChat();
  }

  redirectAtUserInformation(): void {
    this.router.navigate(['information'], { relativeTo: this.route });
  }

  redirectAtChat(){
    this.router.navigate(['page'], { relativeTo: this.route });
  }
}
