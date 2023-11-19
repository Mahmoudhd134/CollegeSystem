using Application.Dtos.Message;
using Application.MediatR.Queries.Message;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using Persistence.Data;

namespace Application.MediatR.Handlers.Message;

public class GetMessagesStateHandler : IRequestHandler<GetMessagesStateQuery, Response<IList<MessageStateDto>>>
{
    private readonly ApplicationDbContext _context;

    public GetMessagesStateHandler(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Response<IList<MessageStateDto>>> Handle(GetMessagesStateQuery request,
        CancellationToken cancellationToken)
    {
        return await _context.UserMessageStates
            .Where(ums => request.MessagesId.Contains(ums.MessageId))
            .GroupBy(ums => new { ums.MessageId, ums.RoomId })
            .Select(g => new MessageStateDto()
            {
                Id = g.Key.MessageId,
                RoomId = g.Key.RoomId,
                IsDelivered = g.Count(x => x.IsDelivered) > 1,
                IsRead = g.Count(x => x.IsRead) > 1
            })
            .ToListAsync(cancellationToken);
    }
}