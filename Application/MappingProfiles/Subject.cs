using Application.Dtos.Room;
using Application.Dtos.Subject;
using Application.Dtos.SubjectMaterial;
using AutoMapper;
using Domain.Subject;

namespace Application.MappingProfiles;

public class Subject : Profile
{
    public Subject()
    {
        CreateMap<Domain.Subject.Subject, SubjectForPageDto>()
            .ForMember(dest => dest.NumberOfFilesTypes, opt =>
                opt.MapFrom(src => src.SubjectFiles
                    .Select(s => s.Type)
                    .Distinct()
                    .Count()
                ));

        CreateMap<AddSubjectDto, Domain.Subject.Subject>();
        CreateMap<Domain.Subject.Subject, SubjectDto>()
            .ForMember(dest => dest.HasADoctor, opt =>
                opt.MapFrom(src => src.DoctorSubject != null))
            .ForMember(dest => dest.DoctorId, opt =>
                opt.MapFrom(src => src.DoctorSubject.DoctorId))
            .ForMember(dest => dest.DoctorUsername, opt =>
                opt.MapFrom(src => src.DoctorSubject.Doctor.UserName))
            .ForMember(dest => dest.DoctorProfilePhoto, opt =>
                opt.MapFrom(src => src.DoctorSubject.Doctor.ProfilePhoto))
            .ForMember(dest => dest.Rooms, opt =>
                opt.MapFrom(src => src.Rooms.Select(r => new RoomForSubjectDto()
                {
                    Id = r.Id,
                    Name = r.Name,
                    Image = r.Image,
                    SubjectId = r.SubjectId
                })));

        CreateMap<Domain.Subject.Subject, SubjectWithMaterialsDto>()
            .ForMember(dest => dest.HasADoctor, opt =>
                opt.MapFrom(src => src.DoctorSubject != null))
            .ForMember(dest => dest.DoctorId, opt =>
                opt.MapFrom(src => src.DoctorSubject.DoctorId))
            .ForMember(dest => dest.Files, opt =>
                opt.MapFrom(src =>
                    src.SubjectFiles.Select(x => new SubjectFileDto
                    {
                        Name = x.FileName,
                        Id = x.Id,
                        Date = x.Date,
                        StoredName = x.StoredName,
                        Type = x.Type,
                        SubjectId = x.SubjectId
                    })));

        CreateMap<Domain.Subject.Subject, SubjectWithStudentsDto>()
            .ForMember(dest => dest.HasADoctor, opt =>
                opt.MapFrom(src => src.DoctorSubject != null))
            .ForMember(dest => dest.DoctorId, opt =>
                opt.MapFrom(src => src.DoctorSubject.DoctorId))
            // .ForMember(dest => dest.NumberOfStudents, opt =>
            // opt.MapFrom(src => src.StudentSubjects.Count));
            .ForMember(dest => dest.NumberOfStudentsForEachDepartment, opt =>
                opt.MapFrom(src => src.StudentSubjects
                    .GroupBy(x => x.Student.Department)
                    .Select(x => new DepartmentAndCount()
                    {
                        Department = x.Key,
                        Count = x.Count()
                    })
                ));

        CreateMap<Domain.Subject.Subject, SubjectReportDto>()
            .ForMember(dest => dest.HasADoctor, opt =>
                opt.MapFrom(src => src.DoctorSubject != null))
            .ForMember(dest => dest.Doctor, opt =>
                opt.MapFrom(src => src.DoctorSubject == null
                    ? null
                    : new DoctorForSubjectReportDto
                    {
                        Id = src.DoctorSubject.DoctorId,
                        Firstname = src.DoctorSubject.Doctor.FirstName,
                        Lastname = src.DoctorSubject.Doctor.LastName,
                        Username = src.DoctorSubject.Doctor.UserName,
                        Email = src.DoctorSubject.Doctor.Email,
                        PhoneNumber = src.DoctorSubject.Doctor.PhoneNumber,
                        NationalNumber = src.DoctorSubject.Doctor.NationalNumber
                    }))
            .ForMember(dest => dest.Files, opt =>
                opt.MapFrom(src => src.SubjectFiles.Select(f => new SubjectFileDto
                {
                    Id = f.Id,
                    Date = f.Date,
                    StoredName = f.StoredName,
                    Type = f.Type,
                    Name = f.FileName,
                    SubjectId = src.Id
                })));

        CreateMap<EditSubjectDto, Domain.Subject.Subject>();
        CreateMap<SubjectFiles, SubjectFileDto>()
            .ForMember(dest => dest.Name, opt =>
                opt.MapFrom(src => src.FileName));
    }
}