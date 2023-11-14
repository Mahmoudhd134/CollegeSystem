using Application.ErrorHandlers.Errors;
using Application.MediatR.Commands.Mail;
using Microsoft.EntityFrameworkCore;
using Persistence.Data;

namespace Application.MediatR.Handlers.Mail;

public class AddMailHandler : IRequestHandler<AddMailCommand, Response<bool>>
{
    private readonly ApplicationDbContext _context;

    public AddMailHandler(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Response<bool>> Handle(AddMailCommand request, CancellationToken cancellationToken)
    {
        var (addMessageDto, senderId) = request;

        var receiverFound =
            await _context.Users.AnyAsync(u => u.Id.Equals(addMessageDto.ReceiverId), cancellationToken);
        if (receiverFound == false)
            return Response<bool>.Failure(UserErrors.WrongId);

        var message = new Domain.Mails.Mail
        {
            SenderId = senderId,
            ReceiverId = addMessageDto.ReceiverId,
            Title = addMessageDto.Title,
            Content = addMessageDto.Content
        };

        _context.Mails.Add(message);
        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}