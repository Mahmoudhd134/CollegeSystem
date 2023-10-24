namespace Application.ErrorHandlers.Errors;

public static class SubjectErrors
{
    public static readonly Error CodeAlreadyExists = new("Subject.CodeAlreadyExists",
        "A subject with the same code is already exists");

    public static readonly Error NameAlreadyExists = new("Subject.NameAlreadyExists",
        "A subject with the same name is already exists");

    public static readonly Error WrongId = new("Subject.WrongId",
        "The id is wrong");

    public static readonly Error InvalidYear = new("Subject.InvalidYear",
        "The year number you entered is invalid");

    public static readonly Error WrongName = new("Subject.WrongName",
        "The name is wrong");

    public static readonly Error WrongCode = new("Subject.WrongCode",
        "The code is wrong");

    public static readonly Error SubjectIsAlreadyAssignedToDoctor = new("Subject.SubjectIsAlreadyAssignedToDoctor",
        "The Subject Is Already Assigned To Doctor");

    public static readonly Error SubjectIsNotAssignedToDoctor = new("Subject.SubjectIsNotAssignedToDoctor",
        "The Subject Is Not Assigned To Doctor");

    public static readonly Error UnAuthorizedGet = new("Subject.UnAuthorizedGet",
        "You can not get details for a subject you are not assigned in");
}