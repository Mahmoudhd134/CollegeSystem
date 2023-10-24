using Domain.Subject;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Persistence.EntityConfigurations;

public class SubjectFileConfiguration : IEntityTypeConfiguration<SubjectFiles>
{
    public void Configure(EntityTypeBuilder<SubjectFiles> builder)
    {
        builder.HasKey(s => s.Id);

        builder.Property(s => s.FileName).HasMaxLength(511).IsRequired();
        builder.Property(s => s.StoredName).HasMaxLength(254).IsRequired();
        builder.Property(s => s.Date).IsRequired();

        builder
            .HasOne(s => s.Subject)
            .WithMany(s => s.SubjectFiles)
            .HasForeignKey(s => s.SubjectId)
            .OnDelete(DeleteBehavior.Cascade)
            .IsRequired();
    }
}