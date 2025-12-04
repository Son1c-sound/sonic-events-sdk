export function formatForSlack(data: any) {
  return {
    timestamp: new Date().toISOString(),
    ...data
  };
}