using MusicServer.Core.Classes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MusicServer.Core.Irepository
{
    public  interface ILogRepository
    {
        //function that match for api call
        Task<IEnumerable<Log>> GetLogsAsync();
        Task<IEnumerable<Log>> GetAllLogsAsync();
        Task<Log> GetLogAsync(int id);
        Task<Log> AddLogAsync(Log log);
        Task UpdateLogAsync(Log log);
        Task DeleteLogAsync(int id);

    }
}
