using Application.Dtos.Role;
using Application.MediatR.Commands.Role;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[Authorize(Roles = "Admin")]
public class RoleController : BaseController
{
    [HttpPost]
    public async Task<ActionResult<bool>> Add([FromBody] AddRoleDto addRoleDto) =>
        Return(await Mediator.Send(new AddRoleCommand(addRoleDto)));
}