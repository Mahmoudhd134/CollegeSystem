using Application.Dtos.Room;
using AutoMapper;

namespace Application.MappingProfiles;

public class Room : Profile
{
    public Room()
    {
        CreateMap<AddRoomDto, Domain.Room.Room>();
        CreateMap<EditRoomDto, Domain.Room.Room>();
        CreateMap<Domain.Room.Room, RoomDto>()
            .ForMember(dest => dest.Subject, opt =>
                opt.MapFrom(src => new SubjectForRoomDto()
                {
                    SubjectId = src.SubjectId,
                    SubjectCode = src.Subject.Code,
                    SubjectName = src.Subject.Name,
                    DoctorId = src.Subject.DoctorSubject.DoctorId
                }));
    }
}