# Dinou Starter App

This project was bootstrapped with `create-dinou`.

It is a Full-Stack React 19 application configured with Server Components, Streaming SSR, and Hybrid Rendering.

## 🚀 Getting Started

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `src/page.tsx`. The page auto-updates as you edit the file.

## 📂 Project Structure

Dinou uses a **file-system based router**. Your file structure defines your URL paths.

```text
.
├── public/          # Static assets (images, fonts, etc.)
├── src/
│   ├── components/  # Shared React components
│   ├── layout.tsx   # Root layout (wraps all pages)
│   ├── page.tsx     # Home page route (/)
│   └── ...          # Other routes
├── package.json
└── README.md
```

### Routing Examples

- `src/page.tsx` → `localhost:3000/`
- `src/about/page.tsx` → `localhost:3000/about`
- `src/blog/[slug]/page.tsx` → `localhost:3000/blog/hello-world`

## 🛠️ Scripts

- `npm run dev`: Starts the development server with HMR.
- `npm run build`: Builds the app for production (generates SSG pages).
- `npm start`: Starts the production server.

## ⚡ Key Features Available

- **React Server Components:** Fetch data directly in your components using `async/await`.
- **Server Functions:** Execute server-side logic from the client without API endpoints.
- **Hybrid Rendering:** Automatic switching between Static (SSG) and Dynamic (SSR) rendering.
- **Styling:** CSS Modules and Tailwind CSS (if selected) are supported out of the box.

## 📚 Learn More

To learn more about Dinou, check out the following resources:

- [Dinou Documentation](https://dinou.dev) - learn about Dinou features and API.
- [Dinou GitHub Repository](https://github.com/roggc/dinou) - your feedback and contributions are welcome!

## ☁️ Deployment

To deploy your Dinou app, build it locally and start the server, or deploy to any Node.js hosting provider.

```bash
npm run build
npm start
```
