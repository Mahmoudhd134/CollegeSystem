using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace Api.Hubs;

public class BaseHub<T> : Hub<T>
    where T : class
{
    private IMediator _mediator;

    protected IMediator Mediator =>
        _mediator ??= Context.GetHttpContext()?.RequestServices.GetRequiredService<IMediator>();

    protected string UserId =>
        Context.User?.Claims?.FirstOrDefault(c => c.Type.Equals(ClaimTypes.Sid))?.Value;
}