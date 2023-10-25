using Application.ErrorHandlers.Errors;
using Application.MediatR.Commands.Student;
using Domain.Student;
using Microsoft.EntityFrameworkCore;
using Persistence.Data;

namespace Application.MediatR.Handlers.Student;

public class AssignStudentToSubjectHandler : IRequestHandler<AssignStudentToSubjectCommand, Response<bool>>
{
    private readonly ApplicationDbContext _context;

    public AssignStudentToSubjectHandler(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Response<bool>> Handle(AssignStudentToSubjectCommand request, CancellationToken cancellationToken)
    {
        var studentId = request.AssignStudentToSubjectDto.StudentId;
        var subjectId = request.AssignStudentToSubjectDto.SubjectId;

        var studentFound = await _context.Students
            .AnyAsync(x => x.Id.Equals(studentId), cancellationToken);
        if (!studentFound)
            return Response<bool>.Failure(UserErrors.WrongId);

        var subjectFound = await _context.Subjects
            .AnyAsync(x => x.Id.Equals(subjectId), cancellationToken);
        if (!subjectFound)
            return Response<bool>.Failure(SubjectErrors.WrongId);

        var sameRegistrationFound = await _context.StudentSubjects
            .AnyAsync(x => x.SubjectId.Equals(subjectId) && x.StudentId.Equals(studentId), cancellationToken);
        if (sameRegistrationFound)
            return Response<bool>.Failure(StudentErrors.SubjectAlreadyRegistered);

        _context.StudentSubjects.Add(new StudentSubjects()
        {
            SubjectId = subjectId,
            StudentId = studentId
        });

        return await _context.SaveChangesAsync(cancellationToken) > 0;
    }
}