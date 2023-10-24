using Application.Dtos.Doctor;

namespace Application.MediatR.Queries.Doctor;

public record GetDoctorReportQuery(string DocId) : IRequest<Response<DoctorReportDto>>;