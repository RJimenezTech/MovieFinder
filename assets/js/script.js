let startButton = document.querySelector('.startButton')
let questionEvent = document.querySelector('.questionEvent')
let titleElement = document.querySelector(".title");
let yearElement = document.querySelector(".year");
let ratingElement = document.querySelector(".rating");
let posterElement = document.querySelector(".poster");
let synopsisElement = document.querySelector(".synopsis");
let streamingElement = document.querySelector("#streaming");
let movieCardElement = document.querySelector(".movieCard");
let backButtonElement = document.querySelector("#backbutton");
let newRecommendationElement = document.querySelector("#recBtn");
var movieNum = "";
const myImdbKey = "k_srn1al6a";
const myUtellyKEy = "02ef498ef6msh8ea8d390f90865bp160652jsn30e4c6e57514"
// function tomove to different page

if (localStorage.getItem("searchInput")) {
    localStorage.clear();
}

//click start button to see questions
const showEventQuestions = (event) => {
    startButton.style.display="none"
    questionEvent.style.display="block"
}

const showMovieCard = function() {
    questionEvent.style.display = "none";
    movieCardElement.style.display = "block";
    backButtonElement.style.display = "block";
}

const recommendMovie = function(occasion) {
    console.log(occasion);
    let queryString = "";
    removeOldInfo();
    if (occasion === "Girls Night") {
        queryString = "?title_type=feature,tv_movie,documentary&genres=romance&certificates=us:PG-13,us:R&count=100&sort=user_rating,desc";
    } else 
    if (occasion === "Family Night") {
        queryString = "?title_type=feature,tv_movie,documentary&genres=adventure&certificates=us:G,us:PG,us:PG-13&count=100&sort=user_rating,desc";
    } else 
    if (occasion === "Kids Sleepover") {
        queryString = "?title_type=feature,tv_movie,documentary&genres=animation&certificates=us:G&count=100&sort=user_rating,desc";
    } else 
    if (occasion === "Date Night") {
        queryString = "?title_type=feature,tv_movie,documentary&genres=romance,adventure&certificates=us:PG-13,us:R&count=100&sort=user_rating,desc";
    } else 
    if (occasion === "Just watching by myself") {
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

// show the card and use button clicked as basis for query string
let getSearchList = function(event) {
    showMovieCard(); 
    let occasion = $(event.target).text();
    localStorage.setItem("searchInput",JSON.stringify(occasion));
    recommendMovie(occasion);
}
// differentiate whether we clicked an ocassion option or selected new rec
const searchHandler = function(event) {
    movieNum = 0;
    if (event.target.innerHTML === "New Recommendation") {
        // use the old search input as the basis for the query string
        recommendMovie(JSON.parse(localStorage.getItem("searchInput")));
        $("#streaming").find("a").remove();
    } else {
        // other wise
        getSearchList(event);
    }
}

let displayMovieInfo = function(data) {
    let randomNum = Math.floor(Math.random() * data.results.length);
    let movie = data.results[randomNum];
    let title = movie.title;
    console.log(title);
    console.log(movie.id);
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
    } else {
        synopsis = movie.plot;    
    }
    synopsisElement.innerHTML = synopsis;
    displayStreamingInfo(movie.id);
}

let displayStreamingInfo = function(imdbTT) {
    console.log(imdbTT);
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Host': 'utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com',
            'X-RapidAPI-Key': myUtellyKEy
        }
    };
    
    let utellyUrl = "https://utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com/idlookup?source_id=" + imdbTT + "&source=imdb&country=us";
    fetch(utellyUrl, options)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    console.log(data); 
                    if (data.collection.locations === undefined) { // cannot reach this inside this if statement
                        let streamingOption = document.createElement("p");
                        streamingOption.innerHTML = "No streaming information available."
                        streamingOption.setAttribute("class","aStreamOption")
                        streamingElement.appendChild(streamingOption);
                    } else {
                        for (let i =0; i < data.collection.locations.length;i++){
                        let streamingText = document.createElement("p");
                        let streamingOption = document.createElement("a");
                        streamingOption.setAttribute("href", data.collection.locations[i].url);
                        streamingOption.setAttribute("target","_blank");
                        streamingOption.setAttribute("display","block");
                        streamingOption.setAttribute("class","aStreamOption");
                        streamingText.innerHTML = data.collection.locations[i].display_name;
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
    localStorage.clear();
    movieCardElement.style.display = "none";
    questionEvent.style.display = "block";
    // clear streaming options
    removeOldInfo();
}


const removeOldInfo = function() {
    $(".aStreamOption").remove();
    titleElement.innerText = "";
    yearElement.innerText = "";
    posterElement.innerText = "";
    ratingElement.innerText = "";
    synopsisElement.innerText = "";
    $(".poster").attr("src","https://bulma.io/images/placeholders/128x128.png");
}
// event listener for new recommendation
newRecommendationElement.addEventListener("click", searchHandler);

// event listener for occasion selection
$("#occasionBtns").on("click",".button-selection", searchHandler);

// wait for back button 
backButtonElement.addEventListener("click",clickBackButton);

// startButton event listener
startButton.addEventListener('click', showEventQuestions)