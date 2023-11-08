using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace YZ.UsersManagement.Core.Entities;

// TODO: IdentityUser - is it Infrastructure or not???
public class ApplicationUser : IdentityUser
{
    [NotMapped]
    public ICollection<string> Roles { get; set; }
    public byte[]? Avatar { get; set; }
}