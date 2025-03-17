using MusicServer.Core.Classes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MusicServer.Core.Iservice
{
    public interface ILogService
    {
        Task<IEnumerable<Log>> GetLogsAsync();
        Task<IEnumerable<Log>> GetAllLogsAsync();
        Task<Log> GetLogAsync(int id);
        Task<Log> AddLogAsync(Log log);
        Task UpdateLogAsync(Log log);
        Task DeleteLogAsync(int id);
    }
}
