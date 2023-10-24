using Application.Dtos.Student;
using Application.Dtos.Subject;

namespace Application.MediatR.Commands.Student;

public record AddStudentCommand(AddStudentDto AddStudentDto) : IRequest<Response<bool>>;