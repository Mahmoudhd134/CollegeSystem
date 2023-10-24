using Application.Dtos.Student;

namespace Application.MediatR.Commands.Student;

public record EditStudentCommand(string StudentId, EditStudentDto EditStudentDto) : IRequest<Response<bool>>;