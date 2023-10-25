namespace Application.MediatR.Commands.Doctor;

public record AssignDoctorToSubjectCommand(string DoctorId, int SubjectId) : IRequest<Response<bool>>;