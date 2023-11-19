using Application.Dtos.Message;

namespace Application.MediatR.Commands.Message;

public record GetUnReadMessagesInRoomCommand(string UserId, Guid RoomId) : IRequest<Response<IList<RoomMessageDto>>>;