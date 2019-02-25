#!/usr/bin/env node

const shell = require("shelljs");
const colors = require("colors");
const fs = require("fs");
const templates = require("./templates/templates");

const appName = process.argv[2];
const appDirectory = `${process.cwd()}/${appName}`;

const createReactApp = () => {
    return new Promise(resolve => {
        if (appName) {
            shell.exec(`create-react-app ${appName}`, () => {
                console.log("created the basics");
                resolve(true);
            });
        } else {
            console.log("\nForgot to tell me your awesome app name?".red);
            console.log("\nProvide an app name in the following format: ");
            console.log("\ncreate-react-app-full ", "app-name\n".cyan);
            resolve(false);
        }
    });
};

const installPackages = () => {
    return new Promise(resolve => {
        console.log("\nDoing some magic...".cyan);
        shell.exec(`cd ${appName} && npm i react-router react-router-dom prop-types axios`, () => {
            resolve(true);
        });
        resolve(true);
    });
};

const updateTemplates = () => {
    return new Promise(resolve => {
        let promise = [];
        Object.keys(templates).forEach((fileName, i) => {
            promise[i] = new Promise(res => {
                fs.writeFile(`${appDirectory}/src/${fileName}`, templates[fileName], (error) => {
                    if (error)
                        return console.log(error);
                    res();
                });
            });
        });
        Promise.all(promise).then(()=>{
            console.log("\nMagic done! You can now start with your React app develpment. Have Fun!".green);
            resolve();
        })
    });
};

const run = async () => {
    let success = await createReactApp();
    if (!success) {
        console.log("Something went wrong while trying to create a new React app using create-react-app".red);
        return false;
    }
    await installPackages();
    await updateTemplates();
};

run();