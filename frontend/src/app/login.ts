import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './app.css',
})
export class LoginPage {
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly http = inject(HttpClient)

  protected mode: 'login' | 'reset' = 'login';
  protected isPasswordVisible = false;
  protected feedback = '';

  protected readonly loginForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [false],
  });

  protected readonly resetForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  constructor() {
    const rememberedEmail = localStorage.getItem('sistecnica-remembered-email');
    if (rememberedEmail) {
      this.loginForm.patchValue({ email: rememberedEmail, rememberMe: true });
    }
  }

  protected submitLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.feedback = 'Confira seu e-mail e sua senha para continuar.';
      return;
    }

    if (this.loginForm.controls.rememberMe.value) {
      localStorage.setItem('sistecnica-remembered-email', this.loginForm.controls.email.value);
    } else {
      localStorage.removeItem('sistecnica-remembered-email');
    }

    this.feedback = '';

    this.http
      .post<{ access_token: string }>('http://localhost:3000/auth/login', {
        email: this.loginForm.controls.email.value,
        senha: this.loginForm.controls.password.value,
      })
      .subscribe({
        next: (res) => {
          localStorage.setItem('sistecnica-token', res.access_token);
          const payload = JSON.parse(atob(res.access_token.split('.')[1]));
          const destino = payload?.tipo_usuario === 'Cliente' ? '/portal' : '/dashboard';
          void this.router.navigateByUrl(destino);
        },
        error: () => {
          this.feedback = 'E-mail ou senha inválidos.';
        },
      });
  }

  protected openResetForm(): void {
    this.resetForm.controls.email.setValue(this.loginForm.controls.email.value);
    this.resetForm.markAsUntouched();
    this.feedback = '';
    this.mode = 'reset';
  }

  protected submitReset(): void {
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }

    this.feedback = 'Solicitação demonstrativa validada. Nenhum e-mail foi enviado.';
  }

  protected togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
}
