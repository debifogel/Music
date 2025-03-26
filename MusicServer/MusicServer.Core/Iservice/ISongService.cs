using MusicServer.Core.Classes;
using MusicServer.Core.Post;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MusicServer.Core.Iservice
{
    public interface ISongService
    {
        Task<IEnumerable<Song>> GetAllSongs();
        Task<IEnumerable<Song>> GetAllSongsByUserId(int id);
        Task<IEnumerable<Song>> GetAllSongsByArtist(int userId, string artist);
        Task<IEnumerable<Song>> GetAllSongsByGenre(int userId, string genre);
        Task<IEnumerable<Folder>> GetAllFoldersBySongId(int id);
        Task<IEnumerable<PlayList>> GetAllPlayListsBySongId(int id);
        Task<IEnumerable<Song>> GetAllPublicSongsByUserName(string name);

        Task<Song> GetSongByIdAsync(int id);
        Task<Song> AddSongAsync(Song song);
        Task UpdateSongAsync(int id, SongUpdate song);
        Task UpdatePermissionSongAsync(int id);

        Task DeleteSongByIdAsync(int id);
    }
}
