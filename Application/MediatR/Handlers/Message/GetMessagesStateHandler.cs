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
        return await _context.Messages
            .Where(m => request.MessagesId.Contains(m.Id))
            .Select(m => new MessageStateDto()
            {
                Id = m.Id,
                RoomId = m.RoomId,
                IsRead = m.IsRead
            })
            .ToListAsync(cancellationToken);
    }
}