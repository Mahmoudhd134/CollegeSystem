using Application.Dtos.Doctor;
using AutoMapper;
using Domain.Subject;

namespace Application.MappingProfiles;

public class Doctor : Profile
{
    public Doctor()
    {
        CreateMap<AddDoctorDto, Domain.Doctor.Doctor>();
        CreateMap<EditDoctorDto, Domain.Doctor.Doctor>().ReverseMap();
        CreateMap<Domain.Doctor.Doctor, DoctorDto>()
            .ForMember(dest => dest.Subjects, opt =>
                opt.MapFrom(src => src.DoctorSubjects.Select(ds => new DoctorSubjectForPageDto
                {
                    Id = ds.SubjectId,
                    Department = ds.Subject.Department,
                    Code = ds.Subject.Code,
                    Name = ds.Subject.Name,
                    NumberOfFilesTypes = ds.Subject.SubjectFiles
                        .Select(s => s.Type)
                        .Distinct()
                        .Count()
                })))
            .ForMember(dest => dest.IsComplete, opt =>
                opt.MapFrom(src => src.DoctorSubjects
                        .Select(ds => ds.Subject.SubjectFiles.Select(sf => sf.Type))
                        .Select(t => t.Distinct().Count() == Enum.GetNames(typeof(SubjectFileTypes)).Length)
                        .Any(r => r == false) == false
                ));

        CreateMap<Domain.Doctor.Doctor, DoctorForPageDto>()
            .ForMember(dest => dest.IsComplete, opt =>
                opt.MapFrom(src => src.DoctorSubjects
                        .Select(ds => ds.Subject.SubjectFiles.Select(sf => sf.Type))
                        .Select(t => t.Distinct().Count() == Enum.GetNames(typeof(SubjectFileTypes)).Length)
                        .Any(r => r == false) == false
                ));

        CreateMap<Domain.Doctor.Doctor, DoctorReportDto>()
            .ForMember(dest => dest.Subjects, opt =>
                opt.MapFrom(src => src.DoctorSubjects
                    .Select(ds => ds.Subject)
                    .Select(s => new SubjectForDoctorReportDto
                    {
                        Id = s.Id,
                        Code = s.Code,
                        Name = s.Name,
                        Department = s.Department,
                        CompletedTypes = s.SubjectFiles.Select(f => f.Type).Distinct().ToList()
                    })));
    }
}