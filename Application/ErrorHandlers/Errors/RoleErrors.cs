namespace Application.ErrorHandlers.Errors;

public static class RoleErrors
{
    public static readonly Error NameAlreadyExists = new("Role.NameAlreadyExists",
        "A role with the same name already exists");

    public static readonly Error UnknownError = new("Role.UnknownError",
        "An unknown error happens, try again later");
}