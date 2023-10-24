namespace Application.MediatR.Commands.DoctorSubject;

public record AssignDoctorToSubjectCommand(string DoctorId, int SubjectId) : IRequest<Response<bool>>;