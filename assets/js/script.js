let startButton = document.querySelector('.startButton')
let questionEvent = document.querySelector('.questionEvent')
let titleElement = document.querySelector(".title");
let yearElement = document.querySelector(".year");
let ratingElement = document.querySelector(".rating");
let posterElement = document.querySelector(".poster");
let synopsisElement = document.querySelector(".synopsis");
let streamingElement = document.querySelector(".streaming");

const myImdbKey = "k_w8uz89zh";
const myUtellyKEy = "02ef498ef6msh8ea8d390f90865bp160652jsn30e4c6e57514"

//click start button to see questions
const showEventQuestions = (event) => {
    startButton.style.display="none"
    questionEvent.style.display="block"
}

// find the button

let getSearchList = function(event) {
    let ocassion = $(event.target).text();
    let queryString ="";
    
    if (ocassion === "Girls Night") {
        queryString = "?title_type=feature,tv_movie,documentary&genres=comedy,drama,family,romances&certificates=us:PG-13,us:R&count=100&sort=user_rating,desc";
    } else 
    if (ocassion === "Family Night") {
        queryString = "?title_type=feature,tv_movie,documentary&genres=drama,horror,romance&certificates=us:G,us:PG,us:PG-13&count=100&sort=user_rating,desc";
    } else 
    if (ocassion === "Kids Sleepover") {
        queryString = "?title_type=feature,tv_movie,documentary&genres=animation&certificates=us:G&count=100&sort=user_rating,desc";
    } else 
    if (ocassion === "Date Night") {
        queryString = "?title_type=feature,tv_movie,documentary&genres=action,adventure,animation,family,fantasy&certificates=us:PG-13,us:R&count=100&sort=user_rating,desc";
    } else 
    if (ocassion === "Just watching by myself") {
        queryString = "?title_type=feature,tv_movie,documentary&count=100&sort=user_rating,desc";
    }
    
    let imdbUrl = "https://imdb-api.com/API/AdvancedSearch/" + myImdbKey + queryString;
       
    fetch(imdbUrl)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    console.log(data);
                    displayMovieInfo(data);
                });
            } else {
                alert("Error: " + response.statusText);
            }
        })
        .catch(function(error) {
            alert("Unable to connect to IMDB");
        });
}

let displayMovieInfo = function(data) {
    // random number
    let randomNum = Math.floor(Math.random() * data.results.length);
    // for loop to find a random movie
    let movie = data.results[randomNum];
    console.log(movie)
    let title = movie.title;
    console.log(title);
    titleElement.innerHTML = title;
    let firstParen = movie.description.indexOf("(");
    let secondParen = movie.description.indexOf(")");
    let year = movie.description.substring(firstParen+1,secondParen);
    console.log(year);
    yearElement.innerHTML = year;
    let rating = movie.imDbRating;
    console.log(rating + "/10");
    ratingElement.innerHTML = rating + "/10";
    let poster = movie.image;
    let posterImageEl = document.createElement("img");
    posterImageEl.setAttribute("src",poster);
    posterImageEl.setAttribute("width","25%");
    posterElement.appendChild(posterImageEl);
    let synopsis = "";
    if (movie.plot === null) {
        synopsis = "No synopsis available.";
        console.log(synopsis);
    } else {
        synopsis = movie.plot;    
        console.log(synopsis);
    }
    synopsisElement.innerHTML = synopsis;
    displayStreamingInfo(movie.title);
}

let displayStreamingInfo = function(title) {
    console.log(title);
    let filteredTitle = title.replaceAll(" ","%20");
    console.log(filteredTitle);
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Host': 'utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com',
            'X-RapidAPI-Key': myUtellyKEy
        }
    };
    

    let utellyUrl = "https://utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com/lookup?term=" + filteredTitle + "&country=us";
    fetch(utellyUrl, options)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    console.log(data); 
                    console.log(data.results[0].locations[0].display_name);
                    if (data.results[0] === null) {
                        streamingElement.innerHTML = "No streaming information available."
                    }
                    for (let i =0; i < data.results[0].locations.length;i++){
                        streamingElement.innerHTML = streamingElement.innerHTML + data.results[0].locations[i].display_name + " ";
                    }
                });
            } else {
                alert("Error: " + response.statusText);
            }
        })
        .catch(function(error) {
            alert("Unable to connect to streaming database (Utelly)");
        });
    
    console.log("help")
}

// event listener for ocassion selection
$(".button-container").on("click",".button-selection", getSearchList);

// startButton event listener
startButton.addEventListener('click', showEventQuestions)