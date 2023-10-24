using Application.Dtos.Student;

namespace Application.MediatR.Queries.Student;

public record GetStudentsPageQuery
    (int PageSize, int PageIndex, string UsernamePrefix) : IRequest<Response<IList<StudentForPageDto>>>;