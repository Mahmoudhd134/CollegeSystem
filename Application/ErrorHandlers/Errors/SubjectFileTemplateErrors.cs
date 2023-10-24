namespace Application.ErrorHandlers.Errors;

public static class SubjectFileTemplateErrors
{
    public static readonly Error FileNotFound = new("SubjectFileTemplateErrors.FileNotFound",
        "The Template You Want Is Not Found");

    public static readonly Error UnSupportedSubjectFileTypeTemplateType = new(
        "SubjectFileTemplateErrors.UnSupportedSubjectFileTypeTemplateType",
        "The only supported file type now is .docx file");
}