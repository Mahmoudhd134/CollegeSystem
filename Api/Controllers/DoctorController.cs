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
    public async Task<ActionResult<DoctorDto>> Get(string id) =>
        Return(await Mediator.Send(new GetDoctorQuery(id ?? Id, Id)));

    [HttpGet]
    [Authorize(Roles = "Admin")]
    [Route("{pageIndex:int}/{pageSize:int}")]
    public async Task<ActionResult<IEnumerable<DoctorForPageDto>>> Page(int pageIndex, int pageSize,
        bool? hasSubject = null,
        string usernamePrefix = "") =>
        Return(await Mediator.Send(new GetDoctorsPageQuery(pageSize, pageIndex, usernamePrefix, hasSubject)));

    [HttpGet]
    [Authorize(Roles = "Admin,Doctor")]
    [Route("Report/{id}")]
    public async Task<ActionResult<DoctorReportDto>> GetReport(string id) =>
        Return(await Mediator.Send(new GetDoctorReportQuery(id)));

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<bool>> Add([FromBody] AddDoctorDto addDoctorDto) =>
        Return(await Mediator.Send(new AddDoctorCommand(addDoctorDto)));

    [HttpPut]
    [Authorize(Roles = "Doctor")]
    public async Task<ActionResult<bool>> Edit([FromBody] EditDoctorDto editDoctorDto) =>
        Return(await Mediator.Send(new EditDoctorCommand(editDoctorDto, Id)));

    [Authorize(Roles = "Admin")]
    [Route("{id}")]
    [HttpDelete]
    public async Task<ActionResult<bool>> Delete(string id) =>
        Return(await Mediator.Send(new DeleteDoctorCommand(id)));

    [Route("GetEditInfo/{id}")]
    [HttpGet]
    public async Task<ActionResult<EditDoctorDto>> GetEditInfo(string id) =>
        Return(await Mediator.Send(new GetEditDoctorDataQuery(id)));


    [Authorize(Roles = "Admin")]
    [HttpGet]
    [Route("AssignToSubject/{doctorId}/{subjectId:int}")]
    public async Task<ActionResult<bool>> AssignToTask(string doctorId, int subjectId) =>
        Return(await Mediator.Send(new AssignDoctorToSubjectCommand(doctorId, subjectId)));
}