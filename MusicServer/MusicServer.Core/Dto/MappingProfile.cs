using AutoMapper;
using MusicServer.Core.Classes;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Collections.Specialized.BitVector32;

namespace MusicServer.Core.Dto
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<User, UserDto>().ReverseMap();
            CreateMap<Folder, FolderDto>().ReverseMap();
            CreateMap<Song, SongDto>().ReverseMap();
            CreateMap<PlayList, PlayListDto>().ReverseMap();
        }
    }
}
