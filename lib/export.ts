import type { Bookmark } from './storage';

export function bookmarksToJSON(bookmarks: Bookmark[]): string {
  return JSON.stringify(bookmarks, null, 2);
}

export function bookmarksToHTML(bookmarks: Bookmark[]): string {
  const escape = (s: string) =>
    s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');

  const items = bookmarks
    .map((b) => {
      const date = new Date(b.time).toISOString().slice(0, 10);
      return `    <li>
      <a href="${escape(b.url)}">${escape(b.title)}</a>
      <div class="meta">${date} · ${escape(new URL(b.url).hostname)}</div>
      ${b.excerpt ? `<p class="excerpt">${escape(b.excerpt)}</p>` : ''}
    </li>`;
    })
    .join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>LocalPocket</title>
<style>
  body { font-family: Georgia, 'Times New Roman', serif; max-width: 42rem; margin: 3rem auto; padding: 0 1rem; line-height: 1.6; color: #222; }
  h1 { font-weight: normal; border-bottom: 1px solid #ccc; padding-bottom: 0.5rem; }
  ul { list-style: none; padding: 0; }
  li { margin: 1.5rem 0; padding-bottom: 1.5rem; border-bottom: 1px dashed #eee; }
  a { color: #1a3a6e; text-decoration: none; font-size: 1.1rem; }
  a:hover { text-decoration: underline; }
  .meta { color: #888; font-size: 0.85rem; margin-top: 0.25rem; }
  .excerpt { color: #555; margin: 0.5rem 0 0; font-size: 0.95rem; }
</style>
</head>
<body>
  <h1>LocalPocket</h1>
  <p><em>${bookmarks.length} saved · exported ${new Date().toISOString().slice(0, 10)}</em></p>
  <ul>
${items}
  </ul>
</body>
</html>
`;
}

export function triggerDownload(content: string, filename: string, mime: string): void {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
