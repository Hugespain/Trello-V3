import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  private fb: FormBuilder;
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  public myForm: FormGroup;

  constructor() {
    this.fb = inject(FormBuilder);
    this.myForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  login() {
    const { email, password } = this.myForm.value;

    this.authService.login(email, password)
    .subscribe(() => {
      if (this.authService.authStatus() === 'authenticated') {
        this.router.navigate(['/tasks']); // Redirige a la ruta de tareas
      } else if (this.authService.authStatus() === 'notAuthenticated') {
        this.snackBar.open('Login incorrecto', 'Cerrar', {
          duration: 3000,
        });
      } else {
        this.snackBar.open('Error en la autenticación', 'Cerrar', {
          duration: 3000,
        });
      }
    });
}
}
