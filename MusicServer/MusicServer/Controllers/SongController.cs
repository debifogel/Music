using Microsoft.AspNetCore.Mvc;
using MusicServer.Core.Classes;
using MusicServer.Core.Iservice;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using MusicServer.Core.Post;
using MusicServer.Core.Dto;
using AutoMapper;
using Microsoft.AspNetCore.Http.HttpResults;

namespace MusicServer.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class SongsController : ControllerBase
    {
        private readonly ISongService _songService;
        private readonly IMapper _mapper;
        public SongsController(ISongService songService,IMapper mapper)
        {
            _songService = songService;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllSongs()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var songs = await _songService.GetAllSongsByUserId(userId);
            return Ok(_mapper.Map<List<SongDto>>(songs));
        }

        [HttpGet("public/{name}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetAllPublicSongs(string name)
        {
            var songs = await _songService.GetAllPublicSongsByUserName(name);
            if(songs!=null)
            return Ok(_mapper.Map<List<SongDto>>(songs));
            return NotFound();
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetSongById(int id)
        {
            var song = await _songService.GetSongByIdAsync(id);
            if (song == null)
            {
                return NotFound();
            }
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            if (song.UserId != userId && song.IsPrivate)
            {
                return Forbid();
            }

            return Ok(_mapper.Map<SongDto>( song));
        }

        [HttpPost]
        public async Task<IActionResult> AddSong(SongDto songdto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var song=_mapper.Map<Song>(songdto);
            int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out int userId);
            song.UserId = userId;
            var addedSong = await _songService.AddSongAsync(song);
            return CreatedAtAction(nameof(GetSongById), new { id = addedSong.SongId }, addedSong);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSong(int id, SongUpdate songUpdate)
        {
            await _songService.UpdateSongAsync(id, songUpdate);
            return Ok();
        }

        [HttpPut("permission/{id}")]
        public async Task<IActionResult> UpdateSongPermission(int id, bool isPrivate)
        {
            await _songService.UpdatePermissionSongAsync(id);
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSong(int id)
        {
            await _songService.DeleteSongByIdAsync(id);
            return Ok();
        }
    }
}