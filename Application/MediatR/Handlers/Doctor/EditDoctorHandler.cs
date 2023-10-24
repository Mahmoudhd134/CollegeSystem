using Application.ErrorHandlers.Errors;
using Application.MediatR.Commands.Doctor;
using Application.MediatR.Queries.Auth;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Persistence.Data;

namespace Application.MediatR.Handlers.Doctor;

public class EditDoctorHandler : IRequestHandler<EditDoctorCommand, Response<bool>>
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly IMediator _mediator;
    private readonly UserManager<Domain.Identity.User> _userManager;

    public EditDoctorHandler(IMapper mapper, IMediator mediator, UserManager<Domain.Identity.User> userManager, ApplicationDbContext context)
    {
        _mapper = mapper;
        _mediator = mediator;
        _userManager = userManager;
        _context = context;
    }

    public async Task<Response<bool>> Handle(EditDoctorCommand request, CancellationToken cancellationToken)
    {
        var (editDoctorDto, doctorId) = request;
        if (doctorId.Equals(editDoctorDto.Id) == false)
            return Response<bool>.Failure(UserErrors.UnAuthorizedEdit);

        var doctor = await _context.Doctors.FirstOrDefaultAsync(d => d.Id.Equals(doctorId), cancellationToken);
        if (doctor == null)
            return Response<bool>.Failure(UserErrors.WrongId);

        if (editDoctorDto.Email.Equals(doctor.Email) == false)
        {
            var validEmail = await _mediator.Send(new IsValidEmailQuery(editDoctorDto.Email), cancellationToken);
            if (validEmail == false)
                return Response<bool>.Failure(UserErrors.NotValidEmailError);
        }

        _mapper.Map(editDoctorDto, doctor);
        var result = await _userManager.UpdateAsync(doctor);

        if (result.Succeeded)
            return true;
        return Response<bool>.Failure(new Error("User.UnknownError",
            string.Join("\n", result.Errors.Select(e => e.Description))));
    }
}