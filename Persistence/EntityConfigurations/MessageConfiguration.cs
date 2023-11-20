using Domain.Room;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Persistence.EntityConfigurations;

public class MessageConfiguration:IEntityTypeConfiguration<Message>
{
    public void Configure(EntityTypeBuilder<Message> builder)
    {
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Text).HasMaxLength(4095).IsRequired();
        builder.Property(x => x.Date).IsRequired();

        builder
            .HasOne(x => x.Sender)
            .WithMany()
            .HasForeignKey(x => x.SenderId);

        builder
            .HasOne(x => x.Room)
            .WithMany(x => x.Messages)
            .HasForeignKey(x => x.RoomId);

        builder.HasIndex(x => x.Date);
    }
}