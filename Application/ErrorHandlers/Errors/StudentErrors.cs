﻿namespace Application.ErrorHandlers.Errors;

public static class StudentErrors
{
    public static readonly Error UnAuthorizedGet = new Error("Student.UnAuthorizedGet",
        "You can not get an other student details");

    public static readonly Error SubjectAlreadyRegistered = new("Student.SubjectAlreadyRegistered",
        "You are already registered this subject");
}