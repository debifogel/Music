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
    public class LogRepository : ILogRepository
    {
        private readonly IData _context;
        public LogRepository(IData context)
        {
            _context = context;
        }
        public async Task<Log> AddLogAsync(Log log)
        {
           await _context.Logs.AddAsync(log);
            return log;
        }

        public async Task DeleteLogAsync(int id)
        {
          var log=  await GetLogAsync(id);
            _context.Logs.Remove(log);
        }

        public async Task<IEnumerable<Log>> GetAllLogsAsync()
        {
            return await _context.Logs.ToListAsync();
        }

        public async Task<Log> GetLogAsync(int id)
        {
            return await _context.Logs.FindAsync(id);
        }

        public async Task<IEnumerable<Log>> GetLogsAsync()
        {
            return await _context.Logs.ToListAsync();

        }

        public async Task UpdateLogAsync(Log log)
        {
            var Log = await GetLogAsync(log.LogId);
            Log = log;
        }
    }
}
