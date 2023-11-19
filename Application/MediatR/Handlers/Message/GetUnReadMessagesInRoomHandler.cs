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
        var unReadMessages = await _context.UserMessageStates
            .Include(ums => ums.Message)
            .Where(ums => ums.RoomId == roomId && ums.UserId == userId && ums.IsRead == false)
            .OrderBy(ums => ums.Message.Date)
            .ProjectTo<RoomMessageDto>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);

        await _roomRealTimeMethods.MakeIsReadToTrueForMessagesInRoom(unReadMessages.Select(m => m.Id), roomId);

        await _context.UserMessageStates
            .Where(ums => ums.UserId == userId && unReadMessages.Select(m => m.Id).Contains(ums.MessageId))
            .ExecuteUpdateAsync(calls => calls
                .SetProperty(ums => ums.IsRead, true)
                .SetProperty(ums => ums.IsDelivered, true), cancellationToken);

        return unReadMessages;
    }
}