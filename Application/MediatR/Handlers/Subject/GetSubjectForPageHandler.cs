using Application.Dtos.Subject;
using Application.ErrorHandlers.Errors;
using Application.MediatR.Queries.Subject;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain.Subject;
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
        var (pageIndex, pageSize, department, year, namePrefix, hasDoctor, completed) = request;

        if (year is < 1 or > 9)
            return Response<IEnumerable<SubjectForPageDto>>.Failure(SubjectErrors.InvalidYear);

        var subjects = _context.Subjects
            .Include(s => s.SubjectFiles)
            .AsQueryable();

        if (string.IsNullOrWhiteSpace(department) == false)
            subjects = subjects
                .Where(s => s.Department.ToUpper().Equals(department.ToUpper()));

        if (string.IsNullOrWhiteSpace(namePrefix) == false)
            subjects = subjects
                .Where(s => s.Name.ToUpper().StartsWith(namePrefix.ToUpper()));

        if (year != null)
            subjects = subjects
                .Where(s => s.Code > year * 100 - 1 && s.Code < (year + 1) * 100);

        if (hasDoctor != null)
            if (hasDoctor ?? false)
                subjects = subjects
                    .Include(s => s.DoctorSubject)
                    .Where(s => s.DoctorSubject.DoctorId != null);
            else
                subjects = subjects
                    .Include(s => s.DoctorSubject)
                    .Where(s => s.DoctorSubject.DoctorId == null);

        var subjectDtos = subjects.ProjectTo<SubjectForPageDto>(_mapper.ConfigurationProvider)
            .AsQueryable();

        if (completed != null)
            if (completed ?? false)
                subjectDtos = subjectDtos
                    .Where(s => s.NumberOfFilesTypes == Enum.GetValues<SubjectFileTypes>().Length);
            else
                subjectDtos = subjectDtos
                    .Where(s => s.NumberOfFilesTypes < Enum.GetValues<SubjectFileTypes>().Length);


        return await subjectDtos
            .Skip(pageIndex * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);
    }
}