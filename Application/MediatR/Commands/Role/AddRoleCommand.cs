using Application.Dtos.Role;

namespace Application.MediatR.Commands.Role;

public record AddRoleCommand(AddRoleDto AddRoleDto) : IRequest<Response<bool>>;