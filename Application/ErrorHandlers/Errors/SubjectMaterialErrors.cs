namespace Application.ErrorHandlers.Errors;

public static class SubjectMaterialErrors
{
    public static readonly Error UnAuthorizedAdd = new("SubjectMaterialErrors.UnAuthorizedAdd",
        "You can not add a material to a subject you are not assigned to");

    public static readonly Error UnAuthorizedDelete = new("SubjectMaterialErrors.UnAuthorizedDelete",
        "You can not delete a material to a subject you are not assigned to");

    public static readonly Error WrongId = new("SubjectMaterialErrors.WrongId",
        "The id is wrong");

    public static readonly Error FileNotFound = new("SubjectMaterialErrors.FileNotFound",
        "File Not Found!!!");
    
    public static readonly Error RepeatedFileOnTheSameType = new("SubjectMaterialErrors.RepeatedFileOnTheSameType",
        "The file type you want to add is already has a file,remove he file first before assign another file to the same type");
}