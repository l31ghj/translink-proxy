import express from 'express';
import fetch from 'node-fetch';
import GtfsRealtimeBindings from 'gtfs-realtime-bindings';
import cors from 'cors';

const app = express();

// Enable CORS for all routes
app.use(cors());

// JSON proxy route
app.get('/TripUpdates', async (req, res) => {
  try {
    const feedUrl = 'https://gtfsrt.api.translink.com.au/api/realtime/SEQ/TripUpdates';
    const upstream = await fetch(feedUrl);
    const buffer = await upstream.arrayBuffer();

    const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(
      new Uint8Array(buffer)
    );

    res.json(feed.toJSON());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch or decode feed' });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
