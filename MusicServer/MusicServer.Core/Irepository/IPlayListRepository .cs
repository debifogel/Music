using MusicServer.Core.Classes;
using MusicServer.Core.Post;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MusicServer.Core.Irepository
{
    public interface IPlayListRepository
    {
        Task<IEnumerable<Song>> GetAllSongsByPlaylistId(int playlistId);
        Task<IEnumerable<PlayList>> GetAllPlaylists();
        Task<IEnumerable<PlayList>> GetAllPlaylistsByUserId(int id);

        Task<PlayList> GetPlaylistByIdAsync(int id);
        Task<PlayList> AddPlaylistAsync(PlayList song);
        Task RenamePlaylistAsync(int id, string playlist);
        Task AddSongInPlaylistAsync(int songId, int playlistId);
        Task RemoveSongInPlaylistAsync(int songId, int playlistId);
        Task DeletePlayListByIdAsync(int id);
    }
}
