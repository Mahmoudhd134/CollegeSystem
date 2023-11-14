namespace Application.MediatR.Queries.Mail;

public record GetIsUserHasUnReadMailsQuery(string UserId) : IRequest<Response<bool>>;