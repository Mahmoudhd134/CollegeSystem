using Application.ErrorHandlers.Errors;
using Application.MediatR.Commands.Student;
using Application.MediatR.Queries.Auth;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Persistence.Data;

namespace Application.MediatR.Handlers.Student;

public class AddStudentHandler : IRequestHandler<AddStudentCommand, Response<bool>>
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly IMediator _mediator;
    private readonly UserManager<Domain.Identity.User> _userManager;

    public AddStudentHandler(ApplicationDbContext context, IMapper mapper, IMediator mediator,
        UserManager<Domain.Identity.User> userManager)
    {
        _context = context;
        _mapper = mapper;
        _mediator = mediator;
        _userManager = userManager;
    }

    public async Task<Response<bool>> Handle(AddStudentCommand request, CancellationToken cancellationToken)
    {
        var addStudentDto = request.AddStudentDto;

        var isValidUsername =
            await _mediator.Send(new IsValidUsernameQuery(addStudentDto.Username), cancellationToken);
        if (isValidUsername == false)
            return Response<bool>.Failure(UserErrors.UsernameAlreadyUsedError);

        var isValidPassword =
            await _mediator.Send(new IsValidPasswordQuery(addStudentDto.Password), cancellationToken);
        if (isValidPassword == false)
            return Response<bool>.Failure(UserErrors.WeakPasswordError);

        var isValidEmail = await _mediator.Send(new IsValidEmailQuery(addStudentDto.Email), cancellationToken);
        if (isValidEmail == false)
            return Response<bool>.Failure(UserErrors.EmailAlreadyUsedError);

        var foundNationalNumber =
            await _context.Users.AnyAsync(d => d.NationalNumber.Equals(addStudentDto.NationalNumber),
                cancellationToken);
        if (foundNationalNumber)
            return Response<bool>.Failure(UserErrors.NationalNumberAlreadyExists);

        var student = _mapper.Map<Domain.Student.Student>(addStudentDto);
        var result = await _userManager.CreateAsync(student, addStudentDto.Password);

        if (result.Succeeded == false)
            return Response<bool>.Failure(new Error("User.UnknownError",
                string.Join("\n", result.Errors.Select(e => e.Description))));

        var r = await _userManager.AddToRoleAsync(student, "Student");
        return r.Succeeded;
    }
}