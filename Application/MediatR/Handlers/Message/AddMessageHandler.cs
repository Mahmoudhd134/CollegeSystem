using Application.Abstractions;
using Application.Dtos.Message;
using Application.Dtos.RealTimeConnection;
using Application.Dtos.Room;
using Application.ErrorHandlers.Errors;
using Application.MediatR.Commands.Message;
using Domain.Room;
using Microsoft.EntityFrameworkCore;
using Persistence.Data;

namespace Application.MediatR.Handlers.Message;

public class AddMessageHandler : IRequestHandler<AddMessageCommand, Response<RoomMessageDto>>
{
    private readonly ApplicationDbContext _context;
    private readonly Dictionary<string, UserRoomConnection> _roomConnections;
    private readonly Dictionary<string, UserAppConnection> _appConnections;
    private readonly IAppRealTimeMethods _appRealTimeMethods;

    public AddMessageHandler(ApplicationDbContext context, Dictionary<string, UserRoomConnection> roomConnections,
        Dictionary<string, UserAppConnection> appConnections, IAppRealTimeMethods appRealTimeMethods)
    {
        _context = context;
        _roomConnections = roomConnections;
        _appConnections = appConnections;
        _appRealTimeMethods = appRealTimeMethods;
    }

    public async Task<Response<RoomMessageDto>> Handle(AddMessageCommand request, CancellationToken cancellationToken)
    {
        var (addMessageDto, senderId) = request;
        var usersJoinedTheRoom = await _context.UserRooms
            .Where(ur => ur.RoomId == addMessageDto.RoomId)
            .ToListAsync(cancellationToken);

        var isJoined = usersJoinedTheRoom.Any(ur => ur.RoomId == addMessageDto.RoomId && ur.UserId == senderId);
        if (!isJoined)
            return Response<RoomMessageDto>.Failure(RoomErrors.UnAuthorizeAddMessage);

        var connectedToTheRoom = _roomConnections
            .Where(kvp => kvp.Value.RoomId == addMessageDto.RoomId)
            .Select(kvp => kvp.Value.UserId)
            .ToHashSet();

        var connectedToTheApp = _appConnections
            .Where(kvp => kvp.Value.UserRooms
                .Any(ur => ur.RoomId == addMessageDto.RoomId))
            .Select(kvp => kvp.Value.UserId)
            .ToList();

        var message = new Domain.Room.Message()
        {
            Text = addMessageDto.Text,
            Date = DateTime.UtcNow,
            RoomId = addMessageDto.RoomId,
            SenderId = senderId,
            UserMessageStates = usersJoinedTheRoom
                .Select(ur => new UserMessageState()
                {
                    RoomId = addMessageDto.RoomId,
                    UserId = ur.UserId,
                    IsDelivered = connectedToTheApp.Contains(ur.UserId),
                    DeliveredDate = connectedToTheApp.Contains(ur.UserId) ? DateTime.UtcNow : null,
                    IsRead = connectedToTheRoom.Contains(ur.UserId),
                    ReadDate = connectedToTheRoom.Contains(ur.UserId) ? DateTime.UtcNow : null,
                })
                .ToList()
        };

        _context.Messages.Add(message);
        await _context.SaveChangesAsync(cancellationToken);

        var notificationDto = await _context.Messages
            .Include(m => m.Room)
            .ThenInclude(r => r.Subject)
            .Where(m => m.Id == message.Id)
            .Select(m => new NewMessageNotificationDto()
            {
                First100Char = string.Join("", m.Text.Take(100)),
                Date = DateTime.UtcNow,
                RoomId = m.RoomId,
                RoomName = m.Room.Name,
                SubjectCode = m.Room.Subject.Code,
                SubjectName = m.Room.Subject.Name
            })
            .FirstOrDefaultAsync(cancellationToken);

        notificationDto.Sender = addMessageDto.Sender;

        await _appRealTimeMethods.SendMessageNotificationToUsers(connectedToTheApp
                .Where(x => connectedToTheRoom.Contains(x) == false),
            notificationDto);

        return new RoomMessageDto()
        {
            RoomId = addMessageDto.RoomId,
            Date = DateTime.UtcNow,
            Text = addMessageDto.Text,
            Id = message.Id,
            Sender = addMessageDto.Sender,
            IsDelivered = connectedToTheApp.Count > 1,
            IsRead = connectedToTheRoom.Count > 1
        };
    }
}