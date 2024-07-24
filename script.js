const albumArt = document.getElementById('album-art');
const songTitle = document.querySelector('.now-playing h2');
const artistName = document.querySelector('.now-playing h3');
const prevButton = document.getElementById('prev-button');
const skipButton = document.getElementById('skip-button');
const playButton = document.getElementById('play-button');

let acs_code;

document.getElementById('submit-code').addEventListener('click', function() {
  acs_code = document.getElementById('access-code').value;
  console.log(acs_code); // For debugging purposes, you can see the value in the console

  // Fetch access token and saved songs once the access code is submitted
  getAccessToken();
  getSavedSongs();
});

let accessToken = ''; // Initialize access token as an empty string
let currentTrackIndex = 0;
let savedTracks = []; // Stores saved songs data

// Function to fetch access token (this function assumes acs_code is already set)
function getAccessToken() {
  // Use the access code directly as the access token for this example
  accessToken = acs_code;
  console.log(`Access token set: ${accessToken}`);
}

// Function to fetch saved songs
function getSavedSongs() {
  if (!accessToken) {
    console.error('Access token is not set');
    return;
  }

  fetch('https://api.spotify.com/v1/me/tracks?limit=50', {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })
  .then(response => response.json())
  .then(data => {
    savedTracks = data.items.map(item => ({
      title: item.track.name,
      artist: item.track.artists[0].name,
      image: item.track.album.images[0].url // Get first image from album
    }));
    updateDisplay();
  })
  .catch(error => console.error(error));
}

// Function to update displayed song information
function updateDisplay() {
  if (savedTracks.length === 0) {
    songTitle.textContent = "No Saved Songs";
    artistName.textContent = "";
    albumArt.src = "";
    return;
  }
  const currentTrack = savedTracks[currentTrackIndex];
  songTitle.textContent = currentTrack.title;
  artistName.textContent = currentTrack.artist;
  albumArt.src = currentTrack.image;
}

// Function to handle previous button click (currently non-functional for playback)
prevButton.addEventListener('click', () => {
  currentTrackIndex--;
  if (currentTrackIndex < 0) {
    currentTrackIndex = savedTracks.length - 1;
  }
  updateDisplay();
});

// Function to handle skip button click (currently non-functional for playback)
skipButton.addEventListener('click', () => {
  currentTrackIndex++;
  if (currentTrackIndex >= savedTracks.length) {
    currentTrackIndex = 0;
  }
  updateDisplay();
});

// Function to handle play button click to open song on YouTube
playButton.addEventListener('click', () => {
  if (savedTracks.length === 0) {
    console.error('No tracks available to play');
    return;
  }

  const currentTrack = savedTracks[currentTrackIndex];
  const searchQuery = `${currentTrack.title} ${currentTrack.artist}`;
  const youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`;
  window.open(youtubeUrl, '_blank');
});
