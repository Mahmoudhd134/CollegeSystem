using Application.Dtos.Mail;
using Application.ErrorHandlers.Errors;
using Application.MediatR.Queries.Mail;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Persistence.Data;

namespace Application.MediatR.Handlers.Mail;

public class GetMailByIdHandler : IRequestHandler<GetMailByIdQuery, Response<MailDto>>
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetMailByIdHandler(ApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<Response<MailDto>> Handle(GetMailByIdQuery request, CancellationToken cancellationToken)
    {
        var (id, userId) = request;
        var message = await _context.Mails
            .FirstOrDefaultAsync(m => m.Id == id, cancellationToken);

        if (message.SenderId.Equals(userId) == false && message.ReceiverId.Equals(userId) == false)
            return Response<MailDto>.Failure(MessageErrors.UnAuthorizeGet);

        var idToName = _context.Users
            .Where(u => u.Id.Equals(message.ReceiverId) || u.Id.Equals(message.SenderId))
            .Select(s => new { s.Id, s.UserName })
            .Take(2)
            .ToList();


        var messageDto = _mapper.Map<MailDto>(message);

        messageDto.SenderUsername = idToName.FirstOrDefault(i => i.Id.Equals(message.SenderId))?.UserName;
        messageDto.ReceiverUsername = idToName.FirstOrDefault(i => i.Id.Equals(message.ReceiverId))?.UserName;

        if (message.Read || message.SenderId.Equals(userId))
            return messageDto;

        message.Read = true;
        _context.Mails.Update(message);
        await _context.SaveChangesAsync(cancellationToken);
        return messageDto;
    }
}