namespace Application.ErrorHandlers.Errors;

public static class UserErrors
{
    public static readonly Error WeakPasswordError = new("User.WeakPassword",
        "The password must has more than 8 characters and at least one small and one capital character and one non-alphabitic character and at least one number");

    public static readonly Error UsernameAlreadyUsedError = new("User.UsernameAlreadyUsed",
        "User Name Is Already Used");

    public static readonly Error EmailAlreadyUsedError = new("User.EmailAlreadyUsed",
        "Email Is Already Exists");

    public static readonly Error UnknownError = new("User.UnknownError",
        "The Un Known Error Is Happen Please Try Again Later");

    public static readonly Error WrongUsername = new("User.WrongUsernameError",
        "The Username Is Wrong");

    public static readonly Error WrongPassword = new("User.WrongPasswordError",
        "The Password Is Wrong");

    public static readonly Error SignInAgain = new("User.SignInAgain",
        "There Are Something Went Wrong, Please Sign In Ageain");

    public static readonly Error ExpireRefreshTokenError = new("User.ExpireRefreshToken",
        "The Session Is Expired, Signin Again");

    public static readonly Error WrongId = new("User.WrongId",
        "The Id is wrong");

    public static readonly Error NotValidEmailError = new("User.NotValidEmail",
        "The email is not valid, try another");

    public static readonly Error WrongRefreshToken = new("User.WrongRefreshTokenError",
        "The Refresh Token Is Wrong, Sign In Again");

    public static readonly Error UnAuthorizedEdit = new("User.UnAuthorizedEdit",
        "You can not edit an user that is not you");

    public static readonly Error NationalNumberAlreadyExists = new("User.NationalNumberAlreadyExists",
        "The national number already exists");
}