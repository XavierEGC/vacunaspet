import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  username = '';
  password = '';
  error = '';
  cargando = false;
  showPass = false;

  constructor(private router: Router, private api: ApiService) {}

  login() {
    this.error = '';
    if (!this.username || !this.password) {
      this.error = 'Por favor ingresa usuario y contraseña';
      return;
    }
    this.cargando = true;

    this.api.login(this.username, this.password).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('usuario', response.username);
        localStorage.setItem('nombre', response.nombre);
        localStorage.setItem('rol', response.rol);
        this.cargando = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error = 'Usuario o contraseña incorrectos';
        this.cargando = false;
      }
    });
  }
}