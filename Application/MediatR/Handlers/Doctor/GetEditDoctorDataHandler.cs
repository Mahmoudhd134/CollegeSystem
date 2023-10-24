using Application.Dtos.Doctor;
using Application.ErrorHandlers.Errors;
using Application.MediatR.Queries.Doctor;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using Persistence.Data;

namespace Application.MediatR.Handlers.Doctor;

public class GetEditDoctorDataHandler : IRequestHandler<GetEditDoctorDataQuery, Response<EditDoctorDto>>
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetEditDoctorDataHandler(ApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<Response<EditDoctorDto>> Handle(GetEditDoctorDataQuery request,
        CancellationToken cancellationToken)
    {
        var id = request.Id;
        var dto = await _context.Doctors
            .ProjectTo<EditDoctorDto>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync(d => d.Id.Equals(id), cancellationToken);

        return dto ?? Response<EditDoctorDto>.Failure(UserErrors.WrongId);
    }
}