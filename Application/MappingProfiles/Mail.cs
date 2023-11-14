using Application.Dtos.Mail;
using AutoMapper;
using Domain.Mails;

namespace Application.MappingProfiles;

public class Mail : Profile
{
    public Mail()
    {
        CreateMap<Domain.Mails.Mail, MailDto>();
        CreateMap<Domain.Mails.Mail, MailForReceivedListDto>();
        CreateMap<Domain.Mails.Mail, MailForSendListDto>();
    }
}