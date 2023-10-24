using Application.Dtos.Student;
using Application.MediatR.Queries.Student;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using Persistence.Data;

namespace Application.MediatR.Handlers.Student;

public class GetStudentsPageHandler : IRequestHandler<GetStudentsPageQuery, Response<IList<StudentForPageDto>>>
{
    private readonly IMapper _mapper;
    private readonly ApplicationDbContext _context;

    public GetStudentsPageHandler(IMapper mapper, ApplicationDbContext context)
    {
        _mapper = mapper;
        _context = context;
    }

    public async Task<Response<IList<StudentForPageDto>>> Handle(GetStudentsPageQuery request,
        CancellationToken cancellationToken)
    {
        var (pageSize, pageIndex, usernamePrefix) = request;
        
        IQueryable<Domain.Student.Student> query = _context.Students;
        
        if (string.IsNullOrWhiteSpace(usernamePrefix) == false)
            query = query.Where(x => x.UserName.ToLower().StartsWith(usernamePrefix.ToLower()));
        
        query = query
            .Skip(pageIndex * pageSize)
            .Take(pageSize);
        
        return await query
            .ProjectTo<StudentForPageDto>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);
    }
}