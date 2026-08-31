const BASE_URL = import.meta.env.BASE_URL

export const POSTS = [
  {
    slug: 'optimizing-flatlist',
    title: 'Optimizing FlatList for 10k+ items',
    date: '2024-05-12',
    dateLabel: 'May 12, 2024',
    readTime: '16 min read',
    tags: ['Performance', 'React Native'],
    excerpt:
      "A deep dive into windowing, the JS-to-native bridge, and every FlatList tuning prop that actually matters — plus a guided tour of the alternatives (FlashList, RecyclerListView, react-native-big-list, Legend List, and plain ScrollView) for when FlatList itself isn't enough.",
    body: [
      {
        type: 'paragraph',
        text: "Rendering large lists in React Native is a notoriously tricky endeavor. When your data array crosses a few hundred items, you might start noticing frame drops during rapid scrolling. By the time you hit 10,000 items, an unoptimized list will bring the JS thread to its knees. This is a full walkthrough: how virtualization actually works under the hood, every FlatList prop worth tuning, and — since FlatList isn't always the right tool — a tour of the alternatives that exist specifically because FlatList has limits.",
      },

      { type: 'heading', text: 'How Virtualization Actually Works' },
      {
        type: 'paragraph',
        text: "A list of 10,000 rows does not mean 10,000 native views exist on screen. FlatList (and everything built like it) uses a technique called windowing, or virtualization: only the rows currently visible, plus a small buffer above and below, are ever mounted as real native components. Everything else exists purely as plain JavaScript data in the `data` array — no view, no layout, no memory cost — until it scrolls close enough to need rendering.",
      },
      {
        type: 'image',
        src: `${BASE_URL}images/blog/flatlist-windowing.png`,
        alt: 'Diagram showing a row of 20 list items, most greyed out as off-screen, a light teal buffer zone, and a dark teal visible-on-screen zone in the middle',
        caption: 'Only the visible rows plus a windowSize buffer are ever mounted as real native views.',
      },
      {
        type: 'paragraph',
        text: "As you scroll, FlatList mounts new cells entering the window and unmounts cells leaving it, continuously sliding this window across the data array. That's the whole trick — and it's also exactly where the cost comes from, because mounting isn't free.",
      },

      { type: 'heading', text: 'Where the Frame Budget Goes' },
      {
        type: 'paragraph',
        text: "Every time a new row scrolls into the window, React has to render the component, reconcile it, and hand the resulting native commands to the host platform. In the classic (non-Fabric) bridge architecture, that hand-off is a real, measurable cost: commands are serialized to JSON, queued, sent across the bridge, deserialized on the other side, then measured, laid out, and painted by the native UI thread.",
      },
      {
        type: 'image',
        src: `${BASE_URL}images/blog/flatlist-bridge-flow.png`,
        alt: 'Diagram showing JS Thread flowing through a Bridge (serialize and batch, then deserialize) into the Native UI Thread',
        caption: 'Every mounted cell pays this round trip once — cheap alone, expensive at 10k rows and 60 scrolls/second.',
      },
      {
        type: 'paragraph',
        text: 'If your items are complex, or if React keeps re-rendering rows that haven\'t actually changed, this pipeline clogs and frames start dropping. Everything below exists to reduce how much work crosses this pipeline, and how often.',
      },

      { type: 'heading', text: "Tuning FlatList's Core Props" },
      { type: 'subheading', text: 'getItemLayout — skip the measurement pass entirely' },
      {
        type: 'paragraph',
        text: "By default, FlatList has to measure each row after it renders to know where it sits in the scroll container. getItemLayout lets you tell it the answer up front — if every row has a fixed height, this is a pure function of the index, so FlatList can skip measurement completely and jump straight to any offset. This is arguably the single most impactful optimization available, provided your rows have a predictable (even if not literally fixed) height.",
      },
      { type: 'subheading', text: 'keyExtractor — a stable identity per row' },
      {
        type: 'paragraph',
        text: "React reconciles list children by key. An unstable or missing key (falling back to array index) makes React treat every reorder or insert as a full remount of everything after the change point. A stable key derived from the item's own id lets React correctly diff which rows actually changed.",
      },
      { type: 'subheading', text: 'renderItem — memoize the actual cell component' },
      {
        type: 'paragraph',
        text: "renderItem itself being wrapped in useCallback only stops FlatList's own props from changing identity — it does nothing for the cell component underneath. Wrap the row component in React.memo (or use a PureComponent) so a parent re-render doesn't cascade into re-rendering every currently-mounted row.",
      },
      {
        type: 'code',
        filename: 'OptimizedList.tsx',
        code: `import React, { useCallback } from 'react';
import { FlatList, ListRenderItem } from 'react-native';

const ITEM_HEIGHT = 80;

const MemoizedListItem = React.memo(function ListItem({ data }) {
  return <Row data={data} />;
});

export const OptimizedList = ({ data }) => {
  // stable identity per row — no fallback to array index
  const keyExtractor = useCallback((item) => item.id.toString(), []);

  // skip the measurement pass entirely — fixed row height
  const getItemLayout = useCallback(
    (_, index) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }),
    []
  );

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
      updateCellsBatchingPeriod={50}
      windowSize={5}
    />
  );
};`,
      },
      {
        type: 'table',
        headers: ['Prop', 'What it controls', 'Tuning notes'],
        rows: [
          ['initialNumToRender', 'Rows rendered synchronously on first mount', 'Set it to roughly what fills one screen — too high delays first paint.'],
          ['maxToRenderPerBatch', 'Rows rendered per batch while scrolling', 'Lower values keep each frame cheaper but take more batches to fill the window.'],
          ['updateCellsBatchingPeriod', 'Delay (ms) between render batches', 'Higher values trade a bit of latency for fewer, larger batches — good for weaker devices.'],
          ['windowSize', 'How many "screens" worth of content stay rendered above/below the viewport', 'Default is 21 (10 above, 10 below, 1 visible) — often overkill; 5–7 is common for heavy rows.'],
          ['removeClippedSubviews', 'Detaches native views that scroll fully offscreen (Android-focused)', 'Frees native memory faster, but can occasionally clip views mid-transition — test it.'],
        ],
      },
      {
        type: 'note',
        text: 'These props interact with each other — a smaller windowSize with a larger maxToRenderPerBatch behaves very differently from the reverse. Change one at a time and profile on a real low-end device, not the simulator.',
      },

      { type: 'heading', text: 'Beyond FlatList: The Alternatives' },
      {
        type: 'paragraph',
        text: "Tuning props gets you a long way, but FlatList has a structural ceiling: it mounts and unmounts a fresh component instance for every row that crosses the window boundary. A newer generation of list libraries instead recycles a small, fixed pool of component instances and just swaps the data bound to them — no mount, no unmount, no new native view allocation as you scroll.",
      },
      {
        type: 'image',
        src: `${BASE_URL}images/blog/flatlist-recycling.png`,
        alt: 'Side-by-side diagram: left panel shows FlatList/ScrollView creating and destroying new CellComponent instances; right panel shows FlashList/RecyclerListView reusing a fixed pool of instances with content swapped',
        caption: 'Mounting a new instance per row vs. recycling a fixed pool and swapping their content.',
      },
      { type: 'subheading', text: 'ScrollView — no virtualization at all' },
      {
        type: 'paragraph',
        text: "ScrollView renders every single child up front, all at once, with no windowing whatsoever. It's the right tool when the content is genuinely short and fully known (a settings screen, a short form) — never for a data-driven list that could grow past a couple dozen items. At 10,000 rows, a ScrollView will mount 10,000 native views immediately and the app will hang or crash.",
      },
      { type: 'subheading', text: 'FlatList & VirtualizedList — the React Native core' },
      {
        type: 'paragraph',
        text: 'FlatList is a thin, ergonomic wrapper around VirtualizedList, the lower-level primitive that actually implements windowing (SectionList, for grouped/sectioned data, is the other wrapper around the same primitive). This is what everything in this post so far has been about — solid, well-supported, ships with React Native itself, but bound by the mount/unmount model above.',
      },
      { type: 'subheading', text: 'FlashList — @shopify/flash-list' },
      {
        type: 'paragraph',
        text: "Shopify's drop-in FlatList replacement, built on a recycling model descended from RecyclerListView's core ideas but with a much simpler API — in most cases it's close to a prop-for-prop swap from FlatList. FlashList v2 (a ground-up rewrite) is the current version and only runs on React Native's New Architecture; it measures every item automatically, so the size-estimation props v1 required are gone entirely. The same discipline that made FlatList fast still applies — a stable keyExtractor and a memoized row component matter just as much here, since recycling only helps if the recycled component itself isn't re-rendering for no reason.",
      },
      {
        type: 'code',
        filename: 'OptimizedFlashList.tsx',
        code: `import React, { useCallback } from 'react';
import { FlashList, ListRenderItem } from '@shopify/flash-list';

const MemoizedListItem = React.memo(function ListItem({ data }) {
  return <Row data={data} />;
});

export const OptimizedFlashList = ({ data }) => {
  // stable identity per row — same reasoning as FlatList's keyExtractor
  const keyExtractor = useCallback((item) => item.id.toString(), []);

  // memoized so recycled cells don't re-render for an unrelated parent update
  const renderItem: ListRenderItem<DataItem> = useCallback(({ item }) => {
    return <MemoizedListItem data={item} />;
  }, []);

  // for lists with more than one row shape — lets FlashList recycle
  // a "message" cell only into another "message" cell, never into a "header"
  const getItemType = useCallback((item) => item.type, []);

  return (
    <FlashList
      data={data}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      getItemType={getItemType}
      // v2 measures every item itself — no estimatedItemSize needed.
      // overrideItemLayout still exists in v2, but only for spans now
      // (e.g. a "header" row spanning all columns in a grid); it no
      // longer accepts a size hint the way v1's did
      overrideItemLayout={(layout, item) => {
        if (item.type === 'header') layout.span = numColumns;
      }}
      // trims work for rows that are offscreen but still in the
      // recycling pool — raise this for chat-style lists that insert
      // many rows above the viewport at once
      drawDistance={250}
    />
  );
};`,
      },
      {
        type: 'table',
        headers: ['Prop', 'What it controls', 'Tuning notes'],
        rows: [
          ['getItemType', 'Which recycling pool a row draws from', 'Essential once a list mixes row shapes — recycling a header into a tall card (and back) is more expensive than not recycling at all.'],
          ['overrideItemLayout', 'Column span for a row, in v2 (size hints were removed)', 'Use it to make a specific row (e.g. a section header) span every column in a grid-style FlashList.'],
          ['drawDistance', 'How far outside the viewport rows stay mounted (px)', 'Lower trims memory/render work; too low causes visible blank flashes on fast flings. Bump it for chat-style prepend-heavy lists.'],
        ],
      },
      {
        type: 'note',
        text: "v2 is a breaking change from v1: estimatedItemSize, estimatedListSize, and the size hint in overrideItemLayout are all gone, and it requires the New Architecture. If a project is still on the legacy architecture or an older FlashList version, the v1 estimatedItemSize-based API still applies — check Shopify's migration guide before assuming this example works as-is.",
      },
      { type: 'subheading', text: 'RecyclerListView — recyclerlistview' },
      {
        type: 'paragraph',
        text: "Originally built at Flipkart and the library FlashList's recycling model is conceptually descended from. It exposes the recycling machinery directly (layout providers, view types, data providers) rather than hiding it behind a FlatList-shaped API, which makes it more powerful for genuinely complex, multi-type layouts — grids mixed with rows, masonry-style lists — at the cost of a steeper learning curve and more verbose setup.",
      },
      {
        type: 'code',
        filename: 'RecyclerListViewExample.tsx',
        code: `import { RecyclerListView, DataProvider, LayoutProvider } from 'recyclerlistview';

const dataProvider = new DataProvider((r1, r2) => r1.id !== r2.id).cloneWithRows(data);

const layoutProvider = new LayoutProvider(
  () => 0, // single view type
  (type, dim) => { dim.width = SCREEN_WIDTH; dim.height = 80; }
);

<RecyclerListView
  dataProvider={dataProvider}
  layoutProvider={layoutProvider}
  rowRenderer={(type, item) => <Row data={item} />}
/>`,
      },
      { type: 'subheading', text: 'react-native-big-list' },
      {
        type: 'paragraph',
        text: "A smaller, community-maintained library aimed squarely at very large, mostly-uniform data sets. It's not a cell-recycling library like FlashList/RecyclerListView — it's a more aggressively-tuned virtualization layer with built-in support for headers, footers, sections, and empty states without pulling in SectionList separately. Worth evaluating for simpler, single-column data where you want more virtualization control than FlatList's props expose without adopting a full recycler API.",
      },
      { type: 'subheading', text: 'Legend List — @legendapp/list' },
      {
        type: 'paragraph',
        text: "The newest entrant here, from the team behind Legend State. It takes a different approach again: rather than fixed-height recycling pools, it's built to handle variable-height content well (chat threads, feeds with mixed media) while still avoiding FlatList's full remount cost, and it's designed to integrate cleanly with Legend State's fine-grained reactivity if you're already using it. Younger and less battle-tested in production than FlashList or RecyclerListView, but worth watching for feed-style, variable-height UIs specifically.",
      },
      {
        type: 'table',
        headers: ['Library', 'Recycles views?', 'Best for', 'Trade-off'],
        rows: [
          ['ScrollView', 'No — renders everything', 'Short, fully-known content', 'Unusable past a few dozen items'],
          ['FlatList / SectionList', 'No — mounts/unmounts per row', 'General-purpose lists, ships with RN', 'Mount/unmount cost caps performance ceiling'],
          ['FlashList', 'Yes', 'Drop-in FlatList upgrade, most row shapes', 'v2 requires the New Architecture; v1-only projects use an older, estimate-based API'],
          ['RecyclerListView', 'Yes', 'Complex multi-type layouts, grids/masonry', 'More setup, steeper API than FlatList-shaped libraries'],
          ['react-native-big-list', 'No — tuned virtualization, not recycling', 'Very large, mostly-uniform single-column data', 'Smaller community than FlashList/RecyclerListView'],
          ['Legend List', 'Partial — optimized for variable height', 'Chat/feed UIs with variable-height content', 'Newest option, least production track record'],
        ],
      },

      { type: 'heading', text: 'Choosing the Right Tool' },
      {
        type: 'list',
        items: [
          "Content is short and fixed (a form, a settings page): ScrollView — virtualization would be pure overhead.",
          'A general list, a few hundred to a couple thousand rows, reasonably uniform: FlatList, properly tuned with getItemLayout, keyExtractor, and memoized rows — no need to reach further.',
          'Tens of thousands of rows, or visibly dropped frames on a tuned FlatList: FlashList first — it is the lowest-effort upgrade with the best-supported recycling model.',
          'Complex, mixed-type layouts (grids, masonry, multiple cell shapes in one list): RecyclerListView — it exposes exactly the controls that kind of layout needs.',
          "A chat thread or feed with genuinely variable-height content: Legend List is worth evaluating, with FlashList's auto-sizing v2 recycler as the more battle-tested fallback.",
        ],
      },
      {
        type: 'paragraph',
        text: "None of these substitute for profiling on the actual lowest-end device your users carry. Measure dropped frames before optimizing, change one prop or one library at a time, and measure again — the right choice depends on your row complexity and data shape far more than on which library has the most GitHub stars.",
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
    nextSlug: 'mobile-security-fintech-healthtech',
  },
  {
    slug: 'mobile-security-fintech-healthtech',
    title: 'Securing React Native Apps for Fintech & Healthtech',
    date: '2026-08-31',
    dateLabel: 'August 31, 2026',
    readTime: '35 min read',
    tags: ['Security', 'React Native', 'Fintech'],
    excerpt:
      "A field guide to the security controls that actually matter once a React Native app touches money or health data — signing, secure storage, token rotation, certificate pinning, tamper detection, compliance, and the testing practices that catch regressions before an auditor does.",
    body: [
      {
        type: 'paragraph',
        text: "Most React Native security advice stops at 'use HTTPS and don't hardcode your API key.' That's necessary but nowhere near sufficient once an app is moving money or storing PHI. This is a working reference for the controls I keep coming back to on fintech and healthtech builds — what each one actually protects against, what it doesn't, and the implementation details that trip people up in practice. It's long by design: treat it as a checklist you can return to per feature, not a single sitting read.",
      },

      { type: 'heading', text: '1. App Signing — Android Keystore & iOS Certificates' },
      { type: 'subheading', text: 'What?' },
      {
        type: 'paragraph',
        text: "Every Android and iOS app is cryptographically signed before it can be installed or updated. On Android that's a keystore (.jks/.keystore) file; on iOS it's a certificate and provisioning profile chain managed through your Apple Developer account. The signature is the OS's way of proving an app really came from its developer.",
      },
      { type: 'subheading', text: 'Why?' },
      {
        type: 'paragraph',
        text: 'Two reasons this matters, and both are security-critical, not just build-pipeline plumbing:',
      },
      {
        type: 'list',
        ordered: true,
        items: [
          "Identity & anti-impersonation — the OS won't run an unsigned or mismatched-signature app, which stops attackers from repackaging your app as a fake.",
          "Update integrity — an update can only overwrite an existing app if it's signed with the same key. This is the exact mechanism that prevents someone from pushing a malicious 'update' to a banking or health app on a user's device.",
          "For fintech/healthtech specifically: losing or leaking a signing key isn't a minor incident — it can mean permanent loss of app identity (Android legacy) or a full re-provisioning of every device (iOS), and a leaked key can be used to sign malware that impersonates your app.",
        ],
      },
      { type: 'subheading', text: 'How?' },
      { type: 'subheading', text: 'Android: two signing models' },
      {
        type: 'paragraph',
        text: "Legacy signing means you hold the keystore file directly — if it's lost or leaked, you can never update that app identity again. Play App Signing, the current standard, has you sign with an upload key while Google holds the real app signing key and re-signs on their end. If your upload key leaks, you revoke and replace it in Play Console and the app identity survives. This is the safer model and should be your default.",
      },
      {
        type: 'code',
        filename: 'shell',
        code: `# Generate a keystore
keytool -genkeypair -v -storetype PKCS12 \\
  -keystore upload-keystore.jks -alias upload \\
  -keyalg RSA -keysize 2048 -validity 10000

# Verify what's signing an APK/AAB
apksigner verify --print-certs app-release.apk`,
      },
      {
        type: 'code',
        filename: 'android/app/build.gradle',
        code: `signingConfigs {
    release {
        // never hardcode passwords here — pull from CI/CD secrets
        storeFile file(System.getenv("KEYSTORE_PATH") ?: "upload-keystore.jks")
        storePassword System.getenv("KEYSTORE_PASSWORD")
        keyAlias System.getenv("KEY_ALIAS")
        keyPassword System.getenv("KEY_PASSWORD")
    }
}`,
      },
      { type: 'subheading', text: 'iOS: a chain of trust, not a single key' },
      {
        type: 'paragraph',
        text: "A certificate signing request goes to Apple, which signs it into a Distribution Certificate; that's bundled with your App ID and entitlements into a Provisioning Profile, which gets embedded in the .ipa. The private key lives in your local Keychain — export a .p12 backup, or you'll be re-issuing certs and re-provisioning every device if that machine is lost. At team scale, fastlane match stores certs and profiles encrypted in a shared repo so everyone uses one source of truth instead of generating their own.",
      },
      {
        type: 'code',
        filename: 'Fastfile',
        code: `lane :release do
  match(type: "appstore", readonly: true)
  build_app(scheme: "MyApp")
end`,
      },

      { type: 'heading', text: '2. Keychain (iOS) & Keystore (Android) — Secure Storage' },
      { type: 'subheading', text: 'What?' },
      {
        type: 'paragraph',
        text: "This is about where sensitive data lives on-device — auth tokens, refresh tokens, biometric flags, PINs. Not regular app data (AsyncStorage/MMKV is fine for that), but the stuff that causes real damage if it leaks: a session token that lets someone impersonate a logged-in user, or a health record cached for offline use.",
      },
      {
        type: 'paragraph',
        text: "iOS Keychain is a system-level encrypted storage service, separate from your app's sandbox — the OS manages the encryption, tied to the device's hardware security. Android Keystore is different in an important way that trips people up: it isn't a place to store your data directly, it's a place to store cryptographic keys that never leave secure hardware. You use those keys to encrypt/decrypt data you then store separately, usually in SharedPreferences or a file. iOS Keychain stores the secret itself; Android Keystore stores the key used to protect the secret, not the secret.",
      },
      { type: 'subheading', text: 'Why?' },
      {
        type: 'paragraph',
        text: "Regular storage isn't encrypted by default and is trivially readable — on a rooted Android device, SharedPreferences XML files can be read in plain text with basic file access. This is where a large share of real mobile breaches happen: not from breaking encryption, but from finding sensitive data that was never encrypted in the first place. A pentest report on a banking app will almost always start by dumping local storage and checking what's readable. Storing a refresh token in AsyncStorage means anyone with physical access, or malware with storage-read permission on a rooted device, gets a token that mints new access tokens indefinitely — no password required.",
      },
      { type: 'subheading', text: 'How?' },
      {
        type: 'paragraph',
        text: "In React Native you don't talk to Keychain/Keystore directly — a library abstracts both platforms behind one API and routes to the right native mechanism underneath.",
      },
      {
        type: 'code',
        filename: 'keychain.ts',
        code: `import * as Keychain from 'react-native-keychain';

// Store
await Keychain.setGenericPassword('auth_token', tokenValue, {
  service: 'com.myapp.auth',
  accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
});

// Retrieve
const credentials = await Keychain.getGenericPassword({ service: 'com.myapp.auth' });
if (credentials) {
  const token = credentials.password;
}

// Remove on logout
await Keychain.resetGenericPassword({ service: 'com.myapp.auth' });`,
      },
      {
        type: 'paragraph',
        text: "On iOS, react-native-keychain calls the native Keychain Services API. The token is encrypted in a system-managed database tied to your app's Keychain access group. WHEN_UNLOCKED_THIS_DEVICE_ONLY means the data is only readable while the device is unlocked, and it won't be restored to a new device from an iCloud/iTunes backup — important for tokens, since you don't want one restored onto a different physical phone. On Android, react-native-keychain uses the Android Keystore system to generate a hardware-backed AES key that, on modern devices, lives in a Trusted Execution Environment or Secure Element and is physically not extractable even with root. The token is encrypted with that key and the ciphertext is stored in SharedPreferences — root the device and read the file, and you still only get ciphertext, because the decryption key never left secure hardware.",
      },
      {
        type: 'note',
        label: 'PII vs. PHI',
        text: "PII (Personally Identifiable Information) is any data that can identify a person — name, email, phone, address, DOB, SSN, IP, device ID. PHI (Protected Health Information) is a HIPAA-specific category: PII plus anything tied to a person's health, treatment, or payment for healthcare — diagnosis, prescriptions, lab results, insurance info, even a name linked to a hospital visit. All PHI is PII, but not all PII is PHI — an email alone is just PII; that same email linked to 'scheduled a cardiology appointment' becomes PHI.",
      },

      { type: 'heading', text: '3. Encrypted Storage for Structured Data' },
      { type: 'subheading', text: 'What?' },
      {
        type: 'paragraph',
        text: "Keychain/Keystore are built for small key-value secrets — one token, one password. For larger structured data — a cached user profile, offline health records, a settings object with sensitive fields — react-native-encrypted-storage is a drop-in encrypted replacement for AsyncStorage: same API shape, but everything written through it is encrypted using the platform's secure key storage underneath.",
      },
      { type: 'subheading', text: 'How?' },
      {
        type: 'code',
        filename: 'secureProfile.ts',
        code: `import EncryptedStorage from 'react-native-encrypted-storage';

async function saveUserProfile(profile) {
  try {
    await EncryptedStorage.setItem('user_profile', JSON.stringify(profile));
  } catch (error) {
    console.error('Failed to save profile securely', error.name); // never log the actual data
  }
}

async function getUserProfile() {
  try {
    const raw = await EncryptedStorage.getItem('user_profile');
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.error('Failed to read profile securely', error.name);
    return null;
  }
}

async function clearSecureStorage() {
  await EncryptedStorage.removeItem('user_profile');
  await EncryptedStorage.clear(); // wipe everything on logout, useful for shared devices
}`,
      },
      {
        type: 'table',
        headers: ['Data type', 'Where it goes'],
        rows: [
          ['Single token or credential', 'react-native-keychain'],
          ['Structured sensitive data (profile, cached PHI/PII)', 'react-native-encrypted-storage'],
          ['Non-sensitive app state (theme, onboarding flags, UI cache)', 'AsyncStorage / MMKV — no encryption needed'],
        ],
      },
      {
        type: 'note',
        text: "Don't reach for encrypted storage by default — it carries more overhead than AsyncStorage/MMKV, and encrypting non-sensitive data like a UI theme preference is unnecessary cost.",
      },

      { type: 'heading', text: '4. Token Refresh Flow & Refresh Token Rotation' },
      { type: 'subheading', text: 'What?' },
      {
        type: 'paragraph',
        text: "This is the mechanism behind staying logged in without re-entering a password every few minutes, while limiting the damage if a token is stolen. An access token is short-lived (5–15 minutes) and sent with every API request. A refresh token is long-lived (days to weeks), stored securely, and used only to mint a new access token — never sent to regular API endpoints. Refresh token rotation means every use of a refresh token also issues a brand-new refresh token and invalidates the old one, so refresh tokens are single-use rather than reusable indefinitely.",
      },
      { type: 'subheading', text: 'Why?' },
      {
        type: 'paragraph',
        text: "The whole design answers one question: if a token is stolen, how much damage happens, and for how long? A single long-lived token means a leak — via logs, a compromised device, a MITM — gives permanent access until manually revoked. Short-lived access tokens cap the blast radius to a few minutes. Rotation adds a second layer: if a stolen refresh token is used by an attacker, the legitimate user's next refresh attempt fails, because their old token was already invalidated by the attacker's use — that failure is your signal that theft happened, and the server can respond by revoking the whole token family and forcing re-login.",
      },
      { type: 'subheading', text: 'How?' },
      {
        type: 'list',
        items: [
          'Login returns a short-lived access_token plus a long-lived refresh_token.',
          'Store access_token in memory (Redux/Context) — never on disk. Store refresh_token in Keychain/Keystore.',
          'Attach access_token to every API request.',
          'On a 401, trigger the refresh flow instead of logging the user out immediately.',
        ],
      },
      {
        type: 'code',
        filename: 'axios-refresh-interceptor.ts',
        code: `import axios from 'axios';
import * as Keychain from 'react-native-keychain';

const api = axios.create({ baseURL: 'https://api.myapp.com' });

let isRefreshing = false;
let refreshQueue = [];

api.interceptors.response.use(
  response => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // queue requests while a refresh is already in progress
        return new Promise((resolve) => {
          refreshQueue.push((newToken) => {
            originalRequest.headers.Authorization = \`Bearer \${newToken}\`;
            resolve(api(originalRequest));
          });
        });
      }

      isRefreshing = true;
      try {
        const creds = await Keychain.getGenericPassword({ service: 'refresh_token' });
        const { data } = await axios.post('https://api.myapp.com/refresh', {
          refresh_token: creds.password,
        });

        // rotation: store the NEW refresh token, discard the old one
        await Keychain.setGenericPassword('refresh_token', data.refresh_token, {
          service: 'refresh_token',
        });

        refreshQueue.forEach((cb) => cb(data.access_token));
        refreshQueue = [];

        originalRequest.headers.Authorization = \`Bearer \${data.access_token}\`;
        return api(originalRequest);
      } catch (refreshError) {
        // refresh token itself was invalid/reused → force logout
        await Keychain.resetGenericPassword({ service: 'refresh_token' });
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);`,
      },

      { type: 'heading', text: '5. Certificate Pinning' },
      { type: 'subheading', text: 'What?' },
      {
        type: 'paragraph',
        text: "Certificate pinning hardcodes which TLS certificate or public key your app trusts for its API, instead of trusting any certificate the device's OS considers valid. Even if a certificate authority is compromised or an attacker obtains a fraudulent-but-technically-valid certificate for your domain, the app refuses to talk to it unless it matches the pin. Normal HTTPS trusts the OS's list of hundreds of CAs; pinning narrows that to 'only this exact certificate, or one signed by this exact key.'",
      },
      { type: 'subheading', text: 'Why?' },
      {
        type: 'paragraph',
        text: "Regular HTTPS protects you from passive eavesdropping, but it doesn't fully protect you from a Man-in-the-Middle (MITM) attack where the attacker presents a valid certificate — one issued by a real (but tricked, compromised, or malicious) CA, or one installed via a malicious root certificate on a rooted/jailbroken device or a corporate MITM proxy. Without pinning, your app has no way to tell the difference between talking to your real API and talking to an attacker sitting in between with a 'legitimate-looking' cert.",
      },
      {
        type: 'paragraph',
        text: 'For fintech/healthtech this is one of the highest-value security controls you can add, because:',
      },
      {
        type: 'list',
        items: [
          "It's specifically what tools like mitmproxy/Charles Proxy/Burp Suite rely on to intercept traffic during a pentest or reverse-engineering attempt — pinning is what stops that cold.",
          'Regulators and security audits (OWASP MASVS) explicitly check for pinning on apps handling financial or health data.',
          'It directly defends against attackers trying to steal the exact tokens you just spent protecting — pinning protects the transport layer that carries those tokens.',
        ],
      },
      { type: 'subheading', text: 'How?' },
      {
        type: 'table',
        headers: ['Strategy', 'What is pinned', 'Trade-off'],
        rows: [
          ['Certificate pinning', 'The exact leaf certificate', 'Breaks the moment you renew your TLS cert — requires an app update before rotation'],
          ['Public key pinning (SPKI)', 'The public key inside the cert', 'Survives cert renewal if you reuse the same key pair — the recommended approach'],
        ],
      },
      {
        type: 'note',
        text: "Always pin the public key, not the full certificate, and pin at least two keys — your current one plus a backup generated but not yet deployed. This is what protects against a pinning lockout, where you renew a cert, forget to ship an app update in time, and your whole user base loses API access.",
      },
      {
        type: 'paragraph',
        text: 'The recommended implementation is native platform config — no extra JS dependency, and it works even for native network calls a JS-level library would miss.',
      },
      {
        type: 'code',
        filename: 'android/app/src/main/res/xml/network_security_config.xml',
        code: `<network-security-config>
    <domain-config>
        <domain includeSubdomains="true">api.myapp.com</domain>
        <pin-set expiration="2027-01-01">
            <pin digest="SHA-256">BASE64_ENCODED_PRIMARY_PUBLIC_KEY_PIN==</pin>
            <pin digest="SHA-256">BASE64_ENCODED_BACKUP_PUBLIC_KEY_PIN==</pin>
        </pin-set>
    </domain-config>
</network-security-config>

<!-- Referenced in AndroidManifest.xml -->
<application android:networkSecurityConfig="@xml/network_security_config" ... >`,
      },
      {
        type: 'code',
        filename: 'Info.plist',
        code: `<key>NSAppTransportSecurity</key>
<dict>
    <key>NSPinnedDomains</key>
    <dict>
        <key>api.myapp.com</key>
        <dict>
            <key>NSPinnedCAIdentities</key>
            <array>
                <dict>
                    <key>SPKI-SHA256-BASE64</key>
                    <string>BASE64_ENCODED_PUBLIC_KEY_PIN==</string>
                </dict>
            </array>
        </dict>
    </dict>
</dict>`,
      },
      {
        type: 'code',
        filename: 'shell — generate the pin hash from your production cert',
        code: `openssl s_client -connect api.myapp.com:443 -servername api.myapp.com < /dev/null 2>/dev/null | \\
openssl x509 -pubkey -noout | \\
openssl pkey -pubin -outform der | \\
openssl dgst -sha256 -binary | \\
openssl enc -base64`,
      },
      {
        type: 'list',
        items: [
          'Always pin at least two public keys — primary and backup — so certs can rotate without an outage.',
          'Set an expiration date on the pin config, with a process to renew before it hits.',
          'Test pinning-failure behavior explicitly: it should hard-fail the request, never silently fall back to unpinned, and never crash the app.',
          "Coordinate pin updates with your backend's cert renewal calendar — this is a cross-team process failure point, not just a code problem.",
        ],
      },

      { type: 'heading', text: '6. Code Obfuscation — ProGuard/R8 for Android' },
      { type: 'subheading', text: 'What?' },
      {
        type: 'paragraph',
        text: 'Obfuscation transforms compiled Android code so it is much harder for a human to read while staying functionally identical. R8 is the modern default in the Android Gradle Plugin, and it obfuscates, shrinks unused code, and optimizes in one pass — renaming classes, methods, and variables to meaningless short names, stripping unused code paths and debug logging, and restructuring control flow to make it harder to follow.',
      },
      { type: 'subheading', text: 'Why?' },
      {
        type: 'paragraph',
        text: "Without obfuscation, anyone can download your APK, run it through a decompiler (jadx, apktool), and get back Java/Kotlin source code that's often readable enough to understand your business logic, find hardcoded values, spot API endpoints, and — most dangerously — find security mistakes you didn't know you'd made.",
      },
      {
        type: 'paragraph',
        text: 'For fintech/healthtech specifically, this matters because:',
      },
      {
        type: 'list',
        items: [
          "It raises the cost of reverse-engineering — a determined attacker can still eventually get through it (obfuscation is not a real security boundary on its own), but it stops casual/automated attacks and slows down serious ones enough to matter.",
          "It's explicitly checked in OWASP MASVS audits — 'resiliency against reverse engineering' is a named control category for regulated apps.",
          'It reduces the chance that hardcoded API keys, internal endpoint names, or business logic (like fraud-detection thresholds) leak to someone poking around a decompiled APK.',
        ],
      },
      {
        type: 'note',
        text: "The honest caveat, and this is an important interview-level nuance: obfuscation is a speed bump, not a lock. Never treat it as your actual security boundary — it should never be the reason sensitive data or keys are 'safe.' That job belongs to Keychain/Keystore, server-side validation, and certificate pinning. Obfuscation just makes casual and automated reverse-engineering harder; it doesn't stop a skilled, motivated attacker.",
      },
      { type: 'subheading', text: 'How?' },
      {
        type: 'code',
        filename: 'android/app/build.gradle',
        code: `android {
    buildTypes {
        release {
            minifyEnabled true        // turns on R8
            shrinkResources true      // removes unused resources too
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}`,
      },
      {
        type: 'paragraph',
        text: "R8 is aggressive by default and will break your app if you don't tell it what to leave alone — especially anything accessed via reflection, which is common in the RN bridge, native modules, and libraries like Firebase, Realm, or crypto libraries.",
      },
      {
        type: 'code',
        filename: 'android/app/proguard-rules.pro',
        code: `# Keep React Native core classes (required — the RN bridge relies on reflection)
-keep class com.facebook.react.** { *; }
-keep class com.facebook.jni.** { *; }

# Keep your own native modules
-keep class com.myapp.nativemodules.** { *; }

# Common libraries that break without keep rules — check each dependency's docs
-keep class com.google.firebase.** { *; }
-keepattributes *Annotation*
-keepattributes Signature`,
      },
      {
        type: 'paragraph',
        text: "You cannot flip minifyEnabled true and assume it works — obfuscation-related crashes only show up in release builds, often only for a specific feature like a native module method that got renamed and broke a bridge call. This is one of the most common 'works in dev, crashes in production' bug classes in React Native. Every obfuscated build also generates a mapping file at app/build/outputs/mapping/release/mapping.txt, which maps obfuscated names back to real code — keep every version, tied to its exact release, or an obfuscated crash trace (a.b.c.onCreate) becomes permanently undebuggable. Crashlytics and Sentry can automate uploading it per build.",
      },
      {
        type: 'code',
        filename: 'shell — verify obfuscation worked',
        code: `cd android && ./gradlew assembleRelease

jadx -d output_folder app-release.apk

# class/method names should be short and meaningless (a, b, c...)
# not your real class names like AuthTokenManager, PatientRecordService`,
      },

      { type: 'heading', text: '7. Payments & Compliance — PCI-DSS, ATT, GDPR' },
      { type: 'subheading', text: 'What?' },
      {
        type: 'paragraph',
        text: 'PCI-DSS is a security standard for protecting payment card information. We generally avoid handling or storing raw card details ourselves and use compliant payment providers.',
      },
      {
        type: 'paragraph',
        text: "App Tracking Transparency is Apple's iOS privacy framework that requires apps to request user permission before tracking users across apps and websites, particularly for advertising-related tracking.",
      },
      {
        type: 'paragraph',
        text: 'GDPR is an EU privacy regulation that governs how organizations collect, process, store, and share personal data and gives users rights such as access, correction, deletion, and objection.',
      },
      { type: 'subheading', text: 'Why?' },
      {
        type: 'paragraph',
        text: 'These three keep showing up together because they all boil down to the same underlying engineering discipline: know exactly what data you’re touching, minimize how much of it you handle directly, and be able to prove or act on that at any time.',
      },
      {
        type: 'list',
        items: [
          "PCI-DSS: if your app code ever sees a raw card number, your entire app falls into a strict compliance scope (audits, encryption requirements, network segmentation). Most companies avoid this entirely by never letting card data touch their own servers or app code — instead using a payment processor's SDK that handles it for you.",
          "ATT: get this wrong (track without consent, or use tracking-adjacent SDKs without declaring them) and Apple will reject your app at review, or pull it later. This isn't optional for any app using ad SDKs, analytics that fingerprint users across apps, or certain attribution tools.",
          "GDPR: a user has a legal right to ask to delete all their data, and you must actually be able to do it — across your database, backups, analytics tools, and any third-party processor you send their data to (Sentry, Mixpanel, etc.). For healthtech this compounds with HIPAA's own retention rules, which sometimes conflict with GDPR deletion rights — a genuinely tricky area senior engineers get asked about.",
        ],
      },
      { type: 'subheading', text: 'How?' },
      { type: 'subheading', text: 'PCI-DSS: reduce scope by never touching the card number' },
      {
        type: 'paragraph',
        text: "If your app code ever sees a raw card number, your entire app falls into strict compliance scope — audits, encryption requirements, network segmentation. Almost every fintech app avoids this by tokenizing on the client with a PCI-compliant SDK (Stripe, Braintree, Adyen), so your app only ever sees a token, never the raw PAN or CVV.",
      },
      {
        type: 'code',
        filename: 'payment.ts',
        code: `// GOOD — Stripe's own UI component collects card details;
// your app never sees the raw card number
import { CardField, useStripe } from '@stripe/stripe-react-native';

const { createPaymentMethod } = useStripe();

async function handlePay() {
  const { paymentMethod, error } = await createPaymentMethod({
    paymentMethodType: 'Card',
  });
  // paymentMethod.id is a token — safe to send to your backend
  await api.post('/charge', { payment_method_id: paymentMethod.id });
}

// BAD — never do this, it pulls you into full PCI-DSS scope
async function handlePayBad(cardNumber, cvv) {
  await api.post('/charge', { card_number: cardNumber, cvv }); // raw PAN over your own network call
}`,
      },
      {
        type: 'paragraph',
        text: "If a card number ever passes through a <TextInput> you control and a network call you write, you're in PCI-DSS scope. Using a native, sandboxed component like Stripe's CardField keeps that data inside their compliant boundary instead of yours.",
      },
      { type: 'subheading', text: 'App Tracking Transparency' },
      {
        type: 'paragraph',
        text: 'Get this wrong — tracking without consent, or using tracking-adjacent SDKs without declaring them — and Apple will reject the app at review or pull it later. This is not optional for any app using ad SDKs, cross-app fingerprinting analytics, or attribution tools.',
      },
      {
        type: 'code',
        filename: 'att.ts',
        code: `import { requestTrackingPermission } from 'react-native-tracking-transparency';

async function requestATT() {
  const status = await requestTrackingPermission();
  // status: 'authorized' | 'denied' | 'restricted' | 'unavailable'

  if (status === 'authorized') {
    initializeAdSDK(); // only initialize tracking SDKs after this
  }
  // if denied: no IDFA access, no cross-app fingerprinting
}`,
      },
      {
        type: 'paragraph',
        text: 'This prompt must appear before any tracking SDK initializes, and Info.plist needs the usage description Apple requires.',
      },
      {
        type: 'code',
        filename: 'Info.plist',
        code: `<key>NSUserTrackingUsageDescription</key>
<string>This identifier will be used to deliver personalized ads to you.</string>`,
      },
      { type: 'subheading', text: "GDPR: the deletion flow you actually have to build" },
      {
        type: 'paragraph',
        text: "The right to erasure is a checklist, not a single delete call — it has to reach your primary database, every third-party processor you send data to, and local device storage.",
      },
      {
        type: 'code',
        filename: 'gdprDeletion.ts',
        code: `async function handleDataDeletionRequest(userId) {
  // 1. Delete/anonymize in your primary database
  await api.post(\`/users/\${userId}/delete\`);

  // 2. Purge from third-party processors
  await analyticsSDK.deleteUser(userId);   // e.g. Mixpanel/Amplitude GDPR delete API
  await crashReportingSDK.clearUserData(); // Sentry/Crashlytics — remove PII association

  // 3. Clear local device storage tied to this user
  await EncryptedStorage.clear();
  await Keychain.resetGenericPassword();

  // 4. Log the deletion event itself for the audit trail — never the deleted data
  await api.post('/audit-log', { event: 'gdpr_deletion', userId, timestamp: Date.now() });
}`,
      },
      {
        type: 'note',
        text: "For healthtech, GDPR's deletion rights can genuinely conflict with HIPAA's own retention requirements — a nuance worth flagging to legal/compliance early rather than assuming one policy covers both.",
      },

      { type: 'heading', text: '8. Biometric Authentication' },
      { type: 'subheading', text: 'What?' },
      {
        type: 'paragraph',
        text: "Face ID, Touch ID, and fingerprint auth all match biometrics in secure hardware — your app never sees the biometric data, only a pass/fail result.",
      },
      { type: 'subheading', text: 'Why?' },
      {
        type: 'paragraph',
        text: "The common mistake is using biometrics as a UI gate only: show a prompt, navigate on success, while the real data was reachable anyway through another path. The correct approach ties biometric success directly to unlocking a stored key, so no code path bypasses it.",
      },
      { type: 'subheading', text: 'How?' },
      {
        type: 'paragraph',
        text: "react-native-keychain handles this rather than a separate library. Store the secret with accessControl: BIOMETRY_CURRENT_SET, so the key auto-locks if enrolled biometrics change — enrolling a new fingerprint makes the old key inaccessible. Retrieving the secret is itself the biometric prompt, a single call rather than two separate steps.",
      },
      {
        type: 'code',
        filename: 'biometricAuth.ts',
        code: `import * as Keychain from 'react-native-keychain';

// Store a secret gated by biometrics
await Keychain.setGenericPassword('auth_token', tokenValue, {
  service: 'com.myapp.auth',
  accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET,
  accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
});

// Retrieving fires the biometric prompt
async function getTokenWithBiometrics() {
  try {
    const credentials = await Keychain.getGenericPassword({
      service: 'com.myapp.auth',
      authenticationPrompt: {
        title: 'Confirm your identity',
        subtitle: 'Use Face ID to access your account',
      },
    });
    return credentials ? credentials.password : null;
  } catch {
    return null; // cancelled, failed, or too many attempts
  }
}

async function checkBiometricSupport() {
  const biometryType = await Keychain.getSupportedBiometryType();
  // 'FaceID' | 'TouchID' | 'Fingerprint' | null
  return biometryType || 'fallback_to_pin';
}

// A production app always needs a non-biometric fallback
async function authenticateUser() {
  const biometryType = await checkBiometricSupport();
  if (biometryType === 'fallback_to_pin') return promptForPin();

  const token = await getTokenWithBiometrics();
  if (token) return token;
  return promptForPin(); // biometric failed or cancelled — don't dead-end
}`,
      },

      { type: 'heading', text: '9. HIPAA — PHI Handling, Encryption, and Audit Logging' },
      { type: 'subheading', text: 'What?' },
      {
        type: 'paragraph',
        text: 'HIPAA is US federal law governing healthcare data. As a mobile engineer, two of its rules matter directly: the Security Rule sets technical requirements for protecting ePHI (electronic PHI) — encryption, access controls, audit trails — and the Privacy Rule governs who is allowed to see PHI and under what circumstances, even internally at your own company.',
      },
      { type: 'subheading', text: 'Why?' },
      {
        type: 'paragraph',
        text: "Any third-party processor that touches PHI on your behalf — a crash reporter, an analytics tool, a cloud host — needs a signed Business Associate Agreement (BAA) before that data reaches them. Sending crash breadcrumbs with patient data to a vendor without a BAA in place is a compliance violation independent of whether the data ever actually leaks.",
      },
      { type: 'subheading', text: 'How?' },
      {
        type: 'paragraph',
        text: "In practice this maps onto everything above with a healthcare-specific bar. Encryption at rest means PHI cached on-device belongs in react-native-encrypted-storage, never plain AsyncStorage — the same rule as before, just non-negotiable here. Access controls mean minimum necessary access: a support engineer's debug tooling shouldn't surface a full medical record just because it's technically reachable in the same database. Audit logging means every read or write of PHI needs a record of who accessed what and when — not the PHI content itself, just the access event — which is what lets you answer 'who looked at this patient's record on this date' during an audit or a breach investigation.",
      },

      { type: 'heading', text: '10. OWASP MASVS/MASTG Checklist' },
      { type: 'subheading', text: 'What?' },
      {
        type: 'paragraph',
        text: 'MASVS (Mobile Application Security Verification Standard) is a structured set of security requirements grouped into categories — what "secure" actually means for a mobile app. MASTG (Mobile Application Security Testing Guide) is its companion: the concrete techniques testers use to verify whether an app meets those requirements. MASVS is the checklist of what should be true; MASTG is how to go check.',
      },
      { type: 'subheading', text: 'Why?' },
      {
        type: 'paragraph',
        text: 'Real pentest firms and regulated-industry audits are built around this standard — a pentest report on a bank or healthtech app is almost always structured against MASVS categories.',
      },
      {
        type: 'table',
        headers: ['MASVS category', 'What it covers'],
        rows: [
          ['MASVS-STORAGE', 'Sensitive data storage'],
          ['MASVS-CRYPTO', 'Cryptography use'],
          ['MASVS-AUTH', 'Authentication & session'],
          ['MASVS-NETWORK', 'Network communication'],
          ['MASVS-PLATFORM', 'Platform interaction (IPC, permissions, screen capture, clipboard)'],
          ['MASVS-CODE', 'Code quality, injection, memory'],
          ['MASVS-RESILIENCE', 'Anti-reverse-engineering, anti-tampering'],
          ['MASVS-PRIVACY', 'Data minimization, user privacy'],
        ],
      },
      { type: 'subheading', text: 'How?' },
      {
        type: 'paragraph',
        text: 'The practical way to use MASVS as an engineer is as a self-audit checklist, not reading material — go through it and honestly answer for your own app.',
      },
      {
        type: 'code',
        filename: 'MASVS self-audit (abbreviated)',
        lang: 'markdown',
        code: `### MASVS-STORAGE
- [ ] No sensitive data in AsyncStorage/SharedPreferences unencrypted
- [ ] Auth tokens in Keychain/Keystore with appropriate accessibility flags
- [ ] No sensitive data in device logs, crash reports, or backups

### MASVS-CRYPTO
- [ ] No custom-rolled cryptography — platform-provided/vetted libraries only
- [ ] Keys generated and stored via Keychain/Keystore, never hardcoded

### MASVS-NETWORK
- [ ] TLS enforced on all network calls (no cleartext traffic allowed)
- [ ] Certificate/public-key pinning implemented with backup pins

### MASVS-AUTH
- [ ] Session tokens expire and rotate
- [ ] Biometric auth gates key access, not just UI
- [ ] Step-up re-auth required for high-value actions

### MASVS-RESILIENCE
- [ ] Code obfuscation enabled for release builds
- [ ] Root/jailbreak detection implemented
- [ ] Anti-tampering / debugger detection in place

### MASVS-PRIVACY
- [ ] ATT consent requested before any tracking
- [ ] Data minimization applied — only collecting/caching what's needed`,
      },
      {
        type: 'paragraph',
        text: 'MASTG gives concrete commands to verify controls yourself before a real pentest happens.',
      },
      {
        type: 'code',
        filename: 'shell — MASTG-style checks',
        code: `# Verify no cleartext traffic is allowed (Android)
grep -r "cleartextTrafficPermitted" android/app/src/main/res/xml/

# Check what's actually in your APK's decompiled storage calls
jadx -d output app-release.apk
grep -r "SharedPreferences" output/ | grep -v "encrypted"

# Verify backup is disabled — default SharedPreferences/internal storage
# can otherwise be swept into a device backup and extracted from it
grep "android:allowBackup" android/app/src/main/AndroidManifest.xml`,
      },

      { type: 'heading', text: '11. Root/Jailbreak Detection' },
      { type: 'subheading', text: 'What?' },
      {
        type: 'paragraph',
        text: "Rooting and jailbreaking are processes that remove a device's built-in security restrictions, granting full administrative access — reading any app's private storage directly, bypassing sandbox isolation, hooking into running processes, modifying system behavior. Detection is code that checks whether the app is currently running on such a device, so it can respond, usually by blocking sensitive functionality.",
      },
      { type: 'subheading', text: 'Why?' },
      {
        type: 'paragraph',
        text: "Almost every protection you've built in this tracker so far assumes the OS sandbox is intact. Root/jailbreak breaks that assumption:",
      },
      {
        type: 'list',
        ordered: true,
        items: [
          "Keystore/Keychain protection weakens — while hardware-backed keys generally remain protected even on rooted devices (that's the whole point of Secure Enclave/TEE), the surrounding app sandbox is gone, so other data (unencrypted caches, in-memory secrets) becomes trivially readable.",
          'Obfuscation becomes easier to defeat — root access enables tools that hook into your running app and inspect memory/behavior directly, bypassing static obfuscation.',
          'Certificate pinning can potentially be bypassed — rooted devices can install tools (like SSL Kill Switch, Frida scripts) that patch pinning logic at runtime.',
        ],
      },
      {
        type: 'note',
        text: 'Important honest caveat: root/jailbreak detection can always be bypassed by a sufficiently skilled attacker (there are tools like Magisk Hide/Zygisk specifically built to hide root from apps). So this is, like obfuscation, a speed bump, not an absolute wall — but it stops the vast majority of casual attackers and automated tooling, and it’s a required checkbox for compliance audits regardless of its theoretical bypassability.',
      },
      { type: 'subheading', text: 'How?' },
      {
        type: 'code',
        filename: 'deviceIntegrity.ts',
        code: `import JailMonkey from 'jail-monkey';

function checkDeviceIntegrity() {
  const isJailBroken = JailMonkey.isJailBroken(); // combines root + jailbreak check
  const canMockLocation = JailMonkey.canMockLocation();
  const isDebugged = JailMonkey.isDebuggedMode();
  const hookDetected = JailMonkey.hookDetected(); // Frida/Xposed-style hooking

  return {
    isCompromised: isJailBroken || hookDetected,
    details: { isJailBroken, canMockLocation, isDebugged, hookDetected },
  };
}`,
      },
      {
        type: 'paragraph',
        text: "What's actually happening under the hood (this is the part worth understanding, not just calling the library):",
      },
      { type: 'subheading', text: 'Android checks include:' },
      {
        type: 'list',
        items: [
          'Presence of root management apps (Superuser.apk, Magisk Manager)',
          'Checking for su binary in common paths (/system/bin/su, /system/xbin/su)',
          "Testing whether system partitions are writable (they shouldn't be on a stock device)",
          'Checking for known root-related packages via PackageManager',
        ],
      },
      { type: 'subheading', text: 'iOS checks include:' },
      {
        type: 'list',
        items: [
          'Checking for jailbreak-associated files (/Applications/Cydia.app, /bin/bash, /usr/sbin/sshd)',
          'Testing whether the app can write outside its normal sandbox (fopen to /private/ succeeding when it shouldn\'t)',
          'Checking for suspicious dynamic libraries loaded into the process',
        ],
      },
      {
        type: 'paragraph',
        text: 'Applying the check — where and how to respond (this is the actual design decision): it depends on the data sensitivity of the specific action, not a blanket app-wide rule.',
      },
      {
        type: 'code',
        filename: 'riskGating.tsx',
        code: `// A more nuanced approach — gate by action, not the whole app
function TransferMoneyScreen() {
  const { isCompromised } = checkDeviceIntegrity();
  if (isCompromised) {
    return <BlockedScreen message="Money transfers are disabled on this device for your security." />;
  }
  return <TransferForm />;
}

function ViewBalanceScreen() {
  // lower-risk action — warn instead of hard-blocking
  const { isCompromised } = checkDeviceIntegrity();
  return (
    <>
      {isCompromised && <SecurityWarningBanner />}
      <BalanceDisplay />
    </>
  );
}`,
      },

      { type: 'heading', text: '12. Anti-Tampering / RASP' },
      { type: 'subheading', text: 'Why?' },
      {
        type: 'paragraph',
        text: 'jail-monkey already includes basic hook detection for some Frida/Xposed signatures, but real anti-tampering depth in a regulated app usually layers in dedicated detection — either a native module or a commercial RASP SDK (Approov, DexGuard/iXGuard, Promon). These are worth knowing exist even without a license, since they come up in vendor security conversations at fintech/healthtech companies.',
      },
      { type: 'subheading', text: 'How?' },
      {
        type: 'code',
        filename: 'fridaCheck.ts',
        code: `// Frida's default server listens on a specific port when actively attached
async function checkFridaPort() {
  try {
    const response = await fetch('http://127.0.0.1:27042', { timeout: 500 });
    return true; // something responded — suspicious
  } catch {
    return false; // nothing listening — good sign, but not conclusive alone
  }
}`,
      },
      {
        type: 'code',
        filename: 'debuggerCheck.kt / .swift (native modules)',
        code: `// Android (Kotlin)
fun isDebuggerAttached(): Boolean {
    return android.os.Debug.isDebuggerConnected()
}

// iOS (Swift) — checking the process debug flag via sysctl
func isDebuggerAttached() -> Bool {
    var info = kinfo_proc()
    var size = MemoryLayout<kinfo_proc>.stride
    var mib: [Int32] = [CTL_KERN, KERN_PROC, KERN_PROC_PID, getpid()]
    sysctl(&mib, 4, &info, &size, nil, 0)
    return (info.kp_proc.p_flag & P_TRACED) != 0
}`,
      },
      {
        type: 'paragraph',
        text: 'The critical design principle: combine multiple weak signals, never trust one — a single check alone can be a false positive from a legitimate dev tool, but several together are high-confidence.',
      },
      {
        type: 'code',
        filename: 'threatAssessment.ts',
        code: `function assessRuntimeThreat() {
  const signals = {
    hookDetected: JailMonkey.hookDetected(),
    isJailBroken: JailMonkey.isJailBroken(),
    isDebugged: JailMonkey.isDebuggedMode(),
  };
  const threatCount = Object.values(signals).filter(Boolean).length;
  return { isHighRisk: threatCount >= 2, signals };
}`,
      },
      {
        type: 'note',
        text: "Client-side tamper detection can theoretically always be bypassed, so the backend should never assume a request came from an untampered client. Send device integrity signals as context and let the backend make the risk decision — never rely purely on the client refusing to proceed.",
      },
      {
        type: 'code',
        filename: 'sensitiveRequest.ts',
        code: `async function makeSensitiveRequest(payload) {
  const { signals } = assessRuntimeThreat();
  await api.post('/transfer', {
    ...payload,
    deviceIntegrity: signals, // backend flags/steps-up/denies based on this
  });
}`,
      },

      { type: 'heading', text: '13. Screenshot & Screen-Recording Protection' },
      { type: 'subheading', text: 'What?' },
      {
        type: 'paragraph',
        text: "This protects sensitive on-screen content — balances, card numbers, patient records, OTP codes — from being captured via screenshot, screen recording, or the OS's app-switcher thumbnail. That last surface is the one almost everyone forgets: double-tapping home or swiping to the app switcher makes the OS snapshot your last-rendered frame for the thumbnail.",
      },
      { type: 'subheading', text: 'Why?' },
      {
        type: 'paragraph',
        text: "Screenshots feel like a minor concern compared to encryption or pinning, but they're a real, frequently-exploited leak path:",
      },
      {
        type: 'list',
        items: [
          "Malware with screen-capture permission on Android can silently screenshot your app while it's in the foreground, capturing balances, PHI, or OTP codes without the user ever knowing.",
          "Shared/managed devices (common in healthtech — a shared tablet at a clinic) — the app switcher thumbnail showing a patient's name and diagnosis is visible to the next person who picks up the device, no attack required at all.",
          'Screen recording software (legitimate or malicious) running on the device can capture everything, including biometric-gated screens, since screen recording happens after your app has already rendered the unlocked content.',
        ],
      },
      {
        type: 'paragraph',
        text: 'This is directly checked under MASVS-PLATFORM. For fintech, this specifically matters for balance screens, card details, and transfer confirmations. For healthtech, it\'s patient records, diagnosis info, and anything with a name attached to health data.',
      },
      { type: 'subheading', text: 'How?' },
      {
        type: 'code',
        filename: 'screenSecurity.ts (Android)',
        code: `import ScreenSecurity from 'react-native-screen-security-secure';

useEffect(() => {
  ScreenSecurity.enable(); // sets FLAG_SECURE on the current activity window
  return () => ScreenSecurity.disable(); // don't leave it on app-wide unnecessarily
}, []);`,
      },
      {
        type: 'paragraph',
        text: 'FLAG_SECURE, once set, silently blocks screenshot attempts, makes screen recording capture black frames, and shows a blank app-switcher thumbnail instead of your last screen.',
      },
      {
        type: 'paragraph',
        text: "iOS has no equivalent flag — Apple deliberately gives apps no way to block screenshots — but you can detect when one was taken and obscure the app-switcher preview yourself.",
      },
      {
        type: 'code',
        filename: 'obscureOnBackground.tsx (iOS)',
        code: `import { AppState } from 'react-native';
import { useRef, useEffect, useState } from 'react';

function useObscureOnBackground() {
  const appState = useRef(AppState.currentState);
  const [isObscured, setIsObscured] = useState(false);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'inactive' || nextState === 'background') {
        // iOS snapshots the screen right as this fires — cover it now, not after
        setIsObscured(true);
      } else if (nextState === 'active') {
        setIsObscured(false);
      }
    });
    return () => sub.remove();
  }, []);

  return isObscured;
}

function SensitiveScreen() {
  const isObscured = useObscureOnBackground();
  return (
    <View>
      <BalanceContent />
      {isObscured && (
        <View style={StyleSheet.absoluteFillObject}>
          <AppLogoOverlay /> {/* what gets captured in the switcher snapshot instead */}
        </View>
      )}
    </View>
  );
}`,
      },
      {
        type: 'note',
        text: 'The timing matters: iOS snapshots the screen the moment the app transitions to inactive/background, so the cover view must render synchronously at that transition. A common bug is putting the obscuring logic on a delayed effect that fires too late, so the real content still gets captured.',
      },
      {
        type: 'paragraph',
        text: 'Apply this selectively — a transfer confirmation screen needs it, a plain dashboard usually does not.',
      },

      { type: 'heading', text: '14. Clipboard Security' },
      { type: 'subheading', text: 'What?' },
      {
        type: 'paragraph',
        text: "The clipboard is a system-wide shared resource — anything copied by any app can be read by any other app, with some OS-level restrictions added in recent years. This covers two concerns: auto-clearing sensitive data your own app puts on the clipboard, and disabling copy on sensitive display fields so users or malware can't extract data like full card numbers.",
      },
      { type: 'subheading', text: 'Why?' },
      {
        type: 'paragraph',
        text: 'The clipboard is one of the most overlooked leak paths because it feels like a convenience feature, not a security surface. But:',
      },
      {
        type: 'list',
        items: [
          'Any app with clipboard read access can read what you copied — historically this was completely silent (any app, anytime); iOS 14+ and Android 12+ added user notifications when an app reads the clipboard, but plenty of malware still monitors it, and many devices/OS versions don\'t have these protections.',
          'If your app copies an OTP code to make "paste to verify" convenient, and the user then switches to another app, that OTP sits on the clipboard readable by whatever\'s next — including malicious apps designed specifically to poll the clipboard for OTP-shaped strings.',
          "For fintech: users sometimes copy full account/routing numbers or card numbers to paste elsewhere — if your app doesn't restrict this, that sensitive data now exists in a system-wide buffer with no encryption, accessible until overwritten.",
        ],
      },
      {
        type: 'paragraph',
        text: 'This is explicitly a MASVS-PLATFORM concern — audits check whether sensitive data appears on the clipboard unnecessarily or persists there.',
      },
      { type: 'subheading', text: 'How?' },
      {
        type: 'code',
        filename: 'clipboard.ts',
        code: `import Clipboard from '@react-native-clipboard/clipboard';

async function copyOTPWithAutoClear(otp) {
  await Clipboard.setString(otp);

  setTimeout(async () => {
    const current = await Clipboard.getString();
    // only clear if it's still the same OTP — don't wipe something else
    // the user copied in the meantime
    if (current === otp) {
      await Clipboard.setString('');
    }
  }, 30000);
}`,
      },
      {
        type: 'code',
        filename: 'sensitiveDisplay.tsx',
        code: `// BAD — long-press shows "Copy", letting a full card number leave the app
<Text selectable={true}>{fullCardNumber}</Text>

// GOOD — mask it, and disable selection on the sensitive version
<Text selectable={false}>{maskedCardNumber}</Text>

// For inputs — a PIN field, for example
<TextInput
  secureTextEntry={true}
  contextMenuHidden={true} // disables copy/paste context menu on iOS
/>`,
      },
      {
        type: 'paragraph',
        text: "The broader principle: the best clipboard security is not needing it at all. Before adding a copy button to a sensitive field, ask whether it needs to be copyable — a transaction reference ID is reasonable to copy; a full account number is better shown masked, with 'copy last 4' or a re-auth step to reveal and copy the full number.",
      },
      {
        type: 'note',
        text: 'Clipboard is also a legitimate OTP autofill mechanism — both platforms support "suggested code" in the keyboard. Prefer native OTP autofill over manual clipboard copy where possible, since it skips the exposure window entirely.',
      },
      {
        type: 'code',
        filename: 'otpAutofill.tsx',
        code: `<TextInput
  textContentType="oneTimeCode" // iOS: native SMS-code suggestion
  autoComplete="sms-otp"        // Android equivalent
  onChangeText={setOtpValue}
/>`,
      },

      { type: 'heading', text: '15. Hardware-Backed Keys — Secure Enclave & Keystore Attestation' },
      { type: 'subheading', text: 'What?' },
      {
        type: 'paragraph',
        text: "This is the hardware layer underneath everything above. On iOS, the Secure Enclave is a physically separate coprocessor with its own encrypted memory — private keys generated there never exist in plaintext anywhere the main OS or apps can read, even under a full jailbreak. Face ID/Touch ID matching happens inside it, and a key marked as Secure Enclave-backed can require biometric or passcode confirmation on every use. On Android, the equivalent is the Android Keystore backed by a Trusted Execution Environment (TEE) or, on newer high-end devices, a StrongBox Secure Element — a physically separate security chip. Keys generated with setIsStrongBoxBacked(true) live in that isolated hardware; the app only ever holds a handle to the key, never the key material.",
      },
      { type: 'subheading', text: 'Why?' },
      {
        type: 'paragraph',
        text: "Attestation is what turns 'we generated a hardware key' into a claim you can actually verify server-side. Android's Key Attestation lets the app request a certificate chain, signed by Google, that proves a given key was generated inside genuine secure hardware on this specific device — not extracted, not software-emulated. Apple's equivalent is App Attest, which lets your backend confirm a request genuinely came from an unmodified copy of your app running on genuine Apple hardware. This matters because everything covered earlier — root detection, obfuscation, anti-tampering — is a client-side signal the client itself reports, and a compromised client can lie about all of it. Attestation is one of the few checks that's cryptographically hard to fake, because the proof is rooted in hardware the attacker doesn't control.",
      },
      { type: 'subheading', text: 'How?' },
      {
        type: 'note',
        text: 'In practice, most React Native teams get this for free through react-native-keychain (which already uses Secure Enclave/StrongBox-backed keys where available) and treat direct attestation APIs as an advanced addition for the highest-risk flows — say, confirming a large transfer server-side — rather than something every screen needs to call directly.',
      },

      { type: 'heading', text: '16. CI/CD Secrets Management' },
      { type: 'subheading', text: 'What?' },
      {
        type: 'paragraph',
        text: 'This is about how you handle passwords, API keys, signing credentials, and tokens used during your build/deploy pipeline — things like your keystore password, Stripe API keys, or backend auth tokens — without ever writing them directly into your code or config files that get committed to git.',
      },
      { type: 'subheading', text: 'Why?' },
      {
        type: 'list',
        items: [
          'Android keystore password and iOS certificates',
          'API keys for third-party services (Stripe, Sentry, push notification services)',
          "Backend credentials your app needs to build against different environments (staging/production)",
        ],
      },
      {
        type: 'paragraph',
        text: "If any of these end up hardcoded in a file that gets committed to git, that secret is now permanently in your git history — even if you delete it in a later commit, it's still recoverable from history unless you rewrite the entire repo. And if your repo is ever exposed (accidentally made public, a former employee's access wasn't revoked, a compromised dev laptop), every one of those secrets is compromised. This is a genuinely common real-world breach pattern — not sophisticated hacking, just someone finding an old commit with a plaintext API key still sitting in it.",
      },
      { type: 'subheading', text: 'How?' },
      {
        type: 'paragraph',
        text: "The rule: secrets live in the CI/CD platform's secret manager, injected as environment variables at build time, never in the repo.",
      },
      {
        type: 'code',
        filename: '.github/workflows/build.yml',
        code: `jobs:
  build-android:
    steps:
      - name: Build release APK
        env:
          KEYSTORE_PASSWORD: \${{ secrets.KEYSTORE_PASSWORD }}
          KEY_PASSWORD: \${{ secrets.KEY_PASSWORD }}
          STRIPE_API_KEY: \${{ secrets.STRIPE_API_KEY }}
        run: ./gradlew assembleRelease`,
      },
      {
        type: 'code',
        filename: 'what not to do',
        lang: 'javascript',
        code: `// BAD — committed to git, permanently in history
const STRIPE_KEY = "sk_live_abc123xyz";

// BAD — .env committed by accident
// .env
STRIPE_SECRET=sk_live_abc123xyz`,
      },
      {
        type: 'list',
        items: [
          'Always add .env to .gitignore.',
          "Use a tool like git-secrets or GitHub's push-protection to catch accidental commits before they happen.",
        ],
      },
      {
        type: 'paragraph',
        text: "Worth doing right now: search your repo's history for any hardcoded key that might already be committed.",
      },
      {
        type: 'code',
        filename: 'shell',
        code: `git log -p | grep -iE "api[_-]?key|password|secret" | head -20`,
      },

      { type: 'heading', text: '17. Session Policy — Auto-Lock & Step-Up Re-Auth' },
      { type: 'subheading', text: 'What?' },
      {
        type: 'paragraph',
        text: 'This covers how long a logged-in session stays valid without re-verifying the user, and when to demand fresh verification even if the session is technically active. Auto-lock re-locks the app after a period of inactivity, even though the underlying token is still valid. Step-up authentication requires fresh verification before a specific high-risk action, regardless of when the app was last unlocked.',
      },
      { type: 'subheading', text: 'Why?' },
      {
        type: 'paragraph',
        text: "A valid token doesn't mean the person currently holding the phone is the legitimate user — someone could pick up an unlocked, backgrounded phone and have full access to a session authenticated 20 minutes earlier by someone else. Phones get left on desks, handed to kids, glanced at by coworkers. Regulators and MASVS-AUTH expect a short inactivity window for high-sensitivity apps — typically 1–5 minutes, not the 30 minutes common in casual consumer apps — plus extra verification for the riskiest actions. A $10,000 transfer or opening a full medical record shouldn't rely on 'they unlocked the app four minutes ago.'",
      },
      { type: 'subheading', text: 'How?' },
      {
        type: 'code',
        filename: 'useAutoLock.ts',
        code: `import { AppState } from 'react-native';
import { useRef, useEffect, useState } from 'react';

const INACTIVITY_LIMIT_MS = 2 * 60 * 1000; // 2 minutes

function useAutoLock() {
  const [isLocked, setIsLocked] = useState(false);
  const backgroundedAt = useRef(null);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'background') {
        backgroundedAt.current = Date.now();
      } else if (nextState === 'active' && backgroundedAt.current) {
        const elapsed = Date.now() - backgroundedAt.current;
        if (elapsed > INACTIVITY_LIMIT_MS) setIsLocked(true); // force re-auth
        backgroundedAt.current = null;
      }
    });
    return () => sub.remove();
  }, []);

  return { isLocked, unlock: () => setIsLocked(false) };
}

function App() {
  const { isLocked, unlock } = useAutoLock();
  if (isLocked) return <BiometricUnlockScreen onSuccess={unlock} />;
  return <MainApp />;
}`,
      },
      {
        type: 'paragraph',
        text: 'Step-up re-auth for high-risk actions runs independently of the auto-lock timer, tying directly back into the biometric-gated key pattern.',
      },
      {
        type: 'code',
        filename: 'stepUpAuth.ts',
        code: `async function confirmTransfer(transferDetails) {
  // even if the app unlocked 30 seconds ago, force a FRESH biometric check
  const token = await getTokenWithBiometrics();
  if (!token) {
    return showError('Re-authentication required to complete this transfer.');
  }
  await api.post('/transfer', { ...transferDetails });
}

const ACTION_RISK_TIER = {
  viewBalance: 'low',
  viewTransactionHistory: 'low',
  addPaymentMethod: 'high',
  transferMoney: 'high',
  changePassword: 'high',
  viewFullMedicalRecord: 'high',
};

async function performAction(actionName, fn) {
  if (ACTION_RISK_TIER[actionName] === 'high') {
    const verified = await getTokenWithBiometrics();
    if (!verified) throw new Error('Step-up authentication required');
  }
  return fn();
}`,
      },

      { type: 'heading', text: '18. MFA/OTP Flows' },
      { type: 'subheading', text: 'What?' },
      {
        type: 'paragraph',
        text: "Multi-factor authentication means requiring more than one type of proof before granting access — typically something you know (a password) plus something you have (a one-time code via SMS/email, or one generated by an authenticator app). SMS/email OTP has the server generate and send a code the user types back. TOTP (Time-based One-Time Password) has an authenticator app generate a new code every 30 seconds from a shared secret plus the current time, with no network round-trip needed to generate it.",
      },
      { type: 'subheading', text: 'Why?' },
      {
        type: 'paragraph',
        text: "A password alone is something you know — if it leaks through phishing, a breach, or reuse from another site, that's the only barrier gone. MFA means a stolen password alone isn't enough. For fintech and healthtech this is frequently a regulatory requirement, not just best practice, and it's often exactly what step-up authentication means in practice on a new or unrecognized device where biometrics haven't been enrolled yet.",
      },
      {
        type: 'note',
        text: 'SMS OTP is the weakest common form of MFA, vulnerable to SIM-swapping — an attacker convinces a carrier to port the victim\'s number to a SIM they control, intercepting the OTP entirely. TOTP has no such weakness, since the code is generated locally on-device rather than transmitted. This is a genuine, frequently-asked interview question: why is SMS OTP weaker than TOTP?',
      },
      { type: 'subheading', text: 'How?' },
      {
        type: 'code',
        filename: 'otpFlow.ts',
        code: `async function requestOTP(phoneNumber) {
  await api.post('/auth/send-otp', { phoneNumber });
  // server generates a random code, stores it hashed with an expiry, sends via SMS
}

async function verifyOTP(phoneNumber, code) {
  const { data } = await api.post('/auth/verify-otp', { phoneNumber, code });
  return data.sessionToken;
}`,
      },
      {
        type: 'code',
        filename: 'otpAutofill.tsx',
        code: `<TextInput
  textContentType="oneTimeCode"
  autoComplete="sms-otp"
  value={otp}
  onChangeText={setOtp}
  keyboardType="number-pad"
  maxLength={6}
/>`,
      },
      {
        type: 'paragraph',
        text: 'If building TOTP enrollment rather than just consuming SMS OTP, the client generates the QR code from a server-issued secret, but the actual verification always happens server-side — the app never independently validates a TOTP code as correct, it just collects the 6-digit input and sends it to the backend, which holds the shared secret and does the real time-window comparison.',
      },
      {
        type: 'code',
        filename: 'totpEnrollment.ts',
        code: `import * as OTPAuth from 'otpauth';

// Server shares a secret once, over a secure channel, during enrollment
function generateEnrollmentURI(secret, userEmail) {
  const totp = new OTPAuth.TOTP({
    issuer: 'MyFintechApp',
    label: userEmail,
    secret: OTPAuth.Secret.fromBase32(secret),
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
  });
  return totp.toString(); // this becomes the QR code content
}`,
      },
      {
        type: 'paragraph',
        text: 'Rate limiting and lockout are a UX responsibility on the client, paired with real enforcement on the server — client-side limiting alone is trivially bypassed by calling the API directly.',
      },
      {
        type: 'code',
        filename: 'otpLockout.ts',
        code: `async function verifyOTPWithLockout(phoneNumber, code, attemptCount) {
  if (attemptCount >= 5) {
    return { error: 'Too many attempts. Please request a new code.' };
  }
  try {
    return await verifyOTP(phoneNumber, code);
  } catch (error) {
    if (error.response?.status === 429) {
      return { error: 'Too many attempts. Try again later.' };
    }
    throw error;
  }
}`,
      },
      {
        type: 'paragraph',
        text: "The server must enforce this too — but showing the right UX (disabling the button, showing a cooldown) prevents legitimate users from hammering the endpoint and getting server-side locked out accidentally.",
      },
      {
        type: 'note',
        text: "Worth checking: whether your app currently supports MFA at all. If it's SMS-only, that's worth flagging as a known weaker option (SIM-swap risk) — consider whether TOTP or push-based approval (an 'approve this login' notification) would be a stronger addition for high-value accounts.",
      },

      { type: 'heading', text: '19. Secure Logging' },
      { type: 'subheading', text: 'What?' },
      {
        type: 'paragraph',
        text: "Secure logging means sensitive data never ends up in logs, crash reports, or analytics events — console.log, native Logcat/Xcode console output, crash reporters like Sentry or Crashlytics, and analytics tools like Mixpanel or Firebase Analytics all count. This is the single most common real-world leak path — not breaking encryption or bypassing pinning, but a developer logging something during debugging and forgetting to remove it, or a crash reporter automatically capturing local variable state that happened to contain PHI.",
      },
      { type: 'subheading', text: 'Why?' },
      {
        type: 'paragraph',
        text: "Logcat is readable by other apps with the right permissions on older Android versions, and trivially readable over adb — a debug log with a token or SSN in it is a real leak. Crash reporters capture breadcrumbs, recent console logs, and network request details automatically; a patient record logged before a crash may now sit in a crash-reporting dashboard, visible to the whole engineering team, potentially without a BAA in place. Analytics is the sneakiest path of all — a well-meaning analytics.track('profile_updated', user) can silently ship an entire user object, PHI included, to a third party.",
      },
      { type: 'subheading', text: 'How?' },
      {
        type: 'code',
        filename: 'logging.ts',
        code: `// BAD — logs the entire object: name, email, maybe more
console.log('User logged in:', user);

// GOOD — log identifiers only
console.log('User logged in:', user.id);`,
      },
      {
        type: 'paragraph',
        text: "A wrapped logger that redacts known-sensitive keys automatically is a useful safety net — not a substitute for the discipline of not logging sensitive objects in the first place, but it catches accidental leaks.",
      },
      {
        type: 'code',
        filename: 'safeLog.ts',
        code: `const SENSITIVE_KEYS = ['token', 'password', 'ssn', 'cvv', 'cardNumber', 'diagnosis', 'dob'];

function safeLog(label, data) {
  if (typeof data === 'object' && data !== null) {
    const redacted = Object.keys(data).reduce((acc, key) => {
      acc[key] = SENSITIVE_KEYS.some(s => key.toLowerCase().includes(s))
        ? '[REDACTED]'
        : data[key];
      return acc;
    }, {});
    console.log(label, redacted);
  } else {
    console.log(label, data);
  }
}

safeLog('User payload:', { name: 'John', token: 'abc123' });
// → "User payload:", { name: 'John', token: '[REDACTED]' }`,
      },
      {
        type: 'paragraph',
        text: 'Debug logs shouldn\'t ship to production at all — strip them from release builds entirely, ideally via a Babel plugin like babel-plugin-transform-remove-console that removes console.* calls from the release bundle.',
      },
      {
        type: 'code',
        filename: 'devLog.ts',
        code: `function devLog(...args) {
  if (__DEV__) console.log(...args);
}`,
      },
      {
        type: 'paragraph',
        text: "Crash reporters also need explicit scrubbing configured — don't rely on their defaults.",
      },
      {
        type: 'code',
        filename: 'sentry.ts',
        code: `import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'YOUR_DSN',
  beforeSend(event) {
    if (event.request?.data) {
      delete event.request.data.token;
      delete event.request.data.ssn;
      delete event.request.data.cardNumber;
    }
    if (event.user) {
      delete event.user.email; // send an ID only, unless a BAA is in place
    }
    return event;
  },
});`,
      },
      {
        type: 'note',
        text: "The senior-level habit: treat every analytics or crash-reporting call as an allowlist, not a blocklist. Explicitly choose what goes in rather than passing a whole object and hoping nothing sensitive is present — objects grow new fields over time, and a blocklist silently breaks the moment someone adds a sensitive field without updating it.",
      },
      {
        type: 'code',
        filename: 'analytics.ts',
        code: `// BAD — ships the whole object, PHI/PII included
analytics.track('profile_updated', user);

// GOOD — explicit allowlist of what's safe to send
analytics.track('profile_updated', { user_id: user.id, updated_at: Date.now() });`,
      },

      { type: 'heading', text: '20. Security Testing Practice — MobSF & Threat Modeling (STRIDE)' },
      { type: 'subheading', text: 'What?' },
      {
        type: 'paragraph',
        text: 'MobSF (Mobile Security Framework) is a free, open-source tool that automatically scans an APK/IPA for hardcoded secrets, missing pinning, weak crypto, insecure storage patterns, and permission misuse — an automated first-pass pentest. STRIDE is a structured way to think through how a feature could be attacked before or while building it, a mnemonic for six categories: Spoofing, Tampering, Repudiation, Information disclosure, Denial of service, Elevation of privilege.',
      },
      { type: 'subheading', text: 'Why?' },
      {
        type: 'paragraph',
        text: "Everything you've learned was reactive knowledge — specific known problems with specific known solutions (pinning, obfuscation, encrypted storage). MobSF and STRIDE are different: they're processes for finding problems you haven't thought of yet, which is exactly what a real security review does before an app ships, and what a real pentest firm will do to your app whether or not you've prepared.",
      },
      {
        type: 'paragraph',
        text: 'For fintech/healthtech, this matters because:',
      },
      {
        type: 'list',
        items: [
          "MobSF gives you a free, repeatable way to catch regressions — someone accidentally hardcodes an API key, or a new dependency introduces an insecure storage call — before it ships, not after a real pentest firm finds it (expensive) or an attacker finds it (catastrophic).",
          'STRIDE gives you a repeatable question framework for new features, so security isn\'t just a fixed list of controls but a way of thinking that scales to problems no checklist ever covered. This is genuinely what separates a senior engineer who "knows some security tricks" from one who can walk into a design review and systematically reason about a new feature\'s attack surface.',
        ],
      },
      { type: 'subheading', text: 'How?' },
      {
        type: 'code',
        filename: 'shell — run MobSF against a build',
        code: `docker pull opensecurity/mobile-security-framework-mobsf
docker run -it -p 8000:8000 opensecurity/mobile-security-framework-mobsf

# open http://localhost:8000, upload a release APK/IPA, and it auto-scans`,
      },
      {
        type: 'paragraph',
        text: "MobSF's findings map directly onto MASVS categories — 'certificate pinning not detected,' 'hardcoded API key found,' 'backup allowed (allowBackup=true)' — most of which map directly onto sections above.",
      },
      {
        type: 'table',
        headers: ['STRIDE category', 'Question', 'Applied to the token refresh flow'],
        rows: [
          ['Spoofing', 'Can someone pretend to be a legitimate user/device?', 'Could an attacker replay a stolen refresh token from a different device? Rotation and family invalidation address this.'],
          ['Tampering', 'Can someone modify data in transit or at rest?', 'Could a MITM attacker modify the refresh request? Certificate pinning addresses this.'],
          ['Repudiation', 'Can an action happen without a traceable record?', 'If a token is misused, can you prove when and from where it was issued? Audit logging addresses this.'],
          ['Information disclosure', 'Can sensitive data leak to someone who shouldn\'t see it?', 'Is the refresh token ever logged, cached unencrypted, or sent to a crash reporter?'],
          ['Denial of service', 'Can someone disrupt legitimate access?', 'Could an attacker spam the refresh endpoint to trigger rate-limit lockouts against real users?'],
          ['Elevation of privilege', 'Can someone gain access beyond what they should have?', 'Could a compromised low-privilege token be used to reach admin-only endpoints?'],
        ],
      },
      {
        type: 'paragraph',
        text: 'A lightweight version fits into a 30-minute design review rather than a formal audit.',
      },
      {
        type: 'code',
        filename: 'Quick STRIDE pass — [feature name]',
        code: `1. Spoofing: Who could pretend to be someone else here, and how do we stop it?
2. Tampering: What data here, if modified in transit/storage, causes harm?
3. Repudiation: If something goes wrong, can we prove who did what, when?
4. Info Disclosure: What's the worst thing that leaks if this component is compromised?
5. DoS: What's the cheapest way someone could disrupt this for legitimate users?
6. Elevation of Privilege: Could this feature grant access beyond its intended scope?`,
      },
      {
        type: 'paragraph',
        text: "This becomes a habit rather than a one-time exercise by running MobSF as part of the release checklist — ideally wired into CI/CD — so every release gets scanned automatically, and by running a quick STRIDE pass during design review for any feature touching auth, payments, or PHI, before code is written rather than after.",
      },
    ],
    prevSlug: 'native-modules',
    nextSlug: null,
  },
]

export function getPostBySlug(slug) {
  return POSTS.find((post) => post.slug === slug)
}
