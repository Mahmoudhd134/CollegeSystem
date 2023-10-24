using Application.Dtos.Role;
using Application.MediatR.Commands.Role;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[Authorize(Roles = "Admin")]
public class RoleController : BaseController
{
    [HttpPost]
    public async Task<ActionResult> Add([FromBody] AddRoleDto addRoleDto)
    {
        return Return(await Mediator.Send(new AddRoleCommand(addRoleDto)));
    }
}