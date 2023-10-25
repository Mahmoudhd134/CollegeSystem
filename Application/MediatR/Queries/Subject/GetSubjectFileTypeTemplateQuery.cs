using Application.Dtos.SubjectMaterial;
using Domain.Subject;

namespace Application.MediatR.Queries.Subject;

public record GetSubjectFileTypeTemplateQuery
    (SubjectFileTypes Type) : IRequest<Response<GetSubjectMaterialPathAndTypeDto>>;