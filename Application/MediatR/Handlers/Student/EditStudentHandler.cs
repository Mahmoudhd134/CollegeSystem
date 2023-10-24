using Application.ErrorHandlers.Errors;
using Application.MediatR.Commands.Student;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Persistence.Data;

namespace Application.MediatR.Handlers.Student;

public class EditStudentHandler : IRequestHandler<EditStudentCommand, Response<bool>>
{
    private readonly ApplicationDbContext _context;

    public EditStudentHandler(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Response<bool>> Handle(EditStudentCommand request, CancellationToken cancellationToken)
    {
        var (studentId, editStudentDto) = request;
        if (studentId.Equals(editStudentDto.Id) == false)
            return Response<bool>.Failure(UserErrors.UnAuthorizedEdit);

        var rowsUpdated = await _context.Students
            .Where(x => x.Id.Equals(studentId))
            .ExecuteUpdateAsync(x => x
                    .SetProperty(s => s.FirstName, editStudentDto.Firstname)
                    .SetProperty(s => s.LastName, editStudentDto.Lastname),
                cancellationToken);

        return rowsUpdated == 1;
    }
}