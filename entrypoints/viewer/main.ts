import { getBookmarks, deleteBookmark, type Bookmark } from '../../lib/storage';

const list = document.getElementById('list') as HTMLUListElement;
const countEl = document.getElementById('count') as HTMLElement;
const emptyEl = document.getElementById('empty') as HTMLElement;
const settingsLink = document.getElementById('open-settings') as HTMLAnchorElement;

settingsLink.addEventListener('click', (e) => {
  e.preventDefault();
  browser.runtime.openOptionsPage();
});

function formatDate(time: number): string {
  return new Date(time).toISOString().slice(0, 10);
}

function hostname(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

function render(bookmarks: Bookmark[]) {
  countEl.textContent = String(bookmarks.length);
  list.innerHTML = '';
  emptyEl.hidden = bookmarks.length > 0;

  for (const b of bookmarks) {
    const li = document.createElement('li');

    const title = document.createElement('a');
    title.className = 'title';
    title.href = b.url;
    title.target = '_blank';
    title.rel = 'noopener noreferrer';
    title.textContent = b.title || b.url;
    li.appendChild(title);

    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.textContent = `${formatDate(b.time)} · ${hostname(b.url)}`;
    li.appendChild(meta);

    if (b.excerpt) {
      const excerpt = document.createElement('p');
      excerpt.className = 'excerpt';
      excerpt.textContent = b.excerpt;
      li.appendChild(excerpt);
    }

    const del = document.createElement('button');
    del.className = 'delete';
    del.textContent = '× remove';
    del.title = 'Remove from LocalPocket';
    del.addEventListener('click', async () => {
      await deleteBookmark(b.url);
      const updated = await getBookmarks();
      render(updated);
    });
    li.appendChild(del);

    list.appendChild(li);
  }
}

async function refresh() {
  render(await getBookmarks());
}

browser.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes.bookmarks) refresh();
});

refresh();
