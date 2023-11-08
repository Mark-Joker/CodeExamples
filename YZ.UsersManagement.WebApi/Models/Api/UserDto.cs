namespace YZ.UsersManagement.WebApi.Models.Api;

public class UserDto
{
    public string Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public string PhoneNumber { get; set; }
    public List<string> Roles { get; set; }
    public byte[] Avatar { get; set; }
    public int VisitsCount { get; set; }
    public DateTime LastVisitDate { get; set; }
}