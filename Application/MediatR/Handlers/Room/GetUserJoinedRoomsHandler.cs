using Application.Dtos.Room;
using Application.MediatR.Queries.Room;
using Microsoft.EntityFrameworkCore;
using Persistence.Data;

namespace Application.MediatR.Handlers.Room;

public class GetUserJoinedRoomsHandler : IRequestHandler<GetUserJoinedRoomsQuery, Response<IList<UserRoomForAppConnection>>>
{
    private readonly ApplicationDbContext _context;

    public GetUserJoinedRoomsHandler(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Response<IList<UserRoomForAppConnection>>> Handle(GetUserJoinedRoomsQuery request,
        CancellationToken cancellationToken)
    {
        return await _context.UserRooms
            .Include(ur => ur.Room)
            .Where(ur => ur.UserId == request.UserId)
            .Select(x => new UserRoomForAppConnection()
            {
                UserId = request.UserId,
                RoomId = x.RoomId,
                RoomName = x.Room.Name
            })
            .ToListAsync(cancellationToken);
    }
}