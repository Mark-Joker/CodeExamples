using Microsoft.AspNetCore.Mvc;
using YZ.UsersManagement.Core.Exceptions;
using YZ.UsersManagement.Core.Services;
using YZ.UsersManagement.WebApi.Helpers;
using YZ.UsersManagement.WebApi.Models.Api;

namespace YZ.UsersManagement.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private const string UserNotFoundMessage = "Can't find such a user.";
    private const string CantUpdateUserMessage = "Can't update a user.";

    private readonly IUsersService _usersService;

    public UsersController(IUsersService usersService)
    {
        _usersService = usersService;
    }

    [HttpGet]
    [Produces("application/json")]
    public IEnumerable<UserDto> Get()
    {
        var users = _usersService.RetrieveApplicationUsers();

        // Map to api User model.
        // TODO: use AutoMapper.
        var result = ModelsMappingHelper.Map(users);

        return result;
    }

    [HttpGet("{id:Guid}")]
    [Produces("application/json")]
    public async Task<IActionResult> Get([FromRoute] Guid id)
    {
        var user = await _usersService.GetAsync(id);

        if (user == null)
        {
            return NotFound(UserNotFoundMessage);
        }

        var result = ModelsMappingHelper.Map(user);

        return Ok(result);
    }

    [HttpPut("{userId:Guid}/roles")]
    [Consumes("application/json")]
    public async Task<IActionResult> UpdateUserRoles([FromRoute] Guid userId, [FromBody] IList<string> roles)
    {
        try
        {
            await _usersService.UpdateUserRolesAsync(userId, roles.ToList());
        }
        catch (UserNotFoundException ex)
        {
            return NotFound(ex.Message);
        }

        return NoContent();
    }

    [HttpPut("{userId:Guid}/avatar")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> UpdateAvatar([FromRoute] Guid userId, [FromForm] IFormFile avatarFile)
    {
        using var memoryStream = new MemoryStream();
        await avatarFile.CopyToAsync(memoryStream);

        var avatarBytes = memoryStream.ToArray();

        bool result = true;

        try
        {
            result = await _usersService.UpdateUserAvatarAsync(userId, avatarBytes);
        }
        catch (UserNotFoundException ex)
        {
            return NotFound(ex.Message);
        }

        if (!result)
        {
            return StatusCode(500, CantUpdateUserMessage);
        }

        return NoContent();
    }

    [HttpDelete("{id:Guid}")]
    [Produces("application/json")]
    public async Task<IActionResult> Delete([FromRoute] Guid id)
    {
        try
        {
            await _usersService.DeleteUserAsync(id);
        }
        catch (UserNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
        catch (UserDeleteException ex)
        {
            return StatusCode(500, ex.Message);
        }

        return NoContent();
    }
}