using Application.ErrorHandlers.Errors;
using Application.MediatR.Commands.Subject;
using Microsoft.EntityFrameworkCore;
using Persistence.Data;

namespace Application.MediatR.Handlers.Subject;

public class DeleteSubjectHandler : IRequestHandler<DeleteSubjectCommand, Response<bool>>
{
    private readonly ApplicationDbContext _context;

    public DeleteSubjectHandler(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Response<bool>> Handle(DeleteSubjectCommand request, CancellationToken cancellationToken)
    {
        var id = request.Id;
        
        await _context.Rooms
            .Where(r => r.SubjectId == id)
            .ExecuteDeleteAsync(cancellationToken);

        await _context.Subjects
            .Where(s => s.Id == id)
            .ExecuteDeleteAsync(cancellationToken);
        return true;
    }
}