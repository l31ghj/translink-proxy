import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 8080;

// CORS so your PID can fetch from browser
app.use((_req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Proxy route: raw protobuf
app.get("/tripupdates", async (_req, res) => {
  try {
    const resp = await fetch("https://gtfsrt.api.translink.com.au/api/realtime/SEQ/TripUpdates");
    if (!resp.ok) throw new Error(`Feed error ${resp.status}`);
    res.setHeader("Content-Type", "application/octet-stream");
    resp.body.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching GTFS RT feed");
  }
});

app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
