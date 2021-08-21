import express from 'express';
import cors from 'cors';
import { TwitterApi } from 'twitter-api-v2';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const client = new TwitterApi(process.env.API_KEY);

const getTweetData = async (id) => {
  try {
    const tweet = await client.get(
      `https://api.twitter.com/1.1/statuses/show.json?id=${id}&include_entities=true`
    );
    const videoData = tweet.extended_entities.media[0].video_info.variants;
    const videoLinks = [];
    videoData.forEach((data) => {
      if (data.content_type === 'video/mp4') {
        videoLinks.push({
          link: data.url,
          size: data.url.split('/')[data.url.split('/').length - 2],
        });
      }
    });
    return videoLinks;
  } catch {
    const videoLinks = [
      {
        link: 'error',
        size: 'error',
      },
    ];
    return videoLinks;
  }
};

app.get('/', async (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

app.get('/:id', async (req, res) => {
  const id = req.params.id;
  const videoLinks = await getTweetData(id);
  res.send(JSON.stringify(videoLinks));
});

app.listen(port, () => {
  console.log(`Listening on PORT ${port}`);
});
