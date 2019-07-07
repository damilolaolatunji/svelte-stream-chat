require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { StreamChat } = require('stream-chat');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// initialize Stream Chat SDK
const serverSideClient = new StreamChat(
  process.env.STREAM_API_KEY,
  process.env.STREAM_APP_SECRET
);

app.post('/join', (req, res) => {
  const { username } = req.body;

  // generate Stream Chat token to use to authenticate user on the client
  const token = serverSideClient.createToken(username);

  return res.status(200).json({ user: { username }, token });
});

app.listen(3000, () => {
  console.log(`Server running on http://localhost:3000`);
});
