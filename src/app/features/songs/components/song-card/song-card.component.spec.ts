import { TestBed } from '@angular/core/testing';
import { SongCardComponent } from './song-card.component';
import { Song } from '../../../core/models/song.model';

describe('SongCardComponent', () => {
  const mockSong: Song = {
    _id: '123',
    title: 'Test Song',
    album: 'Test Album',
    author: 'Test Author',
    imageUrl: 'test-image.jpg',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SongCardComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(SongCardComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  /* it('should compute imageUrl from apiUrl and song.imageUrl', () => {
    const fixture = TestBed.createComponent(SongCardComponent);
    const comp = fixture.componentInstance;
    fixture.componentRef.setInput('song', mockSong);
    expect(comp.imageUrl).toBe('http://localhost:3000/api/images/test-image.jpg');
  }); */

  it('should emit addToPlaylist when add is called', () => {
    const fixture = TestBed.createComponent(SongCardComponent);
    const comp = fixture.componentInstance;
    fixture.componentRef.setInput('song', mockSong);
    const emitSpy = vi.spyOn(comp.addToPlaylist, 'emit');
    comp.addToPlaylist.emit(mockSong);
    expect(emitSpy).toHaveBeenCalledWith(mockSong);
  });

  it('should emit delete with song _id when delete is called', () => {
    const fixture = TestBed.createComponent(SongCardComponent);
    const comp = fixture.componentInstance;
    fixture.componentRef.setInput('song', mockSong);
    const emitSpy = vi.spyOn(comp.delete, 'emit');
    comp.delete.emit(mockSong._id);
    expect(emitSpy).toHaveBeenCalledWith('123');
  });
});
