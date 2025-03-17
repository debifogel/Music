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
    public class LogService : ILogService
    {
        private readonly ILogRepository _logRepository;
        private readonly IManager _manager;
        public LogService(IManager manager,ILogRepository log)
        {
            _manager = manager;
            _logRepository = log;
        }
        public async Task<Log> AddLogAsync(Log log)
        {
            var logres=await _logRepository.AddLogAsync(log);
            await _manager.SavechangesAsync();
            return logres;
        }

        public async Task DeleteLogAsync(int id)
        {
            await _logRepository.DeleteLogAsync(id);
            await _manager.SavechangesAsync();
        }

        public async Task<IEnumerable<Log>> GetAllLogsAsync()
        {
           var logs= await _logRepository.GetLogsAsync();
            return logs;
        }

        public async Task<Log> GetLogAsync(int id)
        {
           return await GetLogAsync(id);
        }

        public async Task<IEnumerable<Log>> GetLogsAsync()
        {
            return await _logRepository.GetLogsAsync();
        }

        public async Task UpdateLogAsync(Log log)
        {
            await _logRepository.UpdateLogAsync(log);
            await _manager.SavechangesAsync();
        }
    }
}
