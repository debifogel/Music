using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MusicServer.Core.Classes
{
    public class User
    {
        public int UserId { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public bool IsAdmin { get; set; }
        public bool IsBlocked { get; set; }
        public DateTime RegistrationDate { get; set; }
        public DateTime? LastLogin { get; set; }
        public List<Song> Songs { get; set; } = new(); // רשימת שירים של המשתמש
        public List<Folder> Folders { get; set; } = new(); // רשימת תיקיות של המשתמש
        public List<PlayList> Playlists { get; set; } = new(); // רשימת רשימות השמעה של המשתמש
    }
    

}
