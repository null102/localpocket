import { getBookmarks, getSettings, saveSettings, clearBookmarks } from '../../lib/storage';
import { bookmarksToJSON, bookmarksToHTML, triggerDownload } from '../../lib/export';

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;

const folderInput = $<HTMLInputElement>('folder');
const filenamePreview = $<HTMLElement>('filename-preview');
const saveBtn = $<HTMLButtonElement>('save');
const saveStatus = $<HTMLElement>('save-status');
const exportJsonBtn = $<HTMLButtonElement>('export-json');
const exportHtmlBtn = $<HTMLButtonElement>('export-html');
const countEl = $<HTMLElement>('count');
const clearBtn = $<HTMLButtonElement>('clear');

async function refresh() {
  const settings = await getSettings();
  folderInput.value = settings.folderName;
  updatePreview();
  const bookmarks = await getBookmarks();
  countEl.textContent = String(bookmarks.length);
}

function updatePreview() {
  const name = folderInput.value.trim() || 'localpocket';
  filenamePreview.textContent = `${name}.json`;
}

function flashStatus(msg: string) {
  saveStatus.textContent = msg;
  saveStatus.classList.add('visible');
  setTimeout(() => saveStatus.classList.remove('visible'), 1600);
}

folderInput.addEventListener('input', updatePreview);

saveBtn.addEventListener('click', async () => {
  await saveSettings({ folderName: folderInput.value.trim() || 'localpocket' });
  flashStatus('Saved.');
});

exportJsonBtn.addEventListener('click', async () => {
  const bookmarks = await getBookmarks();
  const settings = await getSettings();
  triggerDownload(bookmarksToJSON(bookmarks), `${settings.folderName}.json`, 'application/json');
});

exportHtmlBtn.addEventListener('click', async () => {
  const bookmarks = await getBookmarks();
  const settings = await getSettings();
  triggerDownload(bookmarksToHTML(bookmarks), `${settings.folderName}.html`, 'text/html');
});

clearBtn.addEventListener('click', async () => {
  if (!confirm('Delete all bookmarks? This cannot be undone.')) return;
  await clearBookmarks();
  await refresh();
});

refresh();
