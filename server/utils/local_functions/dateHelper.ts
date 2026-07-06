/**
 * Helper function to format ISO date strings to user-friendly time.
 */
export function formatTime(isoString: string): string {
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return "";
  
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
