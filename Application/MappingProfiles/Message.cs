using Application.Dtos.Message;
using AutoMapper;
using Domain.Messages;

namespace Application.MappingProfiles;

public class Message : Profile
{
    public Message()
    {
        CreateMap<Domain.Messages.Message, MessageDto>();
        CreateMap<Domain.Messages.Message, MessageForReceivedListDto>();
        CreateMap<Domain.Messages.Message, MessageForSendListDto>();
    }
}