export type BuilderStep = "brand" | "classes" | "instructors" | "reviews" | "publish";

export type Workshop = {
  id: number;
  title: string;
  date: string;
  location: string;
  price: string;
  capacity: string;
  description: string;
};

export type Instructor = {
  id: number;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
};

export type Review = {
  id: number;
  quote: string;
  author: string;
};

export type BuilderState = {
  theme: string;
  primaryColor: string;
  accentColor: string;
  name: string;
  email: string;
  location: string;
  studioName: string;
  slug: string;
  headline: string;
  bio: string;
  styles: string[];
  studioLocations: string;
  services: string;
  logoUrl: string;
  photoUrl: string;
  importUrl: string;
  paymentMethod: string;
  paymentHandle: string;
  workshops: Workshop[];
  instructors: Instructor[];
  reviews: Review[];
};

export const storageKey = "beyond8-phase-one-builder";

export const styleOptions = ["Bollywood", "Semi-classical", "Hip-hop", "Kids", "Wedding", "Fitness"];

export const themeOptions = [
  "Luxury performance",
  "Warm community",
  "Bold Bollywood",
  "Elegant classical",
];

export const defaultBuilderState: BuilderState = {
  theme: "Luxury performance",
  primaryColor: "#c2185b",
  accentColor: "#28123d",
  name: "Tanvi Shah",
  email: "tanvi@example.com",
  location: "New York, NY",
  studioName: "Tanvi Dance Academy",
  slug: "tanvi",
  headline: "Bollywood classes with stage energy, clean technique, and a community that feels personal.",
  bio: "Tanvi helps dancers feel expressive, confident, and prepared. Her classes blend joyful choreography with clear coaching, so beginners feel welcomed and returning dancers keep growing.",
  styles: ["Bollywood", "Semi-classical", "Kids"],
  studioLocations: "Manhattan studio, Jersey City studio, online private coaching",
  services: "Workshops\nPrivate coaching\nWedding choreography\nShowcase team training",
  logoUrl: "/brand/beyond8-icon-gradient.webp",
  photoUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1400&q=85",
  importUrl: "https://example.com/current-workshops",
  paymentMethod: "Venmo",
  paymentHandle: "@TanviDance",
  workshops: [
    {
      id: 1,
      title: "Bollywood Beginner",
      date: "Sat 11:00 AM",
      location: "Manhattan",
      price: "$25",
      capacity: "24",
      description: "A high-energy class for new dancers who want clean foundations and choreography that feels great.",
    },
    {
      id: 2,
      title: "Kids Showcase Team",
      date: "Sun 10:00 AM",
      location: "Jersey City",
      price: "$180",
      capacity: "18",
      description: "A confidence-building program for kids preparing a polished showcase routine.",
    },
    {
      id: 3,
      title: "Wedding Choreo Intensive",
      date: "Thu 7:30 PM",
      location: "Online",
      price: "$95",
      capacity: "12",
      description: "Learn a joyful, camera-ready routine for sangeet, reception, or family performances.",
    },
  ],
  instructors: [
    {
      id: 1,
      name: "Tanvi Shah",
      role: "Lead choreographer",
      bio: "Bollywood and semi-classical instructor focused on musicality, expression, and confidence.",
      imageUrl: "https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=700&q=85",
    },
    {
      id: 2,
      name: "Maya Patel",
      role: "Kids program instructor",
      bio: "Warm, structured coaching for young dancers learning stage presence and teamwork.",
      imageUrl: "https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?auto=format&fit=crop&w=700&q=85",
    },
  ],
  reviews: [
    {
      id: 1,
      quote: "The class felt organized before I even arrived. I knew where to go, how to pay, and what to expect.",
      author: "Neha R.",
    },
    {
      id: 2,
      quote: "Tanvi makes choreography feel approachable, polished, and genuinely fun.",
      author: "Maya S.",
    },
    {
      id: 3,
      quote: "Our wedding routine looked incredible, and the whole family actually enjoyed learning it.",
      author: "Ari P.",
    },
  ],
};

export function loadBuilderState(): BuilderState {
  if (typeof window === "undefined") return defaultBuilderState;
  try {
    const saved = window.localStorage.getItem(storageKey);
    return saved ? normalizeBuilderState(JSON.parse(saved)) : defaultBuilderState;
  } catch {
    return defaultBuilderState;
  }
}

export function saveBuilderState(state: BuilderState) {
  window.localStorage.setItem(storageKey, JSON.stringify(state));
}

export function normalizeBuilderState(value: Partial<BuilderState>): BuilderState {
  return {
    ...defaultBuilderState,
    ...value,
    workshops: value.workshops?.map((workshop) => ({
      ...workshop,
      description: workshop.description || "A clear, bookable dance offer for students.",
    })) ?? defaultBuilderState.workshops,
    instructors: value.instructors ?? defaultBuilderState.instructors,
    reviews: value.reviews ?? defaultBuilderState.reviews,
    slug: value.slug || slugify(value.studioName || defaultBuilderState.studioName),
  };
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40) || "studio";
}

export function lines(value: string) {
  return value.split("\n").map((item) => item.trim()).filter(Boolean);
}
