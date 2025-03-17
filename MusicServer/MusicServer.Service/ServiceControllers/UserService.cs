using MusicServer.Core.Classes;
using MusicServer.Core.Dto;
using MusicServer.Core.Irepository;
using MusicServer.Core.Iservice;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MusicServer.Service.ServiceControllers
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IManager _manager;

        public UserService(IUserRepository userRepository, IManager manager)
        {
            _userRepository = userRepository;
            _manager = manager;
        }

        public async Task<User> AddUserAsync(User user)
        {
            var User = await _userRepository.AddUserAsync(user);
            await _manager.SavechangesAsync();

            return User;
        }

        public async Task BlockUserByIdAsync(int id)
        {
            await _userRepository.BlockUserByIdAsync(id);
            await _manager.SavechangesAsync();
        }

        public async Task DeleteUserByIdAsync(int id)
        {
            await _userRepository.UpdateLoginUserAsync(id);
            await _manager.SavechangesAsync();

        }

        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            return await _userRepository.GetAllUsersAsync();
        }
        public async Task<User> GetUserByEmailAsync(string email)
        {
            return (await _userRepository.GetAllUsersAsync()).First(u=>u.Email==email);
        }

        public async Task<User> GetUserByIdAsync(int id)
        {
            return await _userRepository.GetUserByIdAsync(id);
        }

        public async Task UpdateUserAsync(int id, UserDto user)
        {
            await _userRepository.UpdateUserAsync(id, user);
            await _manager.SavechangesAsync();
        }
       public async Task UpdateLoginUserAsync(int id)
        {
            _userRepository.UpdateLoginUserAsync(id);
        }

    }
}