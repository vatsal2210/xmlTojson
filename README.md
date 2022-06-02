# XML to JSON converter project

## How to run the project on your computer

1. Open your terminal
2. Install the dependency using `npm install`
3. Run `npm start` script
4. Open your browser
5. Go to `localhost:4201/data` that is the single endpoint

## Project structure

1. index.js
   - App listener on 4201
   - Endpoint to get data

2. utils
   - index.js
     - Fetch Data from URL
       - Used `axios` to fetch data from the given URL
     - Fetch Data from File
       - Assumed that there could be a file to fetch the data from
     - Common function to parse XML to JSON
       - A common function to pase data from XML to JSON

3. data
   - sample.xml file (sample document data)

4. output
   - Saved output `JSON` to the file

## Added different features set

1. Used Promises

- Added promise handling in parsing the data

2. Used async-await

- For fetching from URL or reading a file - used `async-await`

3. Error handling

- Added error handling and logs

4. Comments

- Function names are self describing but added comments just for the references

---

## Project requirement:

A new client wants us to develop the services, and create the infrastructure for their new project.
The client wants their services to be fast, maintainable, and scalable. The client wants to create
a service that can parse XML data and transform it to JSON format.

Hard Requirements:

1. Service must parse XML

- Parse all the Makes from: https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=XML
- Get all the Vehicle Types per Make https://vpic.nhtsa.dot.gov/api/vehicles/GetVehicleTypesForMakeId/440?format=xml

2. Service must produce JSON

- Combine all the of XML information into a single JSON object
- Produce an array of objects will the all of the information from the XML endpoints
- The JSON must look like the following: https://gist.github.com/mbaigbimm/d340e7800d17737482e71c9ad1856f68

3. Service must have a single endpoint to get all the data
4. Service must save this into a document based datastore
5. Service must follow NodeJS best practices for project structure, and code
