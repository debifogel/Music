using MusicServer.Core.Classes;
using MusicServer.Core.Irepository;
using MusicServer.Core.Iservice;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MusicServer.Service.ServiceControllers
{
    public class PlayListService : IPlayListService
    {
        private readonly IPlayListRepository _playListRepository;
        private readonly IManager _manager;

        public PlayListService(IPlayListRepository playListRepository, IManager manager)
        {
            _playListRepository = playListRepository;
            _manager = manager;
        }

        public async Task<IEnumerable<PlayList>> GetAllPlaylists() => await _playListRepository.GetAllPlaylists();

        public async Task<IEnumerable<PlayList>> GetAllPlaylistsByUserId(int id) => await _playListRepository.GetAllPlaylistsByUserId(id);

        public async Task<PlayList> GetPlaylistByIdAsync(int id) => await _playListRepository.GetPlaylistByIdAsync(id);

        public async Task<PlayList> AddPlaylistAsync(PlayList playlist)
        {
            var addedPlaylist = await _playListRepository.AddPlaylistAsync(playlist);
            await _manager.SavechangesAsync();
            return addedPlaylist;
        }

        public async Task RenamePlaylistAsync(int id, string playlist)
        {
            await _playListRepository.RenamePlaylistAsync(id, playlist);
            await _manager.SavechangesAsync();
        }

        public async Task AddSongInPlaylistAsync(int songId, int playlistId)
        {
            await _playListRepository.AddSongInPlaylistAsync(songId, playlistId);
            await _manager.SavechangesAsync();
        }

        public async Task RemoveSongInPlaylistAsync(int songId, int playlistId)
        {
            await _playListRepository.RemoveSongInPlaylistAsync(songId, playlistId);
            await _manager.SavechangesAsync();
        }

        public async Task DeletePlayListByIdAsync(int id)
        {
            await _playListRepository.DeletePlayListByIdAsync(id);
            await _manager.SavechangesAsync();
        }

        public async Task<IEnumerable<Song>> GetAllSongsByPlaylistId(int playlistId)
        {
            return await _playListRepository.GetAllSongsByPlaylistId(playlistId);
        }
    }
}
