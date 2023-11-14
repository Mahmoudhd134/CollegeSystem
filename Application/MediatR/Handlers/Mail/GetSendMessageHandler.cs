using Application.Dtos.Mail;
using Application.MediatR.Queries.Mail;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using Persistence.Data;

namespace Application.MediatR.Handlers.Mail;

public class GetSendMessageHandler : IRequestHandler<GetSendMailsQuery, Response<IEnumerable<MailForSendListDto>>>
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetSendMessageHandler(ApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<Response<IEnumerable<MailForSendListDto>>> Handle(GetSendMailsQuery request,
        CancellationToken cancellationToken)
    {
        var (userId, userName, pageIndex, pageSize) = request;

        var messagesDto = await _context.Mails
            .Where(m => m.SenderId.Equals(userId))
            .OrderByDescending(m => m.Date)
            .Skip(pageIndex * pageSize)
            .Take(pageSize)
            .ProjectTo<MailForSendListDto>(_mapper.ConfigurationProvider)
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