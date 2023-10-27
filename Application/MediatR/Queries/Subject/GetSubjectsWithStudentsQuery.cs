using Application.Dtos.Subject;

namespace Application.MediatR.Queries.Subject;

public record GetSubjectsWithStudentsQuery(int SubjectCode) : IRequest<Response<SubjectWithStudentsDto>>;