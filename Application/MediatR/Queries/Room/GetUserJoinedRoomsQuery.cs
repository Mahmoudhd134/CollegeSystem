using Application.Dtos.RealTimeConnection;
using Application.Dtos.Room;

namespace Application.MediatR.Queries.Room;

public record GetUserJoinedRoomsQuery(string UserId) : IRequest<Response<IList<UserRoomForAppConnection>>>;