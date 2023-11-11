using Application.Dtos.Message;
using Application.MediatR.Commands.Message;
using Application.MediatR.Queries.Messge;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[Authorize(Roles = "Admin,Doctor")]
public class MessageController : BaseController
{
    [HttpGet]
    [Route("{id:int}")]
    public async Task<ActionResult> Get(int id)
    {
        return Return(await Mediator.Send(new GetMessageByIdQuery(id, Id)));
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
        return Return(await Mediator.Send(new GetSendMessagesQuery(Id, Username, pageIndex, pageSize)));
    }

    [HttpGet]
    [Route("CheckUnReadMessages")]
    public async Task<ActionResult> CheckUnReadMessages()
    {
        return Return(await Mediator.Send(new GetIsUserHasUnReadMessagesQuery(Id)));
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> Add([FromBody] AddMessageDto addMessageDto)
    {
        return Return(await Mediator.Send(new AddMessageCommand(addMessageDto, Id)));
    }

    [HttpDelete]
    [Authorize(Roles = "Admin")]
    [Route("{messageId:int}")]
    public async Task<ActionResult> Delete(int messageId)
    {
        return Return(await Mediator.Send(new DeleteMessageCommand(messageId, Id)));
    }
}