export function getPreviousDayTimestamp() {
  const currentDate = new Date();
  const previousDate = new Date(currentDate);
  previousDate.setDate(currentDate.getDate() - 1);
  return previousDate.toISOString();
}
