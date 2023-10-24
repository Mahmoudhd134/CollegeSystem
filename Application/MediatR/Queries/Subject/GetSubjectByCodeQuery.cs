using Application.Dtos.Subject;

namespace Application.MediatR.Queries.Subject;

public record GetSubjectByCodeQuery
    (int Code, IEnumerable<string> Roles, string UserId) : IRequest<Response<SubjectDto>>;