namespace Application.MediatR.Commands.Room;

public record JoinUserToRoomCommand(string UserId, Guid RoomId) : IRequest<Response<bool>>;