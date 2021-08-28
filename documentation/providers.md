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

#### Get Nearby Schools
Returns a image list of nearby schools.
```
Method: GET
Route: /providers/nearby_schools/<distance>
Distance: Number 1 (in city), 2 (around city), or 3 (in county) detailing how far to search
Request Body: None
Response:
{
    url: "gif;base64..."
}
```
*Returned URL is intended to be the `src` attribute of an HTML image tag.

#### Add Food
Adds food for selected school to provide to students.
```
Method: POST
Route: /providers/add_food
Request Body:
{
    name: "Name of food",
    quantity: "Number of items",
    expiration: "UNIX timestamp"
}
Response: Success or error.
```