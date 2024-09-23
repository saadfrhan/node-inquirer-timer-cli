#!/usr/bin/env node
import { input, select } from "@inquirer/prompts";

import {
  displayTimerStatus,
  formatStopwatchTime,
  removeLeadingZeroAndConvertIntoNumber,
  validateFormat,
} from "./utils";

async function start() {
  const choice = await select({
    message: "Select what you want to start?",
    choices: [
      {
        name: "Stopwatch",
        value: "stopwatch",
      },
      {
        name: "Timer",
        value: "timer",
      },
    ],
  });

  if (choice === "timer") {
    // Ask for timer duration
    const time = await input({
      message: "Enter timer duration in this format minutes:seconds",
      validate: (val) =>
        validateFormat(val) ||
        "You must enter in correct format. minutes:seconds",
    });

    // Format user input
    const givenTime = time.split(":");
    const minutes = removeLeadingZeroAndConvertIntoNumber(givenTime[0]!);
    const seconds = removeLeadingZeroAndConvertIntoNumber(givenTime[1]!);

    // Calculate days
    const endDays = minutes / 60 / 24;

    // Get original time
    const originalTime = new Date();
    const originalHours = originalTime.getHours();
    const originalMinutes = originalTime.getMinutes();

    // Clone given seconds and minutes in mutating variables
    let remainingSeconds = seconds;
    let remainingMinutes = minutes;

    // Calculate timer end time
    const newMinutes = (originalMinutes + remainingMinutes) % 60;
    const additionalHours = Math.floor(
      (originalMinutes + remainingMinutes) / 60
    );
    const newHours = (originalHours + additionalHours) % 24;

    const timeInterval = setInterval(() => {
      console.clear();
      if (remainingSeconds === 60 || remainingSeconds === 0) {
        remainingSeconds = 59;
      } else {
        remainingSeconds--;
      }
      displayTimerStatus(
        remainingMinutes,
        remainingSeconds,
        newHours,
        newMinutes,
        endDays
      );
      if (remainingSeconds < 0) {
        remainingSeconds = 59;
        remainingMinutes--;

        if (remainingSeconds < 0) {
          clearInterval(timeInterval);
          console.log("Timer completed!");
        }
      }
    }, 1000);
  } else {
    let milliseconds = 0;
    let seconds = 0;
    let minutes = 0;

    function updateTimer() {
      console.clear();
      console.log(formatStopwatchTime(0, minutes, seconds, milliseconds));

      milliseconds += 10;

      if (milliseconds >= 1000) {
        milliseconds = 0;
        seconds++;
      }

      if (seconds === 60) {
        seconds = 0;
        minutes++;
      }
    }

    setInterval(updateTimer, 10);
  }
}

start();
