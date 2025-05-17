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
    public class FolderRepository : IFolderRepository
    {
        private readonly IData _context;
        public FolderRepository(IData context)
        {
            _context=context;
        }
        public async Task<Folder> AddFolderAsync(Folder folder)
        {
            await _context.Folders.AddAsync(folder);
            return folder;
        }

        public async Task AddSongInFolderAsync(int songId, int foldetId)
        {
            var Folder =await GetFolderByIdAsync(foldetId);
            var Song=await _context.Songs.FindAsync(songId);
            Folder.Songs.Add(Song);
            Song.Folders.Add(Folder);   
            
        }
        public async Task RemoveSongInFolderAsync(int songId, int foldetId)
        {
            var Folder = await GetFolderByIdAsync(foldetId);
            var Song = await _context.Songs.FindAsync(songId);
            Folder.Songs.Remove(Song);
            Song.Folders.Remove(Folder);
        }

        public async Task ChangeParentFolderAsync(int id, int folderId)
        {
            var Folder = await GetFolderByIdAsync(folderId);
            Folder.ParentFolderId = id;

        }

        public async Task DeleteFolderByIdAsync(int id)
        {
            var Folder = await GetFolderByIdAsync(id);
            _context.Folders.RemoveRange(Folder);
        }

        public async Task< IEnumerable<Folder>> GetAllFolders()
        {
            return await _context.Folders.ToListAsync();
        }
        public async Task<IEnumerable<Song>> GetAllSongsByFolderId(int folderId)
        {
            var Folder = await _context.Folders.Include(f=>f.Songs).FirstAsync(f=>f.FolderId==folderId);
            return Folder.Songs;
        }

        public async Task<IEnumerable<Folder>> GetAllFoldersByUserId(int id)
        {
            return await _context.Folders.Where(f=>  f.UserId == id).Include(f=>f.Songs).ToListAsync();

        }       

        public async Task<Folder> GetFolderByIdAsync(int id)
        {
            return await _context.Folders
                    .FirstAsync(f => f.FolderId == id );
        }
        public async Task<IEnumerable<Folder>> GetAllFolderByParentIdAsync(int id)
        {
            return await _context.Folders
                    .Where(f => f.ParentFolderId == id).ToListAsync();
        }

        public async Task RenameFolderAsync(int id, string folder)
        {
            var Folder = await GetFolderByIdAsync(id);
            Folder.FolderName = folder;

        }
    }
}
