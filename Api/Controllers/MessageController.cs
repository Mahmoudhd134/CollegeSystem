using Application.Dtos.Message;
using Application.MediatR.Queries.Message;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

public class MessageController : BaseController
{
    [HttpGet("load-messages")]
    public async Task<ActionResult<IList<RoomMessageDto>>> GetMessages(int messagesCount, DateTime dateTime,
        Guid roomId) =>
        Return(await Mediator.Send(new GetMessagesAfterDateQuery(messagesCount, dateTime, Id, roomId)));

    [HttpPost("messages-state")]
    public async Task<ActionResult<IList<MessageStateDto>>> GetMessagesState([FromBody] MessagesId messagesId) =>
        Return(await Mediator.Send(new GetMessagesStateQuery(messagesId.Messages)));
}