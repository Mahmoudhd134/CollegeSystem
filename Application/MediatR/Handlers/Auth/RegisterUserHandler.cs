using Application.Dtos.Auth;
using Application.ErrorHandlers.Errors;
using Application.MediatR.Commands.Auth;
using Application.MediatR.Queries.Auth;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Persistence.Data;

namespace Application.MediatR.Handlers.Auth;

public class RegisterUserHandler : IRequestHandler<RegisterUserCommand, Response<bool>>
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly IMediator _mediator;
    private readonly UserManager<Domain.Identity.User> _userManager;

    public RegisterUserHandler(ApplicationDbContext context, IMapper mapper, UserManager<Domain.Identity.User> userManager,
        IMediator mediator)
    {
        _context = context;
        _mapper = mapper;
        _userManager = userManager;
        _mediator = mediator;
    }


    async Task<Response<bool>> IRequestHandler<RegisterUserCommand, Response<bool>>.Handle(RegisterUserCommand request,
        CancellationToken cancellationToken)
    {
        var registerUserDto = request.RegisterUserDto;

        var isValidUsername =
            await _mediator.Send(new IsValidUsernameQuery(registerUserDto.Username), cancellationToken);
        if (isValidUsername == false)
            return Response<bool>.Failure(UserErrors.UsernameAlreadyUsedError);

        var isValidPassword =
            await _mediator.Send(new IsValidPasswordQuery(registerUserDto.Password), cancellationToken);
        if (isValidPassword == false)
            return Response<bool>.Failure(UserErrors.WeakPasswordError);

        var isValidEmail = await _mediator.Send(new IsValidEmailQuery(registerUserDto.Email), cancellationToken);
        if (isValidEmail == false)
            return Response<bool>.Failure(UserErrors.EmailAlreadyUsedError);


        var user = _mapper.Map<RegisterUserDto, Domain.Identity.User>(registerUserDto);
        var result = await _userManager.CreateAsync(user, registerUserDto.Password);

        if (result.Succeeded)
            return true;

        return Response<bool>.Failure(new Error("User.UnknownError",
            string.Join("\n", result.Errors.Select(e => e.Description))));
    }
}