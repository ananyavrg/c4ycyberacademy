// Sample user + dashboard data. Replace with auth/backend later.
import avatar from "@/assets/avatar.jpg";

export const sampleUser = { firstName: "Alex", lastName: "Rivera", avatar };

export const sampleStats = { streakDays: 6, minutesInvested: 742 };

export const sampleActivity = [
  { day: "Mon", minutes: 35 },
  { day: "Tue", minutes: 50 },
  { day: "Wed", minutes: 20 },
  { day: "Thu", minutes: 65 },
  { day: "Fri", minutes: 40 },
  { day: "Sat", minutes: 80 },
  { day: "Sun", minutes: 55 },
];

export const defaultTasks = [
  { id: "d1", text: "Finish one lesson in your top pathway", done: false, custom: false },
  { id: "d2", text: "Write a journal note on something new", done: true, custom: false },
  { id: "d3", text: "Review last week's notes", done: false, custom: false },
];

// Lessons already marked complete (sample progress)
export const defaultCompleted = [
  "network-security-1",
  "network-security-2",
  "network-security-3",
  "ethical-hacking-1",
  "cryptography-1",
  "cryptography-2",
];
