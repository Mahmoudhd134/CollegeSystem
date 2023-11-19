using Application.Dtos.Message;
using Application.ErrorHandlers.Errors;
using Application.MediatR.Queries.Message;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using Persistence.Data;

namespace Application.MediatR.Handlers.Message;

public class
    GetMessagesBeforeDateHandler : IRequestHandler<GetMessagesBeforeDateQuery, Response<IList<RoomMessageDto>>>
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly IMediator _mediator;

    public GetMessagesBeforeDateHandler(ApplicationDbContext context, IMapper mapper, IMediator mediator)
    {
        _context = context;
        _mapper = mapper;
        _mediator = mediator;
    }

    public async Task<Response<IList<RoomMessageDto>>> Handle(GetMessagesBeforeDateQuery request,
        CancellationToken cancellationToken)
    {
        var (messagesCount, dateTime, userId, roomId) = request;
        if (messagesCount > 150)
            return Response<IList<RoomMessageDto>>.Failure(RoomErrors.CanNotGetMoreThat150MessagesAtOnce);
        var roomMessageDtos = await _context.Messages
            .Where(m => m.RoomId == roomId && m.Date < dateTime)
            .OrderByDescending(m => m.Date)
            .Take(messagesCount)
            .ProjectTo<RoomMessageDto>(_mapper.ConfigurationProvider)
            .Reverse()
            .ToListAsync(cancellationToken);

        var myMessagesId = roomMessageDtos
            .Where(m => m.Sender.Id == userId)
            .Select(x => x.Id)
            .ToList();

        var messagesState = (await _mediator.Send(new GetMessagesStateQuery(myMessagesId), cancellationToken))
            .Data
            .ToDictionary(s => s.Id);

        roomMessageDtos.ForEach(m =>
        {
            if (m.Sender.Id != userId)
                return;
            m.IsDelivered = messagesState[m.Id].IsDelivered;
            m.IsRead = messagesState[m.Id].IsRead;
        });
        return roomMessageDtos;
    }
}