using Application.Dtos.Mail;

namespace Application.MediatR.Queries.Mail;

public record GetMailByIdQuery(int Id, string UserId) : IRequest<Response<MailDto>>;