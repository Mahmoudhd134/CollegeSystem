using Application.MediatR.Queries.Mail;
using Microsoft.EntityFrameworkCore;
using Persistence.Data;

namespace Application.MediatR.Handlers.Mail;

public class GetIsUserHasUnReadMailsHandler : IRequestHandler<GetIsUserHasUnReadMailsQuery, Response<bool>>
{
    private readonly ApplicationDbContext _context;

    public GetIsUserHasUnReadMailsHandler(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Response<bool>> Handle(GetIsUserHasUnReadMailsQuery request,
        CancellationToken cancellationToken)
    {
        var userId = request.UserId;
        return await _context.Mails
            .AnyAsync(m => m.ReceiverId.Equals(userId) && m.Read == false, cancellationToken);
    }
}