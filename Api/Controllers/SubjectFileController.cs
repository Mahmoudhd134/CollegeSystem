using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Principal;
using Application.Dtos.SubjectMaterial;
using Application.Helpers.Configurations;
using Application.MediatR.Commands.Subject;
using Application.MediatR.Queries.Subject;
using Domain.Subject;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace Api.Controllers;

[Authorize(Roles = "Admin,Doctor")]
[RequestSizeLimit(long.MaxValue)]
public class SubjectFileController : BaseController
{
    private readonly Jwt _jwt;

    public SubjectFileController(IOptions<Jwt> jwt)
    {
        _jwt = jwt.Value;
    }

    [HttpGet]
    [Route("{name}")]
    [AllowAnonymous]
    public async Task<ActionResult> Get(string name, string token, string returnName = null)
    {
        var claimsPrincipal = ValidateToken(token);
        if (IsInAnyRole(claimsPrincipal, "Admin", "Doctor") == false)
            return Forbid();

        var response = await Mediator.Send(new GetSubjectMaterialInfoQuery(name));
        if (response.IsSuccess == false)
            return Return(response);

        Response.Headers.Add("Content-Disposition", "attachment; filename=" + (returnName ?? name));
        Response.Headers.Add("Content-Type", "application/octet-stream");
        Response.Headers.Add("Content-Length", response.Data.Size.ToString());

        await response.Data.Stream.CopyToAsync(Response.Body);
        response.Data.Stream.Close();
        return new EmptyResult();
    }

    [HttpGet]
    [Route("Template/{type}")]
    [AllowAnonymous]
    public async Task<ActionResult> GetTemplate(SubjectFileTypes type, string token)
    {
        var claimsPrincipal = ValidateToken(token);
        if (IsInAnyRole(claimsPrincipal, "Admin", "Doctor") == false)
            return Forbid();

        var response = await Mediator.Send(new GetSubjectFileTypeTemplateQuery(type));
        if (response.IsSuccess == false)
            return Return(response);

        Response.Headers.Add("Content-Disposition", "attachment; filename=" + type + ".docx");
        Response.Headers.Add("Content-Type", "application/octet-stream");
        Response.Headers.Add("Content-Length", response.Data.Size.ToString());

        await response.Data.Stream.CopyToAsync(Response.Body);
        response.Data.Stream.Close();
        return new EmptyResult();
    }

//todo upload file in chunks
    [HttpPost]
    [Authorize(Roles = "Admin")]
    [Route("Template")]
    public async Task<ActionResult<bool>> AddTemplate([FromForm] IFormFile file, [FromForm] SubjectFileTypes type)
    {
        return Return(await Mediator.Send(new AddFileTypeTemplateCommand(type, file.OpenReadStream(), file.FileName)));
    }

//todo upload file in chunks
    [HttpPost]
    [Authorize(Roles = "Doctor")]
    public async Task<ActionResult<bool>> Add([FromForm] IFormFile file,
        [FromForm] AddSubjectMaterialDto addSubjectMaterialDto) =>
        Return(await Mediator.Send(new AddSubjectMaterialCommand(
            addSubjectMaterialDto, file.OpenReadStream(), file.FileName, Id)));

    [HttpDelete]
    [Authorize(Roles = "Doctor")]
    [Route("{id:int}")]
    public async Task<ActionResult<bool>> Delete(int id) =>
        Return(await Mediator.Send(new DeleteSubjectMaterialCommand(id, Id)));

    private ClaimsPrincipal ValidateToken(string authToken)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var validationParameters = Constants.GetValidationParameters(_jwt.SecurityKey);
        var principal =
            tokenHandler.ValidateToken(authToken, validationParameters, out var validatedToken);
        return principal;
    }

    private bool IsInAnyRole(ClaimsPrincipal claims, params string[] roles) =>
        claims.Claims.Any(c => c.Type == ClaimTypes.Role && roles.Contains(c.Value));
}