namespace Application.MediatR.Commands.User;

public record ChangeUserProfilePhotoCommand(string Id, string Name, Stream Stream) : IRequest<Response<bool>>;