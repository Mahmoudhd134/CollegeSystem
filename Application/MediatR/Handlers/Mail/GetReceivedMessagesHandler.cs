using Application.Dtos.Mail;
using Application.MediatR.Queries.Mail;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using Persistence.Data;

namespace Application.MediatR.Handlers.Mail;

public class
    GetReceivedMessagesHandler : IRequestHandler<GetReceivedMessagesQuery,
        Response<IEnumerable<MailForReceivedListDto>>>
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetReceivedMessagesHandler(ApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<Response<IEnumerable<MailForReceivedListDto>>> Handle(GetReceivedMessagesQuery request,
        CancellationToken cancellationToken)
    {
        var (userId, userName, pageIndex, pageSize) = request;
        var messagesDto = await _context.Mails
            .Where(m => m.ReceiverId.Equals(userId))
            .OrderByDescending(m => m.Date)
            .Skip(pageIndex * pageSize)
            .Take(pageSize)
            .ProjectTo<MailForReceivedListDto>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);


        var messagesSendersId = messagesDto.Select(m => m.SenderId);

        var messagesSendersIdsToUsernames = await _context.Users
            .Where(u => messagesSendersId.Contains(u.Id))
            .Select(u => new { u.Id, u.UserName })
            .ToListAsync(cancellationToken);

        foreach (var messageDto in messagesDto)
        {
            messageDto.ReceiverUsername = userName;
            messageDto.SenderUsername = messagesSendersIdsToUsernames
                .FirstOrDefault(m => m.Id.Equals(messageDto.SenderId))?.UserName;
        }

        return messagesDto;
    }
}