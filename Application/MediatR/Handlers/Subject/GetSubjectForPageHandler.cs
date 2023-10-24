using Application.Dtos.Subject;
using Application.ErrorHandlers.Errors;
using Application.MediatR.Queries.Subject;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using Persistence.Data;

namespace Application.MediatR.Handlers.Subject;

public class
    GetSubjectForPageHandler : IRequestHandler<GetSubjectForPageQuery, Response<IEnumerable<SubjectForPageDto>>>
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetSubjectForPageHandler(ApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<Response<IEnumerable<SubjectForPageDto>>> Handle(GetSubjectForPageQuery request,
        CancellationToken cancellationToken)
    {
        var (pageIndex, pageSize, department, year, namePrefix) = request;

        if (year is < 1 or > 9)
            return Response<IEnumerable<SubjectForPageDto>>.Failure(SubjectErrors.InvalidYear);

        var subjectDtos = _context.Subjects
            .Include(s => s.SubjectFiles)
            .AsQueryable();

        if (string.IsNullOrWhiteSpace(department) == false)
            subjectDtos = subjectDtos
                .Where(s => s.Department.ToUpper().Equals(department.ToUpper()));

        if (string.IsNullOrWhiteSpace(namePrefix) == false)
            subjectDtos = subjectDtos
                .Where(s => s.Name.ToUpper().StartsWith(namePrefix.ToUpper()));

        if (year != null)
            subjectDtos = subjectDtos
                .Where(s => s.Code > year * 100 - 1 && s.Code < (year + 1) * 100);

        return await subjectDtos
            .ProjectTo<SubjectForPageDto>(_mapper.ConfigurationProvider)
            .Skip(pageIndex * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);
    }
}