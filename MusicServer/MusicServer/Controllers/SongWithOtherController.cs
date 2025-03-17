using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using MusicServer.Core.Dto;
using MusicServer.Core.Iservice;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace MusicServer.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SongWithOtherController : ControllerBase
    {
        // GET: api/<SongWithOtherController>
        private readonly ISongService _songService;
        private readonly IMapper _mapper;
        public SongWithOtherController(ISongService songService,IMapper mapper)
        {
            _songService = songService;
            _mapper = mapper;

        }

        [HttpGet("folders/{songId}")]
        public async Task<IActionResult> GetFoldersBySongId(int songId)
        {
            var folders = await _songService.GetAllFoldersBySongId(songId);
            if (folders == null)
            {
                return NotFound();
            }
            return Ok(_mapper.Map<FolderDto>( folders));
        }

        [HttpGet("playlists/{songId}")]
        public async Task<IActionResult> GetPlaylistsBySongId(int songId)
        {
            var playlists = await _songService.GetAllPlayListsBySongId(songId);
            if (playlists == null)
            {
                return NotFound();
            }
            return Ok(_mapper.Map <PlayListDto> (playlists));
        }
    }
}
