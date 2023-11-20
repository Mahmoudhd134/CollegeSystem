using Application.Abstractions;
using Application.Dtos.Message;
using Application.MediatR.Commands.Message;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using Persistence.Data;

namespace Application.MediatR.Handlers.Message;

public class
    GetUnReadMessagesInRoomHandler : IRequestHandler<GetUnReadMessagesInRoomCommand, Response<IList<RoomMessageDto>>>
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly IRoomRealTimeMethods _roomRealTimeMethods;

    public GetUnReadMessagesInRoomHandler(ApplicationDbContext context, IMapper mapper,
        IRoomRealTimeMethods roomRealTimeMethods)
    {
        _context = context;
        _mapper = mapper;
        _roomRealTimeMethods = roomRealTimeMethods;
    }

    public async Task<Response<IList<RoomMessageDto>>> Handle(GetUnReadMessagesInRoomCommand request,
        CancellationToken cancellationToken)
    {
        var (userId, roomId) = request;
        var unReadMessages = await _context.Messages
            .Where(m => m.RoomId == roomId &&
                        m.Date > _context.UserRooms
                            .Where(ur => ur.UserId == userId && ur.RoomId == roomId)
                            .Select(ur => ur.LastOnlineDate)
                            .FirstOrDefault())
            .OrderBy(m => m.Date)
            .ProjectTo<RoomMessageDto>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);

        var ids = unReadMessages.Select(m => m.Id).ToList();
        await _roomRealTimeMethods.MakeIsReadToTrueForMessagesInRoom(ids, roomId);

        await _context.Messages
            .Where(m => ids.Contains(m.Id))
            .ExecuteUpdateAsync(calls => calls
                .SetProperty(ums => ums.IsRead, true), cancellationToken);

        return unReadMessages;
    }
}