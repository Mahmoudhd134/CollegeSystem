using Application.Dtos.Subject;

namespace Application.MediatR.Commands.Subject;

public record AddSubjectCommand(AddSubjectDto AddSubjectDto) : IRequest<Response<bool>>;