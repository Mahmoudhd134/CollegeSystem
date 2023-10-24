using Application.Dtos.Student;

namespace Application.MediatR.Queries.Student;

public record GetStudentByIdQuery(string Id,string RequesterId,IList<string> RequesterRoles):IRequest<Response<StudentDto>>;