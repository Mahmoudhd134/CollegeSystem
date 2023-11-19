using Application.Dtos.Auth;
using Application.ErrorHandlers.Errors;
using Application.MediatR.Commands.Auth;
using Application.MediatR.Queries.Auth;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Persistence.Data;

namespace Application.MediatR.Handlers.Auth;

public class RefreshTokenHandler : IRequestHandler<RefreshTokenCommand, Response<RefreshTokenDto>>
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly IMediator _mediator;

    public RefreshTokenHandler(ApplicationDbContext context, IMediator mediator, IMapper mapper)
    {
        _context = context;
        _mediator = mediator;
        _mapper = mapper;
    }

    public async Task<Response<RefreshTokenDto>> Handle(RefreshTokenCommand request,
        CancellationToken cancellationToken)
    {
        var (userId, refreshToken, userAgent) = request;

        if (string.IsNullOrWhiteSpace(refreshToken))
            return Response<RefreshTokenDto>.Failure(UserErrors.ExpireRefreshTokenError);

        var userRefreshToken = await _context.UserRefreshTokens
            .Include(u => u.User)
            .FirstOrDefaultAsync(u => u.UserId.Equals(userId) && u.UserAgent.Equals(userAgent),
                cancellationToken);

        if (userRefreshToken == null)
            return Response<RefreshTokenDto>.Failure(UserErrors.UnknownError);

        var response =
            await _mediator.Send(new GetTokenAndRefreshTokenQuery(userRefreshToken.User), cancellationToken);

        if (response.IsSuccess == false)
            return Response<RefreshTokenDto>.Failure(response.Error);

        if (refreshToken.Equals(userRefreshToken.RefreshToken) == false)
            return Response<RefreshTokenDto>.Failure(UserErrors.WrongRefreshToken);

        var newRefreshTokenDto = new RefreshTokenDto
        {
            UserId = userId,
            Roles = response.Data.Roles,
            Token = response.Data.Token,
            RefreshToken = response.Data.RefreshToken,
            ProfileImage = response.Data.ProfileImage
        };

        userRefreshToken.RefreshToken = newRefreshTokenDto.RefreshToken;
        _context.UserRefreshTokens.Update(userRefreshToken);
        await _context.SaveChangesAsync(cancellationToken);

        return newRefreshTokenDto;
    }
}