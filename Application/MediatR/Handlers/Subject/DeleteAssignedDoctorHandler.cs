using Application.ErrorHandlers.Errors;
using Application.MediatR.Commands.Subject;
using Microsoft.EntityFrameworkCore;
using Persistence.Data;

namespace Application.MediatR.Handlers.Subject;

public class DeleteAssignedDoctorHandler : IRequestHandler<DeleteAssignedDoctorCommand, Response<bool>>
{
    private readonly ApplicationDbContext _context;

    public DeleteAssignedDoctorHandler(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Response<bool>> Handle(DeleteAssignedDoctorCommand request, CancellationToken cancellationToken)
    {
        var id = request.SubjectId;

        var doctorSubject = await _context.DoctorSubjects
            .FirstOrDefaultAsync(x => x.SubjectId == id, cancellationToken);

        if (doctorSubject == null)
            return Response<bool>.Failure(SubjectErrors.SubjectIsNotAssignedToDoctor);

        _context.DoctorSubjects.Remove(doctorSubject);
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}