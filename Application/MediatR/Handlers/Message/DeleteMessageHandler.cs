using Application.ErrorHandlers.Errors;
using Application.MediatR.Commands.Message;
using Microsoft.EntityFrameworkCore;
using Persistence.Data;

namespace Application.MediatR.Handlers.Message;

public class DeleteMessageHandler : IRequestHandler<DeleteMessageCommand, Response<bool>>
{
    private readonly ApplicationDbContext _context;

    public DeleteMessageHandler(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Response<bool>> Handle(DeleteMessageCommand request, CancellationToken cancellationToken)
    {
        var (messageId, userId) = request;
        var message = await _context.Messages
            .Where(m => m.Id == messageId)
            .FirstOrDefaultAsync(cancellationToken);

        if (message == null)
            return Response<bool>.Failure(MessageErrors.WrongId);

        if (message.SenderId.Equals(userId) == false)
            return Response<bool>.Failure(MessageErrors.UnAuthorizeDelete);

        _context.Messages.Remove(message);
        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}