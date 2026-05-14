export interface Bookmark {
  title: string;
  url: string;
  excerpt: string;
  time: number;
  favicon?: string;
}

export interface Settings {
  folderName: string;
}

const DEFAULT_SETTINGS: Settings = {
  folderName: 'localpocket',
};

export async function getBookmarks(): Promise<Bookmark[]> {
  const { bookmarks = [] } = await browser.storage.local.get('bookmarks');
  return bookmarks as Bookmark[];
}

export async function addBookmark(bookmark: Bookmark): Promise<void> {
  const bookmarks = await getBookmarks();
  bookmarks.unshift(bookmark);
  await browser.storage.local.set({ bookmarks });
}

export async function deleteBookmark(url: string): Promise<void> {
  const bookmarks = await getBookmarks();
  await browser.storage.local.set({
    bookmarks: bookmarks.filter((b) => b.url !== url),
  });
}

export async function clearBookmarks(): Promise<void> {
  await browser.storage.local.set({ bookmarks: [] });
}

export async function getSettings(): Promise<Settings> {
  const { settings } = await browser.storage.local.get('settings');
  return { ...DEFAULT_SETTINGS, ...(settings as Partial<Settings> | undefined) };
}

export async function saveSettings(settings: Settings): Promise<void> {
  await browser.storage.local.set({ settings });
}
