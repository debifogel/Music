using Microsoft.EntityFrameworkCore;
using MusicServer.Core.Classes;
using MusicServer.Core.Dto;
using MusicServer.Core.Irepository;
using MusicServer.Data.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MusicServer.Data.Repository
{
    public class UserRepository : IUserRepository
    {
        private readonly IData _context;
        public UserRepository(IData context)
        {
            _context = context;
        }
        public async Task<User> AddUserAsync(User user)
        {
             await _context.Users.AddAsync(user);
            return user;
        }

        public async Task BlockUserByIdAsync(int id)
        {
            var user=await GetUserByIdAsync(id);
            user.IsBlocked = true;
        }

        public async Task DeleteUserByIdAsync(int id)
        {
            var user = await GetUserByIdAsync(id);
             _context.Users.RemoveRange(user);
        }

        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            return await _context.Users.ToListAsync();
        }

        public async Task<User> GetUserByIdAsync(int id)
        {
            return await _context.Users.FindAsync(id);
        }

        public async Task UpdateLoginUserAsync(int id)
        {
            var user = await GetUserByIdAsync(id);
            user.LastLogin = DateTime.Now;
        }

        public async Task UpdateUserAsync(int id,UserDto userd)
        {
            var user = await GetUserByIdAsync(id);
            user.Username = userd.Username;
            user.Password = userd.Password;
            user.Email = userd.Email;
            
        }
    }
}
