namespace Application.MediatR.Commands.Room;

public record OutFromRoomCommand(Guid RoomId, string UserId) : IRequest<Response<bool>>;