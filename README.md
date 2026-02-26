[![Netlify Status](https://api.netlify.com/api/v1/badges/e8b01999-bdd7-4c4a-b2a6-deef4d96ec67/deploy-status)](https://app.netlify.com/projects/weirdanimals/deploys)

# Bestiary - Digital Animal Encyclopedia

A modern web application showcasing Earth's most fascinating and unusual creatures, built with React, Vite, and managed through Decap CMS.

## 🚀 Getting Started

### Prerequisites

- Node.js 20.19.0+ (use `nvm` to manage versions)
- npm or yarn package manager

### Installation & Development

1. **Clone and install dependencies:**

   ```bash
   git clone <repository-url>
   cd bestiary
   npm install
   ```

2. **Start development server:**

   ```bash
   npm run dev
   ```

   Open [http://localhost:5173](http://localhost:5173) in your browser.

3. **Access CMS for content management:**
   ```bash
   npm run serve:public
   ```
   Then visit [http://localhost:8080/admin](http://localhost:8080/admin) to manage content.

## 📝 Content Management

### Using Decap CMS

This project uses **Decap CMS** for content management, allowing you to:

- ✅ **Add/edit animal categories** - Create new animal classifications
- ✅ **Add/edit animals** - Add detailed animal profiles with images
- ✅ **Manage homepage content** - Update site messaging
- ✅ **Version control** - All changes are tracked in Git

### Content Structure

```
src/data/
├── categories/          # Animal category definitions
│   ├── mammals.json
│   ├── birds.json
│   └── ...
└── animals/            # Individual animal profiles
    ├── african-elephant.json
    ├── vampire-squid.json
    └── ...
```

### Adding New Content

1. **Via CMS (Recommended):**

   - Run `npm run serve:public`
   - Go to `http://localhost:8080/admin`
   - Use the intuitive interface to add/edit content

2. **Via JSON files (Advanced):**
   - Create new JSON files following existing structure
   - Files are automatically discovered by the application

## 🛠 Available Scripts

- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run serve:public` - Serve public folder for CMS access
- `npm run lint` - Run ESLint

## 🏗 Tech Stack

- **Frontend:** React 19 + TypeScript
- **Build Tool:** Vite 7.x
- **Styling:** Tailwind CSS 4.x
- **Routing:** React Router DOM
- **CMS:** Decap CMS (formerly Netlify CMS)
- **Content:** JSON-based data files

## 📁 Project Structure

```
bestiary/
├── public/
│   └── admin/           # Decap CMS configuration
├── src/
│   ├── components/      # Reusable React components
│   ├── features/        # Feature-based modules
│   │   ├── Animal/      # Animal-related logic
│   │   └── AnimalCategory/  # Category-related logic
│   ├── data/           # Content JSON files
│   └── pages/          # Page components
└── tailwind.config.js  # Styling configuration
```

## 🎨 Key Features

- **Dynamic Content Loading** - Uses Vite's `import.meta.glob` for automatic content discovery
- **Type-Safe** - Full TypeScript support with proper interfaces
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **SEO Ready** - Structured data and semantic HTML
- **Git-based CMS** - All content changes are version controlled

## 🗺 Sitemap

The sitemap is available at:
[https://weirdanimals.life/sitemap.xml](https://weirdanimals.life/sitemap.xml)

## 🔧 Development Tips

### Adding New Animal Categories

1. Create a new JSON file in `src/data/categories/`
2. Follow the `AnimalCategory` interface structure
3. The filename becomes the category slug automatically

### Adding New Animals

1. Create a new JSON file in `src/data/animals/`
2. Follow the `Animal` interface structure
3. Reference existing category names exactly
4. The filename becomes the animal slug automatically

### Path Aliases

Use these convenient imports:

- `~features/*` → `src/features/*`
- `@/*` → `src/*`

## 📦 Deployment

1. **Build the project:**

   ```bash
   npm run build
   ```

2. **Deploy the `dist/` folder** to your hosting platform

3. **Configure CMS backend** for your hosting provider (Netlify, GitHub, etc.)

---

_Discover Earth's most extraordinary creatures! 🦅🐙🦎_
