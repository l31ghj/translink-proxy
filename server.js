import express from 'express';
import fetch from 'node-fetch';
import GtfsRealtimeBindings from 'gtfs-realtime-bindings';

const app = express();

// Convert the upstream protobuf feed to JSON
app.get('/TripUpdates', async (req, res) => {
  try {
    const feedUrl = 'https://gtfsrt.api.translink.com.au/api/realtime/SEQ/TripUpdates';

    // Fetch as binary
    const upstream = await fetch(feedUrl);
    const buffer = await upstream.arrayBuffer();

    // Decode protobuf
    const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(
      new Uint8Array(buffer)
    );

    // Send JSON to browser
    res.json(feed.toJSON());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch or decode feed' });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Proxy running on port ${PORT}`);
});
