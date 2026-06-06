import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthFacadeService } from '../../../core/services/auth-facade.service';

describe('LoginComponent', () => {
  let mockAuthFacade: Partial<Record<keyof AuthFacadeService, ReturnType<typeof vi.fn>>>;
  let mockRouter: Partial<Record<keyof Router, ReturnType<typeof vi.fn>>>;

  beforeEach(async () => {
    mockAuthFacade = { login: vi.fn() };
    mockRouter = { navigate: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, LoginComponent],
      providers: [
        { provide: AuthFacadeService, useValue: mockAuthFacade },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should have an invalid form when empty', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    expect(fixture.componentInstance.loginForm.valid).toBe(false);
  });

  it('should require a valid email', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const form = fixture.componentInstance.loginForm;
    form.controls.email.setValue('invalid');
    expect(form.controls.email.valid).toBe(false);
    form.controls.email.setValue('test@example.com');
    expect(form.controls.email.valid).toBe(true);
  });

  it('should require password', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const form = fixture.componentInstance.loginForm;
    form.controls.password.setValue('');
    expect(form.controls.password.valid).toBe(false);
    form.controls.password.setValue('somepassword');
    expect(form.controls.password.valid).toBe(true);
  });

  it('should not call authFacade.login when form is invalid', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    fixture.componentInstance.onSubmit();
    expect(mockAuthFacade.login).not.toHaveBeenCalled();
  });

  it('should call authFacade.login and navigate on success', () => {
    mockAuthFacade.login!.mockReturnValue(of(undefined));
    const fixture = TestBed.createComponent(LoginComponent);
    const comp = fixture.componentInstance;
    comp.loginForm.controls.email.setValue('test@example.com');
    comp.loginForm.controls.password.setValue('password123');
    comp.onSubmit();
    expect(mockAuthFacade.login).toHaveBeenCalledWith('test@example.com', 'password123');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should call alert on login error', () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    mockAuthFacade.login!.mockReturnValue(throwError(() => ({ error: { message: 'Invalid credentials' } })));
    const fixture = TestBed.createComponent(LoginComponent);
    const comp = fixture.componentInstance;
    comp.loginForm.controls.email.setValue('test@example.com');
    comp.loginForm.controls.password.setValue('password123');
    comp.onSubmit();
    expect(alertSpy).toHaveBeenCalledWith('Invalid credentials');
    alertSpy.mockRestore();
  });
});
