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
    public async Task<ActionResult> Page(int pageIndex, int pageSize, string department, int? year,
        string namePrefix,bool? hasDoctor, bool? completed)
    {
        return Return(
            await Mediator.Send(new GetSubjectForPageQuery(pageIndex, pageSize, department, year, namePrefix, hasDoctor, completed)));
    }

    [HttpGet]
    [Route("{code:int}")]
    public async Task<ActionResult> GetByCode(int code)
    {
        return Return(await Mediator.Send(new GetSubjectByCodeQuery(code, Id)));
    }

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
    public async Task<ActionResult> GetReport(int code)
    {
        return Return(await Mediator.Send(new GetSubjectReportQuery(code)));
    }

    [Authorize(Roles = "Admin")]
    [HttpPut]
    public async Task<ActionResult> Edit([FromBody] EditSubjectDto editSubjectDto)
    {
        return Return(await Mediator.Send(new EditSubjectCommand(editSubjectDto)));
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult> Add([FromBody] AddSubjectDto addSubjectDto)
    {
        return Return(await Mediator.Send(new AddSubjectCommand(addSubjectDto)));
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete]
    [Route("{id:int}")]
    public async Task<ActionResult> Delete(int id)
    {
        return Return(await Mediator.Send(new DeleteSubjectCommand(id)));
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete]
    [Route("DeleteAssignedDoctor/{subjectId:int}")]
    public async Task<ActionResult> DeleteAssignedDoctor(int subjectId)
    {
        return Return(await Mediator.Send(new DeleteAssignedDoctorCommand(subjectId)));
    }
}