### User Management

#### Signup
Creates a user.
```
Method: POST
Route: /users/signup/
Request Body: 
{
    name: "Name of person or organization",
    email: "Email, used for authentication",
    password: "Password",
    type: "student, school, or provider",
    location: [ (Approximate location of user or organization)
        longitude: -100,
        latitude: 100
    ]
}
Response: Success or error.
```

#### Login
Authenticates a user and creates a session.
```
Method: POST
Route: /users/login/
Request Body: 
{
    
    email: "Email, used for authentication",
    password: "Password"

}
Response: Success or error.
```