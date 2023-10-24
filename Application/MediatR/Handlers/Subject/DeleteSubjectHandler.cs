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
        var subject = await _context.Subjects.FirstOrDefaultAsync(s => s.Id == id, cancellationToken);
        if (subject == null)
            return Response<bool>.Failure(SubjectErrors.WrongId);
        _context.Subjects.Remove(subject);
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}