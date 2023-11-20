using Application.Dtos.Message;
using AutoMapper;
using Domain.Room;

namespace Application.MappingProfiles;

public class Message : Profile
{
    public Message()
    {
        // CreateMap<UserMessageState, RoomMessageDto>()
        //     .ForMember(dest => dest.Id, opt =>
        //         opt.MapFrom(src => src.Message.Id))
        //     .ForMember(dest => dest.Date, opt =>
        //         opt.MapFrom(src => src.Message.Date))
        //     .ForMember(dest => dest.Text, opt =>
        //         opt.MapFrom(src => src.Message.Text))
        //     .ForMember(dest => dest.Sender, opt =>
        //         opt.MapFrom(src => new SenderDto()
        //         {
        //             Id = src.Message.SenderId,
        //             Image = src.Message.Sender.ProfilePhoto,
        //             UserName = src.Message.Sender.UserName
        //         }))
        //     .ForMember(dest => dest.IsDelivered, opt =>
        //         opt.Ignore())
        //     .ForMember(dest => dest.IsRead, opt =>
        //         opt.Ignore());

        CreateMap<Domain.Room.Message, RoomMessageDto>()
            .ForMember(dest => dest.Sender, opt =>
                opt.MapFrom(src => new SenderDto()
                {
                    Id = src.SenderId,
                    Image = src.Sender.ProfilePhoto,
                    UserName = src.Sender.UserName
                }));

        // CreateMap<UserMessageState, MessageStateDto>()
        //     .ForMember(dest => dest.Id, opt =>
        //         opt.MapFrom(src => src.MessageId));
    }
}