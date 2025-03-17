using MusicServer.Core.Classes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MusicServer.Core.Iservice
{
    public interface IPlayListService
    {
        Task<IEnumerable<PlayList>> GetAllPlaylists();
        Task<IEnumerable<PlayList>> GetAllPlaylistsByUserId(int id);
        Task<PlayList> GetPlaylistByIdAsync(int id);
        Task<IEnumerable<Song>> GetAllSongsByPlaylistId(int playlistId);

        Task<PlayList> AddPlaylistAsync(PlayList playlist);
        Task RenamePlaylistAsync(int id, string playlist);
        Task AddSongInPlaylistAsync(int songId, int playlistId);
        Task RemoveSongInPlaylistAsync(int songId, int playlistId);
        Task DeletePlayListByIdAsync(int id);
    }
}
