using Application.MediatR.Queries.Auth;
using Microsoft.EntityFrameworkCore;
using Persistence.Data;

namespace Application.MediatR.Handlers.Auth;

public class IsValidEmailHandler : IRequestHandler<IsValidEmailQuery, bool>
{
    private readonly ApplicationDbContext _context;

    public IsValidEmailHandler(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(IsValidEmailQuery request, CancellationToken cancellationToken)
    {
        var email = request.Email;
        return await _context.Users.AnyAsync(u => u.Email.ToUpper().Equals(email.ToUpper()), cancellationToken) ==
               false;
    }
}