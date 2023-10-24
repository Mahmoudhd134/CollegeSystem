using Application.ErrorHandlers.Errors;
using Application.MediatR.Commands.Message;
using Microsoft.EntityFrameworkCore;
using Persistence.Data;

namespace Application.MediatR.Handlers.Message;

public class AddMessageHandler : IRequestHandler<AddMessageCommand, Response<bool>>
{
    private readonly ApplicationDbContext _context;

    public AddMessageHandler(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Response<bool>> Handle(AddMessageCommand request, CancellationToken cancellationToken)
    {
        var (addMessageDto, senderId) = request;

        var receiverFound =
            await _context.Users.AnyAsync(u => u.Id.Equals(addMessageDto.ReceiverId), cancellationToken);
        if (receiverFound == false)
            return Response<bool>.Failure(UserErrors.WrongId);

        var message = new Domain.Messages.Message
        {
            SenderId = senderId,
            ReceiverId = addMessageDto.ReceiverId,
            Title = addMessageDto.Title,
            Content = addMessageDto.Content
        };

        _context.Messages.Add(message);
        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}