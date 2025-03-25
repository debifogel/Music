using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MusicServer.Core.Classes
{
    public class Folder

    {
        public int FolderId { get; set; }
        public int UserId { get; set; }
        [MaxLength(255)]

        public string FolderName { get; set; }
        public int? ParentFolderId { get; set; }
        public List<Song> Songs { get; set; } = new List<Song>(); // רשימת שירים בתיקייה
    
}
}
