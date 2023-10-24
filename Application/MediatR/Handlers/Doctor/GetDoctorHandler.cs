using Application.Dtos.Doctor;
using Application.ErrorHandlers.Errors;
using Application.MediatR.Queries.Doctor;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using Persistence.Data;

namespace Application.MediatR.Handlers.Doctor;

public class GetDoctorHandler : IRequestHandler<GetDoctorQuery, Response<DoctorDto>>
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetDoctorHandler(ApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<Response<DoctorDto>> Handle(GetDoctorQuery request, CancellationToken cancellationToken)
    {
        var (id, userRequestId) = request;
        var doctorDto = await _context.Doctors
            .Include(d => d.DoctorSubjects)
            .ThenInclude(ds => ds.Subject)
            .ThenInclude(s => s.SubjectFiles)
            .AsSplitQuery()
            .ProjectTo<DoctorDto>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync(d => d.Id.Equals(id), cancellationToken);

        if (doctorDto == null)
            return Response<DoctorDto>.Failure(UserErrors.WrongId);

        doctorDto.IsOwner = id.Equals(userRequestId);
        return doctorDto;
    }
}