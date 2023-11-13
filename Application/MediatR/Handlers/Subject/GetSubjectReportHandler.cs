using Application.Dtos.Subject;
using Application.ErrorHandlers.Errors;
using Application.MediatR.Queries.Subject;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain.Subject;
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
        var (code, requesterId) = request;

        var subjectDto = await _context.Subjects
            .ProjectTo<SubjectReportDto>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync(s => s.Code == code, cancellationToken);

        if ((subjectDto.Doctor?.Id ?? "") != requesterId)
            return Response<SubjectReportDto>.Failure(SubjectErrors.UnAuthorizedReportGet);

        subjectDto.IsComplete = subjectDto.Files
            .Select(f => f.Type)
            .Distinct()
            .Count() == Enum.GetNames<SubjectFileTypes>().Length;

        return subjectDto;
    }
}