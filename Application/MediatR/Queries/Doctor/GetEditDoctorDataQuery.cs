using Application.Dtos.Doctor;

namespace Application.MediatR.Queries.Doctor;

public record GetEditDoctorDataQuery(string Id) : IRequest<Response<EditDoctorDto>>;