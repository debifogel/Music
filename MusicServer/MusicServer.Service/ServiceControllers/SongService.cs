using Microsoft.AspNetCore.Http;
using MusicServer.Core.Classes;
using MusicServer.Core.Irepository;
using MusicServer.Core.Iservice;
using MusicServer.Core.Post;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace MusicServer.Service.ServiceControllers
{
    public class SongService : ISongService
    {
        private readonly ISongRepository _songRepository;
        private readonly IManager _manager;
        public SongService(ISongRepository songRepository, IManager manager)
        {
            _manager = manager;
            _songRepository = songRepository;
        }

        public async Task<Song> AddSongAsync(Song song)
        {
            // שמירה במסד הנתונים
            var addedSong = await _songRepository.AddSongAsync(song);
            await _manager.SavechangesAsync();
            return addedSong;
        }


        public async Task DeleteSongByIdAsync(int id)
        {
            await _songRepository.DeleteSongByIdAsync(id);
            await _manager.SavechangesAsync();
        }

        public async Task<IEnumerable<Folder>> GetAllFoldersBySongId(int id)
        {
            var folderlist=await _songRepository.GetAllFoldersBySongId(id);
            return folderlist;
        }

        public async Task<IEnumerable<PlayList>> GetAllPlayListsBySongId(int id)
        {
            var playslist = await _songRepository.GetAllPlayListsBySongId(id);
            return playslist;
        }

        public async Task<IEnumerable<Song>> GetAllPublicSongsByUserName(string name)
        {
            var songslist=await _songRepository.GetAllPublicSongsByUserName(name);
            return songslist;
        }
        public async Task<IEnumerable<Song>> GetSongByListIdAsync(List<int> ids)
        {
            var songslist = await _songRepository.GetSongByListIdAsync(ids);
            return songslist;
        }

        public async Task<IEnumerable<Song>> GetAllSongs()
        {
            var songlists=await _songRepository.GetAllSongs();
            return songlists;
        }

        public async Task<IEnumerable<Song>> GetAllSongsByArtist(int userId, string artist)
        {
            var songlist=await _songRepository.GetAllSongsByArtist(userId, artist);    
            return songlist;
        }

        public async Task<IEnumerable<Song>> GetAllSongsByGenre(int userId, string genre)
        {
            var songList =await _songRepository.GetAllSongsByGenre(userId, genre);
            return songList;
        }

        public async Task<IEnumerable<Song>> GetAllSongsByUserId(int id)
        {
            var songs=await _songRepository.GetAllSongsByUserId(id);
            return songs;
        }

        public async Task<Song> GetSongByIdAsync(int id)
        {
            var song = await _songRepository.GetSongByIdAsync(id);
            return song;
        }

        public async Task UpdatePermissionSongAsync(int id)
        {
            await _songRepository.UpdatePermissionSongAsync(id);
            await _manager.SavechangesAsync();
        }

        public async Task UpdateSongAsync(int id, SongUpdate song)
        {
            await _songRepository.UpdateSongAsync(id, song);
            await _manager.SavechangesAsync();
        }
    }
}
