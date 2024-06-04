


export function formatTime(seconds, lng) {


    const hours = Math.floor(seconds / 3600);
    seconds -= hours * 3600;
    const minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;

    const parts = [];
    if (hours > 0) parts.push(hours + " год.");
    if (minutes > 0) parts.push(minutes + " хв.");
    if (seconds > 0) parts.push(seconds + " c.");

    return parts.join(' ');
}