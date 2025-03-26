using Microsoft.AspNetCore.Mvc;
using MusicServer.Core.Classes;
using MusicServer.Core.Iservice;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using MusicServer.Core.Dto;
using AutoMapper;
using System.Threading.Tasks;

namespace MusicServer.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class FoldersController : ControllerBase
    {
        private readonly IFolderService _folderService;
        private readonly IMapper _mapper;
        public FoldersController(IFolderService folderService,IMapper mapper)
        {
            _folderService = folderService;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllFolders()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var folders = await _folderService.GetAllFoldersByUserId(userId);
            return Ok(_mapper.Map<List<FolderDto>>(folders));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetFolderById(int id)
        {
            var folder = await _folderService.GetFolderByIdAsync(id);
            if (folder == null)
            {
                return NotFound();
            }
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            if (folder.UserId != userId)
            {
                return Forbid();
            }
            return Ok(_mapper.Map<FolderDto>( folder));
        }

        [HttpGet("parent/{id}")]
        public async Task<IActionResult> GetFoldersByParentId(int id)
        {
            var folders = await _folderService.GetAllFolderByParentIdAsync(id);
            if (folders == null)
            {
                return NotFound();
            }
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            
            return Ok(_mapper.Map<List<FolderDto>>(folders));
        }

        [HttpPost]
        public async Task<IActionResult> AddFolder(FolderDto folderdto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var folder=_mapper.Map<Folder>(folderdto);
            int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out int userId);
            folder.UserId = userId;
            var addedFolder = await _folderService.AddFolderAsync(folder);
            return CreatedAtAction(nameof(GetFolderById), new { id = addedFolder.FolderId }, addedFolder);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> RenameFolder(int id, string folderName)
        {
            await _folderService.RenameFolderAsync(id, folderName);
            return Ok();
        }

        [HttpPut("parent/{id}")]
        public async Task<IActionResult> ChangeParentFolder(int id, int parentFolderId)
        {
            await _folderService.ChangeParentFolderAsync(id, parentFolderId);
            return Ok();
        }

        [HttpPut("song/{folderId}/{songId}")]
        public async Task<IActionResult> AddSongToFolder(int folderId, int songId)
        {
            await _folderService.AddSongInFolderAsync(songId, folderId);
            return Ok();
        }

        [HttpDelete("song/{folderId}/{songId}")]
        public async Task<IActionResult> RemoveSongFromFolder(int folderId, int songId)
        {
            await _folderService.RemoveSongInFolderAsync(songId, folderId);
            return Ok();
        }
        [HttpDelete("empty/")]
        public async Task<IActionResult> RemoveEmptyFolder()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var allFolders = await _folderService.GetAllFoldersByUserId(userId);
            foreach (var item in allFolders)
            {
                if (item.Songs.Count == 0)
                     DeleteFolder(item.FolderId);
            }
            await Task.WhenAll();
            return Ok();
        }
        [HttpDelete("empty/{id}")]
        public async Task<IActionResult> RemoveEmptyFolderById(int id)
        {
            var folder = await _folderService.GetFolderByIdAsync(id);
              if (folder.Songs.Count == 0)
                   await DeleteFolder(folder.FolderId);
            
            return Ok();
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFolder(int id)
        {
            await _folderService.DeleteFolderByIdAsync(id);
            return Ok();
        }

        [HttpGet("songs/{id}")]
        public async Task<IActionResult> GetAllSongsInFolder(int id)
        {
            var songs = await _folderService.GetAllSongsByFolderId(id);
            return Ok(_mapper.Map<List<SongDto>>(songs));
        }
    }
}

