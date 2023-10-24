namespace Application.MediatR.Commands.Message;

public record DeleteMessageCommand(int MessageId, string UserId) : IRequest<Response<bool>>;