using Application.ErrorHandlers.Errors;
using Application.MediatR.Commands.Subject;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Persistence.Data;

namespace Application.MediatR.Handlers.Subject;

public class AddSubjectHandler : IRequestHandler<AddSubjectCommand, Response<bool>>
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public AddSubjectHandler(ApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<Response<bool>> Handle(AddSubjectCommand request, CancellationToken cancellationToken)
    {
        var addSubjectDto = request.AddSubjectDto;

        var sameCodeFound = await _context.Subjects
            .AnyAsync(s => s.Code == addSubjectDto.Code, cancellationToken);
        if (sameCodeFound)
            return Response<bool>.Failure(SubjectErrors.CodeAlreadyExists);

        var sameNameFound = await _context.Subjects
            .AnyAsync(s => s.Name.ToUpper().Equals(addSubjectDto.Name.ToUpper()), cancellationToken);
        if (sameNameFound)
            return Response<bool>.Failure(SubjectErrors.NameAlreadyExists);

        _context.Add((object)_mapper.Map<Domain.Subject.Subject>(addSubjectDto));
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}