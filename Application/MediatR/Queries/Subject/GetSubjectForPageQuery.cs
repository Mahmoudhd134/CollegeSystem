using Application.Dtos.Subject;

namespace Application.MediatR.Queries.Subject;

public record GetSubjectForPageQuery
    (int PageIndex, int PageSize, string Department, int? Year, string NamePrefix, bool? HasDoctor, bool? completed) : IRequest<
        Response<IEnumerable<SubjectForPageDto>>>;