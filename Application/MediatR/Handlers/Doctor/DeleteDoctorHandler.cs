using Application.ErrorHandlers.Errors;
using Application.MediatR.Commands.Doctor;
using Microsoft.EntityFrameworkCore;
using Persistence.Data;

namespace Application.MediatR.Handlers.Doctor;

public class DeleteDoctorHandler : IRequestHandler<DeleteDoctorCommand, Response<bool>>
{
    private readonly ApplicationDbContext _context;

    public DeleteDoctorHandler(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Response<bool>> Handle(DeleteDoctorCommand request, CancellationToken cancellationToken)
    {
        var id = request.Id;

        var doctor = await _context.Doctors
            .FirstOrDefaultAsync(d => d.Id.Equals(id), cancellationToken);

        if (doctor == null)
            return Response<bool>.Failure(UserErrors.WrongId);

        var messages = _context.Messages.Where(m => m.SenderId.Equals(id));
        _context.Messages.RemoveRange(messages);
        _context.Doctors.Remove(doctor);
        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}