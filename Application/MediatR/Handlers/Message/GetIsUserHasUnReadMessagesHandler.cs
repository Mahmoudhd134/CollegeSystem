using Application.MediatR.Queries.Messge;
using Microsoft.EntityFrameworkCore;
using Persistence.Data;

namespace Application.MediatR.Handlers.Message;

public class GetIsUserHasUnReadMessagesHandler : IRequestHandler<GetIsUserHasUnReadMessagesQuery, Response<bool>>
{
    private readonly ApplicationDbContext _context;

    public GetIsUserHasUnReadMessagesHandler(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Response<bool>> Handle(GetIsUserHasUnReadMessagesQuery request,
        CancellationToken cancellationToken)
    {
        var userId = request.UserId;
        return await _context.Messages
            .AnyAsync(m => m.ReceiverId.Equals(userId) && m.Read == false, cancellationToken);
    }
}