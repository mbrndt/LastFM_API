import express from "express";
import fs from "fs";
import { convertArrayToCSV } from "convert-array-to-csv";
import bodyParser from "body-parser";
import stringify from "json-stringify-safe";

//to be able to use path.dirname(__filename)
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));

// Route to get all artists / Artist search bar
router.get("/search", (req, res) => {
  console.log("Begin API call backend");
  const { artist } = req.query;

  const url = `http://ws.audioscrobbler.com/2.0/?method=artist.search&artist=${artist}&api_key=739a58e70418553b07b7c03490b77a09&format=json`;
  const artistInfo = [];
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log("Fetch sucessfull");
      // saves all search results to an array
      for (let i = 0; i < data.results.artistmatches.artist.length; i++) {
        artistInfo.push({
          name: data.results.artistmatches.artist[i].name,
          mbid: data.results.artistmatches.artist[i].mbid,
          url: data.results.artistmatches.artist[i].url,
          image_small: data.results.artistmatches.artist[i].image[3]["#text"],
          image: data.results.artistmatches.artist[i].image[3]["#text"],
        });
      }

      console.log("Data ready to be downloaded");
    });
});

//Route to save and download the .csv file
router.post("/download", (req, res) => {
  console.log("Begin cvs filesaving");
  const filename = stringify(req.body.file);

  fs.writeFile(`${filename}.csv`, convertArrayToCSV(artistInfo), (err) => {
    if (err) throw err;
    console.log(`The file was saved.`);
    setTimeout(() => {
      res.download(`${filename}.csv`);
    }, 1000);
    console.log(`File ${filename} successfully downloaded.`);
  });
});

export default router;
