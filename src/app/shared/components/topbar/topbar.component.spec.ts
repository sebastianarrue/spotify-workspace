import { TestBed } from '@angular/core/testing';
import { TopbarComponent } from './topbar.component';
import { AuthFacadeService } from '../../../core/services/auth-facade.service';

describe('TopbarComponent', () => {
  let mockAuthFacade: Partial<Record<keyof AuthFacadeService, ReturnType<typeof vi.fn>>>;

  beforeEach(async () => {
    mockAuthFacade = {};

    await TestBed.configureTestingModule({
      imports: [TopbarComponent],
      providers: [
        { provide: AuthFacadeService, useValue: mockAuthFacade },
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(TopbarComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should expose authFacade', () => {
    const fixture = TestBed.createComponent(TopbarComponent);
    expect(fixture.componentInstance.authFacade).toBe(mockAuthFacade as AuthFacadeService);
  });
});
