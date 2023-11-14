using Application.Dtos.Mail;

namespace Application.MediatR.Commands.Mail;

public record AddMailCommand(AddMailDto AddMailDto, string SenderId) : IRequest<Response<bool>>;