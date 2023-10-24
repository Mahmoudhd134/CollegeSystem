# CoursesToTeachers

## available apis right now is:


### Auth
    GET
    /Api/Auth/private
    
    POST
    /Api/Auth/Register
    
    POST
    /Api/Auth/Login
    
    GET
    /Api/Auth/RefreshToken
    
    GET
    /Api/Auth/isValidUsername/{username}
### Doctor
    GET
    /Api/Doctor/{id}

    DELETE
    /Api/Doctor/{id}
    
    GET
    /Api/Doctor/{pageIndex}/{pageSize}/{usernamePrefix}
    
    POST
    /Api/Doctor
    
    PUT
    /Api/Doctor
    
    GET
    /Api/Doctor/AssignToSubject/{doctorId}/{subjectId}
    
### Role
    POST
    /Api/Role
    
### Subject
    GET
    /Api/Subject/{pageIndex}/{pageSize}
    
    GET
    /Api/Subject/{name}
    
    PUT
    /Api/Subject
    
    POST
    /Api/Subject
    
    DELETE
    /Api/Subject/{id}
    
    DELETE
    /Api/Subject/DeleteAssignedDoctor/{subjectId}
    
### SubjectMaterial
    POST
    /Api/SubjectMaterial
    
    DELETE
    /Api/SubjectMaterial/{id}