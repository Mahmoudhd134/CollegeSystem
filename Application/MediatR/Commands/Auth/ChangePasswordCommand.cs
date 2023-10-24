using Application.Dtos.Auth;

namespace Application.MediatR.Commands.Auth;

public record ChangePasswordCommand(string UserId, ChangePasswordDto ChangePasswordDto) : IRequest<Response<bool>>;