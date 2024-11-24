export function formatStopwatchTime(hours: number, minutes: number, seconds: number) {
	return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function displayTimerStatus(minutes: number, seconds: number) {
	console.log(`${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}\n`);

  console.log("Press 'p' to pause/resume, 'q' to quit, 'r' to set a new timer.");
}


export function removeLeadingZeroAndConvertIntoNumber(inputString: string) {
	if (inputString.startsWith("0")) {
		return Number(inputString.substring(1));
	}
	return Number(inputString);
}

export function validateFormat(input: string) {
  const regex = /^\d+:\d+$/;
  return regex.test(input);
}