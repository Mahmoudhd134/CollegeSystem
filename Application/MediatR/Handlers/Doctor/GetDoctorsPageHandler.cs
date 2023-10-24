using Application.Dtos.Doctor;
using Application.MediatR.Queries.Doctor;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using Persistence.Data;

namespace Application.MediatR.Handlers.Doctor;

public class GetDoctorsPageHandler : IRequestHandler<GetDoctorsPageQuery, Response<IEnumerable<DoctorForPageDto>>>
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetDoctorsPageHandler(ApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<Response<IEnumerable<DoctorForPageDto>>> Handle(GetDoctorsPageQuery request,
        CancellationToken cancellationToken)
    {
        var (pageSize, pageIndex, usernamePrefix, hasSubject) = request;
        var result = _context.Doctors
            .Where(d => d.UserName.ToUpper().StartsWith(usernamePrefix.ToUpper()))
            .AsQueryable();

        if (hasSubject != null)
            result = result
                .Include(d => d.DoctorSubjects)
                .Where(d => hasSubject ?? false ? d.DoctorSubjects.Count > 0 : d.DoctorSubjects.Count == 0);

        return await result
            .ProjectTo<DoctorForPageDto>(_mapper.ConfigurationProvider)
            .Skip(pageIndex * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);
    }
}