using Domain.Room;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Persistence.EntityConfigurations;

public class RoomConfiguration:IEntityTypeConfiguration<Room>
{
    public void Configure(EntityTypeBuilder<Room> builder)
    {
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Name).HasMaxLength(255).IsRequired();
        builder.Property(x => x.Image).HasMaxLength(255).IsRequired();

        builder
            .HasOne(x => x.Subject)
            .WithMany(x => x.Rooms)
            .HasForeignKey(x => x.SubjectId);
    }
}