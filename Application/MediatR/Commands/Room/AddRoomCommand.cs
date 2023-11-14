using Application.Dtos.Room;

namespace Application.MediatR.Commands.Room;

public record AddRoomCommand(AddRoomDto AddRoomDto, string Id) : IRequest<Response<bool>>;