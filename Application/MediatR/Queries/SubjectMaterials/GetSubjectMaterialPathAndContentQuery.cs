using Application.Dtos.SubjectMaterial;

namespace Application.MediatR.Queries.SubjectMaterials;

public record GetSubjectMaterialPathAndContentQuery(string Name) : IRequest<Response<GetSubjectMaterialPathAndTypeDto>>;