using Application.Dtos.Auth;
using Application.ErrorHandlers.Errors;
using Application.MediatR.Commands.Auth;
using Application.MediatR.Queries.Auth;
using Domain.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Persistence.Data;

namespace Application.MediatR.Handlers.Auth;

public class LoginUserHandler : IRequestHandler<LoginUserCommand, Response<RefreshTokenDto>>
{
    private readonly ApplicationDbContext _context;
    private readonly IMediator _mediator;
    private readonly UserManager<Domain.Identity.User> _userManager;

    public LoginUserHandler(ApplicationDbContext context, UserManager<Domain.Identity.User> userManager, IMediator mediator)
    {
        _context = context;
        _userManager = userManager;
        _mediator = mediator;
    }

    public async Task<Response<RefreshTokenDto>> Handle(LoginUserCommand request, CancellationToken cancellationToken)
    {
        var (login, userAgent) = request;
        var user = await _userManager.FindByNameAsync(login.Username);
        if (user == null)
            return Response<RefreshTokenDto>.Failure(UserErrors.WrongUsername);

        if (await _userManager.CheckPasswordAsync(user, login.Password) == false)
            return Response<RefreshTokenDto>.Failure(UserErrors.WrongPassword);

        var oldRefreshToken = await _context.UserRefreshTokens
            .FirstOrDefaultAsync(u => u.UserId.Equals(user.Id) && u.UserAgent.Equals(userAgent), cancellationToken);

        var response = await _mediator.Send(new GetTokenAndRefreshTokenQuery(user), cancellationToken);
        if (response.IsSuccess == false)
            return Response<RefreshTokenDto>.Failure(response.Error);

        if (oldRefreshToken == null)
        {
            await _context.UserRefreshTokens.AddAsync(new UserRefreshToken
            {
                UserId = user.Id,
                RefreshToken = response.Data.RefreshToken,
                UserAgent = userAgent
            }, cancellationToken);
        }
        else
        {
            oldRefreshToken.RefreshToken = response.Data.RefreshToken;
            _context.UserRefreshTokens.Update(oldRefreshToken);
        }

        await _context.SaveChangesAsync(cancellationToken);

        response.Data.ProfileImage = user.ProfilePhoto;
        return response.Data;
    }
}