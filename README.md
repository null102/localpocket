# LocalPocket

> Local-first Pocket alternative — save pages to plain files you own.

A browser extension that saves bookmarks as plain JSON / HTML files on disk. No database, no backend, no Electron. Your saved pages are yours — syncable via Git, Syncthing, iCloud, Dropbox, OneDrive, or whatever you already use.

## Why

A tribute to Pocket. LocalPocket carries the same read-later spirit, built on principles that outlast any single service: **local-first, plain files, browser as UI**. Long-lived tech only — HTML, JSON, Markdown, localhost, static files. No Chrome-only APIs, no Electron, no "React framework of the week".

Your saved pages live as files on your disk. No cloud account, no backend, no migration when the next service folds.

## Features

- **One-click save** — Click the toolbar icon on any page to save `{title, url, excerpt, time, favicon}`
- **Right-click menu** — View bookmarks / Open settings
- **Export** — Download all bookmarks as plain JSON or HTML
- **Cross-browser** — Chrome, Firefox, Safari from a single codebase

## Quick start

```sh
npm install
npm run dev          # Chrome dev mode (auto-loads extension)
npm run dev:firefox  # Firefox dev mode
```

## Build

```sh
npm run build           # Chrome (MV3)
npm run build:firefox   # Firefox
npm run build:safari    # Safari Web Extension
npm run build:all       # All three
```

Output goes to `output/{browser}-mv3/`.

## Loading the built extension

- **Chrome** — `chrome://extensions` → enable Developer mode → "Load unpacked" → pick `output/chrome-mv3/`.
- **Firefox** — `about:debugging` → This Firefox → "Load Temporary Add-on" → pick any file in `output/firefox-mv3/`.
- **Safari** — needs an Xcode wrapper. Convert and build:
  ```sh
  xcrun safari-web-extension-converter output/safari-mv3 \
    --project-location safari \
    --app-name LocalPocket \
    --bundle-identifier com.example.localpocket \
    --swift --macos-only --copy-resources --no-prompt --force
  open safari/LocalPocket/LocalPocket.xcodeproj
  ```
  Then in Xcode: Run. In Safari: enable Develop menu (Settings → Advanced) → Develop → Allow Unsigned Extensions → Settings → Extensions → check LocalPocket. Unsigned mode resets every Safari restart; permanent install needs an Apple Developer Program signed build.

## Project structure

```
entrypoints/
  background.ts     Service worker: action.onClicked save + contextMenu
  viewer/           Bookmark list page (right-click → View bookmarks)
  options/          Settings page (filename prefix, export, stats)
lib/
  storage.ts        chrome.storage.local wrapper
  export.ts         JSON / HTML export
public/icon/        Extension icons (16/32/48/96/128)
assets/             Source artwork for icons
```

## Stack

- TypeScript
- [WXT](https://wxt.dev) — "Vite for browser extensions"
- Manifest V3
- Native HTML/CSS, no framework

## Design notes

- **No React** — too heavy for what's essentially a typography-first reading list.
- **No popup** — left click = save (silent), right click = menu. Direct action over decoration.
- **No `showDirectoryPicker()`** — Firefox and Safari don't support it reliably. Sticking with `chrome.storage.local` + plain downloads keeps cross-browser behavior identical.
- **No Safari App Extension (Swift)** — only Safari Web Extension via WXT, so a single codebase covers all three browsers.
