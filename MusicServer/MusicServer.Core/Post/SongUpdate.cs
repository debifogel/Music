using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MusicServer.Core.Post
{
    public class SongUpdate
    {
        public string Title { get; set; }
        public string Artist { get; set; }
        public string Genre { get; set; }
    }
}
