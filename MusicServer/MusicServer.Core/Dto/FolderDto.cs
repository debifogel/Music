using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MusicServer.Core.Dto
{
    public class FolderDto
    {
        public int FolderId { get; set; }
        public string FolderName { get; set; }
        public int? ParentFolderId { get; set; }
    }
}
