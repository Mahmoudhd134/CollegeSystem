using Application.Dtos.Auth;
using Application.Helpers.Configurations;
using Application.MediatR.Commands.Auth;
using Application.MediatR.Queries.Auth;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace Api.Controllers;

[AllowAnonymous]
public class AuthController : BaseController
{
    private readonly Expiry _expiry;
    private readonly IMapper _mapper;

    public AuthController(IOptions<Expiry> expiry, IMapper mapper)
    {
        _mapper = mapper;
        _expiry = expiry.Value;
    }

    [Route("Register")]
    [HttpPost]
    public async Task<ActionResult> Register([FromBody] RegisterUserDto registerUserDto)
    {
        return Return(await Mediator.Send(new RegisterUserCommand(registerUserDto)));
    }

    [Route("Login")]
    [HttpPost]
    public async Task<ActionResult> Login([FromBody] LoginUserDto loginUserDto)
    {
        var response = await Mediator.Send(new LoginUserCommand(loginUserDto, Useragent));
        if (response.IsSuccess == false)
            return BadRequest(new { code = response.Error.Code, message = response.Error.Message });

        SetToHttpCookie(response.Data);
        var tokenDto = _mapper.Map<TokenDto>(response.Data);
        return Ok(tokenDto);
    }

    [Route("RefreshToken")]
    [HttpGet]
    public async Task<ActionResult> RefreshToken()
    {
        if (Request.Cookies.TryGetValue("id", out var id) == false)
            return BadRequest(new { message = "Can not get id, Login Again" });
        if (string.IsNullOrWhiteSpace(id))
            return BadRequest(new { message = "Can not get id, Login Again" });

        if (Request.Cookies.TryGetValue("refreshToken", out var refreshToken) == false)
            return BadRequest(new { message = "Can not get refreshToken, Login Again" });
        if (string.IsNullOrWhiteSpace(refreshToken))
            return BadRequest(new { message = "Can not get refreshToken, Login Again" });

        var response = await Mediator.Send(new RefreshTokenCommand(id, refreshToken, Useragent));

        if (response.IsSuccess == false)
            return BadRequest(new { code = response.Error.Code, message = response.Error.Message });

        SetToHttpCookie(response.Data);
        var tokenDto = _mapper.Map<TokenDto>(response.Data);
        return Ok(tokenDto);
    }

    [HttpGet]
    [Route("isValidUsername/{username}")]
    public async Task<ActionResult> IsValidUsername(string username)
    {
        return Ok(await Mediator.Send(new IsValidUsernameQuery(username)));
    }

    [HttpPost]
    [Authorize]
    [Route("ChangePassword")]
    public async Task<ActionResult> ChangePassword([FromBody] ChangePasswordDto changePasswordDto)
    {
        return Return(await Mediator.Send(new ChangePasswordCommand(Id, changePasswordDto)));
    }

    private void SetToHttpCookie(RefreshTokenDto refreshTokenDto)
    {
        var cookiesOption = new CookieOptions
        {
            HttpOnly = true,
            SameSite = SameSiteMode.Strict,
            Expires = DateTime.UtcNow.AddDays(_expiry.RefreshTokenExpiryInDays),
            // Expires = DateTime.Now.AddSeconds(10),
            Secure = true
        };

        Response.Cookies.Append("refreshToken", refreshTokenDto.RefreshToken, cookiesOption);
        Response.Cookies.Append("id", refreshTokenDto.UserId, cookiesOption);
    }
}