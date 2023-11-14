using Application.Dtos.Mail;

namespace Application.MediatR.Queries.Mail;

public record GetSendMailsQuery
    (string UserId, string UserName, int PageIndex, int PageSize) : IRequest<
        Response<IEnumerable<MailForSendListDto>>>;