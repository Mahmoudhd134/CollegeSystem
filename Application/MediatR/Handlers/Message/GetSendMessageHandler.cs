using Application.Dtos.Message;
using Application.MediatR.Queries.Messge;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using Persistence.Data;

namespace Application.MediatR.Handlers.Message;

public class GetSendMessageHandler : IRequestHandler<GetSendMessagesQuery, Response<IEnumerable<MessageForSendListDto>>>
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetSendMessageHandler(ApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<Response<IEnumerable<MessageForSendListDto>>> Handle(GetSendMessagesQuery request,
        CancellationToken cancellationToken)
    {
        var (userId, userName, pageIndex, pageSize) = request;

        var messagesDto = await _context.Messages
            .Where(m => m.SenderId.Equals(userId))
            .OrderByDescending(m => m.Date)
            .Skip(pageIndex * pageSize)
            .Take(pageSize)
            .ProjectTo<MessageForSendListDto>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);

        var messagesReceivedIds = messagesDto.Select(s => s.ReceiverId);

        var usersIdToUsername = await _context.Users
            .Where(u => messagesReceivedIds.Contains(u.Id))
            .Select(u => new { u.Id, u.UserName })
            .ToListAsync(cancellationToken);

        foreach (var messageDto in messagesDto)
        {
            messageDto.SenderUsername = userName;
            messageDto.ReceiverUsername = usersIdToUsername
                .FirstOrDefault(u => u.Id.Equals(messageDto.ReceiverId))?.UserName;
        }

        return messagesDto;
    }
}