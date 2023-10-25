using Application.Dtos.Subject;
using Application.ErrorHandlers.Errors;
using Application.MediatR.Queries.Subject;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using Persistence.Data;

namespace Application.MediatR.Handlers.Subject;

public class
    GetSubjectWithMaterialsInfoHandler : IRequestHandler<GetSubjectWithMaterialsInfoQuery, Response<SubjectWithMaterialsDto>>
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetSubjectWithMaterialsInfoHandler(ApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<Response<SubjectWithMaterialsDto>> Handle(GetSubjectWithMaterialsInfoQuery request,
        CancellationToken cancellationToken)
    {
        var (subjectCode, id) = request;
        var subjectMaterials = await _context.Subjects
            .ProjectTo<SubjectWithMaterialsDto>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync(x => x.Code == subjectCode, cancellationToken);
        if (subjectMaterials == null)
            return Response<SubjectWithMaterialsDto>.Failure(SubjectErrors.WrongId);

        subjectMaterials.IsOwner = subjectMaterials.DoctorId.Equals(id);
        subjectMaterials.NumberOfFileTypesUploaded = subjectMaterials.Files
            .DistinctBy(x => x.Type)
            .Count();
        return subjectMaterials;
    }
}