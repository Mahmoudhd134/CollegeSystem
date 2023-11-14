using Application.Dtos.Room;
using Application.MediatR.Commands.Room;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

public class RoomController : BaseController
{
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
}