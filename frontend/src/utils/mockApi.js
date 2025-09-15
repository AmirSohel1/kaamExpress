// Simulate API calls with dummy data and delay
export const mockFetch = (data, delay = 400) =>
  new Promise((resolve) => setTimeout(() => resolve(data), delay));
