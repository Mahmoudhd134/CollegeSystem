using Application.MediatR.Queries.Auth;
using Microsoft.EntityFrameworkCore;
using Persistence.Data;

namespace Application.MediatR.Handlers.Auth;

public class IsValidUsernameHandler : IRequestHandler<IsValidUsernameQuery, bool>
{
    private readonly ApplicationDbContext _context;

    public IsValidUsernameHandler(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(IsValidUsernameQuery request, CancellationToken cancellationToken)
    {
        var username = request.Username;
        if (string.IsNullOrWhiteSpace(username))
            return false;

        var found = await _context.Users.AnyAsync(u => u.UserName.ToUpper().Equals(username.ToUpper()),
            cancellationToken);

        return found == false;
    }
}