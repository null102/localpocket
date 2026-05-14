import { addBookmark, type Bookmark } from '../lib/storage';

export default defineBackground(() => {
  browser.action.onClicked.addListener(async (tab) => {
    if (!tab.url || !tab.id) return;
    if (tab.url.startsWith('chrome://') || tab.url.startsWith('about:') || tab.url.startsWith('edge://')) {
      flashBadge(tab.id, '!', '#a33');
      return;
    }

    let excerpt = '';
    try {
      const results = await browser.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          const pick = (sel: string) =>
            (document.querySelector(sel) as HTMLMetaElement | null)?.content?.trim();
          return (
            pick('meta[name="description"]') ||
            pick('meta[property="og:description"]') ||
            document.querySelector('p')?.textContent?.trim().slice(0, 240) ||
            ''
          );
        },
      });
      excerpt = (results[0]?.result as string | undefined) ?? '';
    } catch {
      // Some pages (privileged, file://) block scripting — that's fine.
    }

    const bookmark: Bookmark = {
      title: tab.title ?? tab.url,
      url: tab.url,
      excerpt,
      time: Date.now(),
      favicon: tab.favIconUrl,
    };

    await addBookmark(bookmark);
    flashBadge(tab.id, '✓', '#2d7a2d');
  });

  browser.runtime.onInstalled.addListener(() => {
    browser.contextMenus.create({
      id: 'view-bookmarks',
      title: 'View bookmarks',
      contexts: ['action'],
    });
    browser.contextMenus.create({
      id: 'open-settings',
      title: 'Settings',
      contexts: ['action'],
    });
  });

  browser.contextMenus.onClicked.addListener((info) => {
    if (info.menuItemId === 'view-bookmarks') {
      browser.tabs.create({ url: browser.runtime.getURL('/viewer.html') });
    } else if (info.menuItemId === 'open-settings') {
      browser.runtime.openOptionsPage();
    }
  });
});

function flashBadge(tabId: number, text: string, color: string) {
  browser.action.setBadgeText({ text, tabId });
  browser.action.setBadgeBackgroundColor({ color, tabId });
  setTimeout(() => browser.action.setBadgeText({ text: '', tabId }), 1500);
}
