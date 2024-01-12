const axios = require("axios");
const fs = require("fs-extra");
const os = require("os");
const yts = require("yt-search");
const ytdl = require("@distube/ytdl-core");

const musicStates = {};

module.exports = {
  config: {
    name: "music",
    version: "2.0",
    role: 0,
    author: "𝗞𝘀𝗵𝗶𝘁𝗶𝘇",
    cooldowns: 40,
    shortDescription: "",
    longDescription: {
      en: "Type 'music on' to start sending random music tracks every 5 minutes, and 'music off' to stop.",
    },
    category: "𝗠𝗨𝗦𝗜𝗖",
    dependencies: {
      "fs-extra": "",
      "axios": "",
      "ytdl-core": "",
      "yt-search": "",
    },
    guide: {
      en: "{p}music on / off",
    },
  },
  onStart: async function ({ api, event, args }) {
    try {
      const threadID = event.threadID;
      const command = args[0];

      if (command === "on") {
        if (!musicStates[threadID]) {
          musicStates[threadID] = { isEnabled: true, intervalId: null, sentMusic: [] }; 
          api.sendMessage("𝗥𝗮𝗻𝗱𝗼𝗺 𝗺𝘂𝘀𝗶𝗰 𝘁𝗿𝗮𝗰𝗸𝘀 𝗮𝗿𝗲 𝗻𝗼𝘄 𝗲𝗻𝗮𝗯𝗹𝗲𝗱.", threadID);
          sendRandomMusic(api, event); 
          startSendingRandomMusic(api, event);
        } else if (musicStates[threadID].isEnabled) {
          api.sendMessage("𝗥𝗮𝗻𝗱𝗼𝗺 𝗺𝘂𝘀𝗶𝗰 𝘁𝗿𝗮𝗰𝗸𝘀 𝗮𝗿𝗲 𝗮𝗹𝗿𝗲𝗮𝗱𝘆 𝗲𝗻𝗮𝗯𝗹𝗲𝗱 𝗶𝗻 𝘁𝗵𝗶𝘀 𝘁𝗵𝗿𝗲𝗮𝗱.", threadID);
        }
      } else if (command === "off") {
        if (musicStates[threadID] && musicStates[threadID].isEnabled) {
          musicStates[threadID].isEnabled = false;
          clearInterval(musicStates[threadID].intervalId);
          api.sendMessage("𝗥𝗮𝗻𝗱𝗼𝗺 𝗺𝘂𝘀𝗶𝗰 𝘁𝗿𝗮𝗰𝗸𝘀 𝗮𝗿𝗲 𝗻𝗼𝘄 𝗱𝗶𝘀𝗮𝗯𝗹𝗲𝗱 𝗶𝗻 𝘁𝗵𝗶𝘀 𝘁𝗵𝗿𝗲𝗮𝗱.", threadID);
        } else {
          api.sendMessage("𝗥𝗮𝗻𝗱𝗼𝗺 𝗺𝘂𝘀𝗶𝗰 𝘁𝗿𝗮𝗰𝗸𝘀 𝗮𝗿𝗲 𝗮𝗹𝗿𝗲𝗮𝗱𝘆 𝗱𝗶𝘀𝗮𝗯𝗹𝗲𝗱 𝗶𝗻 𝘁𝗵𝗶𝘀 𝘁𝗵𝗿𝗲𝗮𝗱.", threadID);
        }
      } else {
        api.sendMessage("𝗜𝗻𝘃𝗮𝗹𝗶𝗱 𝗰𝗼𝗺𝗺𝗮𝗻𝗱. 𝗧𝘆𝗽𝗲 '𝗺𝘂𝘀𝗶𝗰 𝗼𝗻' 𝘁𝗼 𝘀𝘁𝗮𝗿𝘁, 𝗮𝗻𝗱 '𝗺𝘂𝘀𝗶𝗰 𝗼𝗳𝗳' 𝘁𝗼 𝘀𝘁𝗼𝗽.", threadID);
      }
    } catch (error) {
      console.error('[ERROR]', error);
      api.sendMessage('𝗔𝗻 𝗲𝗿𝗿𝗼𝗿 𝗼𝗰𝗰𝘂𝗿𝗿𝗲𝗱 𝘄𝗵𝗶𝗹𝗲 𝗽𝗿𝗼𝗰𝗲𝘀𝘀𝗶𝗻𝗴 𝘁𝗵𝗲 𝗰𝗼𝗺𝗺𝗮𝗻𝗱', event.threadID, event.messageID);
    }
  },
};

function startSendingRandomMusic(api, event) {
  const threadID = event.threadID;

  musicStates[threadID].intervalId = setInterval(() => {
    sendRandomMusic(api, event);
  }, 4 * 60 * 1000);
}

async function sendRandomMusic(api, event) {
  try {
    const threadID = event.threadID;
    const senderID = event.senderID;

    const loadingMessage = await api.sendMessage("𝗹𝗼𝗮𝗱𝗶𝗻𝗴 𝗮 𝗿𝗮𝗻𝗱𝗼𝗺 𝗺𝘂𝘀𝗶𝗰 𝗽𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁....🎵", threadID, null, event.messageID);

    const playlistIds = ["PLMC9KNkIncKseYxDN2niH6glGRWKsLtde", "PLCiXFxWx8d2D0LdsRd4gqe2Oe46gnA6qV", "PLCiXFxWx8d2DfXUVW0xH3G_Fnc_lZN8O8"];
    const playlistId = playlistIds[Math.floor(Math.random() * playlistIds.length)];

    const apiKey = "AIzaSyAO1tuGus4-S8RJID51f8WJAM7LXz1tVNc";
    const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?key=${apiKey}&playlistId=${playlistId}&part=contentDetails&maxResults=50`;
    const response = await axios.get(playlistUrl);

    const items = response.data.items;
    const videoIds = items.map((item) => item.contentDetails.videoId);

    if (musicStates[threadID].isEnabled && musicStates[threadID].intervalId) {
      if (!musicStates[threadID].sentMusic) {
        musicStates[threadID].sentMusic = []; 
      }

      if (musicStates[threadID].sentMusic.length === videoIds.length) {
        musicStates[threadID].sentMusic.length = 0; 
      }

      const unwatchedVideoIds = videoIds.filter((videoId) => !musicStates[threadID].sentMusic.includes(videoId));

      if (unwatchedVideoIds.length === 0) {
        api.unsendMessage(loadingMessage.messageID);
        return api.sendMessage("No unwatched music tracks left.", threadID, null, event.messageID);
      }

      const randomVideoId = unwatchedVideoIds[Math.floor(Math.random() * unwatchedVideoIds.length)];

      musicStates[threadID].sentMusic.push(randomVideoId);

      const videoDetailsUrl = `https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&id=${randomVideoId}&part=snippet`;
      const videoResponse = await axios.get(videoDetailsUrl);

      const videoInfo = videoResponse.data.items[0].snippet;

      const randomMusicTitle = videoInfo.title;

      const cacheFilePath = os.tmpdir() + "/randomMusicTitle.txt";
      fs.writeFileSync(cacheFilePath, randomMusicTitle);

      const searchResults = await yts(randomMusicTitle);

      if (!searchResults.videos.length) {
        api.unsendMessage(loadingMessage.messageID);
        return api.sendMessage("No music track found based on the search title.", threadID, null, event.messageID);
      }

      const foundVideo = searchResults.videos[0];
      const videoUrl = foundVideo.url;

      const stream = ytdl(videoUrl, { filter: "audioonly" });
      const fileName = `${senderID}.mp3`;
      const filePath = __dirname + `/cache/${fileName}`;

      stream.pipe(fs.createWriteStream(filePath));

      stream.on('response', () => {
        console.info('[DOWNLOADER]', 'Starting download now!');
      });

      stream.on('info', (info) => {
        console.info('[DOWNLOADER]', `Downloading music: ${info.videoDetails.title}`);
      });

      stream.on('end', () => {
        console.info('[DOWNLOADER] Downloaded');

        if (fs.statSync(filePath).size > 26214400) {
          fs.unlinkSync(filePath);
          api.unsendMessage(loadingMessage.messageID);
          return api.sendMessage('❌ | The file could not be sent because it is larger than 25MB.', threadID, null, event.messageID);
        }

        const message = {
          body: `🎵 | Here's the random music track:\n\n🔮 | Title: ${randomMusicTitle}\n⏰| Duration: ${foundVideo.duration.timestamp}`,
          attachment: fs.createReadStream(filePath),
        };

        api.sendMessage(message, threadID, null, event.messageID, () => {
          fs.unlinkSync(filePath);
        });

        setTimeout(() => {
          api.unsendMessage(loadingMessage.messageID);
        }, 10000);
      });
    }
  } catch (error) {
    console.error('[ERROR]', error);
    api.sendMessage('An error occurred while processing the command.', event.threadID, event.messageID);
  }
}
