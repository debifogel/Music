using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MusicServer.Core.Irepository
{
    public interface IManager
    {
        Task SavechangesAsync();

    }
}
