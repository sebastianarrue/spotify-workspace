import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { SignupComponent } from './signup.component';
import { AuthFacadeService } from '../../../core/services/auth-facade.service';

describe('SignupComponent', () => {
  let mockAuthFacade: Partial<Record<keyof AuthFacadeService, ReturnType<typeof vi.fn>>>;
  let mockRouter: Partial<Record<keyof Router, ReturnType<typeof vi.fn>>>;

  beforeEach(async () => {
    mockAuthFacade = { signup: vi.fn() };
    mockRouter = { navigate: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, SignupComponent],
      providers: [
        { provide: AuthFacadeService, useValue: mockAuthFacade },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(SignupComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should have an invalid form when empty', () => {
    const fixture = TestBed.createComponent(SignupComponent);
    expect(fixture.componentInstance.signupForm.valid).toBe(false);
  });

  it('should require a valid email', () => {
    const fixture = TestBed.createComponent(SignupComponent);
    const form = fixture.componentInstance.signupForm;
    form.controls.email.setValue('invalid');
    expect(form.controls.email.valid).toBe(false);
    form.controls.email.setValue('test@example.com');
    expect(form.controls.email.valid).toBe(true);
  });

  it('should require password with min length 6', () => {
    const fixture = TestBed.createComponent(SignupComponent);
    const form = fixture.componentInstance.signupForm;
    form.controls.password.setValue('12345');
    expect(form.controls.password.valid).toBe(false);
    form.controls.password.setValue('123456');
    expect(form.controls.password.valid).toBe(true);
  });

  it('should not call authFacade.signup when form is invalid', () => {
    const fixture = TestBed.createComponent(SignupComponent);
    fixture.componentInstance.onSubmit();
    expect(mockAuthFacade.signup).not.toHaveBeenCalled();
  });

  it('should call authFacade.signup, alert and navigate on success', () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    mockAuthFacade.signup!.mockReturnValue(of(undefined));
    const fixture = TestBed.createComponent(SignupComponent);
    const comp = fixture.componentInstance;
    comp.signupForm.controls.email.setValue('test@example.com');
    comp.signupForm.controls.password.setValue('password123');
    comp.onSubmit();
    expect(mockAuthFacade.signup).toHaveBeenCalledWith('test@example.com', 'password123');
    expect(alertSpy).toHaveBeenCalledWith('Account created! Please log in.');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    alertSpy.mockRestore();
  });

  it('should call alert on signup error', () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    mockAuthFacade.signup!.mockReturnValue(throwError(() => ({ error: { message: 'Email taken' } })));
    const fixture = TestBed.createComponent(SignupComponent);
    const comp = fixture.componentInstance;
    comp.signupForm.controls.email.setValue('test@example.com');
    comp.signupForm.controls.password.setValue('password123');
    comp.onSubmit();
    expect(alertSpy).toHaveBeenCalledWith('Email taken');
    alertSpy.mockRestore();
  });
});
