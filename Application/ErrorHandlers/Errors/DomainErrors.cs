namespace Application.ErrorHandlers.Errors;

public static class DomainErrors
{
    public static readonly Error None = new(string.Empty, string.Empty);
    public static readonly Error UnKnown = new("Error.Unknown", 
        "Un Known Error Occurred");
}