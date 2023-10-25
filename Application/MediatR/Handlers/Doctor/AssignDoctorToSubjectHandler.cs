using Application.ErrorHandlers.Errors;
using Application.MediatR.Commands.Doctor;
using Microsoft.EntityFrameworkCore;
using Persistence.Data;

namespace Application.MediatR.Handlers.Doctor;

public class AssignDoctorToSubjectHandler : IRequestHandler<AssignDoctorToSubjectCommand, Response<bool>>
{
    private readonly ApplicationDbContext _context;

    public AssignDoctorToSubjectHandler(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Response<bool>> Handle(AssignDoctorToSubjectCommand request, CancellationToken cancellationToken)
    {
        var (doctorId, subjectId) = request;
        var doctorFound = await _context.Doctors
            .AnyAsync(d => d.Id.Equals(doctorId), cancellationToken);
        if (doctorFound == false)
            return Response<bool>.Failure(UserErrors.WrongId);

        var subjectFound = await _context.Subjects
            .AnyAsync(d => d.Id == subjectId, cancellationToken);
        if (subjectFound == false)
            return Response<bool>.Failure(SubjectErrors.WrongId);

        var isAssignedSubject = await _context.DoctorSubjects
            .AnyAsync(x => x.SubjectId == subjectId, cancellationToken);
        if (isAssignedSubject)
            return Response<bool>.Failure(SubjectErrors.SubjectIsAlreadyAssignedToDoctor);


        _context.DoctorSubjects.Add(new Domain.Doctor.DoctorSubject
        {
            DoctorId = doctorId,
            SubjectId = subjectId
        });
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}