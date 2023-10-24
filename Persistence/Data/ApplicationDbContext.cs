using Domain.Doctor;
using Domain.Identity;
using Domain.Messages;
using Domain.Student;
using Domain.Subject;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Persistence.EntityConfigurations;
using Persistence.Extenstions;

namespace Persistence.Data;

public class ApplicationDbContext : IdentityDbContext<User, Role, string>
{
    public DbSet<UserRefreshToken> UserRefreshTokens { get; set; }
    public DbSet<Doctor> Doctors { get; set; }
    public DbSet<Student> Students { get; set; }
    public DbSet<StudentSubjects> StudentSubjects { get; set; }
    public DbSet<Subject> Subjects { get; set; }
    public DbSet<SubjectFiles> SubjectMaterials { get; set; }
    public DbSet<DoctorSubject> DoctorSubjects { get; set; }
    public DbSet<Message> Messages { get; set; }

    public ApplicationDbContext(DbContextOptions options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.ApplyConfiguration(new UserConfiguration());
        builder.ApplyConfiguration(new UserRefreshTokenConfiguration());
        builder.ApplyConfiguration(new RoleConfiguration());
        builder.ApplyConfiguration(new DoctorConfiguration());
        builder.ApplyConfiguration(new SubjectConfiguration());
        builder.ApplyConfiguration(new DoctorSubjectConfiguration());
        builder.ApplyConfiguration(new SubjectFileConfiguration());
        builder.ApplyConfiguration(new MessageConfiguration());
        builder.ApplyConfiguration(new StudentSubjectConfiguration());
        builder.ApplyUtcDateTimeConverter();
        base.OnModelCreating(builder);
    }
}