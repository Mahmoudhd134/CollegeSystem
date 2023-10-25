using Domain.Subject;

namespace Application.MediatR.Commands.Subject;

public record AddFileTypeTemplateCommand
    (SubjectFileTypes Type, Stream FileStream, string FileName) : IRequest<Response<bool>>;