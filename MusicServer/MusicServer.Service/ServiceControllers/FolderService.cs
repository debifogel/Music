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
    public class FolderService : IFolderService
    {
        private readonly IFolderRepository _folderRepository;
        private readonly IManager _manager;

        public FolderService(IFolderRepository folderRepository, IManager manager)
        {
            _folderRepository = folderRepository;
            _manager = manager;
        }

        public async Task<IEnumerable<Folder>> GetAllFolders() => await _folderRepository.GetAllFolders();
        public async Task<IEnumerable<Folder>> GetAllFoldersByUserId(int id) => await _folderRepository.GetAllFoldersByUserId(id);
        public async Task<IEnumerable<Song>> GetAllSongsByFolderId(int folderId) => await _folderRepository.GetAllSongsByFolderId(folderId);
        public async Task<Folder> GetFolderByIdAsync(int id) => await _folderRepository.GetFolderByIdAsync(id);
        public async Task<IEnumerable<Folder>> GetAllFolderByParentIdAsync(int id) => await _folderRepository.GetAllFolderByParentIdAsync(id);

        public async Task<Folder> AddFolderAsync(Folder folder)
        {
            var addedFolder = await _folderRepository.AddFolderAsync(folder);
            await _manager.SavechangesAsync();
            return addedFolder;
        }

        public async Task RenameFolderAsync(int id, string folder)
        {
            await _folderRepository.RenameFolderAsync(id, folder);
            await _manager.SavechangesAsync();
        }

        public async Task ChangeParentFolderAsync(int id, int folderId)
        {
            await _folderRepository.ChangeParentFolderAsync(id, folderId);
            await _manager.SavechangesAsync();
        }

        public async Task AddSongInFolderAsync(int songId, int folderId)
        {
            await _folderRepository.AddSongInFolderAsync(songId, folderId);
            await _manager.SavechangesAsync();
        }

        public async Task RemoveSongInFolderAsync(int songId, int folderId)
        {
            await _folderRepository.RemoveSongInFolderAsync(songId, folderId);
            await _manager.SavechangesAsync();
        }

        public async Task DeleteFolderByIdAsync(int id)
        {
            await _folderRepository.DeleteFolderByIdAsync(id);
            await _manager.SavechangesAsync();
        }
    }


}
