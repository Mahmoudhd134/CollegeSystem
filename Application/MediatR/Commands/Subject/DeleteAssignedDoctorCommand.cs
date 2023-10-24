namespace Application.MediatR.Commands.Subject;

public record DeleteAssignedDoctorCommand(int SubjectId) : IRequest<Response<bool>>;