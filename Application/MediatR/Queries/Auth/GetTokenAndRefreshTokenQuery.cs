using Application.Dtos.Auth;
using Domain.Identity;

namespace Application.MediatR.Queries.Auth;

public record GetTokenAndRefreshTokenQuery(User User) : IRequest<Response<RefreshTokenDto>>;