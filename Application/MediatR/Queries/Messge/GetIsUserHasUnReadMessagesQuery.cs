namespace Application.MediatR.Queries.Messge;

public record GetIsUserHasUnReadMessagesQuery(string UserId) : IRequest<Response<bool>>;