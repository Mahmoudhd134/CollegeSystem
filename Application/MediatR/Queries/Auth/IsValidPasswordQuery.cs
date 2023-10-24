namespace Application.MediatR.Queries.Auth;

public record IsValidPasswordQuery(string Password) : IRequest<bool>;