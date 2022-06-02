const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const parseString = require("xml2js").parseString;
const fs = require("fs");
const axios = require("axios");
const { fetchDataFromURL, fetchDataFromFile } = require("./utils");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const outputFilePath = "./output/output.js";

/**
 * Fetch Vehicle types for make
 * @param {*} vehicles
 */
const fetchVehicleTypesForMake = async (vehicles) => {
  console.log("Total Vehicles ", vehicles.length);
  let output = [];

  for (let index in vehicles) {
    let vehicle = vehicles[index];
    try {
      const getVehicleTypesForMakeId = await fetchDataFromURL(
        `https://vpic.nhtsa.dot.gov/api/vehicles/GetVehicleTypesForMakeId/${vehicle.Make_ID}?format=xml`
      );

      let vehicleMakeType =
        getVehicleTypesForMakeId?.Response?.Results[0]
          ?.VehicleTypesForMakeIds || [];

      output.push({
        makeId: vehicle.Make_ID,
        makeName: vehicle.Make_Name,
        vehicleTypes: vehicleMakeType.map(
          ({ VehicleTypeId, VehicleTypeName }) => ({
            typeId: VehicleTypeId,
            typeName: VehicleTypeName,
          })
        ),
      });
      console.log("Added:", index);
    } catch (err) {
      console.log("Get file makes type error", vehicle.Make_ID);
    }
  }
  fs.writeFileSync(outputFilePath, JSON.stringify(output));
  console.log("Output added to the file.");
  return output;
};

app.get("/data", async (req, res) => {
  console.log("Start: Get all vehicle data");
  try {
    // const getAllMakes = await fetchDataFromURL(
    //   `https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=XML`
    // );
    const getAllMakes = await fetchDataFromFile();
    vehicles = getAllMakes.Response.Results[0].AllVehicleMakes.splice(0, 10); // fetch first 10
    const output = await fetchVehicleTypesForMake(vehicles);
    res.status(200).send(output);
  } catch (err) {
    console.log("Read file error:", err);
  }
});

app.listen(4201, async () => {
  console.log("Listening on 4201");
});
