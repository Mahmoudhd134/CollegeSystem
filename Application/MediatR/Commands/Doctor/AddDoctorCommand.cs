using Application.Dtos.Doctor;

namespace Application.MediatR.Commands.Doctor;

public record AddDoctorCommand(AddDoctorDto AddDoctorDto) : IRequest<Response<bool>>;