using Application.Dtos.Doctor;

namespace Application.MediatR.Commands.Doctor;

public record EditDoctorCommand(EditDoctorDto EditDoctorDto, string DoctorId) : IRequest<Response<bool>>;