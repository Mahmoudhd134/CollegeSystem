using Application.Dtos.Room;

namespace Application.MediatR.Queries.Room;

public record GetRoomQuery(Guid RoomId,string UserId) : IRequest<Response<RoomDto>>;