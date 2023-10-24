using Domain.Identity;

namespace Domain.Doctor;

public class Doctor : User
{
    public IList<DoctorSubject> DoctorSubjects { get; set; } = new List<DoctorSubject>();
}