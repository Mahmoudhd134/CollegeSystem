using Application.MediatR.Commands.Room;
using Microsoft.EntityFrameworkCore;
using Persistence.Data;

namespace Application.MediatR.Handlers.Room;

public class OutFromRoomHandler : IRequestHandler<OutFromRoomCommand, Response<bool>>
{
    private readonly ApplicationDbContext _context;

    public OutFromRoomHandler(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Response<bool>> Handle(OutFromRoomCommand request, CancellationToken cancellationToken)
    {
        var (roomId, userId) = request;
        await _context.UserRooms
            .Where(ur => ur.UserId == userId && ur.RoomId == roomId)
            .ExecuteUpdateAsync(calls => calls
                .SetProperty(ur => ur.LastOnlineDate, DateTime.UtcNow), cancellationToken);
        return true;
    }
}