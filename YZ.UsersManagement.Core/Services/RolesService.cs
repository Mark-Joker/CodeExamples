using Microsoft.AspNetCore.Identity;

namespace YZ.UsersManagement.Core.Services;

public class RolesService : IRolesService
{
    private readonly RoleManager<IdentityRole> _roleManager;

    public RolesService(RoleManager<IdentityRole> roleManager)
    {
        _roleManager = roleManager;
    }

    public List<IdentityRole> Retrieve()
    {
        var roles = _roleManager.Roles.ToList();

        return roles;
    }
}