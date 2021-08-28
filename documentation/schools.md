### School Management

#### Get Students
Returns a list of students in a school.
```
Method: GET
Route: /schools/get_students/
Request Body: None
Response: Students as a string if there are none or as an array of:
{
    name: "Student's name",
    email: "Student's email"
}
```

#### Add Students
Adds student(s) to a school.
```
Method: POST
Route: /schools/add_students/
Request Body: 
{
   students: [ (Emails of students to add)
       "example@mail.com",
       ...
       "another@example.com"
   ]
}
Response:
{
    info: "Success message with number of students added.",
    error: [ (Emails of students lacking accounts)
        "another@example.com"
    ]
}
```