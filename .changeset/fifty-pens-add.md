---
"node-inquirer-timer-cli": minor
---

- Added support for selecting either Stopwatch or Timer functionality.
- For Timer:
  - Users can input timer duration in the format minutes:seconds
  - Improved validation for user input to ensure correct format.
  - When the timer completes, a message "Timer completed!" is displayed.
- For Stopwatch:
  - The stopwatch displays hours, minutes, seconds, and milliseconds.
  - The display is updated every 10 milliseconds.
  - The stopwatch runs continuously until stopped.
