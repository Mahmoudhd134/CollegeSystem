namespace Application.MediatR.Commands.Student;

public record DeleteStudentCommand(string Id) : IRequest<Response<bool>>;