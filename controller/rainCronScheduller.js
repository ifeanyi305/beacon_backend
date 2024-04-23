const schedule = require('node-schedule')
const colors = require('colors');
const { createServer } = require("node:http");
const { Server } = require("socket.io")
const express = require('express');

const server = createServer(express())
    const io = new Server(server, {
        cors: {
            origin: "https://dotplayplay.netlify.app"
            // origin: "http://localhost:5173"
        }
    });

const date = () => {
    // Get today's date
    let today = new Date();

    let todayYear = today.getFullYear();
    let todayMonth = today.getMonth() + 1; // Adding 1 because months are zero-indexed
    let todayDay = today.getDate();

    let hours = today.getHours();
    let minutes = today.getMinutes();
    let seconds = today.getSeconds();

    const executedTime = todayYear + "-" + todayMonth + "-" + todayDay + ":" + hours + "-" + minutes + "-" + seconds;
    return executedTime
}
const task = (fireDate) => {
    // console.log(colors.green.underline("[Rain-Drop] Dripping Task Triggered Every Minutes for Testing ===>", fireDate).italic)
    // Get the socket instance from the other file
    io.emit('coinRain', "Its another six (6) hours, Time for Coin Rain");
}
const rainScheduler = () => {
    // console.log(colors.cyan.underline("Sending A [Rain-Drop] Every six(6) Hours to Run at ===>", date()).italic)
    const job = schedule.scheduleJob('* * * * *', (fireDate) => {
        task(fireDate)
    })
}

rainScheduler()


process.on('SIGINT', () => {
    schedule.gracefulShutdown()
    .then(() => process.exit(0))
})