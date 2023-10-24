using Application.Dtos.Auth;
using AutoMapper;
using Domain.Identity;

namespace Application.MappingProfiles;

public class User : Profile
{
    public User()
    {
        CreateMap<RegisterUserDto, Domain.Identity.User>();
        CreateMap<RefreshTokenDto, TokenDto>();
    }
}