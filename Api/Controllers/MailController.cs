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
    public async Task<ActionResult<MailDto>> Get(int id) =>
        Return(await Mediator.Send(new GetMailByIdQuery(id, Id)));

    [HttpGet]
    [Route("GetReceived")]
    public async Task<ActionResult<IEnumerable<MailForReceivedListDto>>> GetReceived(int pageIndex, int pageSize) =>
        Return(await Mediator.Send(new GetReceivedMessagesQuery(Id, Username, pageIndex, pageSize)));

    [HttpGet]
    [Route("GetSend")]
    public async Task<ActionResult<IEnumerable<MailForSendListDto>>> GetSend(int pageIndex, int pageSize) =>
        Return(await Mediator.Send(new GetSendMailsQuery(Id, Username, pageIndex, pageSize)));

    [HttpGet]
    [Route("CheckUnReadMessages")]
    public async Task<ActionResult<bool>> CheckUnReadMessages() =>
        Return(await Mediator.Send(new GetIsUserHasUnReadMailsQuery(Id)));

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<bool>> Add([FromBody] AddMailDto addMailDto) =>
        Return(await Mediator.Send(new AddMailCommand(addMailDto, Id)));

    [HttpDelete]
    [Authorize(Roles = "Admin")]
    [Route("{messageId:int}")]
    public async Task<ActionResult<bool>> Delete(int messageId) =>
        Return(await Mediator.Send(new DeleteMailCommand(messageId, Id)));
}