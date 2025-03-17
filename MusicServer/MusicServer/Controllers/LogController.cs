using Microsoft.AspNetCore.Mvc;
using MusicServer.Core.Classes;
using MusicServer.Core.Iservice;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace MusicServer.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")] // Only admins can access logs
    public class LogsController : ControllerBase
    {
        private readonly ILogService _logService;

        public LogsController(ILogService logService)
        {
            _logService = logService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllLogs()
        {
            var logs = await _logService.GetAllLogsAsync();
            return Ok(logs);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetLogById(int id)
        {
            var log = await _logService.GetLogAsync(id);
            if (log == null)
            {
                return NotFound();
            }
            return Ok(log);
        }

        [HttpPost]
        public async Task<IActionResult> AddLog(Log log)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var addedLog = await _logService.AddLogAsync(log);
            return CreatedAtAction(nameof(GetLogById), new { id = addedLog.LogId }, addedLog);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateLog(Log log)
        {
            await _logService.UpdateLogAsync(log);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLog(int id)
        {
            await _logService.DeleteLogAsync(id);
            return NoContent();
        }
    }
}