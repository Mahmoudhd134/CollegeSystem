using Application.Dtos.Student;

namespace Application.MediatR.Commands.Student;

public record AssignStudentToSubjectCommand(AssignStudentToSubjectDto AssignStudentToSubjectDto) : IRequest<Response<bool>>;