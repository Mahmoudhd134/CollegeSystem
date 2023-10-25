using Application.MediatR.Commands.Student;
using Microsoft.EntityFrameworkCore;
using Persistence.Data;

namespace Application.MediatR.Handlers.Student;

public class DeAssignStudentFromSubjectHandler : IRequestHandler<DeAssignStudentFromSubjectCommand, Response<bool>>
{
    private readonly ApplicationDbContext _context;

    public DeAssignStudentFromSubjectHandler(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Response<bool>> Handle(DeAssignStudentFromSubjectCommand request,
        CancellationToken cancellationToken)
    {
        var (studentId,subjectId) = request;
        return await _context.StudentSubjects
            .Where(x =>
                x.StudentId.Equals(studentId) &&
                x.SubjectId.Equals(subjectId))
            .ExecuteDeleteAsync(cancellationToken) == 1;
    }
}