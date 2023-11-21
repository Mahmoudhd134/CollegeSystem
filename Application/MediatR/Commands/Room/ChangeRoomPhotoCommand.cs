using Application.Dtos.Room;

namespace Application.MediatR.Commands.Room;

public record ChangeRoomPhotoCommand
    (Guid RoomId, string UserId, string Name, Stream Stream) : IRequest<Response<bool>>;