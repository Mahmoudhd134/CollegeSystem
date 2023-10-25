using Application.Dtos.SubjectMaterial;

namespace Application.MediatR.Commands.Subject;

public record AddSubjectMaterialCommand
(AddSubjectMaterialDto AddSubjectMaterialDto, Stream FileStream, string FileName,
    string UserId) : IRequest<Response<bool>>;