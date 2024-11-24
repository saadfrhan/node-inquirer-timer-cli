#!/usr/bin/env node
import { input, select } from "@inquirer/prompts";
import {
  displayTimerStatus,
  formatStopwatchTime,
  removeLeadingZeroAndConvertIntoNumber,
  validateFormat,
} from "./utils";

async function start() {
  try {
    const choice = await select({
      message: "Select what you want to start?",
      choices: [
        { name: "Stopwatch", value: "stopwatch" },
        { name: "Timer", value: "timer" },
        { name: "Exit", value: "exit" },
      ],
    });

    if (choice === "timer") {
      await startTimer();
    } else if (choice === "stopwatch") {
      await startStopwatch();
    } else {
      process.exit(0);
    }
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "ExitPromptError") {
        process.exit(0);
      } else {
        console.error(error.message);
        process.exit(1);
      }
    }
  }
}

async function startTimer() {
  const time = await input({
    message: "Enter timer duration in this format minutes:seconds",
    validate: (val) =>
      validateFormat(val) || "You must enter in correct format. minutes:seconds",
  });

  const givenTime = time.split(":");
  const minutes = removeLeadingZeroAndConvertIntoNumber(givenTime[0]!);
  const seconds = removeLeadingZeroAndConvertIntoNumber(givenTime[1]!);

  let remainingSeconds = seconds;
  let remainingMinutes = minutes;
  let isPaused = false;

  const timeInterval = setInterval(() => {
    if (!isPaused) {
      console.clear();
      if (remainingSeconds === 0) {
        if (remainingMinutes === 0) {
          clearInterval(timeInterval);
          console.log("Timer completed!");
          return;
        }
        remainingSeconds = 59;
        remainingMinutes--;
      } else {
        remainingSeconds--;
      }
      displayTimerStatus(remainingMinutes, remainingSeconds);
    }
  }, 1000);

  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.on("data", (key) => {
    if (key.toString() === "p") {
      isPaused = !isPaused;
      console.log(isPaused ? "Timer paused" : "Timer resumed");
    } else if (key.toString() === "q") {
      clearInterval(timeInterval);
      process.stdin.removeAllListeners("data");
      start();
    }
  });
}

async function startStopwatch() {
  let seconds = 0;
  let minutes = 0;
  let isPaused = false;

  const stopwatchInterval = setInterval(() => {
    if (!isPaused) {
      console.clear();
      console.log(formatStopwatchTime(0, minutes, seconds));
      console.log("\nPress 'p' to pause/resume, 'q' to quit");

      seconds++;

      if (seconds === 60) {
        seconds = 0;
        minutes++;
      }
    }
  }, 1000);

  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.on("data", (key) => {
    if (key.toString() === "p") {
      isPaused = !isPaused;
      console.log(isPaused ? "Stopwatch paused" : "Stopwatch resumed");
    } else if (key.toString() === "q") {
      clearInterval(stopwatchInterval);
      process.stdin.removeAllListeners("data");
      start();
    }
  });
}

start();