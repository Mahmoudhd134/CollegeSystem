using Application.Dtos.Room;

namespace Application.Dtos.Subject;

public class SubjectDto
{
    public int Id { get; set; }
    public string Department { get; set; }
    public int Code { get; set; }
    public int Hours { get; set; }
    public string Name { get; set; }
    public bool HasADoctor { get; set; }
    public string DoctorId { get; set; }
    public string DoctorUsername { get; set; }
    public string DoctorProfilePhoto { get; set; }
    public IList<RoomForSubjectDto> Rooms { get; set; }
}