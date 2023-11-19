using Application.Abstractions;
using Application.Dtos.Message;
using Application.MediatR.Commands.Message;
using Microsoft.EntityFrameworkCore;
using Persistence.Data;

namespace Application.MediatR.Handlers.Message;

public class GetDelayedMessagesInfoHandler : IRequestHandler<GetDelayedMessagesInfoCommand,
    Response<IList<DelayedSubjectMessageInfoDto>>>
{
    private readonly ApplicationDbContext _context;
    private readonly IRoomRealTimeMethods _roomRealTimeMethods;

    public GetDelayedMessagesInfoHandler(ApplicationDbContext context, IRoomRealTimeMethods roomRealTimeMethods)
    {
        _context = context;
        _roomRealTimeMethods = roomRealTimeMethods;
    }

    public async Task<Response<IList<DelayedSubjectMessageInfoDto>>> Handle(GetDelayedMessagesInfoCommand request,
        CancellationToken cancellationToken)
    {
        var userId = request.UserId;

        var subjectGrouping = await _context.UserMessageStates
            .Include(ums => ums.Room)
            .ThenInclude(r => r.Subject)
            .Where(ums => ums.UserId == userId && ums.IsRead == false)
            .Select(ums => new
            {
                SubjectName = ums.Room.Subject.Name,
                SubjectCode = ums.Room.Subject.Code,
                ums.RoomId,
                RoomName = ums.Room.Name,
                ums.MessageId
            })
            .GroupBy(x => new
            {
                x.SubjectCode,
                x.SubjectName
            })
            .ToListAsync(cancellationToken);
        var subjectGroupingWithRooms = subjectGrouping.Select(x => new
            {
                x.Key.SubjectCode,
                x.Key.SubjectName,
                Rooms = x.GroupBy(y => new { y.RoomId, y.RoomName })
            })
            .ToList();

        var roomMessagesId = subjectGroupingWithRooms.SelectMany(x => x.Rooms)
            .Select(r => new
            {
                r.Key.RoomId,
                MessagesId = r.Select(x => x.MessageId)
            })
            .ToList();
        var tasks = roomMessagesId.Select(r =>
            _roomRealTimeMethods.MakeIsDeliveredToTrueForMessagesInRoom(r.MessagesId,
                r.RoomId));

        var delayedSubjectMessageInfoDtos = subjectGroupingWithRooms.Select(x => new DelayedSubjectMessageInfoDto()
        {
            SubjectCode = x.SubjectCode,
            SubjectName = x.SubjectName,
            DelayedRooms = x.Rooms.Select(y => new DelayedRoomMessageInfoDto()
                {
                    RoomName = y.Key.RoomName,
                    RoomId = y.Key.RoomId,
                    MessagesCount = y.Count()
                })
                .ToList()
        }).ToList();

        var messagesId = roomMessagesId.SelectMany(r => r.MessagesId).ToList();
        await _context.UserMessageStates
            .Where(ums =>
                ums.UserId == userId && messagesId.Contains(ums.MessageId))
            .ExecuteUpdateAsync(caller => caller
                .SetProperty(ums => ums.IsDelivered, true), cancellationToken);

        await Task.WhenAll(tasks);
        return delayedSubjectMessageInfoDtos;
    }
}