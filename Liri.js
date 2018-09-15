var dotenv = require("dotenv").config({
    path: "./.env"
});
if (dotenv.error) {
    throw dotenv.error
}
var keys = require("./keys");
var op = process.argv[2];

var Spotify = require('node-spotify-api');
if (op === "my-tweets") {
    twitter();
} else if (op === "spotify-this-song") {
    if (process.argv.length === 3) {
        spotify("Bimmer Music");
    }
    else {
        spotify();
    }
} else if (op === "movie-this") {
    movie();
} else if (op === "do-what-it-says") {
    random();
}

function movie() {
    var title = [];
    if (process.argv.length === 3) {
        title = "The Dark Knight";
    } else {
        for (var i = 3; i < process.argv.length; i++) {
            title = title + "+" + process.argv[i];
        }
    }

    var request = require("request");
    request("http://www.omdbapi.com/?t=" + title + "&apikey=trilogy", function (error, response, body) {
        if (error) {
            console.log("Error: " + error);
        }
        var data = JSON.parse(body);
        console.log("===Movie===");
        console.log("``````````````````````");
        console.log("Title ==> " + data.Title);
        console.log("Released ==> " + data.Year);
        console.log("IMDB Rating ==> " + data.Ratings[0].Value);
        console.log("Rotten Tomatoes ==> " + data.Ratings[1].Value);
        console.log("Country ==> " + data.Country);
        console.log("Language ==> " + data.Language);
        console.log("Plot ==> " + data.Plot);
        console.log("Actors ==> " + data.Actors);
        console.log("``````````````````````");
    });
};

function twitter() {
    var Twitter = require('twitter');
    var client = new Twitter(keys.twitter);
    var params = { q: ' ', count: 20 };
    client.get('search/tweets', params, function (error, tweets, response) {
        if (!error) {
            console.log("===Twitter===");
            console.log("``````````````````````");
            for (var i = 0; i < tweets.statuses.length; i++) {
                console.log(tweets.statuses[i].created_at + ": " + tweets.statuses[i].text);
            }
            console.log("``````````````````````");
        }
    });
};

function spotify(songname) {
    var spotify = new Spotify(keys.spotify);
    if (!songname) {
        songname = ""
        for (var i = 3; i < process.argv.length; i++) {
            songname += " " + process.argv[i];
        }
    }
    spotify.search({ type: 'track', query: songname }, function (err, data) {
        if (err) {
            return console.log('Error: ' + err);
        }
        console.log("===Spotify===");
        console.log("``````````````````````");
        console.log("Artist(s) ==> " + data.tracks.items[1].artists[0].name);
        console.log("Song ==> " + data.tracks.items[1].name);
        console.log("Listen on Spotify ==> " + data.tracks.items[1].album.external_urls.spotify);
        console.log("Album ==> " + data.tracks.items[1].album.name);
        console.log("``````````````````````");
    });
};
function random() {
    var fs = require("fs");
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            console.log("Error: " + error);
        }
        var dataArr = data.split(",");
        spotify(dataArr[1]);
    });
}