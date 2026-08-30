export const PROJECTS = [
  {
    slug: 'ledge-pay',
    tag: 'Fintech',
    title: 'Ledge Pay',
    summary:
      'Solving complex cross-border settlements with a resilient, offline-first mobile architecture. Rebuilt the core transaction engine to handle highly volatile network conditions.',
    tags: ['React Native', 'Redux', 'TypeScript'],
    hero: {
      badge: 'FINTECH APP',
      description:
        'A seamless React Native mobile application designed to simplify cross-border transactions for modern freelancers and remote teams.',
    },
    challenge: {
      title: 'Fragmented Workflows',
      description:
        'Freelancers were juggling multiple apps to track invoices, receive payments, and manage expenses, leading to delayed payments and high conversion fees.',
    },
    solution: {
      title: 'Unified Ecosystem',
      description:
        'We architected a centralized React Native platform that integrates real-time ledger management with instant multi-currency settlement APIs, wrapped in a frictionless UI.',
    },
    stack: [
      { name: 'React Native (Expo)', role: 'Frontend Framework' },
      { name: 'TypeScript', role: 'Type Safety' },
      { name: 'Zustand', role: 'State Management' },
      { name: 'Stripe Connect API', role: 'Payment Infrastructure' },
    ],
    metrics: [
      { value: '2.5M', label: 'Transactions Processed' },
      { value: '4.9', label: 'App Store Rating' },
      { value: '40%', label: 'Faster Load Times' },
    ],
    next: 'vitalis',
  },
  {
    slug: 'vitalis',
    tag: 'Health Tech',
    title: 'Vitalis',
    summary:
      'Real-time patient monitoring for remote clinics. Engineered custom Native Modules for reliable Bluetooth Low Energy (BLE) peripheral communication and WebSockets for live telemetry streams.',
    tags: ['Native Modules', 'WebSockets', 'BLE'],
    hero: {
      badge: 'HEALTH TECH',
      description:
        'A remote patient-monitoring app streaming live vitals from bedside devices to clinicians over resilient WebSocket connections.',
    },
    challenge: {
      title: 'Unreliable Device Telemetry',
      description:
        'Remote clinics relied on manual vitals logging, so critical changes in patient condition surfaced late and BLE peripherals dropped connection under real-world network conditions.',
    },
    solution: {
      title: 'Native BLE Bridge',
      description:
        'We engineered custom Native Modules for reliable Bluetooth Low Energy peripheral communication paired with a WebSocket layer for continuous, low-latency telemetry streaming to clinicians.',
    },
    stack: [
      { name: 'React Native', role: 'Frontend Framework' },
      { name: 'Native Modules', role: 'BLE Bridge' },
      { name: 'WebSockets', role: 'Live Telemetry' },
      { name: 'Redux', role: 'State Management' },
    ],
    metrics: [
      { value: '99.9%', label: 'Connection Uptime' },
      { value: '<200ms', label: 'Telemetry Latency' },
      { value: '30+', label: 'Clinics Onboarded' },
    ],
    next: 'index-c',
  },
  {
    slug: 'index-c',
    tag: 'Cataloging',
    title: 'Index-C',
    summary:
      'High-performance inventory management for large-scale retail environments. Utilized Realm for ultra-fast local search and established robust CI/CD pipelines for daily internal distribution.',
    tags: ['React Native', 'Realm DB', 'CI/CD'],
    hero: {
      badge: 'CATALOGING',
      description:
        'A high-performance inventory management app built for large-scale retail environments with thousands of SKUs per store.',
    },
    challenge: {
      title: 'Slow, Offline-Unfriendly Search',
      description:
        'Store associates needed to search massive product catalogs instantly, even on unreliable warehouse Wi-Fi, but the legacy web portal required a constant connection and could not keep up.',
    },
    solution: {
      title: 'Local-First Catalog',
      description:
        'We rebuilt the catalog on Realm for ultra-fast local search and indexing, with daily internal CI/CD distribution keeping every store on the latest inventory data without a full reinstall.',
    },
    stack: [
      { name: 'React Native', role: 'Frontend Framework' },
      { name: 'Realm DB', role: 'Local-First Storage' },
      { name: 'CI/CD', role: 'Daily Distribution' },
      { name: 'TypeScript', role: 'Type Safety' },
    ],
    metrics: [
      { value: '10k+', label: 'SKUs Indexed Locally' },
      { value: '120ms', label: 'Avg. Search Time' },
      { value: '200+', label: 'Store Devices' },
    ],
    next: 'ledge-pay',
  },
]

export function getProjectBySlug(slug) {
  return PROJECTS.find((project) => project.slug === slug)
}
