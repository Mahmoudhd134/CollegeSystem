using Application.Dtos.Auth;

namespace Application.MediatR.Commands.Auth;

public record RegisterUserCommand(RegisterUserDto RegisterUserDto) : IRequest<Response<bool>>;