namespace Application.MediatR.Commands.Mail;

public record DeleteMailCommand(int MessageId, string UserId) : IRequest<Response<bool>>;