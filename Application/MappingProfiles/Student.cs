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
        CreateMap<Domain.Student.Student, StudentDto>();
    }
}