using Microsoft.EntityFrameworkCore;
using MusicServer.Core.Classes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MusicServer.Data.Data
{
    public interface IData
    {
        public DbSet<Song> Songs { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Folder> Folders { get; set; }
        public DbSet<Log> Logs { get; set; }
        public DbSet<PlayList> Playlists { get; set; }
    }
}
