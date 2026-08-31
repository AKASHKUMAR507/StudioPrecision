export const PROJECTS = [
  {
    slug: 'seeds',
    tag: 'Fintech',
    title: 'Seeds',
    summary:
      'A micro-lending loan management app enabling loans up to ₹3L for small business owners and women entrepreneurs, built around a three-role field approval workflow.',
    tags: ['React Native', 'OCR', 'Geolocation'],
    hero: {
      badge: 'FINTECH APP',
      description:
        'End-to-end development of a micro-financing platform used across a multi-role approval workflow — from field data capture to final credit validation.',
      liveUrl: null,
    },
    challenge: {
      title: 'Manual, Fragmented Loan Approvals',
      description:
        'Small-business and women-led loan applications required data capture, identity verification, and credit checks to be coordinated across three separate field roles, with no unified digital workflow.',
    },
    solution: {
      title: 'Multi-Role Approval Workflow',
      description:
        'Built a three-role workflow — Regional Officer (Aadhaar/PAN OCR, Equifax CIBIL scoring initiation), Branch Manager (geolocation verification within 100m, voice interviews), and Branch Credit Manager (final validation) — on a reusable custom form-validation framework, with PennyDrop bank verification and Firebase/Sentry.io for distribution and monitoring.',
    },
    stack: [
      { name: 'React Native', role: 'Frontend Framework' },
      { name: 'Equifax CIBIL API', role: 'Credit Scoring' },
      { name: 'Google Maps API', role: 'Geolocation Verification' },
      { name: 'Firebase & Sentry.io', role: 'Distribution & Monitoring' },
    ],
    metrics: [
      { value: '₹3L', label: 'Max Loan Amount' },
      { value: '3', label: 'Approval Roles' },
      { value: '4+', label: 'APIs Integrated' },
    ],
    next: 'worldref',
  },
  {
    slug: 'worldref',
    tag: 'Consumer Apps',
    title: 'WorldRef Mobile Apps',
    summary:
      'Engineered and launched mobile apps on the Play Store and App Store, growing engagement by 25% and reaching a 4.9-star rating while cutting app size by 80%.',
    tags: ['React Native', 'TypeScript', 'Zustand'],
    hero: {
      badge: 'CONSUMER APPS',
      description:
        'End-to-end mobile engineering — a reusable component library and TypeScript-based MVC architecture, UI/UX redesign, and in-app camera capture.',
      liveUrl: 'https://mi9.com/package/com.dealx/',
    },
    challenge: {
      title: 'Slow, Inconsistent Delivery',
      description:
        'The existing codebase lacked a shared component library or consistent architecture, slowing feature delivery and leaving the app bloated and harder to maintain.',
    },
    solution: {
      title: 'Reusable Architecture & UX Overhaul',
      description:
        'Built a reusable React Native component library on a TypeScript-based MVC architecture, redesigned the UI/UX, and added in-app vision-camera capture, while integrating Sentry, Zustand, and AsyncStorage for faster, more reliable data handling.',
    },
    stack: [
      { name: 'React Native', role: 'Frontend Framework' },
      { name: 'TypeScript', role: 'MVC Architecture' },
      { name: 'Zustand', role: 'State Management' },
      { name: 'Sentry', role: 'Error Tracking' },
    ],
    metrics: [
      { value: '25%', label: 'Engagement Growth' },
      { value: '4.9', label: 'App Store Rating' },
      { value: '80%', label: 'App Size Reduction' },
    ],
    next: 'mobiloitte-projects',
  },
  {
    slug: 'mobiloitte-projects',
    tag: 'Internship',
    title: 'Component Library & API Layer',
    summary:
      'Designed accessible, reusable UI components in React Native and integrated REST APIs with Axios, cutting development time by 40%.',
    tags: ['React Native', 'JavaScript', 'Axios'],
    hero: {
      badge: 'REACT NATIVE INTERNSHIP',
      description:
        'Early hands-on work building a reusable component library and connecting front-end screens to backend services during a React Native internship at Mobiloitte.',
      liveUrl: null,
    },
    challenge: {
      title: 'Repetitive UI Work',
      description:
        'Screens across the app rebuilt similar UI patterns from scratch, with no standard way to wire front-end views to backend data.',
    },
    solution: {
      title: 'Shared Component Library',
      description:
        'Designed a reusable, accessible component library in React Native and JavaScript, and integrated REST APIs with Axios for consistent front-end/back-end communication.',
    },
    stack: [
      { name: 'React Native', role: 'Frontend Framework' },
      { name: 'JavaScript', role: 'Core Language' },
      { name: 'Axios', role: 'REST API Integration' },
    ],
    metrics: [{ value: '40%', label: 'Faster Development Time' }],
    next: 'seeds',
  },
]

export function getProjectBySlug(slug) {
  return PROJECTS.find((project) => project.slug === slug)
}
