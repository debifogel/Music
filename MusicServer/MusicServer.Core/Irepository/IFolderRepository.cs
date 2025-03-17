using MusicServer.Core.Classes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MusicServer.Core.Irepository
{
    public interface IFolderRepository
    {
        Task<IEnumerable<Folder>> GetAllFolders();
        Task<IEnumerable<Folder>> GetAllFoldersByUserId(int id);
        Task<IEnumerable<Song>> GetAllSongsByFolderId(int folderId);
         Task<IEnumerable<Folder>> GetAllFolderByParentIdAsync(int id);
        Task<Folder> GetFolderByIdAsync(int id);
        Task<Folder> AddFolderAsync(Folder folder);
        Task RenameFolderAsync(int id,string folder);
        Task ChangeParentFolderAsync(int id,int folderId);
        Task AddSongInFolderAsync(int songId,int foldetId);
        Task RemoveSongInFolderAsync(int songId, int foldetId);

        Task DeleteFolderByIdAsync(int id);
    }
}
