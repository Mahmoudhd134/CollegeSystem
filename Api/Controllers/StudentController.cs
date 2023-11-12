using Application.Dtos.Student;
using Application.MediatR.Commands.Student;
using Application.MediatR.Queries.Student;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

public class StudentController : BaseController
{
    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IList<StudentForPageDto>>>
        GetPage(int pageSize, int pageIndex, string usernamePrefix) =>
        Return(await Mediator.Send(new GetStudentsPageQuery(pageSize, pageIndex, usernamePrefix)));

    [HttpGet("IsAssignToSubject/{subjectId:int}")]
    public async Task<ActionResult<bool>> IsAssignedToSubject(int subjectId) =>
        Return(await Mediator.Send(new IsAssignedToSubjectQuery(subjectId, Id)));

    [HttpGet("Me")]
    public async Task<ActionResult<StudentDto>> GetMe() =>
        Return(await Mediator.Send(new GetStudentByIdQuery(Id, Id, Roles)));

    [HttpGet("{id}")]
    public async Task<ActionResult<StudentDto>> GetById(string id) =>
        Return(await Mediator.Send(new GetStudentByIdQuery(id, Id, Roles)));

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<bool>> Add([FromBody] AddStudentDto addStudentDto) =>
        Return(await Mediator.Send(new AddStudentCommand(addStudentDto)));

    [HttpPost("AssignToSubject/{subjectId:int}")]
    [Authorize(Roles = "Student")]
    public async Task<ActionResult<bool>> AssignToSubject(int subjectId) =>
        Return(await Mediator.Send(new AssignStudentToSubjectCommand(Id, subjectId)));

    [HttpPut]
    [Authorize(Roles = "Student")]
    public async Task<ActionResult<bool>> Edit([FromBody] EditStudentDto editStudentDto,
        CancellationToken cancellationToken) =>
        Return(await Mediator.Send(new EditStudentCommand(Id, editStudentDto), cancellationToken));

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<bool>> Delete(string id) =>
        Return(await Mediator.Send(new DeleteStudentCommand(id)));

    [HttpDelete("DeAssignFromSubject/{subjectId:int}")]
    [Authorize(Roles = "Student")]
    public async Task<ActionResult<bool>> DeAssignFromSubject(int subjectId) =>
        Return(await Mediator.Send(new DeAssignStudentFromSubjectCommand(Id, subjectId)));
}