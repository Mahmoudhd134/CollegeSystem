using Application.Dtos.Subject;

namespace Application.MediatR.Queries.Subject;

public record GetSubjectReportQuery(int SubjectCode,string RequesterId) : IRequest<Response<SubjectReportDto>>;