using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MusicServer.Core.Classes
{
    public class PlayList
    {
        public int PlaylistId { get; set; }
        public int UserId { get; set; }
        public string PlaylistName { get; set; }
        public DateTime CreationDate { get; set; }
        public List<Song> Songs { get; set; } = new List<Song>(); // רשימת שירים ברשימת ההשמעה
    }
}
