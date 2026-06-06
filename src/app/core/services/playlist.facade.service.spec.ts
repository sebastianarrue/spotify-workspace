import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { PlaylistFacadeService } from './playlist.facade.service';
import { PlaylistApiService } from './playlist-api.service';
import { Playlist, PlaylistResponse } from '../models/playlist.model';

describe('PlaylistFacadeService', () => {
  let service: PlaylistFacadeService;
  let apiMock: {
    getPlaylists: ReturnType<typeof vi.fn>;
    getPlaylist: ReturnType<typeof vi.fn>;
    createPlaylist: ReturnType<typeof vi.fn>;
    addSongToPlaylist: ReturnType<typeof vi.fn>;
    removeSongFromPlaylist: ReturnType<typeof vi.fn>;
    deletePlaylist: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    apiMock = {
      getPlaylists: vi.fn(),
      getPlaylist: vi.fn(),
      createPlaylist: vi.fn(),
      addSongToPlaylist: vi.fn(),
      removeSongFromPlaylist: vi.fn(),
      deletePlaylist: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        PlaylistFacadeService,
        { provide: PlaylistApiService, useValue: apiMock },
      ],
    });

    service = TestBed.inject(PlaylistFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initial state', () => {
    it('should have playlists signal initialized as empty array', () => {
      expect(service.playlists()).toEqual([]);
    });
  });

  describe('getPlaylists', () => {
    it('should update playlists signal with fetched playlists', () => {
      const playlists: Playlist[] = [
        { id: 1, name: 'Test', description: 'Desc', userId: 1 },
      ];
      apiMock.getPlaylists.mockReturnValue(of({ playlists } as PlaylistResponse));

      service.getPlaylists().subscribe();

      expect(apiMock.getPlaylists).toHaveBeenCalled();
      expect(service.playlists()).toEqual(playlists);
    });
  });

  describe('getPlaylist', () => {
    it('should delegate to api.getPlaylist and return the response', () => {
      const playlist: Playlist = {
        id: 1,
        name: 'Test',
        description: 'Desc',
        userId: 1,
      };
      apiMock.getPlaylist.mockReturnValue(of(playlist));

      let result: Playlist | undefined;
      service.getPlaylist('1').subscribe(r => (result = r));

      expect(apiMock.getPlaylist).toHaveBeenCalledWith('1');
      expect(result).toEqual(playlist);
    });
  });

  describe('createPlaylist', () => {
    it('should call api.createPlaylist and refresh playlists', () => {
      const newPlaylist: Playlist = {
        id: 1,
        name: 'New',
        description: 'Desc',
        userId: 1,
      };
      const playlists: Playlist[] = [newPlaylist];
      apiMock.createPlaylist.mockReturnValue(
        of({ message: 'ok', playlist: newPlaylist }),
      );
      apiMock.getPlaylists.mockReturnValue(of({ playlists } as PlaylistResponse));

      service.createPlaylist('New', 'Desc').subscribe();

      expect(apiMock.createPlaylist).toHaveBeenCalledWith('New', 'Desc');
      expect(apiMock.getPlaylists).toHaveBeenCalled();
      expect(service.playlists()).toEqual(playlists);
    });
  });

  describe('addSongToPlaylist', () => {
    it('should delegate to api.addSongToPlaylist with correct args', () => {
      apiMock.addSongToPlaylist.mockReturnValue(of({}));

      service.addSongToPlaylist(1, 'song123').subscribe();

      expect(apiMock.addSongToPlaylist).toHaveBeenCalledWith(1, 'song123');
    });
  });

  describe('removeSongFromPlaylist', () => {
    it('should delegate to api.removeSongFromPlaylist with correct args', () => {
      apiMock.removeSongFromPlaylist.mockReturnValue(of({}));

      service.removeSongFromPlaylist(1, 'song123').subscribe();

      expect(apiMock.removeSongFromPlaylist).toHaveBeenCalledWith(1, 'song123');
    });
  });

  describe('deletePlaylist', () => {
    it('should call api.deletePlaylist and refresh playlists', () => {
      const playlists: Playlist[] = [
        { id: 2, name: 'Remaining', description: 'Desc', userId: 1 },
      ];
      apiMock.deletePlaylist.mockReturnValue(of({}));
      apiMock.getPlaylists.mockReturnValue(of({ playlists } as PlaylistResponse));

      service.deletePlaylist(1).subscribe();

      expect(apiMock.deletePlaylist).toHaveBeenCalledWith(1);
      expect(apiMock.getPlaylists).toHaveBeenCalled();
      expect(service.playlists()).toEqual(playlists);
    });
  });
});
