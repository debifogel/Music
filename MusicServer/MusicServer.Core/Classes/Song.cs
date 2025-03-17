using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MusicServer.Core.Classes
{
    public class Song
    {
        public int SongId { get; set; }
        public int UserId { get; set; }
        public string Title { get; set; }
        public string Artist { get; set; }
        public string Genre { get; set; }
        public string FilePath { get; set; }
        public bool IsPrivate { get; set; }
        public DateTime UploadDate { get; set; }
        public List<Folder> Folders { get; set; } = new List<Folder>(); // רשימת תיקיות שהשיר נמצא בהן
        public List<PlayList> Playlists { get; set; } = new List<PlayList>(); // רשימת רשימות השמעה שהשיר נמצא בהן
    }
}
