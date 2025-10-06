const CACHE_NAME = 'material-idle-shards-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './index.tsx',
  './metadata.json',
  './utils/format.ts',
  './utils/calculations.ts',
  './App.tsx',
  './contexts/LanguageContext.tsx',
  './contexts/ThemeContext.tsx',
  './hooks/useGame.ts',
  './components/ActiveSkillsBar.tsx',
  './components/ControlPanel.tsx',
  './components/icons.tsx',
  './components/MainDisplay.tsx',
  './components/modals.tsx',
  './components/Settings.tsx',
  './components/StatsBar.tsx',
  './components/panels/AchievementsPanel.tsx',
  './components/panels/GeneratorsPanel.tsx',
  './components/panels/LorePanel.tsx',
  './components/panels/PrestigePanel.tsx',
  './components/panels/SingularityGridPanel.tsx',
  './components/panels/SkillsPanel.tsx',
  './components/panels/StatsPanel.tsx',
  './components/panels/TalismansPanel.tsx',
  './components/panels/UpgradesPanel.tsx',
  './components/panels/utils.ts',
  './components/shared/BuyAmountSelector.tsx',
  './components/shared/ItemCard.tsx',
  './components/shared/PurchaseButton.tsx',
  './components/shared/SkillCard.tsx',
  './locales/en.json',
  './locales/it.json',
  './types/events.ts',
  './types/game.ts',
  './types/index.ts',
  './types/player.ts',
  './types/ui.ts',
  './data/achievements.ts',
  './data/ascension.ts',
  './data/bosses.ts',
  './data/challenges.ts',
  './data/constants.ts',
  './data/generators.ts',
  './data/index.ts',
  './data/lore.ts',
  './data/prestige.ts',
  './data/singularity.ts',
  './data/skills.ts',
  './data/talismans.ts',
  './data/tiers.ts',
  './data/upgrades.ts',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }

        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          (response) => {
            if (!response || response.status !== 200) {
              return response;
            }
            
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});
