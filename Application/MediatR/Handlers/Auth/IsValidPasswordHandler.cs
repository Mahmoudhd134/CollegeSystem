using System.Text.RegularExpressions;
using Application.MediatR.Queries.Auth;

namespace Application.MediatR.Handlers.Auth;

public class IsValidPasswordHandler : IRequestHandler<IsValidPasswordQuery, bool>
{
    public Task<bool> Handle(IsValidPasswordQuery request, CancellationToken cancellationToken)
    {
        var pass = request.Password;
        if (string.IsNullOrWhiteSpace(pass))
            return Task.FromResult(false);

        var isGoodPass = new Regex("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$");

        return Task.FromResult(isGoodPass.IsMatch(pass));
    }
}