using Application.Dtos.Message;
using Application.MediatR.Commands.Message;
using Application.MediatR.Commands.User;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

public class UserController : BaseController
{
    [HttpGet("delayed-messages-info")]
    public async Task<ActionResult<IList<DelayedSubjectMessageInfoDto>>> GetUnReadMessagesInfo() =>
        Return(await Mediator.Send(new GetDelayedMessagesInfoCommand(Id)));

    [HttpPost]
    [Route("ChangeProfilePhoto")]
    public async Task<ActionResult> ChangeProfilePhoto([FromForm] IFormFile file)
    {
        return Return(await Mediator.Send(new ChangeUserProfilePhotoCommand(Id, file.FileName, file.OpenReadStream())));
    }
}