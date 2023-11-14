namespace Application.MediatR.Commands.Room;

public record DeleteRoomCommand(Guid RoomId,string Id):IRequest<Response<bool>>;