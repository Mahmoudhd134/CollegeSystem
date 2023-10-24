namespace Application.MediatR.Commands.SubjectMaterial;

public record DeleteSubjectMaterialCommand(int MaterialId, string UserId) : IRequest<Response<bool>>;