const { artists, songs } = window;
console.log({ artists, songs }, "App Data");

function buildMenu() {
  let menu = document.getElementById("menu");
  menu.innerHTML = "";
  for (let i = 0; i < artists.length; i++) {
    menu.innerHTML += `<span onclick='showSelectedArtist("${artists[i].id}")'>${artists[i].name}</span>&nbsp;`;
  }
}

function showSelectedArtist(artistID) {
  let selectedArtistContainer = document.getElementById("selected-artist");
  let selectedArtist = artists.find((artist) => artist.id === artistID);
  let linksHtml = selectedArtist.links.map(
    (link) => `<a href="${link.url}" target="_blank">${link.name}</a>`
  ).join(" ");

  selectedArtistContainer.innerHTML = `
    <span>${selectedArtist.name}</span>
    <div class="links-container">${linksHtml}</div>
  `;
  showCardsByArtist(artistID);
}

async function getQuote() {
  const fetchRes = await fetch("https://dummyjson.com/quotes/random");
  const quoteData = await fetchRes.json();

  const quote = quoteData.quote;
  
  if (quote.length < 60) {
    return quote;
  } else {
    return `${quote.slice(0, 60)}...`;
  }
}

function showCardsByArtist(artistID)
 {
  let artistSongs = songs.filter(song => song.artistId === artistID);
  let cardContainer = document.getElementById("song-cards");
  cardContainer.innerHTML = "";

  artistSongs.forEach(async song => {
    const quote = await getQuote();
    const songCard = `
      <div class="song-card" onclick="showSongForm('${song.id}')">
        <img src="${song.album.imageURL}" alt="${song.title} Album Artwork">
        <h3>${song.title}</h3>
        <p><b>Year</b>: ${song.year}</p>
        <p><b>Duration</b>: ${song.duration} seconds</p>
        <p><b>Album Name</b>: ${song.album.name}</p>
        <p><b>Quote</b>: <i>${quote}</i></p>
      </div>
    `;

    cardContainer.innerHTML += songCard;
    // getQuote().then(quote => {
    //   const quoteParagraph = cardContainer.querySelector(`[data-song-id="${song.id}"] p`);
    //   quoteParagraph.textContent = `Quote: "${quote}"`;
    // });
  });
}

function showSongForm(songId) {
  const songForm = document.getElementById("edit-song-form");
  songForm.classList.remove("hidden");
  const song = songs.find(song => song.id === songId);
  document.getElementById("edit-song-id").value = song.id;
  document.getElementById("edit-artist-id").value = song.artistId;
  document.getElementById("edit-song-title").value = song.title;
  document.getElementById("edit-song-year").value = song.year;
  document.getElementById("edit-song-duration").value = song.duration;

  const titleDisplay = document.getElementById("song-title-display");
  titleDisplay.textContent = `Title: ${song.title}`;
  titleDisplay.classList.remove("hidden");
}

document.addEventListener("DOMContentLoaded", function () {
  buildMenu();
  showSelectedArtist(artists[0].id);

  const songForm = document.getElementById("edit-song-form");

  songForm.onsubmit = function (event) {
    event.preventDefault(); 
  
    const editedSongId = document.getElementById("edit-song-id").value;
    const editedSongIndex = songs.findIndex(song => song.id === editedSongId);
  
    if (editedSongIndex !== -1) {
      songs[editedSongIndex].title = document.getElementById("edit-song-title").value;
      songs[editedSongIndex].year = document.getElementById("edit-song-year").value;
      songs[editedSongIndex].duration = document.getElementById("edit-song-duration").value;
    }
  
    const artistId = document.getElementById("edit-artist-id").value;
    showCardsByArtist(artistId);
  
    songForm.classList.add("hidden");
  };

  const songCards = document.querySelectorAll(".song-card");
  songCards.forEach(songCard => {
    songCard.addEventListener("click", function (event) {
      if (!songForm.classList.contains("hidden")) {
        return;
      }

      const songId = parseInt(event.currentTarget.dataset.songId);
      showSongForm(songId);
    });
  });
});
