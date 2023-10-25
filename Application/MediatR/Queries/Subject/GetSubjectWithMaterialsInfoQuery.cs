using Application.Dtos.Subject;

namespace Application.MediatR.Queries.Subject;

public record GetSubjectWithMaterialsInfoQuery(int SubjectCode,string RequesterId) : IRequest<Response<SubjectWithMaterialsDto>>;