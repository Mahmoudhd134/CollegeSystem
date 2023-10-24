using Application.Dtos.Subject;

namespace Application.MediatR.Queries.Subject;

public record GetSubjectReportQuery(int SubjectId) : IRequest<Response<SubjectReportDto>>;