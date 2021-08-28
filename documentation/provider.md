### Provider Management

#### Get School
Returns a provider's school.
```
Method: GET
Route: /providers/get_students/
Request Body: None
Response: School as a string if there is none or an object:
{
    name: "School name",
    email: "School email,"
    location: { (Of the school)
        longitude: -100,
        latitude: 100
    }
}
```

#### Set School
Sets a provider's school.
```
Method: POST
Route: /providers/set_school/
Request Body: 
{
   schoolName: "Name of school, case insensitive"
}
Response: Success or error.
```