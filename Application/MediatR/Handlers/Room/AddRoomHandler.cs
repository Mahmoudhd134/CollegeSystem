using Application.ErrorHandlers.Errors;
using Application.MediatR.Commands.Room;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Persistence.Data;

namespace Application.MediatR.Handlers.Room;

public class AddRoomHandler : IRequestHandler<AddRoomCommand, Response<bool>>
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public AddRoomHandler(ApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<Response<bool>> Handle(AddRoomCommand request, CancellationToken cancellationToken)
    {
        var (addRoomDto, id) = request;
        var isDoctorAssigned = await _context.DoctorSubjects
            .AnyAsync(ds =>
                ds.DoctorId == id && ds.SubjectId == addRoomDto.SubjectId, cancellationToken);
        if (!isDoctorAssigned)
            return Response<bool>.Failure(RoomErrors.UnAuthorizeAdd);

        var room = _mapper.Map<Domain.Room.Room>(addRoomDto);
        _context.Rooms.Add(room);
        return await _context.SaveChangesAsync(cancellationToken) > 0;
    }
}