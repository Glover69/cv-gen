import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '../../../services/toast.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import {
  UserResponse,
  UserVerification,
  UserSignIn,
} from '../../../models/data.models';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { LottieComponent } from 'ngx-lottie';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule, LottieComponent, ReactiveFormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent {
  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;
  otpForm: FormGroup;
  isLogin: boolean = false;
  isSignUp: boolean = true;
  isLoading: boolean = false;
  isVerificationStep: boolean = false;
  collectedOTP: any;
  currentUser: any;
  customerID!: string;
  signInForm: FormGroup;
  signUpForm: FormGroup;
  lottieConfig = {
    path: 'assets/lottie/loader-2.json', // Relative path to the animation file
    autoplay: true, // Autoplay the animation
    loop: true, // Loop the animation
  };

  constructor(
    private fb: FormBuilder,
    private toastService: ToastService,
    private router: Router,
    private authService: AuthService
  ) {
    this.signInForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', [Validators.required]],
    });

    this.signUpForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      phoneNumber: ['', [Validators.required, this.exactLengthValidator(10)]],
      password: ['', [Validators.required]],
    });

    this.otpForm = this.fb.group({
      otp1: ['', [Validators.required, Validators.maxLength(1)]],
      otp2: ['', [Validators.required, Validators.maxLength(1)]],
      otp3: ['', [Validators.required, Validators.maxLength(1)]],
      otp4: ['', [Validators.required, Validators.maxLength(1)]],
    });
  }

  ngOnInit() {
    const currentUser = this.authService.currentUserValue;
    if (currentUser.token) {
      // logged in so return true
      this.currentUser = currentUser.token;
      // console.log(this.currentUser);
    }
  }

  ngAfterViewInit() {
    // this.otpInputs.first.nativeElement.focus();
  }

  onInput(event: any, index: number) {
    const value = event.target.value;

    // Navigate to the next input if the value length is 1
    if (value.length === 1 && index < this.otpInputs.length - 1) {
      this.otpInputs.toArray()[index + 1].nativeElement.focus();
      // console.log(index);
    }

    // // If backspace is pressed, navigate to the previous input
    // if (event.inputType === 'deleteContentBackward' && index > 0) {
    //   this.otpInputs.toArray()[index - 1].nativeElement.focus();
    // }

    // Collect OTP when all boxes are filled
    if (this.otpForm.valid) {
      const otpValue = Object.values(this.otpForm.value).join('');
      this.collectedOTP = otpValue;
      // console.log('Collected OTP:', this.collectedOTP);
      // Call a method to process the OTP value (e.g., verify it with the server)
    }
  }

  onKeyDown(event: any, index: number) {
    if (event.key === 'Backspace' && index > 0) {
      // Clear the current input and move to the previous one
      this.otpForm.controls[`otp${index + 1}`].setValue('');
      this.otpInputs.toArray()[index - 1].nativeElement.focus();
    }
  }

  toggleLogin() {
    this.isSignUp = false;
    this.isLogin = true;
  }

  toggleSignUp() {
    this.isLogin = false;
    this.isSignUp = true;
  }

  moveToVerification() {
    this.toggleLogin();
    this.isVerificationStep = !this.isVerificationStep;
  }

  exactLengthValidator(length: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value && value.length !== length) {
        return {
          exactLength: { requiredLength: length, actualLength: value.length },
        };
      }
      return null;
    };
  }

  onSubmitVerification() {
    if (this.otpForm.valid) {
      console.log(this.collectedOTP);
      console.log(this.customerID);

      const email =
        this.signUpForm.get('email')?.value ||
        this.signInForm.get('email')?.value;
      console.log(email);
      this.isLoading = true;

      this.authService
        .verifyOTP(this.customerID, this.collectedOTP, email)
        .subscribe(
          (response: HttpResponse<UserResponse>) => {
            if (
              response.status === 200 &&
              response.body?.status === 'Success'
            ) {
              // console.log(response.body);

              this.isLoading = false;
              localStorage.setItem(
                'currentUSER',
                JSON.stringify(response.body)
              );
              localStorage.setItem(
                'customerID',
                JSON.stringify(response.body?.user.customerID)
              );
              window.location.href = '/cv-builder/editor';
            }
          },
          (error) => {
            console.error('Signup error:', error);
            this.isLoading = false;
          }
        );
    }
  }

  onSubmitSignup() {
    // console.log(this.signUpForm.valid);
    if (this.signUpForm.valid) {
      this.isLoading = true;

      const email = this.signUpForm.get('email')?.value;
      const password = this.signUpForm.get('password')?.value;
      const firstName = this.signUpForm.get('firstName')?.value;
      const lastName = this.signUpForm.get('lastName')?.value;
      const phoneNumber = this.signUpForm.get('phoneNumber')?.value;

      this.authService
        .signup(email, password, firstName, lastName, phoneNumber)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            this.isLoading = false;
            if (error.status === 400) {
              this.toastService.showToast(
                'User already exists.',
                `An account with this email address already exists. Try logging in instead.`
              );
            } else {
              console.error('An unexpected error occurred:', error);
              this.toastService.showToast(
                'Error',
                `An unexpected error occurred. Please try again later.`
              );
            }
            return throwError(error);
          })
        )
        .subscribe((response: HttpResponse<UserVerification>) => {
          if (
            response.status === 200 &&
            response.body?.message === 'Verification Code sent.'
          ) {
            // console.log(response.body);

            this.customerID = response.body.data.customerID;
            this.isVerificationStep = true;
            this.isSignUp = false;
            this.isLoading = false;
          }
        });
    }
  }

  onSubmitLogin(): void {
    if (this.signInForm.valid) {
      this.isLoading = true;

      const email = this.signInForm.get('email')?.value;
      const password = this.signInForm.get('password')?.value;

      this.authService
        .signin(email, password)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            this.isLoading = false;
            if (error.status === 400) {
              this.toastService.showToast(
                'Account not found.',
                `This user doesn't exist. Please check your details and try again`
              );
            } else {
              console.error('An unexpected error occurred:', error);
              this.toastService.showToast(
                'Error',
                `An unexpected error occurred. Please try again later`
              );
            }
            return throwError(error);
          })
        )
        .subscribe((response: HttpResponse<UserSignIn>) => {
          if (
            response.status === 200 &&
            response.body?.message === 'User not verified, OTP sent.'
          ) {
            console.log(response.body);
            this.isLoading = false;
            this.toastService.showToast(
              'User not registered.',
              `A code will be sent to your email to verify your account.`
            );

            this.isVerificationStep = true;
            this.isLogin = false;
            this.onSubmitVerification();

            localStorage.setItem('currentUser', JSON.stringify(response.body));
            localStorage.setItem(
              'customerID',
              JSON.stringify(response.body.user.customerID)
            );
            this.customerID = response.body.user.customerID;
          } else if (response.status === 200 && !response.body?.message) {
            // console.log('Success', response.body);
            // window.location.href = '/shop';
            console.log('success!', response.body);
          }
        });
    }
  }
}
