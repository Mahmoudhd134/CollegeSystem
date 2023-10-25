using Application.Dtos.Student;

namespace Application.MediatR.Commands.Student;

public record AddStudentCommand(AddStudentDto AddStudentDto) : IRequest<Response<bool>>;