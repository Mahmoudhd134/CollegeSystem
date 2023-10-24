using Application.Dtos.Doctor;
using Application.ErrorHandlers.Errors;
using Application.MediatR.Commands.Doctor;
using Application.MediatR.Queries.Auth;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Persistence.Data;

namespace Application.MediatR.Handlers.Doctor;

public class AddDoctorHandler : IRequestHandler<AddDoctorCommand, Response<bool>>
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly IMediator _mediator;
    private readonly UserManager<Domain.Identity.User> _userManager;

    public AddDoctorHandler(UserManager<Domain.Identity.User> userManager, ApplicationDbContext context, IMapper mapper,
        IMediator mediator)
    {
        _userManager = userManager;
        _context = context;
        _mapper = mapper;
        _mediator = mediator;
    }

    public async Task<Response<bool>> Handle(AddDoctorCommand request, CancellationToken cancellationToken)
    {
        var registerUserDto = request.AddDoctorDto;

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

        var foundNationalNumber =
            await _context.Doctors.AnyAsync(d => d.NationalNumber.Equals(registerUserDto.NationalNumber),
                cancellationToken);
        if (foundNationalNumber)
            return Response<bool>.Failure(UserErrors.NationalNumberAlreadyExists);


        var doctor = _mapper.Map<AddDoctorDto, Domain.Doctor.Doctor>(registerUserDto);
        var result = await _userManager.CreateAsync(doctor, registerUserDto.Password);

        if (result.Succeeded == false)
            return Response<bool>.Failure(new Error("User.UnknownError",
                string.Join("\n", result.Errors.Select(e => e.Description))));

        await _userManager.AddToRoleAsync(doctor, "Doctor");
        return true;
    }
}