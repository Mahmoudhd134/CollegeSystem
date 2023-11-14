using Application.Dtos.Room;
using Application.ErrorHandlers.Errors;
using Application.MediatR.Commands.Room;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Persistence.Data;

namespace Application.MediatR.Handlers.Room;

public class EditRoomHandler : IRequestHandler<EditRoomCommand, Response<bool>>
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public EditRoomHandler(ApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<Response<bool>> Handle(EditRoomCommand request, CancellationToken cancellationToken)
    {
        var (editRoomDto, id) = request;
        var room = await _context.Rooms
            .FirstOrDefaultAsync(r => r.Id == editRoomDto.Id, cancellationToken);
        if (room == null)
            return Response<bool>.Failure(RoomErrors.WrongId);

        var doctorIsAssigned = await _context.DoctorSubjects.AnyAsync(ds =>
            ds.SubjectId == room.SubjectId && ds.DoctorId == id, cancellationToken);
        if (!doctorIsAssigned)
            return Response<bool>.Failure(RoomErrors.UnAuthorizeEdit);

        _mapper.Map(editRoomDto, room);
        return await _context.SaveChangesAsync(cancellationToken) > 0;
    }
}