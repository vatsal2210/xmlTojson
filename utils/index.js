const parseString = require("xml2js").parseString;
const fs = require("fs");
const axios = require("axios");

const dataFilePath = "./data/sample1.xml";

/**
 * Fetch Data from URL
 * @param {*} url
 * @returns
 */
const fetchDataFromURL = async (url) => {
  const res = await axios.get(url);
  const parseRes = await parseData(res.data);
  if (!parseRes || res.status !== 200) {
    console.error("Error: Fetch data from URL");
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
    console.error("Error: Fetch data from file");
    return null;
  } else {
    return parseRes;
  }
};

/**
 * Parse data from xml to json
 * @param {*} data
 * @returns
 */
const parseData = async (data) => {
  return new Promise((resolve, reject) => {
    parseString(data, (err, res) => {
      if (err) {
        console.error("Error: Parsing data", err);
        reject(null);
      } else {
        resolve(res);
      }
    });
  });
};

module.exports = { fetchDataFromFile, fetchDataFromURL };
