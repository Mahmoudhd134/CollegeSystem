using Application.Dtos.Subject;
using Application.ErrorHandlers.Errors;
using Application.MediatR.Queries.Subject;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using Persistence.Data;

namespace Application.MediatR.Handlers.Subject;

public class
    GetSubjectWithStudentsHandler : IRequestHandler<GetSubjectsWithStudentsQuery, Response<SubjectWithStudentsDto>>
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetSubjectWithStudentsHandler(ApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<Response<SubjectWithStudentsDto>> Handle(GetSubjectsWithStudentsQuery request,
        CancellationToken cancellationToken)
    {
        var subjectCode = request.SubjectCode;
        var subjectWithStudentsDto = await _context.Subjects
            .ProjectTo<SubjectWithStudentsDto>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync(s => s.Code == subjectCode, cancellationToken);

        if (subjectWithStudentsDto == null)
            return Response<SubjectWithStudentsDto>.Failure(SubjectErrors.WrongId);

        subjectWithStudentsDto.NumberOfStudents = subjectWithStudentsDto
            .NumberOfStudentsForEachDepartment
            .Select(x => x.Count)
            .Sum();
        
        return subjectWithStudentsDto;
    }
}