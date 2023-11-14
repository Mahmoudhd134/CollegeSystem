using Application.ErrorHandlers.Errors;
using Application.MediatR.Commands.Room;
using Microsoft.EntityFrameworkCore;
using Persistence.Data;

namespace Application.MediatR.Handlers.Room;

public class DeleteRoomHandler : IRequestHandler<DeleteRoomCommand, Response<bool>>
{
    private readonly ApplicationDbContext _context;

    public DeleteRoomHandler(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Response<bool>> Handle(DeleteRoomCommand request, CancellationToken cancellationToken)
    {
        var (roomId, id) = request;
        var isRoomSubjectAssignedToDoctor = await _context.Rooms
            .Include(r => r.Subject)
            .ThenInclude(s => s.DoctorSubject)
            .Select(r => new
            {
                RoomId = r.Id,
                SubjectId = r.SubjectId,
                DoctorId = r.Subject.DoctorSubject.DoctorId
            })
            .AnyAsync(r => r.RoomId == roomId && r.DoctorId == id, cancellationToken);
        if (!isRoomSubjectAssignedToDoctor)
            return Response<bool>.Failure(RoomErrors.UnAuthorizeDelete);

        var r = await _context.Rooms
            .Where(r => r.Id == roomId)
            .ExecuteDeleteAsync(cancellationToken);

        return r > 0;
    }
}