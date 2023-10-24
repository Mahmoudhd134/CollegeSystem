using Application.MediatR.Commands.User;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

public class UserController : BaseController
{
    [HttpPost]
    [Route("ChangeProfilePhoto")]
    public async Task<ActionResult> ChangeProfilePhoto([FromForm] IFormFile file)
    {
        return Return(await Mediator.Send(new ChangeUserProfilePhotoCommand(Id, file.FileName, file.OpenReadStream())));
    }
}