namespace Application.MediatR.Queries.Auth;

public record IsValidUsernameQuery(string Username) : IRequest<bool>;