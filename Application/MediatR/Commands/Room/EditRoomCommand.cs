using Application.Dtos.Room;

namespace Application.MediatR.Commands.Room;

public record EditRoomCommand(EditRoomDto EditRoomDto,string Id):IRequest<Response<bool>>;