using Application.Dtos.Message;

namespace Application.MediatR.Queries.Message;

public record GetMessagesStateQuery(IEnumerable<Guid> MessagesId) : IRequest<Response<IList<MessageStateDto>>>;