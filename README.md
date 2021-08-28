# esca
A project for WaffleHacks '21.

Esca is a service that helps connect schools with local grocery stores and restaurants (providers) who are willing to donate left over food to students facing food insecurity.

This API includes many key functions to Esca, such as:
- Providing schools with a list of local providers, and vice versa
- Allowing schools to create accounts for students so they can claim avaliable food
- Allowing providers to add food for students facing food insecurity to claim
- Allowing students to claim a certain daily amount of good from local providers

The Esca API also utilizes computational intelligence via the [Wolfram|Alpha API](https://www.wolframalpha.com/), in order to connect schools and providers, as well as allow every student an equal amount of food.

## Installation

Clone this repository.

```bash
git clone https://github.com/Qursch/esca.git
```

Use [npm](https://www.npmjs.com/) to install the necessary packages.

```bash
cd esca
npm install
```

Next add and set the following `.env` variables.

```
MONGO_URI=...
SESSION_SECRET=...
WOLFRAM_ID=...
OPENCAGE_KEY=...
```

## API Documentation

Documentation for:

[General Users](documentation/users.md)<br />
[Schools](documentation/schools.md)<br />
[Providers](documentation/providers.md)<br />
[Students](documentation/students.md)<br />

## License
[Apache-2.0](https://choosealicense.com/licenses/apache-2.0/)
