using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using MusicServer.Core.Classes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MusicServer.Data.Data
{
    
    public class DataContext: DbContext,IData
    {
        private readonly IConfiguration _configuration;
        public DataContext(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public DbSet <Song>Songs { get; set; }
        public DbSet <User> Users{ get; set; }
        public DbSet <Folder>Folders { get; set; }
        public DbSet <Log>Logs { get; set; }
        public DbSet <PlayList>Playlists { get; set; }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(_configuration["DbConnectionString"]);
        }
    }
}
