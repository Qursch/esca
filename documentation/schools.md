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

#### Get Nearby Possible Providers
Returns a image list of nearby grocery stores OR restaurants.
```
Method: GET
Route: /schools/nearby/<place_type>/<distance>
Place Type: "grocery" or "restaurants"
Distance: Number 1 (near city) or 2 (in county) detailing how far to search
Request Body: None
Response:
{
    url: "gif;base64..."
}
```
*Returned URL is intended to be the `src` attribute of an HTML image tag.

#### Available Food
Returns a list of available food a school's students can claim.
```
Method: GET
Route: /schools/available_food/
Request Body: None
Response: String if no food is available or an array of:
{
    name: "Food item name",
    quantity: "Number of items left",
    calories: "Number of calories per item",
    expiration: "UNIX time"
}
```