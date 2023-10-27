using Application.Dtos.Subject;
using Application.MediatR.Queries.Subject;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using Persistence.Data;

namespace Application.MediatR.Handlers.Subject;

public class GetSubjectReportHandler : IRequestHandler<GetSubjectReportQuery, Response<SubjectReportDto>>
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetSubjectReportHandler(ApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<Response<SubjectReportDto>> Handle(GetSubjectReportQuery request,
        CancellationToken cancellationToken)
    {
        var id = request.SubjectId;

        var subjectDto = await _context.Subjects
            .ProjectTo<SubjectReportDto>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync(s => s.Id == id, cancellationToken);

        return subjectDto;
    }
}