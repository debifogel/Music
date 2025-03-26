using Microsoft.AspNetCore.Mvc;
using MusicServer.Core.Classes;
using MusicServer.Core.Iservice;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using AutoMapper;
using MusicServer.Core.Dto;

namespace MusicServer.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PlaylistsController : ControllerBase
    {
        private readonly IPlayListService _playlistService;
        private readonly IMapper _mapper;
        public PlaylistsController(IPlayListService playlistService,IMapper mapper)
        {
            _playlistService = playlistService;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllPlaylists()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var playlists = await _playlistService.GetAllPlaylistsByUserId(userId);
            return Ok(_mapper.Map<List<PlayListDto>>(playlists));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetPlaylistById(int id)
        {
            var playlist = await _playlistService.GetPlaylistByIdAsync(id);
            if (playlist == null)
            {
                return NotFound();
            }
            int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out int userId);
            if (playlist.UserId != userId)
            {
                return Forbid();
            }
            return Ok(_mapper.Map<PlayListDto>(playlist));
        }

        [HttpPost]
        public async Task<IActionResult> AddPlaylist(string playlistname)
        {
            
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out int userId);
            PlayList playlist = new PlayList() {UserId=userId,PlaylistName=playlistname,CreationDate=DateTime.Now };
            var addedPlaylist = await _playlistService.AddPlaylistAsync(playlist);
            return CreatedAtAction(nameof(GetPlaylistById), new { id = addedPlaylist.PlaylistId }, addedPlaylist);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> RenamePlaylist(int id, string playlistName)
        {
            await _playlistService.RenamePlaylistAsync(id, playlistName);
            return Ok();
        }

        [HttpPut("song/{playlistId}/{songId}")]
        public async Task<IActionResult> AddSongToPlaylist(int playlistId, int songId)
        {
            await _playlistService.AddSongInPlaylistAsync(songId, playlistId);
            return Ok();
        }

        [HttpDelete("song/{playlistId}/{songId}")]
        public async Task<IActionResult> RemoveSongFromPlaylist(int playlistId, int songId)
        {
            await _playlistService.RemoveSongInPlaylistAsync(songId, playlistId);
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePlaylist(int id)
        {
            await _playlistService.DeletePlayListByIdAsync(id);
            return Ok();
        }

        [HttpGet("songs/{id}")]
        public async Task<IActionResult> GetAllSongsInPlaylist(int id)
        {
            var songs = await _playlistService.GetAllSongsByPlaylistId(id);
            return Ok(_mapper.Map<List<SongDto>>( songs));
        }
    }
}

