using Microsoft.AspNetCore.Mvc;
using YZ.UsersManagement.WebApi.Helpers;
using YZ.UsersManagement.Core.Services;

namespace YZ.UsersManagement.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RolesController : ControllerBase
{
    private readonly IRolesService _rolesService;

    public RolesController(IRolesService rolesService)
    {
        _rolesService = rolesService;
    }

    [HttpGet]
    [Produces("application/json")]
    public IEnumerable<string> Get()
    {
        var roles = _rolesService.Retrieve();

        var result = ModelsMappingHelper.Map(roles);

        return result;
    }
}
