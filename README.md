# Color Manager

A React + TypeScript application for managing and organizing colors. Add colors via RGB values, HEX codes, or a color picker — the app automatically converts between all formats (RGB, HEX, HSL). Your color collection is stored in localStorage and displayed in a sortable, filterable table.

## Features

- **Add Colors** — Enter values via RGB inputs, HEX code, or a native color picker
- **Auto-Conversion** — Converts between RGB, HEX, and HSL in real-time
- **Color Table** — View all saved colors with their values
- **Filter by Channel** — Filter colors by Red, Green, Blue dominance or high Saturation
- **Sort** — Colors are automatically sorted by RGB channels and saturation
- **Delete Colors** — Remove colors from your collection
- **Persistent Storage** — All data is saved to `localStorage`

## Tech Stack

- React 18
- TypeScript
- SCSS
- Create React App

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Install

```bash
npm install
```

### Run (Development)

```bash
npm start
```

Opens at [http://localhost:3000](http://localhost:3000).

### Build (Production)

```bash
npm run build
```

### Test

```bash
npm test
```

## Project Structure

```
src/
├── App.tsx                  # Main app component with state management
├── Components/
│   ├── FormAdd.tsx          # Color input form (RGB, HEX, color picker)
│   ├── TableColors.tsx      # Color table with filtering
│   ├── ShowFilterInfo.tsx    # Active filter indicator
│   ├── PopUp.tsx            # Success popup (add)
│   └── PopUpInfo.tsx        # Success popup (delete)
├── Styles/
│   ├── main.scss            # Global styles and animations
│   └── table.scss           # Table-specific styles
└── index.tsx                # Entry point
```

## License

This project is for personal/educational use.
