using Domain.Subject;

namespace Application.MediatR.Commands.SubjectMaterial;

public record AddFileTypeTemplateCommand
    (SubjectFileTypes Type, Stream FileStream, string FileName) : IRequest<Response<bool>>;