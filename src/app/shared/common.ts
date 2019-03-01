export const DefaultWidthModal = 1174;
export const defaultIntervalBetweenRangers = 3;
export const defaultBackgroundIndicator = '#00C5DE';

export const fullcalendarSettings = {
  slotDuration: 30
};

export function generateRandomNumber(min, max): number {
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    rand = Math.round(rand);
    return rand;
}