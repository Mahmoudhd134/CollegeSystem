using Application.ErrorHandlers.Errors;
using Application.MediatR.Commands.Role;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Persistence.Data;

namespace Application.MediatR.Handlers.Role;

public class AddRoleHandler : IRequestHandler<AddRoleCommand, Response<bool>>
{
    private readonly ApplicationDbContext _context;
    private readonly RoleManager<Domain.Identity.Role> _roleManager;

    public AddRoleHandler(RoleManager<Domain.Identity.Role> roleManager, ApplicationDbContext context)
    {
        _roleManager = roleManager;
        _context = context;
    }

    public async Task<Response<bool>> Handle(AddRoleCommand request, CancellationToken cancellationToken)
    {
        var addRoleDto = request.AddRoleDto;

        var found = await _context.Roles.AnyAsync(r => r.Name.ToUpper().Equals(addRoleDto.Name.ToUpper()),
            cancellationToken);
        if (found)
            return Response<bool>.Failure(RoleErrors.NameAlreadyExists);

        var result = await _roleManager.CreateAsync(new Domain.Identity.Role
        {
            Name = addRoleDto.Name
        });

        return result.Succeeded
            ? true
            : Response<bool>.Failure(new Error("Role.UnknownError",
                string.Join("\n", result.Errors.Select(e => e.Description))));
    }
}