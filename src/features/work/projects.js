const BASE_URL = import.meta.env.BASE_URL

export const PROJECTS = [
  {
    slug: 'worldref',
    tag: 'Consumer Apps',
    title: 'WorldRef Mobile Apps',
    summary:
      'Engineered and launched mobile apps on the Play Store and App Store, growing engagement by 25% and reaching a 4.9-star rating while cutting app size by 80%.',
    tags: ['React Native', 'TypeScript', 'Zustand'],
    thumbnail: `${BASE_URL}images/work/worldref/cover.webp`,
    hero: {
      badge: 'CONSUMER APPS',
      description:
        'End-to-end mobile engineering — a reusable component library and TypeScript-based MVC architecture, UI/UX redesign, and in-app camera capture.',
      liveUrl: 'https://mi9.com/package/com.dealx/',
      image: `${BASE_URL}images/work/worldref/cover.webp`,
    },
    screenshots: [
      { src: `${BASE_URL}images/work/worldref/screen-interface.png`, alt: 'WorldRef app order list screen showing a user-friendly, easy-to-navigate procurement interface' },
      { src: `${BASE_URL}images/work/worldref/screen-tracking.png`, alt: 'WorldRef app live order tracking screen with a real-time delivery timeline' },
      { src: `${BASE_URL}images/work/worldref/screen-notifications.png`, alt: 'WorldRef app instant notifications screen showing payment and delivery updates' },
      { src: `${BASE_URL}images/work/worldref/screen-metrics.png`, alt: 'WorldRef app performance metrics screen showing on-time delivery score' },
    ],
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
    next: 'seeds',
  },
  {
    slug: 'seeds',
    tag: 'Fintech',
    title: 'Seeds',
    summary:
      'A micro-lending loan management app enabling loans up to ₹3L for small business owners and women entrepreneurs, built around a three-role field approval workflow.',
    tags: ['React Native', 'OCR', 'Geolocation'],
    thumbnail: `${BASE_URL}images/work/seeds/thumbnail.jpg`,
    hero: {
      badge: 'FINTECH APP',
      description:
        'End-to-end development of a micro-financing platform used across a multi-role approval workflow — from field data capture to final credit validation.',
      liveUrl: null,
      image: `${BASE_URL}images/work/seeds/screen-customer-account.jpg`,
    },
    screenshots: [
      { src: `${BASE_URL}images/work/seeds/screen-customer-account.jpg`, alt: 'Seeds Finance app Home screen showing approved credit limit and account overview' },
      { src: `${BASE_URL}images/work/seeds/screen-customer-profile.jpg`, alt: 'Seeds Finance app Profile & Settings screen showing suppliers, transactions, and support' },
      { src: `${BASE_URL}images/work/seeds/screen-customer-transactions.jpg`, alt: 'Seeds Finance app My Transactions screen showing tranche payment history and status' },
      { src: `${BASE_URL}images/work/seeds/screen-customer-tranche-request.jpg`, alt: 'Seeds Finance app New Tranche Request screen for selecting a supplier' },
      { src: `${BASE_URL}images/work/seeds/screen-officer-home.jpg`, alt: 'Seeds Officer app Home dashboard showing leads and application counts' },
      { src: `${BASE_URL}images/work/seeds/screen-officer-applications.jpg`, alt: 'Seeds Officer app Applications screen showing pending, completed, and rejected applications' },
      { src: `${BASE_URL}images/work/seeds/screen-officer-application.jpg`, alt: 'Seeds Officer app Application Details screen showing loan application upload progress' },
      { src: `${BASE_URL}images/work/seeds/screen-officer-tranche-details.jpg`, alt: 'Seeds Officer app Tranche Details screen showing payment history and status' },
      { src: `${BASE_URL}images/work/seeds/screen-officer-map.jpg`, alt: 'Seeds Officer app Supplier Location screen showing a pinned map location' },
      { src: `${BASE_URL}images/work/seeds/screen-officer-login.jpg`, alt: 'Seeds Officer app employee login screen' },
    ],
    challenge: {
      title: 'Manual, Fragmented Loan Approvals',
      description:
        'Small-business and women-led loan applications required data capture, identity verification, and credit checks to be coordinated across three separate field roles, with no unified digital workflow.',
    },
    solution: {
      title: 'Multi-Role Approval Workflow',
      description:
        'Built a three-role workflow — Regional Officer (Aadhaar/PAN OCR, Equifax CIBIL scoring initiation), Branch Manager (geolocation verification within 100m, voice interviews), and Branch Credit Manager (final validation) — on a reusable custom form-validation framework, with PhonePe and Penny Drop for bank verification, Digio for KYC/CKYC/VKYC and document eSign, and Firebase/Sentry.io for distribution and monitoring.',
    },
    companionApp: {
      title: 'Seeds Officer',
      description:
        'A field app built for the loan officers running the approval workflow — managing leads, applications, tranches, and supplier visits from a single dashboard while working on the move.',
      liveUrl: null,
      features: [
        { name: 'Leads', description: 'See all leads, follow-ups, and interested prospects on one dashboard.' },
        { name: 'Application Details', description: 'Log a response and notes right after every customer call.' },
        { name: 'Applications', description: 'Filter applications by pending, completed, or rejected — all in one list.' },
        { name: 'Tranche Payments', description: 'Review every credit, status, and transaction ID instantly.' },
        { name: 'Supplier Location', description: 'Pin and save exact supplier locations for every field visit.' },
      ],
    },
    stack: [
      { name: 'React Native', role: 'Frontend Framework' },
      { name: 'Equifax CIBIL API', role: 'Credit Scoring' },
      { name: 'Google Maps API', role: 'Geolocation Verification' },
      { name: 'PhonePe', role: 'Payments' },
      { name: 'Penny Drop', role: 'Bank Account Verification' },
      { name: 'Digio', role: 'KYC, CKYC, VKYC & Document eSign' },
      { name: 'Camera', role: 'Document & Field Capture' },
      { name: 'Firebase Analytics', role: 'Usage Analytics' },
      { name: 'Firebase Crashlytics', role: 'Crash Reporting' },
      { name: 'Firebase Cloud Messaging', role: 'Push Notifications' },
      { name: 'Firebase Remote Config', role: 'Feature Flags & Config' },
      { name: 'Sentry.io', role: 'Error Monitoring' },
    ],
    metrics: [
      { value: '₹3L', label: 'Max Loan Amount' },
      { value: '3', label: 'Approval Roles' },
      { value: '10+', label: 'APIs Integrated' },
    ],
    next: 'psolvi',
  },
  {
    slug: 'psolvi',
    tag: 'Healthtech',
    title: 'Psolvi',
    summary:
      'A unified mental-health platform for India — bringing therapy, self-guided tools, curated content, and a dedicated specialist companion app together into one connected system.',
    tags: ['React Native', 'TypeScript', 'Firebase'],
    thumbnail: `${BASE_URL}images/work/psolvi/thumbnail.png`,
    hero: {
      badge: 'HEALTHTECH',
      description:
        'An organised mental-health system spanning two apps — Psolvi for users, and Psolvi Specialists for verified professionals — replacing the fragmentation of therapy, assessments, and habit tracking living in separate tools.',
      liveUrl: 'https://play.google.com/store/apps/details?id=com.mwellness&pcampaignid=web_share',
      image: `${BASE_URL}images/work/psolvi/hero.png`,
    },
    screenshots: [
      { src: `${BASE_URL}images/work/psolvi/screen-consumer-therapy.png`, alt: 'Psolvi Therapy screen showing specialist search and booking' },
      { src: `${BASE_URL}images/work/psolvi/screen-consumer-tools.png`, alt: 'Psolvi Tools screen showing Mood Map, Habit Tracker, podcasts, and self assessments' },
      { src: `${BASE_URL}images/work/psolvi/screen-consumer-store.png`, alt: 'Psolvi Store screen showing curated wellness products' },
      { src: `${BASE_URL}images/work/psolvi/screen-consumer-edu.png`, alt: 'Psolvi EDU screen showing awareness campaigns and personal journals' },
      { src: `${BASE_URL}images/work/psolvi/screen-specialists-home.png`, alt: 'Psolvi Specialists home dashboard showing availability, resources, and upcoming schedule' },
      { src: `${BASE_URL}images/work/psolvi/screen-specialists-calls.png`, alt: 'Psolvi Specialists calls screen showing recent patient calls' },
      { src: `${BASE_URL}images/work/psolvi/screen-specialists-earnings.png`, alt: 'Psolvi Specialists earnings screen showing monthly earnings and payments' },
    ],
    challenge: {
      title: 'Mental Health Support, Fragmented Across Apps',
      description:
        'Mental health support in India is often divided across multiple apps — therapy in one place, assessments elsewhere, daily habits tracked separately. This fragmentation makes consistency difficult, especially for people balancing work, studies, and family responsibilities.',
    },
    solution: {
      title: 'One System, Five Modules',
      description:
        'Structured Psolvi around five independent modules — Therapy, Tools, Social, Store, and EDU — each working on its own while following the same clean, predictable design, reducing friction and helping users maintain steady routines. The system reflects local realities through accessible pricing, culturally aware specialists, straightforward language, and strong privacy safeguards.',
    },
    modules: [
      {
        name: 'Therapy',
        description:
          'Direct access to verified Psychiatrists (evaluation and medication-related care), Psychologists (counselling and structured therapy), and Expressive Arts Therapists (guided creative techniques). Profiles show qualifications, experience, languages, and availability, with sessions booked and conducted securely in-app and reminders that support regular follow-through.',
      },
      {
        name: 'Tools',
        description:
          'Daily self-monitoring between sessions: My Mood Map for tracking emotional patterns, My Habit Tracker for building routines, an ARTS Suite of short anxiety-relieving audio/video practices, Self Assessments for anxiety, depression, ADHD, PTSD, and OCD, and Quick Games for brief mental resets.',
      },
      {
        name: 'Social',
        description:
          'A focused feed users tune to their own interests — mental health, relationships, lifestyle, fitness, productivity, or creativity — keeping them connected to relevant content instead of general social-platform noise.',
      },
      {
        name: 'Store',
        description:
          'A curated selection of wellness and expressive products that support stress relief, creativity, and reflection, integrating easily alongside therapy or self-guided practice.',
      },
      {
        name: 'EDU',
        description:
          'Jargon-free lessons and audio guides covering mental-health concepts, conditions, coping frameworks, and treatment basics — reliable information made easier to understand and apply.',
      },
    ],
    companionApp: {
      title: 'Psolvi Specialists',
      description:
        "A professional companion app built exclusively for verified mental-health specialists on the platform — for conducting and managing online consultations, and coordinating the day-to-day of a practice in one place. It's intended for healthcare professionals only: it provides no automated medical advice, diagnosis, or treatment recommendations, and isn't meant for patient use.",
      liveUrl: 'https://play.google.com/store/apps/details?id=com.psolvispecialists&pcampaignid=web_share',
      features: [
        { name: 'Availability', description: 'Scheduling and managing availability' },
        { name: 'Upcoming Appointments', description: 'Conducting and managing online consultations' },
        { name: 'Calls', description: 'Coordinating follow-ups and professional communication' },
        { name: 'Journals', description: 'Maintaining in-app journal notes for documentation' },
        { name: 'Earnings', description: 'Tracking earnings and payouts with clear summaries' },
        { name: 'Profile', description: 'Managing profile and account settings' },
      ],
    },
    stack: [
      { name: 'React Native', role: 'Frontend Framework' },
      { name: 'TypeScript', role: 'Type Safety' },
      { name: 'Firebase', role: 'Backend, Auth & Realtime Data' },
      { name: 'Node.js', role: 'Custom Backend Services' },
      { name: 'Razorpay', role: 'Payments' },
      { name: 'Twilio', role: 'Video & Voice Calling' },
      { name: 'Camera', role: 'In-App Media Capture' },
    ],
    metrics: [],
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
    next: 'worldref',
  },
]

export function getProjectBySlug(slug) {
  return PROJECTS.find((project) => project.slug === slug)
}
