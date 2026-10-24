// Sample data — replace with a backend later. Edit titles, images, times here.
import network from "@/assets/path-network.jpg";
import hacking from "@/assets/path-hacking.jpg";
import crypto from "@/assets/path-crypto.jpg";
import forensics from "@/assets/path-forensics.jpg";

export type Lesson = { id: string; title: string; minutes: number };
export type Pathway = {
  id: string;
  title: string;
  image: string;
  short: string;
  description: string;
  estimatedTime: string;
  lessons: Lesson[];
};

const mk = (pid: string, titles: string[]): Lesson[] =>
  titles.map((t, i) => ({ id: `${pid}-${i + 1}`, title: t, minutes: 20 + ((i * 7) % 25) }));

export const pathways: Pathway[] = [
  {
    id: "network-security",
    title: "Network Security",
    image: network,
    short: "Learn how data moves and how to defend the networks that carry it.",
    description:
      "Placeholder: Explore the fundamentals of networking, from packets and protocols to firewalls and intrusion detection. You'll build a mental model of how traffic flows and learn to spot and stop suspicious activity.",
    estimatedTime: "6 weeks · ~18 hours",
    lessons: mk("network-security", [
      "How the Internet Works",
      "The OSI & TCP/IP Models",
      "Ports, Protocols & Services",
      "Firewalls and Segmentation",
      "Intrusion Detection Basics",
      "Securing Wi‑Fi Networks",
    ]),
  },
  {
    id: "ethical-hacking",
    title: "Ethical Hacking",
    image: hacking,
    short: "Think like an attacker to find weaknesses before others do.",
    description:
      "Placeholder: Learn the mindset and methodology of penetration testers. Practice reconnaissance, scanning, and responsible disclosure in safe lab environments.",
    estimatedTime: "8 weeks · ~24 hours",
    lessons: mk("ethical-hacking", [
      "Ethics and the Law",
      "Reconnaissance",
      "Scanning with Nmap",
      "Common Web Vulnerabilities",
      "Password Attacks",
      "Writing a Pentest Report",
    ]),
  },
  {
    id: "cryptography",
    title: "Cryptography",
    image: crypto,
    short: "Uncover the math and ideas that keep secrets secret.",
    description:
      "Placeholder: From ancient ciphers to modern public-key systems, discover how encryption protects data at rest and in transit.",
    estimatedTime: "5 weeks · ~15 hours",
    lessons: mk("cryptography", [
      "Classical Ciphers",
      "Symmetric Encryption",
      "Hash Functions",
      "Public‑Key Cryptography",
      "Digital Signatures & TLS",
    ]),
  },
  {
    id: "digital-forensics",
    title: "Digital Forensics",
    image: forensics,
    short: "Investigate incidents and follow the digital evidence trail.",
    description:
      "Placeholder: Learn how investigators collect, preserve, and analyze digital evidence after a security incident.",
    estimatedTime: "6 weeks · ~20 hours",
    lessons: mk("digital-forensics", [
      "Intro to Incident Response",
      "Evidence & Chain of Custody",
      "File Systems Deep Dive",
      "Memory Analysis",
      "Log Analysis",
      "Building a Timeline",
    ]),
  },
];

export const getPathway = (id: string) => pathways.find((p) => p.id === id);
export const getLesson = (lessonId: string) => {
  for (const p of pathways) {
    const l = p.lessons.find((x) => x.id === lessonId);
    if (l) return { pathway: p, lesson: l };
  }
};
