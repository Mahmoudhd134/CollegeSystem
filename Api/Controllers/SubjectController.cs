﻿using Application.Dtos.Subject;
using Application.MediatR.Commands.Subject;
using Application.MediatR.Queries.Subject;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

public class SubjectController : BaseController
{
    [Authorize(Roles = "Admin")]
    [HttpGet]
    [Route("{pageIndex:int}/{pageSize:int}")]
    public async Task<ActionResult> Page(int pageIndex, int pageSize, string department, int? year,
        string namePrefix)
    {
        return Return(
            await Mediator.Send(new GetSubjectForPageQuery(pageIndex, pageSize, department, year, namePrefix)));
    }

    [Authorize(Roles = "Admin,Doctor")]
    [HttpGet]
    [Route("{code:int}")]
    public async Task<ActionResult> Page(int code)
    {
        return Return(await Mediator.Send(new GetSubjectByCodeQuery(code, Roles, Id)));
    }

    [Authorize(Roles = "Admin")]
    [HttpGet]
    [Route("Report/{id:int}")]
    public async Task<ActionResult> GetReport(int id)
    {
        return Return(await Mediator.Send(new GetSubjectReportQuery(id)));
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