using Application.Dtos.SubjectMaterial;

namespace Application.MediatR.Queries.Subject;

public record GetSubjectMaterialInfoQuery(string Name) : IRequest<Response<SubjectMaterialStreamInfoDto>>;