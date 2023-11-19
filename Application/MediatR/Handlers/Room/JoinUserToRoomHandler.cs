using Application.Dtos.RealTimeConnection;
using Application.Dtos.Room;
using Application.ErrorHandlers.Errors;
using Application.MediatR.Commands.Room;
using Domain.Room;
using Microsoft.EntityFrameworkCore;
using Persistence.Data;

namespace Application.MediatR.Handlers.Room;

public class JoinUserToRoomHandler : IRequestHandler<JoinUserToRoomCommand, Response<bool>>
{
    private readonly ApplicationDbContext _context;
    private readonly Dictionary<string, UserAppConnection> _appConnections;

    public JoinUserToRoomHandler(ApplicationDbContext context, Dictionary<string, UserAppConnection> appConnections)
    {
        _context = context;
        _appConnections = appConnections;
    }

    public async Task<Response<bool>> Handle(JoinUserToRoomCommand request, CancellationToken cancellationToken)
    {
        var (userId, roomId) = request;
        var isJoined = await _context.UserRooms
            .AnyAsync(ur => ur.RoomId == roomId && ur.UserId == userId, cancellationToken);
        if (isJoined)
            return Response<bool>.Failure(RoomErrors.UserAlreadyJoined);

        var roomName = await _context.Rooms
            .Where(r => r.Id == roomId)
            .Select(r => r.Name)
            .FirstOrDefaultAsync(cancellationToken);
        if (string.IsNullOrWhiteSpace(roomName))
            return Response<bool>.Failure(RoomErrors.WrongId);
        
        _context.UserRooms.Add(new UserRoom()
        {
            RoomId = roomId,
            UserId = userId
        });
        
        _appConnections.FirstOrDefault(kvp => kvp.Value.UserId == userId)
            .Value.UserRooms.Add(new UserRoomForAppConnection()
            {
                UserId = userId,
                RoomId = roomId,
                RoomName = roomName
            });

        return await _context.SaveChangesAsync(cancellationToken) > 0;
    }
}