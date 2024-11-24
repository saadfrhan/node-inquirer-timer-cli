#!/usr/bin/env node
import { input, select } from "@inquirer/prompts";
import {
  displayTimerStatus,
  formatStopwatchTime,
  loadState,
  removeLeadingZeroAndConvertIntoNumber,
  removeTheLatestState,
  saveState,
  validateFormat,
} from "./utils";
import notifier from "node-notifier";

async function start() {
  try {
    const choice = await select({
      message: "Select what you want to start?",
      choices: [
        { name: "Stopwatch", value: "stopwatch" },
        { name: "Timer", value: "timer" },
        { name: "Help", value: "help" },
        { name: "Exit", value: "exit" },
      ],
    });

    if (choice === "timer") {
      await startTimer();
    } else if (choice === "stopwatch") {
      await startStopwatch();
    } else if (choice === "help") {
      displayHelp();
      start();
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
  const savedState = loadState();
  let minutes, seconds;

  if (savedState && savedState.type === "timer") {
    minutes = savedState.minutes;
    seconds = savedState.seconds;
    console.log("Loaded saved timer state.");
  } else {
    const time = await input({
      message: "Enter timer duration in this format minutes:seconds",
      validate: (val) =>
        validateFormat(val) ||
        "You must enter in correct format. minutes:seconds",
    });

    const givenTime = time.split(":");
    minutes = removeLeadingZeroAndConvertIntoNumber(givenTime[0]!);
    seconds = removeLeadingZeroAndConvertIntoNumber(givenTime[1]!);
  }

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
          notifier.notify({
            title: "Timer",
            message: "Timer completed!",
            sound: true,
          });
          return;
        }
        remainingSeconds = 59;
        remainingMinutes--;
      } else {
        remainingSeconds--;
      }
      displayTimerStatus(remainingMinutes, remainingSeconds);
      saveState({
        type: "timer",
        minutes: remainingMinutes,
        seconds: remainingSeconds,
      });
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
    } else if (key.toString() === "r") {
      clearInterval(timeInterval);
      process.stdin.removeAllListeners("data");
      removeTheLatestState("timer");
      startTimer();
    }
  });
}

async function startStopwatch() {
  const savedState = loadState();
  let seconds = 0;
  let minutes = 0;
  let isPaused = false;
  let laps: string[] = [];

  if (savedState && savedState.type === "stopwatch") {
    console.log("Loaded saved stopwatch state.");
    seconds = savedState.seconds;
    minutes = savedState.minutes;
    laps = savedState.laps;
  }

  const stopwatchInterval = setInterval(() => {
    if (!isPaused) {
      console.clear();
      console.log(formatStopwatchTime(0, minutes, seconds));
      console.log(
        "\nPress 'p' to pause/resume, 'l' to record lap, 'q' to quit, 'r' to reset the stopwatch."
      );

      seconds++;

      if (seconds === 60) {
        seconds = 0;
        minutes++;
      }
      saveState({ type: "stopwatch", minutes, seconds, laps });
    }
  }, 1000);

  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.on("data", (key) => {
    if (key.toString() === "p") {
      isPaused = !isPaused;
      console.log(isPaused ? "Stopwatch paused" : "Stopwatch resumed");
    } else if (key.toString() === "l") {
      const lapTime = formatStopwatchTime(0, minutes, seconds);
      laps.push(lapTime);
      console.log(`Lap recorded: ${lapTime}`);
    } else if (key.toString() === "q") {
      clearInterval(stopwatchInterval);
      process.stdin.removeAllListeners("data");
      console.log("Laps recorded:");
      laps.forEach((lap, index) => console.log(`Lap ${index + 1}: ${lap}`));
      start();
    } else if (key.toString() === "r") {
      clearInterval(stopwatchInterval);
      process.stdin.removeAllListeners("data");
      removeTheLatestState("stopwatch");
      startStopwatch();
    }
  });
}

function displayHelp() {
  console.log(`
    Timer and Stopwatch CLI
    =======================
    Commands:
      - Timer: Start a countdown timer
      - Stopwatch: Start a stopwatch
      - Help: Display this help message
      - Exit: Exit the application

    Timer Controls:
      - p: Pause/Resume the timer
      - q: Quit the timer
      - r: Reset the timer

    Stopwatch Controls:
      - p: Pause/Resume the stopwatch
      - l: Record a lap
      - q: Quit the stopwatch
      - r: Reset the stopwatch
  `);
}

start();
