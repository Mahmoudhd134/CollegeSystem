using Application.Dtos.Student;
using AutoMapper;

namespace Application.MappingProfiles;

public class Student : Profile
{
    public Student()
    {
        CreateMap<AddStudentDto, Domain.Student.Student>();
        CreateMap<Domain.Student.Student, StudentForPageDto>();
        CreateMap<EditStudentDto, Domain.Student.Student>();
        CreateMap<Domain.Student.Student, StudentDto>()
            .ForMember(dest => dest.Subjects, opt =>
                opt.MapFrom(src => src.StudentSubjects
                    .Select(x => x.Subject)
                    .Select(x => new SubjectForStudentDto()
                    {
                        Id = x.Id,
                        Code = x.Code,
                        Department = x.Department,
                        Name = x.Name
                    })));
    }
}