using Application.MediatR.Queries.Student;
using Microsoft.EntityFrameworkCore;
using Persistence.Data;

namespace Application.MediatR.Handlers.Student;

public class IsAssignedToSubjectHandler : IRequestHandler<IsAssignedToSubjectQuery, Response<bool>>
{
    private readonly ApplicationDbContext _context;

    public IsAssignedToSubjectHandler(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Response<bool>> Handle(IsAssignedToSubjectQuery request, CancellationToken cancellationToken)
    {
        var (subjectId, studentId) = request;
        return await _context.StudentSubjects.AnyAsync(ss =>
            ss.StudentId == studentId && ss.SubjectId == subjectId, cancellationToken);
    }
}