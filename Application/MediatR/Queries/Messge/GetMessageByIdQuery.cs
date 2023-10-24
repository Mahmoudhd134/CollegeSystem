using Application.Dtos.Message;

namespace Application.MediatR.Queries.Messge;

public record GetMessageByIdQuery(int Id, string UserId) : IRequest<Response<MessageDto>>;