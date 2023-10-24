namespace Application.MediatR.Commands.Subject;

public record DeleteSubjectCommand(int Id) : IRequest<Response<bool>>;