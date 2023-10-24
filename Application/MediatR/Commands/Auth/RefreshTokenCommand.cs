using Application.Dtos.Auth;

namespace Application.MediatR.Commands.Auth;

public record RefreshTokenCommand
    (string UserId, string RefreshToken, string UserAgent) : IRequest<Response<RefreshTokenDto>>;