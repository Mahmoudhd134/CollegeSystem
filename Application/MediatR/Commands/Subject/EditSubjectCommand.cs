using Application.Dtos.Subject;

namespace Application.MediatR.Commands.Subject;

public record EditSubjectCommand(EditSubjectDto EditSubjectDto) : IRequest<Response<bool>>;