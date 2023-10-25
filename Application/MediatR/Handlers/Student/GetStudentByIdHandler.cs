using Application.Dtos.Student;
using Application.ErrorHandlers.Errors;
using Application.MediatR.Queries.Student;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using Persistence.Data;

namespace Application.MediatR.Handlers.Student;

public class GetStudentByIdHandler : IRequestHandler<GetStudentByIdQuery, Response<StudentDto>>
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetStudentByIdHandler(ApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<Response<StudentDto>> Handle(GetStudentByIdQuery request, CancellationToken cancellationToken)
    {
        var (id, requesterId, requesterRoles) = request;
        var studentDto = await _context.Students
            .ProjectTo<StudentDto>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync(x => x.Id.Equals(id), cancellationToken);

        if (studentDto == null)
            return Response<StudentDto>.Failure(UserErrors.WrongId);
        
        studentDto.IsOwner = id.Equals(requesterId);
        if (requesterRoles.Count == 1 && requesterRoles.Contains("Student"))
            if (studentDto.IsOwner == false)
                return Response<StudentDto>.Failure(StudentErrors.UnAuthorizedGet);
        
        return studentDto;
    }
}