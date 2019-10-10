const fs = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");
const generatehtml = require("./generateHTML.js")
//console.log(generatehtml);
let watchers = [];

inquirer.prompt([
    {
        type: "input",
        name: "githubusername",
        message: "What is your GitHub UserName?"
    },
    {
        type: "checkbox",
        message: "color?",
        name: "mycolor",
        choices: [
            "green",
            "blue",
            "pink",
            "red"
        ]
    }
]).then(function ({ githubusername, mycolor }) {

    console.log(githubusername);
    console.log(mycolor);

    const queryURL = `https://api.github.com/users/${githubusername}/repos?per_page=100`;
    const queryURL2 = `https://api.github.com/users/${githubusername}`;

    axios.get(queryURL2)
        .then(function (res) {

            let githubandcolorinfo = {
                color: mycolor,
                profileimageurl: res.data.avatar_url,
                username: res.data.login,
                location: res.data.avatar_url,
                profilelink: res.data.html_url,
                blog: res.data.blog,
                bio: res.data.bio,
                publicrepos: res.data.public_repos,
                followers: res.data.followers,
                following: res.data.following,
            };
            // * Profile image
            //console.log("profile image" + res.data.avatar_url);
            // * User name
            //console.log("username" + res.data.login);
            // * Links to the following:
            //     * User location via Google Maps
            //console.log("location" + res.data.location);
            //     * User GitHub profile
            //console.log("profile link" + res.data.html_url)
            //     * User blog
            //console.log("blog" + res.data.blog);
            // * User bio
            //console.log("bio" + res.data.bio);
            // * Number of public repositories
            //console.log("public repos" + res.data.public_repos);
            // * Number of followers
            //console.log("followers" + res.data.followers);
            // * Number of users following
            //console.log("following" + res.data.following);

            axios.get(queryURL)
                .then(function (res) {
                    for (let i = 0; i < res.data.length; i++) {
                        watchers.push(res.data[i].watchers_count);
                    }
                    //console.log(watchers);
                    let totalwatchers = watchers.reduce((a, b) => a + b);
                    //  Number of GitHub stars
                    //console.log("watches/stars" + totalwatchers);

                    // fs.writeFile("myselection.txt",)
                    githubandcolorinfo.stars = totalwatchers;
                    console.log(githubandcolorinfo);
                    generatehtml(githubandcolorinfo);
                })
        })
});
