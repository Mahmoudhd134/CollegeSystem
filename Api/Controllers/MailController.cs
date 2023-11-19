using Application.Dtos.Mail;
using Application.MediatR.Commands.Mail;
using Application.MediatR.Queries.Mail;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[Authorize(Roles = "Admin,Doctor")]
public class MailController : BaseController
{
    [HttpGet]
    [Route("{id:int}")]
    public async Task<ActionResult> Get(int id)
    {
        return Return(await Mediator.Send(new GetMailByIdQuery(id, Id)));
    }

    [HttpGet]
    [Route("GetReceived")]
    public async Task<ActionResult> GetReceived(int pageIndex, int pageSize)
    {
        return Return(await Mediator.Send(new GetReceivedMessagesQuery(Id, Username, pageIndex, pageSize)));
    }

    [HttpGet]
    [Route("GetSend")]
    public async Task<ActionResult> GetSend(int pageIndex, int pageSize)
    {
        return Return(await Mediator.Send(new GetSendMailsQuery(Id, Username, pageIndex, pageSize)));
    }

    [HttpGet]
    [Route("CheckUnReadMessages")]
    public async Task<ActionResult> CheckUnReadMessages()
    {
        return Return(await Mediator.Send(new GetIsUserHasUnReadMailsQuery(Id)));
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> Add([FromBody] AddMailDto addMailDto)
    {
        return Return(await Mediator.Send(new AddMailCommand(addMailDto, Id)));
    }

    [HttpDelete]
    [Authorize(Roles = "Admin")]
    [Route("{messageId:int}")]
    public async Task<ActionResult> Delete(int messageId)
    {
        return Return(await Mediator.Send(new DeleteMailCommand(messageId, Id)));
    }
}