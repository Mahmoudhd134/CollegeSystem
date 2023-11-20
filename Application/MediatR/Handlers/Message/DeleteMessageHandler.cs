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
        var messageSenderId = await _context.Messages
            .Where(m => m.Id == messageId)
            .Select(m => m.SenderId)
            .FirstOrDefaultAsync(cancellationToken);
        if (messageSenderId == null)
            return Response<bool>.Failure(MessageErrors.WrongId);
        if (messageSenderId != userId)
            return Response<bool>.Failure(MessageErrors.UnAuthorizeDelete);

        await _context.UserMessageStates
            .Where(ums => ums.MessageId == messageId)
            .ExecuteDeleteAsync(cancellationToken);
        await _context.Messages
            .Where(m => m.Id == messageId)
            .ExecuteDeleteAsync(cancellationToken);
        return true;
    }
}