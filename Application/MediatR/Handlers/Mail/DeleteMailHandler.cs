using Application.ErrorHandlers.Errors;
using Application.MediatR.Commands.Mail;
using Microsoft.EntityFrameworkCore;
using Persistence.Data;

namespace Application.MediatR.Handlers.Mail;

public class DeleteMailHandler : IRequestHandler<DeleteMailCommand, Response<bool>>
{
    private readonly ApplicationDbContext _context;

    public DeleteMailHandler(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Response<bool>> Handle(DeleteMailCommand request, CancellationToken cancellationToken)
    {
        var (messageId, userId) = request;
        var message = await _context.Mails
            .Where(m => m.Id == messageId)
            .FirstOrDefaultAsync(cancellationToken);

        if (message == null)
            return Response<bool>.Failure(MessageErrors.WrongId);

        if (message.SenderId.Equals(userId) == false)
            return Response<bool>.Failure(MessageErrors.UnAuthorizeDelete);

        _context.Mails.Remove(message);
        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}