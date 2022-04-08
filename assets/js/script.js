let startButton = document.querySelector('.startButton')
let questionEvent = document.querySelector('.questionEvent')

const myImdbKey = "k_w8uz89zh";
const myUtellyKEy = "02ef498ef6msh8ea8d390f90865bp160652jsn30e4c6e57514"

//click start button to see questions
const showEventQuestions = () => {
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

    console.log(data.results[randomNum]);
}

// event listener for ocassion selection
$(".button-container").on("click",".button-selection", getSearchList);

// startButton event listener
startButton.addEventListener('click', showEventQuestions)