import {Globe, MessageCircleMoreIcon, Search} from "lucide-react";

export const MSGS_PER_PAGE = 20;

export const navLinks = {
  links: [
    {
      title: "Global Chat",
      href: "/global-chat",
    },
  ],
  posts: [
    {
      title: "Buy/Sell",
      href: "/buy-sell",
    },
    {
      title: "Jobs/Hiring",
      href: "/jobs-hiring",
    },
  ],
};

export const FAQs = [
  {title: "FAQ 1", description: "FAQ 1 description"},
  {title: "FAQ 2", description: "FAQ 2 description"},
  {title: "FAQ 3", description: "FAQ 3 description"},
  {title: "FAQ 4", description: "FAQ 4 description"},
  {title: "FAQ 5", description: "FAQ 5 description"},
];

export const features = [
  {
    title: "Global Reach",
    description: "Connect with others from every corner of the world.",
    Icon: Globe,
  },
  {
    title: "Tailored Recommendations",
    description: "we will help you find what you're looking for faster.",
    Icon: Search,
  },
  {
    title: "Real-Time Networking",
    description: "Engage with others in real-time conversations.",
    Icon: MessageCircleMoreIcon,
  },
];
