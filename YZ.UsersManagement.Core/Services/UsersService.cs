using Microsoft.AspNetCore.Identity;
using YZ.UsersManagement.Core.Entities;
using YZ.UsersManagement.Core.Exceptions;

namespace YZ.UsersManagement.Core.Services;

public class UsersService : IUsersService
{
    // TODO: move to Infrastructure layer???
    private readonly UserManager<ApplicationUser> _userManager;

    public UsersService(UserManager<ApplicationUser> userManager)
    {
        _userManager = userManager;
    }

    public List<ApplicationUser> RetrieveApplicationUsers()
    {
        var users = _userManager.Users.ToList();

        return users;
    }

    public async Task DeleteUserAsync(Guid id)
    {
        ArgumentNullException.ThrowIfNull(id);

        var user = await _userManager.FindByIdAsync(id.ToString());
        if (user == null)
        {
            throw new UserNotFoundException();
        }

        var identityResult = await _userManager.DeleteAsync(user);
        if (!identityResult.Succeeded)
        {
            throw new UserDeleteException();
        }
    }

    public async Task<ApplicationUser?> GetAsync(Guid id)
    {
        ArgumentNullException.ThrowIfNull(id);

        var user = await _userManager.FindByIdAsync(id.ToString());

        if (user != null)
        {
            var roles = await _userManager.GetRolesAsync(user);
            user.Roles = roles;
        }

        return user;
    }

    public async Task UpdateUserRolesAsync(Guid userId, List<string> roles)
    {
        ArgumentNullException.ThrowIfNull(roles);
        ArgumentNullException.ThrowIfNull(userId);

        var user = await _userManager.FindByIdAsync(userId.ToString());

        if (user == null)
        {
            throw new UserNotFoundException();
        }

        var userRoles = await _userManager.GetRolesAsync(user);

        var rolesToDelete = userRoles.Except(roles);
        if (rolesToDelete.Any())
        {
            await _userManager.RemoveFromRolesAsync(user, rolesToDelete);
        }

        var rolesToAdd = roles.Except(userRoles);
        if (rolesToAdd.Any())
        {
            await _userManager.AddToRolesAsync(user, rolesToAdd);
        }
    }

    public async Task<bool> UpdateUserAvatarAsync(Guid userId, byte[] avatar)
    {
        ArgumentNullException.ThrowIfNull(userId);

        var user = await _userManager.FindByIdAsync(userId.ToString());

        if (user == null)
        {
            throw new UserNotFoundException();
        }

        user.Avatar = avatar.Any() ? avatar : null;

        IdentityResult result = await _userManager.UpdateAsync(user);

        return result.Succeeded;
    }
}