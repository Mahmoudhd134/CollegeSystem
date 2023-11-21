using Application.Dtos.Subject;
using Application.MediatR.Commands.Subject;
using Application.MediatR.Queries.Subject;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

public class SubjectController : BaseController
{
    [HttpGet]
    [Route("{pageIndex:int}/{pageSize:int}")]
    public async Task<ActionResult<IEnumerable<SubjectForPageDto>>> Page(int pageIndex, int pageSize, string department, int? year,
        string namePrefix, bool? hasDoctor, bool? completed) =>
        Return(await Mediator.Send(new GetSubjectForPageQuery(
            pageIndex, pageSize, department, year, namePrefix, hasDoctor, completed)));

    [HttpGet]
    [Route("{code:int}")]
    public async Task<ActionResult<SubjectDto>> GetByCode(int code) =>
        Return(await Mediator.Send(new GetSubjectByCodeQuery(code, Id)));

    [Authorize(Roles = "Admin,Doctor")]
    [HttpGet]
    [Route("Materials/{code:int}")]
    public async Task<ActionResult<SubjectWithMaterialsDto>> GetSubjectWithMaterials(int code) =>
        Return(await Mediator.Send(new GetSubjectWithMaterialsInfoQuery(code, Id)));

    [Authorize(Roles = "Admin,Doctor")]
    [HttpGet]
    [Route("Students/{code:int}")]
    public async Task<ActionResult<SubjectWithMaterialsDto>> GetSubjectWithStudents(int code) =>
        Return(await Mediator.Send(new GetSubjectsWithStudentsQuery(code)));

    [Authorize(Roles = "Admin,Doctor")]
    [HttpGet]
    [Route("Report/{code:int}")]
    public async Task<ActionResult<SubjectReportDto>> GetReport(int code) =>
        Return(await Mediator.Send(new GetSubjectReportQuery(code, Id)));

    [Authorize(Roles = "Admin")]
    [HttpPut]
    public async Task<ActionResult<bool>> Edit([FromBody] EditSubjectDto editSubjectDto) =>
        Return(await Mediator.Send(new EditSubjectCommand(editSubjectDto)));

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<bool>> Add([FromBody] AddSubjectDto addSubjectDto) =>
        Return(await Mediator.Send(new AddSubjectCommand(addSubjectDto)));

    [Authorize(Roles = "Admin")]
    [HttpDelete]
    [Route("{id:int}")]
    public async Task<ActionResult<bool>> Delete(int id) =>
        Return(await Mediator.Send(new DeleteSubjectCommand(id)));

    [Authorize(Roles = "Admin")]
    [HttpDelete]
    [Route("DeleteAssignedDoctor/{subjectId:int}")]
    public async Task<ActionResult<bool>> DeleteAssignedDoctor(int subjectId) =>
        Return(await Mediator.Send(new DeleteAssignedDoctorCommand(subjectId)));
}