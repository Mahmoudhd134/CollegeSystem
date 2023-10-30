using Application.Dtos.Doctor;
using Application.MediatR.Commands.Doctor;
using Application.MediatR.Queries.Doctor;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

public class DoctorController : BaseController
{
    [HttpGet]
    [Route("{id?}")]
    public async Task<ActionResult> Get(string id)
    {
        return Return(await Mediator.Send(new GetDoctorQuery(id ?? Id, Id)));
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    [Route("{pageIndex:int}/{pageSize:int}/{usernamePrefix?}")]
    public async Task<ActionResult> Page(int pageIndex, int pageSize, bool? hasSubject = null,
        string usernamePrefix = "")
    {
        return Return(await Mediator.Send(new GetDoctorsPageQuery(pageSize, pageIndex, usernamePrefix, hasSubject)));
    }

    [HttpGet]
    [Authorize(Roles = "Admin,Doctor")]
    [Route("Report/{id}")]
    public async Task<ActionResult> GetReport(string id)
    {
        return Return(await Mediator.Send(new GetDoctorReportQuery(id)));
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult> Add([FromBody] AddDoctorDto addDoctorDto)
    {
        return Return(await Mediator.Send(new AddDoctorCommand(addDoctorDto)));
    }

    [HttpPut]
    [Authorize(Roles = "Doctor")]
    public async Task<ActionResult> Edit([FromBody] EditDoctorDto editDoctorDto)
    {
        return Return(await Mediator.Send(new EditDoctorCommand(editDoctorDto, Id)));
    }

    [Authorize(Roles = "Admin")]
    [Route("{id}")]
    [HttpDelete]
    public async Task<ActionResult> Delete(string id)
    {
        return Return(await Mediator.Send(new DeleteDoctorCommand(id)));
    }

    [Route("GetEditInfo/{id}")]
    [HttpGet]
    public async Task<ActionResult> GetEditInfo(string id)
    {
        return Return(await Mediator.Send(new GetEditDoctorDataQuery(id)));
    }


    [Authorize(Roles = "Admin")]
    [HttpGet]
    [Route("AssignToSubject/{doctorId}/{subjectId:int}")]
    public async Task<ActionResult> AssignToTask(string doctorId, int subjectId)
    {
        return Return(await Mediator.Send(new AssignDoctorToSubjectCommand(doctorId, subjectId)));
    }
}