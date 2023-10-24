using Application.Abstractions;

namespace Infrastructure;

public class PhysicalFileAccessor : IFileAccessor
{
    public async Task<string> Add(Stream stream, string extension)
    {
        var newFileName = Guid.NewGuid() + extension;

        await using var rootFileStream =
            new FileStream(Path.Combine("wwwroot", "subjectMaterials", newFileName), FileMode.Create);
        await stream.CopyToAsync(rootFileStream);

        return newFileName;
    }

    public async Task<byte[]> Get(string name)
    {
        return await File.ReadAllBytesAsync(Path.Combine("wwwroot", "subjectMaterials", name));
    }

    public Task Delete(string name)
    {
        File.Delete(name);
        return Task.CompletedTask;
    }
}