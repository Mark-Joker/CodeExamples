using YZ.UsersManagement.Core.Entities;

namespace YZ.UsersManagement.Core.Services;

public interface IUsersService
{
    List<ApplicationUser> RetrieveApplicationUsers();
    Task DeleteUserAsync(Guid id);
    Task<ApplicationUser?> GetAsync(Guid id);
    Task UpdateUserRolesAsync(Guid userId, List<string> roles);
    Task<bool> UpdateUserAvatarAsync(Guid userId, byte[] avatar);
}