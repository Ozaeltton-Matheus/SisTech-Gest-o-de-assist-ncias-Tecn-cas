import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './app.css',
})
export class LoginPage {
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);

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

    void this.router.navigateByUrl('/dashboard');
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
