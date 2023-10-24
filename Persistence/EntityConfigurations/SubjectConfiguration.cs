using Domain.Subject;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Persistence.EntityConfigurations;

public class SubjectConfiguration : IEntityTypeConfiguration<Subject>
{
    public void Configure(EntityTypeBuilder<Subject> builder)
    {
        builder.HasKey(s => s.Id);

        builder.Property(s => s.Department).HasMaxLength(3).IsRequired();
        builder.Property(s => s.Code).HasMaxLength(3).IsRequired();
        builder.Property(s => s.Name).HasMaxLength(63).IsRequired();
        builder.Property(s => s.Hours).IsRequired();

        builder.HasIndex(s => s.Code).IsUnique();
        builder.HasIndex(s => s.Name).IsUnique();
        builder.HasIndex(s => s.Department);
    }
}