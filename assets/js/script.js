let startButton = document.querySelector('.startButton')
let questionEvent = document.querySelector('.questionEvent')
let titleElement = document.querySelector(".title");
let yearElement = document.querySelector(".year");
let ratingElement = document.querySelector(".rating");
let posterElement = document.querySelector(".poster");
let synopsisElement = document.querySelector(".synopsis");
let streamingElement = document.querySelector("#streaming");
let movieCardElement = document.querySelector(".movieCard");

const myImdbKey = "k_w8uz89zh";
const myUtellyKEy = "02ef498ef6msh8ea8d390f90865bp160652jsn30e4c6e57514"
// function tomove to different page

const moveToMovieCard = function() {
    location.assign("movieDisplayed.html");
}

//click start button to see questions
const showEventQuestions = (event) => {
    startButton.style.display="none"
    questionEvent.style.display="block"
}

const showMovieCard = function() {
    questionEvent.style.display = "none";
    movieCardElement.style.display = "block";
}

// find the button
let getSearchList = function(event) {
    let occassion = $(event.target).text();
    
    let queryString = "";
    
    localStorage.setItem("searchInput",JSON.stringify(occassion));

    if (occassion === "Girls Night") {
        queryString = "?title_type=feature,tv_movie,documentary&genres=romances&certificates=us:PG-13,us:R&count=100&sort=user_rating,desc";
    } else 
    if (occassion === "Family Night") {
        queryString = "?title_type=feature,tv_movie,documentary&genres=drama,horror,romance&certificates=us:G,us:PG,us:PG-13&count=100&sort=user_rating,desc";
    } else 
    if (occassion === "Kids Sleepover") {
        queryString = "?title_type=feature,tv_movie,documentary&genres=animation&certificates=us:G&count=100&sort=user_rating,desc";
    } else 
    if (occassion === "Date Night") {
        queryString = "?title_type=feature,tv_movie,documentary&genres=action,adventure,animation,family,fantasy&certificates=us:PG-13,us:R&count=100&sort=user_rating,desc";
    } else 
    if (occassion === "Just watching by myself") {
        queryString = "?title_type=feature,tv_movie,documentary&count=100&sort=user_rating,desc";
    }
    
    let imdbUrl = "https://imdb-api.com/API/AdvancedSearch/" + myImdbKey + queryString;
       
    fetch(imdbUrl)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    console.log(data);
                    
                    // moveToMovieCard();
                    console.log("help");
                    showMovieCard();
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
    
    
    titleElement.innerHTML = title;
    let firstParen = movie.description.indexOf("(");
    let secondParen = movie.description.indexOf(")");
    let year = movie.description.substring(firstParen,secondParen+1);
    
    yearElement.innerHTML = year;
    let rating = movie.imDbRating;
    
    ratingElement.innerHTML = "IMDB Score: " + rating + "/10";
    let poster = movie.image;
    posterElement.setAttribute("src",poster);
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
                    if (data.results[0] === undefined) { // cannot reach this inside this if statement
                        let streamingOption = document.createElement("p");
                        streamingOption.innerHTML = "No streaming information available."
                        streamingElement.appendChild(streamingOption);
                    } else {
                        for (let i =0; i < data.results[0].locations.length;i++){
                        let streamingText = document.createElement("p");
                        let streamingOption = document.createElement("a");
                        streamingOption.setAttribute("href", data.results[0].locations[i].url);
                        streamingOption.setAttribute("target","_blank");
                        streamingOption.setAttribute("display","block");
                        streamingText.innerHTML = data.results[0].locations[i].display_name;
                        streamingOption.appendChild(streamingText);
                        streamingElement.appendChild(streamingOption);
                        }
                    }
                });
            } else {
                alert("Error: " + response.statusText);
            }
        })
        .catch(function(error) {
            alert("Unable to connect to streaming database (Utelly)");
        });
}

// function for back button
const clickBackButton = function () {
    location.assign("index.html");
    localStorage.setItem("searchInput", null);
}

// event listener for occassion selection
$(".button-container").on("click",".button-selection", getSearchList);



// startButton event listener
startButton.addEventListener('click', showEventQuestions)