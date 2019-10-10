const fs = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");
const myrepos = [];

inquirer.prompt([
    {
        type: "input",
        name : "githubusername",
        message: "What is your GitHub UserName?"
    },
    {
        type: "checkbox",
        message : "color?",
        name: "color",
        choices: [
            "green",
            "blue",
            "pink",
            "red"
        ]
    }
]).then(function({githubusername}) {
    const queryURL = `https://api.github.com/users/${githubusername}/repos?per_page=100`;

    axios.get(queryURL)
    .then(function (res){

        console.log(res);
        // * Profile image
        let image = res.data[0].avatar_url;
        // * User name
        let username = githubusername;
        // * Links to the following:
        //     * User location via Google Maps
        //     * User GitHub profile
        //     * User blog
        // * User bio
        // * Number of public repositories
        // * Number of followers
        //  Number of GitHub stars
        // * Number of users following

        // for (let i = 0; i < res.data.length; i++)
        // {
        //     myrepos.push(res.data[i].name)
        // }
        // console.log(myrepos);


    })


    // fs.writeFile("test.txt", JSON.stringify(data, null),function(err){
    //     if(err){
    //         return console.log(err);
    //     }
    //     console.log("success");
    // });

});