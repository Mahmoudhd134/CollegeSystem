namespace Application.MediatR.Queries.Student;

public record IsAssignedToSubjectQuery(int SubjectId,string StudentId):IRequest<Response<bool>>;