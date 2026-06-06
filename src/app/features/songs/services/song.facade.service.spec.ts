import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { SongFacadeService } from './song.facade.service';
import { SongApiService } from './song-api.service';
import { Song, SongResponse } from '../../../core/models/song.model';

describe('SongFacadeService', () => {
  let service: SongFacadeService;
  let apiMock: {
    getSongs: ReturnType<typeof vi.fn>;
    createSong: ReturnType<typeof vi.fn>;
    deleteSong: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    apiMock = {
      getSongs: vi.fn(),
      createSong: vi.fn(),
      deleteSong: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        SongFacadeService,
        { provide: SongApiService, useValue: apiMock },
      ],
    });

    service = TestBed.inject(SongFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initial state', () => {
    it('should have songs signal initialized as empty array', () => {
      expect(service.songs()).toEqual([]);
    });
  });

  describe('getSongs', () => {
    it('should update songs signal with fetched songs using default page', () => {
      const songs: Song[] = [
        {
          _id: '1',
          title: 'Test',
          album: 'Album',
          author: 'Author',
          imageUrl: 'img.jpg',
        },
      ];
      apiMock.getSongs.mockReturnValue(
        of({
          songs,
          message: 'ok',
          totalItems: 1,
          currentPage: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        } as SongResponse),
      );

      service.getSongs().subscribe();

      expect(apiMock.getSongs).toHaveBeenCalledWith(1);
      expect(service.songs()).toEqual(songs);
    });

    it('should pass the page parameter to api.getSongs', () => {
      apiMock.getSongs.mockReturnValue(
        of({
          songs: [],
          message: 'ok',
          totalItems: 0,
          currentPage: 2,
          hasNextPage: false,
          hasPreviousPage: false,
        } as SongResponse),
      );

      service.getSongs(2).subscribe();

      expect(apiMock.getSongs).toHaveBeenCalledWith(2);
    });
  });

  describe('createSong', () => {
    it('should call api.createSong and refresh songs', () => {
      const formData = new FormData();
      formData.append('title', 'New Song');

      const songs: Song[] = [
        {
          _id: '1',
          title: 'New Song',
          album: 'Album',
          author: 'Author',
          imageUrl: 'img.jpg',
        },
      ];
      apiMock.createSong.mockReturnValue(of({ message: 'ok', song: songs[0] }));
      apiMock.getSongs.mockReturnValue(
        of({
          songs,
          message: 'ok',
          totalItems: 1,
          currentPage: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        } as SongResponse),
      );

      service.createSong(formData).subscribe();

      expect(apiMock.createSong).toHaveBeenCalledWith(formData);
      expect(apiMock.getSongs).toHaveBeenCalled();
      expect(service.songs()).toEqual(songs);
    });
  });

  describe('deleteSong', () => {
    it('should call api.deleteSong and refresh songs', () => {
      const songs: Song[] = [
        {
          _id: '2',
          title: 'Remaining',
          album: 'Album',
          author: 'Author',
          imageUrl: 'img.jpg',
        },
      ];
      apiMock.deleteSong.mockReturnValue(of({}));
      apiMock.getSongs.mockReturnValue(
        of({
          songs,
          message: 'ok',
          totalItems: 1,
          currentPage: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        } as SongResponse),
      );

      service.deleteSong('1').subscribe();

      expect(apiMock.deleteSong).toHaveBeenCalledWith('1');
      expect(apiMock.getSongs).toHaveBeenCalled();
      expect(service.songs()).toEqual(songs);
    });
  });
});
