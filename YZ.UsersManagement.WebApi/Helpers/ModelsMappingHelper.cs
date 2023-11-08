using Microsoft.AspNetCore.Identity;
using YZ.UsersManagement.Core.Entities;
using YZ.UsersManagement.WebApi.Models.Api;

namespace YZ.UsersManagement.WebApi.Helpers;

public static class ModelsMappingHelper
{
    public static UserDto Map(ApplicationUser user)
    {
        var result = new UserDto();

        result.Id = user.Id;
        result.Name = user.UserName;
        result.Email = user.Email;
        result.PhoneNumber = user.PhoneNumber;
        result.Roles = user.Roles != null ? user.Roles.ToList() : null;
        result.Avatar = user.Avatar;

        return result;
    }

    public static List<UserDto> Map(List<ApplicationUser> users)
    {
        var result = users.Select(user => Map(user)).ToList();

        return result;
    }

    public static List<string> Map(List<IdentityRole> roles)
    {
        var result = roles.Select(role => role.Name).ToList();

        return result;
    }
}