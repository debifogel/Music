using MusicServer.Core.Classes;
using MusicServer.Core.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MusicServer.Core.Irepository
{
    public interface IUserRepository
    {
        Task<IEnumerable<User>> GetAllUsersAsync();
        Task<User> GetUserByIdAsync(int id);
        Task<User> AddUserAsync(User user);
        Task UpdateUserAsync(int id,UserDto user);
        Task UpdateLoginUserAsync(int id);
        Task<IEnumerable<DateOnly>> GetAllUsersDateAsync();
        Task DeleteUserByIdAsync(string email);
        Task BlockUserByIdAsync(string email);

    }
}
