using Domain.Student;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Persistence.EntityConfigurations;

public class StudentSubjectConfiguration : IEntityTypeConfiguration<StudentSubjects>
{
    public void Configure(EntityTypeBuilder<StudentSubjects> builder)
    {
        builder.HasKey(x => x.Id);

        builder
            .HasOne(x => x.Subject)
            .WithMany(s => s.StudentSubjects)
            .HasForeignKey(x => x.SubjectId);

        builder
            .HasOne(x => x.Student)
            .WithMany(s => s.StudentSubjects)
            .HasForeignKey(x => x.StudentId);

        builder.HasIndex(x => new { x.StudentId, x.SubjectId }).IsUnique();
    }
}