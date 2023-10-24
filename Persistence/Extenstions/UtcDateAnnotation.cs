using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;



namespace Persistence.Extenstions;

public static class UtcDateAnnotation
{
    private const string IsUtcAnnotation = "IsUtc";

    private static readonly ValueConverter UtcConverter =
        new ValueConverter<DateTime, DateTime>(v => v, v => DateTime.SpecifyKind(v, DateTimeKind.Utc));

    private static readonly ValueConverter<DateTime?, DateTime?> UtcNullableConverter =
        new(v => v,
            v => v == null ? v : DateTime.SpecifyKind(v.Value, DateTimeKind.Utc));

    public static PropertyBuilder<TProperty> IsUtc<TProperty>(this PropertyBuilder<TProperty> builder,
        bool isUtc = true)
    {
        return builder.HasAnnotation(IsUtcAnnotation, isUtc);
    }

    private static bool IsUtc(this IMutableProperty property)
    {
        return (bool?)property.FindAnnotation(IsUtcAnnotation)?.Value ?? true;
    }

    /// <summary>
    ///     Make sure this is called after configuring all your entities.
    /// </summary>
    public static void ApplyUtcDateTimeConverter(this ModelBuilder builder)
    {
        foreach (var entityType in builder.Model.GetEntityTypes())
        foreach (var property in entityType.GetProperties())
        {
            if (!property.IsUtc()) continue;

            if (property.ClrType == typeof(DateTime)) property.SetValueConverter(UtcConverter);

            if (property.ClrType == typeof(DateTime?)) property.SetValueConverter(UtcNullableConverter);
        }
    }
}