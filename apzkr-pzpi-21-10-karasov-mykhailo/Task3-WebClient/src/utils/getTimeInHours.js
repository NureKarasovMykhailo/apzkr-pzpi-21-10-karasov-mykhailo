export function getTimeInHours(seconds) {
    const hours = Math.floor(seconds / 3600);
    const remainingSeconds = seconds % 3600;
    const minutes = Math.floor(remainingSeconds / 60);

    const formattedHours = hours.toString();
    const formattedMinutes = minutes.toString();

    return `${formattedHours}:${formattedMinutes}`;
}