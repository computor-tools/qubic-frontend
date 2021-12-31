# Qubic frontend

Interface for Qubic authors, computors and token holders. Wallet and DEX are included.
This is a work in progress.

## TODOs:

- [ ] Fetch data from network with [`qubic-js`](https://github.com/computor-tools/qubic-js).
- [ ] Add pool stats.
- [ ] Interface for qubic authors.
- [ ] Interface for computor control.
- [ ] Search interface.
- [ ] Integrate exchange with its backend.

## Development

[pnpm](https://pnpm.io/) is used to manage dependencies.

1. Install dependencies:

```
pnpm i
```

2. Link [`qubic-js`](https://github.com/computor-tools/qubic-js):

```
cd ../ &&
git clone https://github.com/computor-tools/qubic-js &&
cd computor-frontend &&
pnpm link ../qubic-js
```

3. Start development server:

```
pnpm start
```

## Production

Bundle for production as single html file:

```
pnpm run build
```
