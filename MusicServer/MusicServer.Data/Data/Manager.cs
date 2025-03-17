using MusicServer.Core.Irepository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MusicServer.Data.Data
{
    public class Manager : IManager
    {
        DataContext _context;

        public Manager(DataContext context)
        {
            _context = context;
        }

        public async Task SavechangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
