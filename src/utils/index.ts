export function formatStopwatchTime(hours: number, minutes: number, seconds: number, milliseconds: number) {
	const msFormatted = String(milliseconds).padStart(3, "0");
	return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${msFormatted}`;
}

export function displayTimerStatus(minutes: number, seconds: number, endHours: number, endMinutes: number, endDays: number) {
	console.log(`${minutes}:${seconds}`);
	console.log(`Timer will end at: ${String(endHours).padStart(2, "0")}:${String(endMinutes).padStart(2, "0")} ${endDays === 1 ? `after ${endDays} days.` : ""}`)
}


export function removeLeadingZeroAndConvertIntoNumber(inputString: string) {
	if (inputString.startsWith("0")) {
		return Number(inputString.substring(1));
	}
	return Number(inputString);
}

export function validateFormat(input: string) {
  // Regular expression to match the format number:number
  const regex = /^\d+:\d+$/;

  // Test if the input matches the regular expression
  return regex.test(input);
}