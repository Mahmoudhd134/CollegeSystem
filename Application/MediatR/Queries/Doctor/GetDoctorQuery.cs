using Application.Dtos.Doctor;

namespace Application.MediatR.Queries.Doctor;

public record GetDoctorQuery(string Id, string UserRequestId) : IRequest<Response<DoctorDto>>;