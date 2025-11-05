import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserResponseDto } from '../../../models/user-response-dto';
import { UserService } from '../../../core/services/user.service';
import { AuthResponseDto } from '../../../models/auth-response-dto';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-information',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-information.component.html',
  styleUrl: './user-information.component.css'
})
export class UserInformationComponent {

  user!: UserResponseDto;

  form!: FormGroup;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  isLoading = false;

  constructor(private fb: FormBuilder,
              private userService: UserService,
              private authService: AuthService,
              private router: Router){}

  ngOnInit(): void {

    this.userService.user$.subscribe({
      next: (user) => {
        if(user){
          this.user = user;
          this.previewUrl = this.user.presignedUrl ? this.user.presignedUrl : "https://st2.depositphotos.com/9447932/47520/v/450/depositphotos_475203180-stock-illustration-cow-vector-illustration-flat-style.jpg";
        }
      }
    });

    this.form = this.fb.group({
      username: [this.user?.username || '', [Validators.required, Validators.minLength(3)]]
    });


  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = () => (this.previewUrl = reader.result);
      reader.readAsDataURL(file);
    }
  }

  uploadImage(): void {
      if (!this.selectedFile) return;

      this.isLoading = true;
      this.userService.uploadUserImage(this.selectedFile).subscribe({
        next: (res) => {
          this.isLoading = false;
          alert('Imagen cargada correctamente.');
        },
        error: (err) => {
          console.error('Error al subir imagen:', err);
          this.isLoading = false;
        }
      });
    }

  updateUsername(): void {
    if (this.form.invalid) return;

    this.isLoading = true;
    const newUsername = this.form.get('username')?.value;

    this.userService.updateUsername(newUsername).subscribe({
      next: (authResponseDto:AuthResponseDto) => {
        this.user.username = newUsername;
        this.isLoading = false;
        this.authService.saveToken(authResponseDto.jwt);
        alert('Nombre de usuario actualizado.');
      },
      error: (err) => {
        console.error('Error al actualizar nombre:', err);
        this.isLoading = false;
      }
    });
  }

  redirectAtChatPage(){
    this.router.navigate(["/chat"]);
  }
}
