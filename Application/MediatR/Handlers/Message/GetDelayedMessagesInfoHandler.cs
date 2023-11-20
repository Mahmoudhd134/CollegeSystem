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

        var delayedSubjectMessageInfoDtos = await _context.Rooms
            .Where(r => r.UserRooms.Where(ur => ur.UserId == userId).Select(ur => ur.RoomId).Contains(r.Id))
            .Select(r => new
            {
                SC = r.Subject.Code,
                SN = r.Subject.Name,
                RN = r.Name,
                RID = r.Id,
                RMC = r.Messages.Count(m => m.Date > r.UserRooms
                    .Where(ur => ur.UserId == userId)
                    .Select(ur => ur.LastOnlineDate)
                    .FirstOrDefault())
            })
            .Where(r => r.RMC > 0)
            .GroupBy(r => new { r.SC, r.SN })
            .Select(g => new DelayedSubjectMessageInfoDto()
            {
                SubjectCode = g.Key.SC,
                SubjectName = g.Key.SN,
                DelayedRooms = g.GroupBy(r => new { r.RN, r.RID, r.RMC })
                    .Select(gg => new DelayedRoomMessageInfoDto()
                    {
                        RoomId = gg.Key.RID,
                        RoomName = gg.Key.RN,
                        MessagesCount = gg.Key.RMC
                    })
                    .ToList()
            })
            .ToListAsync(cancellationToken);

        return delayedSubjectMessageInfoDtos;
    }
}