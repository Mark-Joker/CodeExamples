using Microsoft.AspNetCore.Identity;

namespace YZ.UsersManagement.Core.Services;

public interface IRolesService
{
    List<IdentityRole> Retrieve();
}