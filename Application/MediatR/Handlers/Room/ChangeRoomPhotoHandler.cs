using Application.ErrorHandlers.Errors;
using Application.MediatR.Commands.Room;
using Microsoft.EntityFrameworkCore;
using Persistence.Data;

namespace Application.MediatR.Handlers.Room;

public class ChangeRoomPhotoHandler : IRequestHandler<ChangeRoomPhotoCommand, Response<bool>>
{
    private readonly ApplicationDbContext _context;

    public ChangeRoomPhotoHandler(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Response<bool>> Handle(ChangeRoomPhotoCommand request, CancellationToken cancellationToken)
    {
        var (roomId, userId, name, stream) = request;
        var room = await _context.Rooms
            .Include(r => r.Subject)
            .ThenInclude(s => s.DoctorSubject)
            .Where(r => r.Id == roomId)
            .Select(r => new { r.Subject.DoctorSubject.DoctorId, r.Image })
            .FirstOrDefaultAsync(cancellationToken);

        if (room == null)
            return Response<bool>.Failure(RoomErrors.WrongId);
        if (room.DoctorId != userId)
            return Response<bool>.Failure(RoomErrors.UnAuthorizeEdit);

        if (room.Image != "default.png")
            File.Delete(Path.Combine("wwwroot", "RoomImages", room.Image));

        var newName = Guid.NewGuid() + name;
        var path = Path.Combine("wwwroot", "RoomImages", newName);
        await using var imagesPathStream = new FileStream(path, FileMode.Create);
        await stream.CopyToAsync(imagesPathStream, cancellationToken);

        return await _context.Rooms
            .Where(r => r.Id == roomId)
            .ExecuteUpdateAsync(calls => calls
                .SetProperty(r => r.Image, newName), cancellationToken) == 1;
    }
}