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

#### Available Food
Returns a list of available food a student can claim.
```
Method: GET
Route: /students/available_food/
Request Body: None
Response: String if no food is available or an array of:
{
    name: "Food item name",
    quantity: "Number of items left",
    calories: "Number of calories per item",
    expiration: "UNIX time"
}
```

#### Claim Food
Claims and reserves a specific food item for a student.
```
Method: POST
Route: /students/claim_food/
Request Body:
{
    name: "Food item name",
    quantity: "Number of items"
}
Response: Success or errors.
```