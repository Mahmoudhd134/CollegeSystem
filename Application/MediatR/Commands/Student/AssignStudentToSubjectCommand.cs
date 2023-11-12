using Application.Dtos.Student;

namespace Application.MediatR.Commands.Student;

public record AssignStudentToSubjectCommand(string StudentId,int SubjectId) : IRequest<Response<bool>>;