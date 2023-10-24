using Application.ErrorHandlers.Errors;
using Application.MediatR.Commands.Auth;
using Application.MediatR.Queries.Auth;
using Microsoft.AspNetCore.Identity;

namespace Application.MediatR.Handlers.Auth;

public class ChangePasswordHandler : IRequestHandler<ChangePasswordCommand, Response<bool>>
{
    private readonly UserManager<Domain.Identity.User> _manager;
    private readonly IMediator _mediator;

    public ChangePasswordHandler(UserManager<Domain.Identity.User> manager, IMediator mediator)
    {
        _manager = manager;
        _mediator = mediator;
    }

    public async Task<Response<bool>> Handle(ChangePasswordCommand request, CancellationToken cancellationToken)
    {
        var (userId, changePasswordDto) = request;
        var user = await _manager.FindByIdAsync(userId);

        var isValidPassword =
            await _mediator.Send(new IsValidPasswordQuery(changePasswordDto.NewPassword), cancellationToken);
        if (isValidPassword == false)
            return Response<bool>.Failure(UserErrors.WeakPasswordError);

        if (user == null)
            return Response<bool>.Failure(UserErrors.WrongId);

        var result =
            await _manager.ChangePasswordAsync(user, changePasswordDto.OldPassword, changePasswordDto.NewPassword);

        if (result.Succeeded)
            return true;

        return Response<bool>.Failure(new Error("User.ChangePasswordError",
            string.Join("\n", result.Errors.Select(e => e.Description))));
    }
}