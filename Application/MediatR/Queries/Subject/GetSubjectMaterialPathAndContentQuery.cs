using Application.Dtos.SubjectMaterial;

namespace Application.MediatR.Queries.Subject;

public record GetSubjectMaterialPathAndContentQuery(string Name) : IRequest<Response<GetSubjectMaterialPathAndTypeDto>>;