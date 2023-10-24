using Application.Abstractions;
using Application.ErrorHandlers.Errors;
using Application.MediatR.Commands.SubjectMaterial;
using Domain.Subject;
using Microsoft.EntityFrameworkCore;
using Persistence.Data;

namespace Application.MediatR.Handlers.SubjectMaterial;

public class AddSubjectMaterialHandler : IRequestHandler<AddSubjectMaterialCommand, Response<bool>>
{
    private readonly ApplicationDbContext _context;
    private readonly IMediator _mediator;
    private readonly IFileAccessor _fileAccessor;

    public AddSubjectMaterialHandler(ApplicationDbContext context, IMediator mediator, IFileAccessor fileAccessor)
    {
        _context = context;
        _mediator = mediator;
        _fileAccessor = fileAccessor;
    }

    public async Task<Response<bool>> Handle(AddSubjectMaterialCommand request, CancellationToken cancellationToken)
    {
        var (addSubjectMaterialDto, fileStream, fileName, userId) = request;

        var subject = await _context.Subjects
            .FirstOrDefaultAsync(s => s.Id == addSubjectMaterialDto.SubjectId, cancellationToken);
        if (subject == null)
            return Response<bool>.Failure(SubjectErrors.WrongId);

        var isAssigned = await _context.DoctorSubjects
            .AnyAsync(x => x.DoctorId.Equals(userId) && x.SubjectId == addSubjectMaterialDto.SubjectId,
                cancellationToken);
        if (isAssigned == false)
            return Response<bool>.Failure(SubjectMaterialErrors.UnAuthorizedAdd);

        // var newFileName = $"{Guid.NewGuid()}-{userId}-{fileName}";
        //
        // var wwwroot = await _mediator.Send(new GetWwwrootPathQuery(), cancellationToken);
        // await using var rootFileStream =
        //     new FileStream($@"{wwwroot}\SubjectMaterials\{newFileName}", FileMode.Create);
        // await fileStream.CopyToAsync(rootFileStream, cancellationToken);

        var newFileName = await _fileAccessor.Add(fileStream, Path.GetExtension(fileName));
        subject.SubjectFiles.Add(new SubjectFiles
        {
            FileName = fileName,
            StoredName = newFileName,
            Type = addSubjectMaterialDto.Type
        });
        return await _context.SaveChangesAsync(cancellationToken) > 0;
    }
}