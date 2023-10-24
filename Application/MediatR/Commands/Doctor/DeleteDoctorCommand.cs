namespace Application.MediatR.Commands.Doctor;

public record DeleteDoctorCommand(string Id) : IRequest<Response<bool>>;