using Application.Dtos.Subject;

namespace Application.MediatR.Queries.Subject;

public record GetSubjectByCodeQuery
    (int Code, string UserId) : IRequest<Response<SubjectDto>>;