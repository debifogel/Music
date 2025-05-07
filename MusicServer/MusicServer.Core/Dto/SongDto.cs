using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MusicServer.Core.Dto
{
    public class SongDto
    {
        public int? SongId { get; set; }

        public string Title { get; set; }
        public string Artist { get; set; }
        public string Genre { get; set; }
        public string FilePath { get; set; }
        public bool IsPrivate { get; set; }
    }
}
