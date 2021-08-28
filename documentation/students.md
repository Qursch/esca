### Student Management

#### Get School
Returns a student's school.
```
Method: GET
Route: /students/get_students/
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
