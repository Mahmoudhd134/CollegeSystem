using Application.Dtos.Message;
using Application.Dtos.Room;
using Application.ErrorHandlers;
using Application.MediatR.Commands.Message;
using Application.MediatR.Commands.Room;
using Application.MediatR.Queries.Room;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

public class RoomController : BaseController
{
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<RoomDto>> Get(Guid id) =>
        Return(await Mediator.Send(new GetRoomQuery(id, Id)));

    [HttpGet("un-read-messages/{roomId:guid}")]
    public async Task<ActionResult<IList<RoomMessageDto>>> GetUnReadMessages(Guid roomId) =>
        Return(await Mediator.Send(new GetUnReadMessagesInRoomCommand(Id, roomId)));

    [HttpPost]
    [Authorize(Roles = "Doctor")]
    public async Task<ActionResult<bool>> Add(AddRoomDto addRoomDto) =>
        Return(await Mediator.Send(new AddRoomCommand(addRoomDto, Id)));

    [HttpPut]
    [Authorize(Roles = "Doctor")]
    public async Task<ActionResult<bool>> Edit(EditRoomDto editRoomDto) =>
        Return(await Mediator.Send(new EditRoomCommand(editRoomDto, Id)));

    [HttpDelete("{roomId:guid}")]
    [Authorize(Roles = "Doctor")]
    public async Task<ActionResult<bool>> Delete(Guid roomId) =>
        Return(await Mediator.Send(new DeleteRoomCommand(roomId, Id)));

    [HttpPost("join-user/{roomId:guid}")]
    public async Task<ActionResult<Response<bool>>> JoinUser(Guid roomId) =>
        Return(await Mediator.Send(new JoinUserToRoomCommand(Id, roomId)));
}