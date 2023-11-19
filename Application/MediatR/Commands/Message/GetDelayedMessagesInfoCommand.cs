using Application.Dtos.Message;

namespace Application.MediatR.Commands.Message;

public record GetDelayedMessagesInfoCommand(string UserId) : IRequest<Response<IList<DelayedSubjectMessageInfoDto>>>;