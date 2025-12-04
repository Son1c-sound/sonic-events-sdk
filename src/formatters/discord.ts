export function formatForDiscord(data: any) {
  return {
    timestamp: new Date().toISOString(),
    ...data
  };
}