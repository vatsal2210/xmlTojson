let parseString = require("xml2js").parseString;
let fs = require("fs");
const axios = require("axios");

const dataFilePath = "./data/sample1.xml";
const outputFilePath = "./output/output.js";

let output = [];

/**
 * Fetch Data
 * @param {*} url
 * @returns
 */
const fetchDataFromURL = async (url) => {
  const res = await axios.get(url);
  const parseRes = await parseData(res.data);
  if (!parseRes || res.status !== 200) {
    console.log("Found error parsing data");
    return null;
  } else {
    return parseRes;
  }
};

/**
 * Read data from file
 * @param {*} filePath
 */
const fetchDataFromFile = async (filePath = dataFilePath) => {
  const data = await fs.readFileSync(filePath, "utf8");
  const parseRes = await parseData(data);
  if (!parseRes) {
    console.log("Found error parsing data");
    return;
  } else {
    return parseRes;
  }
};

/**
 * Parse data
 * @param {*} data
 * @returns
 */
const parseData = async (data) => {
  return new Promise((resolve, reject) => {
    parseString(data, (err, res) => {
      if (err) {
        console.log("Parsing error", err);
        reject(null);
      } else {
        resolve(res);
      }
    });
  });
};

/**
 * Get Data from the URL
 * @returns
 */
const getData = async () => {
  try {
    // const getAllMakes = await fetchDataFromURL(
    //   `https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=XML`
    // );
    const getAllMakes = await fetchDataFromFile();
    vehicles = getAllMakes.Response.Results[0].AllVehicleMakes.splice(0, 2); //
    fetchVehicleTypesForMake(vehicles);
  } catch (err) {
    console.log("Read file error:", err);
  }
};

const fetchVehicleTypesForMake = async (vehicles) => {
  console.log("Total Vehicles ", vehicles.length);

  for (let index in vehicles) {
    let vehicle = vehicles[index];
    try {
      const getVehicleTypesForMakeId = await fetchDataFromURL(
        `https://vpic.nhtsa.dot.gov/api/vehicles/GetVehicleTypesForMakeId/${vehicle.Make_ID}?format=xml`
      );

      let vehicleMakeType =
        getVehicleTypesForMakeId.Response.Results[0].VehicleTypesForMakeIds;

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
  console.log(output);
  fs.writeFileSync(outputFilePath, JSON.stringify(output));
  process.exit();
};

getData();
