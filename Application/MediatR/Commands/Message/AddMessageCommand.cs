using Application.Dtos.Message;

namespace Application.MediatR.Commands.Message;

public record AddMessageCommand(AddMessageDto AddMessageDto, string SenderId) : IRequest<Response<bool>>;