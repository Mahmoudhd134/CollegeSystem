using Application.Dtos.Auth;

namespace Application.MediatR.Commands.Auth;

public record LoginUserCommand(LoginUserDto LoginUserDto, string UserAgent) : IRequest<Response<RefreshTokenDto>>;