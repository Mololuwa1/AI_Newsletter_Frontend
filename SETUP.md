# AI Newsletter Generator - Local Development Setup

## 📥 Download and Setup Instructions

### Prerequisites
Before you begin, ensure you have the following installed on your computer:
- [Node.js](https://nodejs.org/) (version 16 or higher)
- [VS Code](https://code.visualstudio.com/)
- [Git](https://git-scm.com/) (optional, for version control)

### Step 1: Download the Project
1. **From Bolt.new**: Click the download button or export option to get the project files
2. **Extract the files** to your desired directory (e.g., `C:\Projects\ai-newsletter-generator` or `~/Projects/ai-newsletter-generator`)

### Step 2: Open in VS Code
1. **Launch VS Code**
2. **Open the project folder**:
   - File → Open Folder
   - Navigate to your extracted project directory
   - Click "Select Folder"

### Step 3: Install Dependencies
1. **Open VS Code Terminal**:
   - Terminal → New Terminal (or press `Ctrl+`` )
2. **Install project dependencies**:
   ```bash
   npm install
   ```
   This will install all required packages including React, TypeScript, Tailwind CSS, and Recharts.

### Step 4: Start Development Server
1. **Run the development server**:
   ```bash
   npm run dev
   ```
2. **Open your browser** and navigate to `http://localhost:5173`
3. The application should now be running locally!

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint for code quality

## 📁 Project Structure

```
ai-newsletter-generator/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── charts/        # Chart components
│   │   ├── DataUpload.tsx
│   │   ├── InteractiveSection.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── NewsletterPreview.tsx
│   │   ├── QuickDemo.tsx
│   │   └── SampleDataViewer.tsx
│   ├── App.tsx            # Main application
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind configuration
├── tsconfig.json          # TypeScript configuration
└── vite.config.ts         # Vite configuration
```

## 🎯 VS Code Recommended Extensions

Install these extensions for the best development experience:

### Essential Extensions:
1. **ES7+ React/Redux/React-Native snippets** - React code snippets
2. **TypeScript Importer** - Auto import TypeScript modules
3. **Tailwind CSS IntelliSense** - Tailwind class autocomplete
4. **Prettier - Code formatter** - Code formatting
5. **Auto Rename Tag** - Rename paired HTML/JSX tags
6. **Bracket Pair Colorizer** - Color matching brackets
7. **GitLens** - Enhanced Git capabilities

### Installation:
1. Open VS Code Extensions panel (`Ctrl+Shift+X`)
2. Search for each extension name
3. Click "Install" for each one

## 🚀 Development Tips

### Hot Reload
- The development server supports hot reload
- Changes to your code will automatically refresh the browser
- No need to manually restart the server for most changes

### Code Organization
- Each chart component is in `src/components/charts/`
- Main application logic is in `src/App.tsx`
- Styling uses Tailwind CSS classes
- All components are fully typed with TypeScript

### Customization
- **Colors**: Modify gradient schemes in component files
- **Charts**: Customize chart types and data in chart components
- **Layout**: Adjust responsive breakpoints in Tailwind classes
- **Content**: Update sample data in component files

## 🔧 Troubleshooting

### Common Issues:

**Port already in use:**
```bash
# Kill process on port 5173
npx kill-port 5173
# Or use a different port
npm run dev -- --port 3000
```

**Dependencies not installing:**
```bash
# Clear npm cache
npm cache clean --force
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**TypeScript errors:**
```bash
# Check TypeScript configuration
npx tsc --noEmit
```

## 📦 Building for Production

When ready to deploy:

```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service like Netlify, Vercel, or GitHub Pages.

## 🤝 Development Workflow

1. **Make changes** to components in `src/`
2. **View changes** automatically in browser
3. **Test functionality** using the Quick Demo
4. **Upload custom data** to test with different datasets
5. **Build and deploy** when ready for production

## 📝 Next Steps

- Explore the interactive charts in the newsletter preview
- Try uploading your own CSV data
- Customize the styling and branding
- Add new chart types or data visualizations
- Integrate with real data sources or APIs

---

**Need Help?** Check the console for error messages or refer to the component documentation in the source files.