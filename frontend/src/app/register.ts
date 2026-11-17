import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

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

  protected profile: Profile | null = null;
  protected step: 1 | 2 = 1;
  protected submitted = false;

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
    if (this.registrationForm.invalid || !this.profile) {
      return;
    }
    this.submitted = true;
  }
}
