using Application.Dtos.Room;
using AutoMapper;

namespace Application.MappingProfiles;

public class Room : Profile
{
    public Room()
    {
        CreateMap<AddRoomDto, Domain.Room.Room>();
        CreateMap<EditRoomDto, Domain.Room.Room>();
    }
}