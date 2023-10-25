namespace Application.MediatR.Commands.Subject;

public record DeleteSubjectMaterialCommand(int MaterialId, string UserId) : IRequest<Response<bool>>;