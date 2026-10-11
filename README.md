# Astro Starter Kit: Minimal

```sh
npm create astro@latest -- --template minimal
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
├── src/
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## Website data

Editable website content is stored in JSON:

- `src/data/home.json` contains homepage media, destinations, stay cards, services, vehicles, people, payments, and social providers.
- `src/data/properties.json` contains guesthouse listings and their detail content.
- `src/data/amenity-filters.json` defines the guesthouse amenity filters.
- `src/i18n/locales.json`, `src/i18n/property-locales.json`, and `src/i18n/languages.json` contain translations and locale metadata.

The homepage loads its catalog through `src/data/content-client.ts` from `/data/home.json`. The `/data/home.json` and `/data/properties.json` routes are generated from the same source files, so those endpoints can later be redirected to an API without changing the homepage rendering code. Property pages also read the JSON catalog at build time to generate static routes; switching those pages to API-managed listings will require server-rendered routes or a client-side detail-page strategy.

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
