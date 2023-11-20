using Domain.Room;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Persistence.EntityConfigurations;

public class UserRoomConfiguration : IEntityTypeConfiguration<UserRoom>
{
    public void Configure(EntityTypeBuilder<UserRoom> builder)
    {
        builder.HasKey(x => x.Id);

        builder
            .HasOne(x => x.Room)
            .WithMany(x => x.UserRooms)
            .HasForeignKey(x => x.RoomId);

        builder
            .HasOne(x => x.User)
            .WithMany(x => x.UserRooms)
            .HasForeignKey(x => x.UserId);

        builder.HasIndex(x => x.RoomId);
        builder.HasIndex(x => x.UserId);
        builder.HasIndex(x => new { x.RoomId, x.UserId }).IsUnique();
    }
}