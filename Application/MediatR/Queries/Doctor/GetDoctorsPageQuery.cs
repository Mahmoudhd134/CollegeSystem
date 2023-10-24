using Application.Dtos.Doctor;

namespace Application.MediatR.Queries.Doctor;

public record GetDoctorsPageQuery
    (int PageSize, int PageIndex, string UsernamePrefix, bool? HasSubject) : IRequest<
        Response<IEnumerable<DoctorForPageDto>>>;