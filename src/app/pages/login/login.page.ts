import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class LoginPage {

  email = '';
  password = '';
  cargando = false;
  error = '';
  modoRegistro = false;

  constructor(private auth: AuthService, private router: Router) {}

  async submit() {
    if (!this.email || !this.password) {
      this.error = 'Por favor completa todos los campos.';
      return;
    }

    this.cargando = true;
    this.error = '';

    try {
      if (this.modoRegistro) {
        await this.auth.register(this.email, this.password);
        this.error = '¡Registro exitoso! Revisa tu correo para confirmar tu cuenta.';
        this.modoRegistro = false;
      } else {
        await this.auth.login(this.email, this.password);
        this.router.navigate(['/poemas'], { replaceUrl: true });
      }
    } catch (e: any) {
      if (e.message?.includes('Invalid login credentials')) {
        this.error = 'Correo o contraseña incorrectos.';
      } else if (e.message?.includes('Email not confirmed')) {
        this.error = 'Debes confirmar tu correo antes de iniciar sesión.';
      } else if (e.message?.includes('User already registered')) {
        this.error = 'Este correo ya está registrado.';
      } else {
        this.error = e.message || 'Ocurrió un error inesperado.';
      }
    } finally {
      this.cargando = false;
    }
  }

  toggleModo() {
    this.modoRegistro = !this.modoRegistro;
    this.error = '';
  }
}
