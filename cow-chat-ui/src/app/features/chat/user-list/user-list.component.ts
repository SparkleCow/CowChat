import { Component, Input, OnInit } from '@angular/core';
import { UserResponseDto } from '../../../models/user-response-dto';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  @Input() loggedUser: UserResponseDto | null = null;

  users: UserResponseDto[] = [];
  filteredUsers: UserResponseDto[] = [];

  searchTerm: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userService.loadAllUsers(true);

    this.userService.users$.subscribe({
      next: (users) => {
        this.users = users;
        this.filteredUsers = users;
      }
    });
  }

  onSearchChange(): void {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      this.filteredUsers = this.users;
      return;
    }

    this.filteredUsers = this.users.filter(user =>
      user.username?.toLowerCase().includes(term)
    );
  }

  openChat(user: UserResponseDto): void {
    this.userService.saveReceiverId(user.id);
    this.redirectAtChat();
  }

  redirectAtUserInformation(): void {
    this.router.navigate(['information'], { relativeTo: this.route });
  }

  redirectAtChat(): void {
    this.router.navigate(['page'], { relativeTo: this.route });
  }
}
