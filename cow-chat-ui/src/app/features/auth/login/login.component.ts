import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { AuthResponseDto } from '../../../models/auth-response-dto';
import { UserResponseDto } from '../../../models/user-response-dto';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{

  form!: FormGroup;

  constructor(private authService: AuthService,
              private userService: UserService,
              private fb: FormBuilder,
              private router:Router
  ){}

  ngOnInit(): void {
    this.form = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

     this.authService.$login(this.form.value).subscribe({
      next: (response: AuthResponseDto) => {
        this.authService.saveToken(response.jwt);
        this.authService.saveUserId(response.userId)
        this.userService.findUserLogged();
        alert("Logueado con éxito");
        this.redirectAtChat();
      },
      error: (err) => console.error('Error al loguear cuenta:', err)
    });
  }

  redirectAtChat(){
    this.router.navigate(["/chat"]);
  }

}
