using Microsoft.EntityFrameworkCore;
using MusicServer.Core.Classes;
using MusicServer.Core.Irepository;
using MusicServer.Core.Post;
using MusicServer.Data.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MusicServer.Data.Repository
{
    public class SongRepository : ISongRepository
    {
        private readonly IData _context;
        public SongRepository(IData context)
        {
            _context = context;
        }
        public async Task<Song> AddSongAsync(Song song)
        {
           await _context.Songs.AddAsync(song);
            return song;
        }

        public async Task DeleteSongByIdAsync(int id) 
        {
            var Song = await GetSongByIdAsync(id);
            _context.Songs.RemoveRange(Song);
        }

       public async Task<IEnumerable<Folder>> GetAllFoldersBySongId(int id)
        {
            var Song= await GetSongByIdAsync(id);
            return Song.Folders;
        }

        public async Task<IEnumerable<PlayList>> GetAllPlayListsBySongId(int id)
        {
            var Song=await GetSongByIdAsync(id);
            return Song.Playlists;
        }

       

        public async Task<IEnumerable<Song>> GetAllPublicSongsByUserName(string name)
        {
            return await _context.Songs.Where(s => s.IsPrivate == false).ToListAsync();
        }

        public async Task<IEnumerable<Song>> GetAllSongs()
        {
            return await _context.Songs.ToListAsync();
        }

        public async Task<IEnumerable<Song>> GetAllSongsByArtist(int userId, string artist)
        {
            return await _context.Songs.Where(s => s.UserId == userId && s.Artist == artist).ToListAsync();

        }


        

        public async Task<IEnumerable<Song>> GetAllSongsByGenre(int userId, string genre)
        {
            return await _context.Songs.Where(s => s.UserId == userId && s.Genre == genre).ToListAsync();
        }

       

        

        public async  Task<IEnumerable<Song>> GetAllSongsByUserId(int id)
        {
            return await _context.Songs.Where(s => s.UserId == id).ToListAsync();

        }

        public async Task<Song> GetSongByIdAsync(int id)
        {
            return await _context.Songs
                    .FirstAsync(s => s.SongId == id );
        }

        public async Task UpdatePermissionSongAsync(int id, bool isPrivate)
        {
            var Song= await GetSongByIdAsync(id);
            Song.IsPrivate = isPrivate;
        }

        public async Task UpdateSongAsync(int id, SongUpdate song)
        {
            var Song = await GetSongByIdAsync(id);
            Song.Artist=song.Artist;
            Song.Genre=song.Genre;
            Song.Title=song.Title;

        }
    }
}
