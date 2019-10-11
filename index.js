var sad = require("fs");

const axios = require("axios");
const inquirer = require("inquirer");
const generatehtml = require("./generateHTML.js")

// var fs = require('fs'), convertFactory = require('electron-html-to');
// var conversion = convertFactory({ converterPath: convertFactory.converters.PDF });

const fs = require('fs');
const convertFactory = require('electron-html-to');

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

    // console.log(githubusername);
    // console.log(mycolor);

    const queryURL = `https://api.github.com/users/${githubusername}/repos?per_page=100`;
    const queryURL2 = `https://api.github.com/users/${githubusername}`;

    axios.get(queryURL2)
        .then(function (res) {

            let githubandcolorinfo = {
                color: mycolor,
                profileimageurl: res.data.avatar_url,
                username: res.data.name,
                location: res.data.location,
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
                    // console.log(githubandcolorinfo);
                    generatehtml(githubandcolorinfo);



                    sad.writeFile("resume.html", generatehtml(githubandcolorinfo), function (err) {
                        if (err) {
                            return console.log(err);
                        }
                        console.log("Done!");
                    })



                    // conversion({ file: "./resume.html" }, function (err, result) {
                    //     if (err) {
                    //         return console.error(err);
                    //     }

                    //     // console.log(result.numberOfPages);
                    //     // console.log(result.logs);
                    //     result.stream.pipe(fs.createWriteStream('./anywhere.pdf'));
                    //     conversion.kill(); // necessary if you use the electron-server strategy, see bellow for details
                    // });


                    fs.readFile('resume.html', 'utf8', (err, htmlString) => {
                        // add local path in case your HTML has relative paths
                        htmlString = htmlString.replace(/href="|src="/g, match => {
                            return match + './';
                        });
                        const conversion = convertFactory({
                            converterPath: convertFactory.converters.PDF,
                            allowLocalFilesAccess: true
                        });
                        conversion({ html: htmlString }, (err, result) => {
                            if (err) return console.error(err);
                            result.stream.pipe(fs.createWriteStream('./resume.pdf'));
                            conversion.kill(); // necessary if you use the electron-server strategy, see bellow for details
                        });
                    });


                    // var pdf = require('html-pdf');
                    // var html = sad.readFileSync('resume.html', 'utf8');
                    // var options = { format: 'Letter' };
                    // pdf.create(html, options).toFile('pleasework.pdf', function (err, res) {
                    //     if (err) return console.log(err);
                    //     console.log(res);
                });
        })
})

