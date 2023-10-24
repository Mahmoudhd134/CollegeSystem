using Application.MediatR.Commands.Student;
using Microsoft.EntityFrameworkCore;
using Persistence.Data;

namespace Application.MediatR.Handlers.Student;

public class DeleteStudentHandler : IRequestHandler<DeleteStudentCommand, Response<bool>>
{
    private readonly ApplicationDbContext _context;

    public DeleteStudentHandler(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Response<bool>> Handle(DeleteStudentCommand request, CancellationToken cancellationToken)
    {
        return await _context.Students
            .Where(x => x.Id.Equals(request.Id))
            .ExecuteDeleteAsync(cancellationToken) >= 1;
    }
}