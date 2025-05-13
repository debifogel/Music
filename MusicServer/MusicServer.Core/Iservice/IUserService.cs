using MusicServer.Core.Classes;
using MusicServer.Core.Dto;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MusicServer.Core.Iservice
{
    public interface IUserService
    {
        Task<IEnumerable<User>> GetAllUsersAsync();
        Task<User> GetUserByIdAsync(int id);
        Task<User> AddUserAsync(User user);
        Task<User> GetUserByEmailAsync(string email);
        Task<IEnumerable<DateOnly>> GetAllUsersDateAsync();
        Task UpdateUserAsync(int id, UserDto user);
        Task DeleteUserByIdAsync(int id);
        Task BlockUserByIdAsync(int id);
        Task BlockByDate(DateTime date);
        Task UpdateLoginUserAsync(int id);

    }
}
