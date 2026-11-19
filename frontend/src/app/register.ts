import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

type Profile = 'client' | 'technician';

function passwordsMatch(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmation = control.get('confirmPassword')?.value;
  return password === confirmation ? null : { passwordsMismatch: true };
}

@Component({
  selector: 'app-registration',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './app.css',
})
export class RegistrationPage {
  private readonly formBuilder = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly http = inject(HttpClient);

  protected profile: Profile | null = null;
  protected step: 1 | 2 = 1;
  protected submitted = false;
  protected isSubmitting = false;

  protected readonly registrationForm = this.formBuilder.nonNullable.group(
    {
      name: ['', [Validators.required, Validators.minLength(3)]],
      document: ['', [Validators.required, Validators.minLength(11)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.minLength(10)]],
      specialty: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: passwordsMatch },
  );

  constructor() {
    const profile = this.route.snapshot.queryParamMap.get('profile');
    if (profile === 'client' || profile === 'technician') {
      this.selectProfile(profile);
    }
  }

  protected selectProfile(profile: Profile): void {
    this.profile = profile;
    this.registrationForm.controls.specialty.setValidators(
      profile === 'technician' ? Validators.required : null,
    );
    this.registrationForm.controls.specialty.updateValueAndValidity();
    this.step = 2;
  }

  protected returnToProfileSelection(): void {
    this.step = 1;
    this.submitted = false;
  }

  protected submitRegistration(): void {
    this.registrationForm.markAllAsTouched();
    if (this.registrationForm.invalid || !this.profile || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    const { name, document, email, phone, specialty, password } =
      this.registrationForm.getRawValue();

    this.http
      .post('https://sistech-api.onrender.com/usuarios', {
        nome: name,
        email,
        senha: password,
        cpf: document,
        endereco: 'Não informado',
        telefone: phone,
        cargo: this.profile === 'technician' ? specialty : undefined,
        tipo_usuario: this.profile === 'client' ? 'Cliente' : 'Funcionario',
      })
      .subscribe({
        next: () => {
          this.isSubmitting = false;
          this.submitted = true;
        },
        error: (err) => {
          this.isSubmitting = false;
          alert(
            err?.status === 500
              ? 'Este e-mail ou CPF já está cadastrado.'
              : err?.error?.message || 'Erro ao realizar cadastro.',
          );
     },
    });
  }
}