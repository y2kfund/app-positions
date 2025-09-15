# @y2kfund/positions

A Vue 3 component for displaying positions information.

## Installation

Install from GitHub:

```bash
npm install git+https://github.com/y2kfund/positions.git
# or
pnpm add git+https://github.com/y2kfund/positions.git
# or
yarn add git+https://github.com/y2kfund/positions.git
```

## Usage

```vue
<template>
  <div>
    <Positions />
  </div>
</template>

<script setup>
import { Positions } from '@y2kfund/positions'
// or
import Positions from '@y2kfund/positions'
</script>
```

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build the library
pnpm build:lib

# Build for production
pnpm build
```

## Scripts
- `pnpm dev` - start dev server (http://localhost:5101)
- `pnpm build` - production build
- `pnpm build:lib` - build as library
- `pnpm preview` - preview built app

## Notes
- Pure Vue 3 + Vite library
- Can be used as a standalone app or imported as a component
- Built with TypeScript support

## License

MIT
