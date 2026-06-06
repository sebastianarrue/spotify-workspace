import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { SidebarComponent } from './sidebar.component';
import { PlaylistFacadeService } from '../../../core/services/playlist.facade.service';

describe('SidebarComponent', () => {
  let mockPlaylistFacade: Partial<Record<keyof PlaylistFacadeService, ReturnType<typeof vi.fn>>>;

  beforeEach(async () => {
    mockPlaylistFacade = {
      getPlaylists: vi.fn().mockReturnValue(of([])),
      createPlaylist: vi.fn().mockReturnValue(of(undefined)),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, SidebarComponent],
      providers: [
        { provide: PlaylistFacadeService, useValue: mockPlaylistFacade },
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(SidebarComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should call getPlaylists on init', () => {
    TestBed.createComponent(SidebarComponent);
    expect(mockPlaylistFacade.getPlaylists).toHaveBeenCalledTimes(1);
  });

  it('should start with showCreateForm as false', () => {
    const fixture = TestBed.createComponent(SidebarComponent);
    expect(fixture.componentInstance.showCreateForm()).toBe(false);
  });

  it('should have an invalid form when empty', () => {
    const fixture = TestBed.createComponent(SidebarComponent);
    expect(fixture.componentInstance.playlistForm.valid).toBe(false);
  });

  it('should require playlist name', () => {
    const fixture = TestBed.createComponent(SidebarComponent);
    const form = fixture.componentInstance.playlistForm;
    form.controls.name.setValue('');
    expect(form.controls.name.valid).toBe(false);
    form.controls.name.setValue('My Playlist');
    expect(form.controls.name.valid).toBe(true);
  });

  it('should not call createPlaylist when form is invalid', () => {
    const fixture = TestBed.createComponent(SidebarComponent);
    fixture.componentInstance.onCreate();
    expect(mockPlaylistFacade.createPlaylist).not.toHaveBeenCalled();
  });

  it('should call createPlaylist, hide form, and reset on success', () => {
    const fixture = TestBed.createComponent(SidebarComponent);
    const comp = fixture.componentInstance;
    comp.playlistForm.controls.name.setValue('New Playlist');
    comp.playlistForm.controls.description.setValue('A great playlist');
    comp.onCreate();
    expect(mockPlaylistFacade.createPlaylist).toHaveBeenCalledWith('New Playlist', 'A great playlist');
    expect(comp.showCreateForm()).toBe(false);
    expect(comp.playlistForm.value).toEqual({ name: null, description: null });
  });
});
