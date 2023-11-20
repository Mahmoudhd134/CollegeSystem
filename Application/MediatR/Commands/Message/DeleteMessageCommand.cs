namespace Application.MediatR.Commands.Message;

public record DeleteMessageCommand(Guid MessageId, string UserId) : IRequest<Response<bool>>;