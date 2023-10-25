namespace Application.MediatR.Commands.Student;

public record DeAssignStudentFromSubjectCommand (string StudentId,int SubjectId) : IRequest<Response<bool>>;