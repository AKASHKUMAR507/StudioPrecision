export const POSTS = [
  {
    slug: 'optimizing-flatlist',
    title: 'Optimizing FlatList for 10k+ items',
    date: '2024-05-12',
    dateLabel: 'May 12, 2024',
    readTime: '6 min read',
    tags: ['Performance', 'React Native'],
    excerpt:
      "A deep dive into memory management and windowing techniques in React Native. Exploring initialNumToRender, maxToRenderPerBatch, and windowSize to maintain 60fps on low-end Android devices while rendering massive data sets.",
    body: [
      {
        type: 'paragraph',
        text: "Rendering large lists in React Native is a notoriously tricky endeavor. When your FlatList data array crosses the threshold of a few hundred items, you might start noticing frame drops during rapid scrolling. By the time you hit 10,000 items, unoptimized lists will bring the JavaScript thread to its knees. Let's explore a systematic approach to reclaiming your 60fps target.",
      },
      { type: 'heading', text: 'The Anatomy of a Bottleneck' },
      {
        type: 'paragraph',
        text: 'The core issue stems from how React Native bridges communication between the JS thread and the native UI thread. Every time a new item scrolls into view, React must render the component, reconcile the virtual DOM, serialize the commands, and send them across the bridge. If the items are complex or if React is constantly re-rendering items that haven’t changed, the bridge becomes clogged.',
      },
      {
        type: 'code',
        filename: 'OptimizedList.tsx',
        code: `import React, { useCallback } from 'react';
import { FlatList, ListRenderItem } from 'react-native';

const ITEM_HEIGHT = 80;

export const OptimizedList = ({ data }) => {
  // 1. Stable key extractor
  const keyExtractor = useCallback((item) => item.id.toString(), []);

  // 2. Pre-calculated layout dimensions
  const getItemLayout = useCallback(
    (_, index) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }),
    []
  );

  // 3. Memoized render function
  const renderItem: ListRenderItem<DataItem> = useCallback(({ item }) => {
    return <MemoizedListItem data={item} />;
  }, []);

  return (
    <FlatList
      data={data}
      keyExtractor={keyExtractor}
      getItemLayout={getItemLayout}
      renderItem={renderItem}
      removeClippedSubviews={true}
      initialNumToRender={10}
      maxToRenderPerBatch={5}
      windowSize={5}
    />
  );
};`,
      },
      {
        type: 'paragraph',
        text: 'By implementing getItemLayout, we bypass the dynamic measurement phase entirely. This is arguably the single most impactful optimization you can make, provided your list items have a fixed height. Coupling this with proper memoization of the render function ensures that we only pay the rendering tax exactly once per unique item state.',
      },
    ],
    prevSlug: null,
    nextSlug: 'native-modules',
  },
  {
    slug: 'native-modules',
    title: 'Bridging the Gap: Custom Native Modules',
    date: '2024-04-28',
    dateLabel: 'April 28, 2024',
    readTime: '8 min read',
    tags: ['JSI', 'C++', 'Swift'],
    excerpt:
      "When JS isn't enough—writing high-performance C++ and Swift bridges. A practical guide to circumventing the JavaScript bridge for computationally heavy tasks, complete with JSI implementation examples.",
    body: [
      {
        type: 'paragraph',
        text: "When JS isn't enough—writing high-performance C++ and Swift bridges. A practical guide to circumventing the JavaScript bridge for computationally heavy tasks, complete with JSI implementation examples.",
      },
    ],
    prevSlug: 'optimizing-flatlist',
    nextSlug: 'fintech-security',
  },
  {
    slug: 'fintech-security',
    title: 'Fintech Security Patterns',
    date: '2024-04-15',
    dateLabel: 'April 15, 2024',
    readTime: '5 min read',
    tags: ['Security', 'Fintech'],
    excerpt:
      'Implementing biometric auth and secure storage for banking apps. Reviewing best practices for Keychain/Keystore utilization, memory wiping, and guarding against reverse engineering in React Native applications.',
    body: [
      {
        type: 'paragraph',
        text: 'Implementing biometric auth and secure storage for banking apps. Reviewing best practices for Keychain/Keystore utilization, memory wiping, and guarding against reverse engineering in React Native applications.',
      },
    ],
    prevSlug: 'native-modules',
    nextSlug: null,
  },
]

export function getPostBySlug(slug) {
  return POSTS.find((post) => post.slug === slug)
}
