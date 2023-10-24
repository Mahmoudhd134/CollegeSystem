namespace Application.MediatR.Queries.Auth;

public record IsValidEmailQuery(string Email) : IRequest<bool>;