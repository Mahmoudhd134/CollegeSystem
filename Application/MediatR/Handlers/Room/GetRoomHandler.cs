using Application.Dtos.Room;
using Application.MediatR.Queries.Room;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using Persistence.Data;

namespace Application.MediatR.Handlers.Room;

public class GetRoomHandler : IRequestHandler<GetRoomQuery, Response<RoomDto>>
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetRoomHandler(ApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<Response<RoomDto>> Handle(GetRoomQuery request, CancellationToken cancellationToken)
    {
        var roomDto = await _context.Rooms
            .ProjectTo<RoomDto>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync(r => r.Id == request.RoomId, cancellationToken);

        roomDto.IsJoined = await _context.UserRooms
            .AnyAsync(ur =>
                    ur.RoomId == request.RoomId && ur.UserId == request.UserId,
                cancellationToken);

        return roomDto;
    }
}