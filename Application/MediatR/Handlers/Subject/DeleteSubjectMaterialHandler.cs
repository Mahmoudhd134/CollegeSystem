using Application.ErrorHandlers.Errors;
using Application.MediatR.Commands.Subject;
using Application.MediatR.Queries.Global;
using Microsoft.EntityFrameworkCore;
using Persistence.Data;

namespace Application.MediatR.Handlers.Subject;

public class DeleteSubjectMaterialHandler : IRequestHandler<DeleteSubjectMaterialCommand, Response<bool>>
{
    private readonly ApplicationDbContext _context;
    private readonly IMediator _mediator;

    public DeleteSubjectMaterialHandler(ApplicationDbContext context, IMediator mediator)
    {
        _context = context;
        _mediator = mediator;
    }

    public async Task<Response<bool>> Handle(DeleteSubjectMaterialCommand request, CancellationToken cancellationToken)
    {
        var (materialId, userId) = request;

        var material = await _context.SubjectMaterials
            .FirstOrDefaultAsync(m => m.Id == materialId, cancellationToken);

        if (material == null)
            return Response<bool>.Failure(SubjectMaterialErrors.WrongId);

        var isFoundAndAssigned = await _context.DoctorSubjects
            .AnyAsync(s => s.DoctorId.Equals(userId) && s.SubjectId == material.SubjectId,
                cancellationToken);
        if (isFoundAndAssigned == false)
            return Response<bool>.Failure(SubjectMaterialErrors.UnAuthorizedDelete);

        _context.SubjectMaterials.Remove(material);

        var wwwroot = await _mediator.Send(new GetWwwrootPathQuery(), cancellationToken);
        File.Delete($@"{wwwroot}\SubjectMaterials\{material.StoredName}");
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}