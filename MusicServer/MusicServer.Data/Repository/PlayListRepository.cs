using Microsoft.EntityFrameworkCore;
using MusicServer.Core.Classes;
using MusicServer.Core.Irepository;
using MusicServer.Data.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MusicServer.Data.Repository
{
    public class PLayListRepository:IPlayListRepository
    {
        private readonly IData _context;
        public PLayListRepository(IData context)
        {
            _context = context;
        }

        public async Task<PlayList> AddPlaylistAsync(PlayList playlist)
        {
           await _context.Playlists.AddAsync(playlist);
            return playlist;
        }

        public async Task AddSongInPlaylistAsync(int songId, int playlistId)
        {
            var Playlist = await GetPlaylistByIdAsync(playlistId);
            var Song = await _context.Songs.FindAsync(songId);
            Playlist.Songs.Add(Song);
            Song.Playlists.Add(Playlist);
        }

        public async Task DeletePlayListByIdAsync(int id)
        {
            var playlist=await GetPlaylistByIdAsync(id);
            _context.Playlists.RemoveRange(playlist);
        }

        public async Task<IEnumerable<PlayList>> GetAllPlaylists()
        {
            return await _context.Playlists.ToListAsync();
        }

        public async Task<IEnumerable<PlayList>> GetAllPlaylistsByUserId(int id)
        {
            return await _context.Playlists.Where(p=>p.UserId == id).ToListAsync();
        }

        public async Task<IEnumerable<Song>> GetAllSongsByPlaylistId(int playlistId)
        {
            var Playlist = await _context.Playlists.Include(p=>p.Songs).FirstAsync(p=>p.PlaylistId==playlistId);
            return Playlist.Songs;
        }

        public async Task<PlayList> GetPlaylistByIdAsync(int id)
        {
            return await _context.Playlists.FindAsync(id);
        }

        public async Task RemoveSongInPlaylistAsync(int songId, int playlistId)
        {
            var Playlist = await GetPlaylistByIdAsync(playlistId);
            var Song = await _context.Songs.FindAsync(songId);
            Playlist.Songs.Remove(Song);
        }

        public async Task RenamePlaylistAsync(int id, string playlist)
        {
            var Playlist=await GetPlaylistByIdAsync(id);
            Playlist.PlaylistName=playlist;
        }
    }
}
