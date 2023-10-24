using Application.ErrorHandlers.Errors;
using Application.MediatR.Commands.Subject;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Persistence.Data;

namespace Application.MediatR.Handlers.Subject;

public class EditSubjectHandler : IRequestHandler<EditSubjectCommand, Response<bool>>
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public EditSubjectHandler(ApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<Response<bool>> Handle(EditSubjectCommand request, CancellationToken cancellationToken)
    {
        var editSubjectDto = request.EditSubjectDto;

        var subject = await _context.Subjects
            .FirstOrDefaultAsync(s => s.Id == editSubjectDto.Id, cancellationToken);
        if (subject == null)
            return Response<bool>.Failure(SubjectErrors.WrongId);

        if (editSubjectDto.Code != subject.Code)
        {
            var sameCodeFound = await _context.Subjects
                .AnyAsync(s => s.Code == editSubjectDto.Code, cancellationToken);
            if (sameCodeFound)
                return Response<bool>.Failure(SubjectErrors.CodeAlreadyExists);
        }

        if (editSubjectDto.Name.Equals(subject.Name) == false)
        {
            var sameNameFound = await _context.Subjects
                .AnyAsync(s => s.Name.ToUpper().Equals(editSubjectDto.Name.ToUpper()), cancellationToken);
            if (sameNameFound)
                return Response<bool>.Failure(SubjectErrors.NameAlreadyExists);
        }

        _mapper.Map(editSubjectDto, subject);
        _context.Subjects.Update(subject);
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}