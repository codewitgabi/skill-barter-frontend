import type { IExchangeRequest } from "@/types/dashboard";

export function generateMockRequests(count: number): Array<IExchangeRequest> {
  const skills = [
    "Graphic Design",
    "Korean Language",
    "Photography",
    "Yoga",
    "Guitar",
    "Web Development",
    "Spanish",
    "Cooking",
    "Data Science",
    "React Development",
    "UI/UX Design",
    "Python Programming",
    "Music Theory",
    "Fitness Training",
    "French",
    "JavaScript",
    "Digital Marketing",
    "Video Editing",
    "Writing",
    "Drawing",
  ];

  const wantsToLearn = [
    "React Development",
    "Cooking",
    "Web Development",
    "Spanish",
    "Data Science",
    "Graphic Design",
    "Photography",
    "Korean Language",
    "Yoga",
    "Guitar",
    "Python Programming",
    "UI/UX Design",
    "Music Theory",
    "Fitness Training",
    "French",
    "JavaScript",
    "Digital Marketing",
    "Video Editing",
    "Writing",
    "Drawing",
  ];

  const names = [
    "John Smith",
    "Lisa Park",
    "Michael Chen",
    "Sarah Johnson",
    "David Martinez",
    "Emma Wilson",
    "James Brown",
    "Maria Garcia",
    "Alex Thompson",
    "Sophie Lee",
    "Ryan Davis",
    "Olivia White",
    "Noah Taylor",
    "Ava Anderson",
    "Liam Jackson",
    "Isabella Harris",
    "Ethan Clark",
    "Mia Lewis",
    "Mason Walker",
    "Charlotte Hall",
  ];

  const messages = [
    "I'd love to exchange skills! I have 5+ years of experience.",
    "Looking to teach in exchange for learning. Available for virtual sessions.",
    "Professional with extensive experience. Can teach from beginner to advanced.",
    "Native speaker here! Looking for a skill exchange opportunity.",
    "Certified instructor seeking language exchange. Available for in-person sessions.",
    "Passionate about teaching and learning. Let's exchange skills!",
    "Experienced professional looking to share knowledge and learn something new.",
    "Available for virtual or in-person sessions. Flexible schedule.",
    "10+ years of experience. Can teach from basics to advanced levels.",
    "Looking for a learning partner. I'm patient and enthusiastic!",
  ];

  const times = [
    "2 hours ago",
    "5 hours ago",
    "1 day ago",
    "2 days ago",
    "3 days ago",
    "4 days ago",
    "5 days ago",
    "1 week ago",
    "2 weeks ago",
    "3 weeks ago",
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    from:
      names[i % names.length] +
      (i >= names.length ? ` ${Math.floor(i / names.length) + 1}` : ""),
    skill: skills[i % skills.length],
    wantsToLearn: wantsToLearn[i % wantsToLearn.length],
    message: messages[i % messages.length],
    avatar: "/placeholder-avatar.jpg",
    time: times[i % times.length],
  }));
}
