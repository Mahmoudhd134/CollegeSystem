using Application.Dtos.SubjectMaterial;

namespace Application.MediatR.Commands.SubjectMaterial;

public record AddSubjectMaterialCommand
(AddSubjectMaterialDto AddSubjectMaterialDto, Stream FileStream, string FileName,
    string UserId) : IRequest<Response<bool>>;