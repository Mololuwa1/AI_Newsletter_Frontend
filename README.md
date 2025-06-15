# AI Newsletter Generator Frontend

A modern, interactive React application that transforms business data into dynamic newsletters with AI-powered insights and advanced data visualizations.

## 🚀 Features

- **Interactive Charts**: Revenue trends, customer growth, satisfaction gauges, and product performance
- **Dynamic Content**: Expandable sections with raw data toggles
- **AI-Generated Insights**: Smart narratives for each visualization
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Professional UI**: Modern gradients, animations, and micro-interactions

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (version 16 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [VS Code](https://code.visualstudio.com/) (recommended editor)

## 🛠️ Installation & Setup

1. **Extract the downloaded files** to your desired directory
2. **Open the project in VS Code**:
   ```bash
   code ai-newsletter-generator
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Start the development server**:
   ```bash
   npm run dev
   ```
5. **Open your browser** and navigate to `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/
│   ├── charts/                 # Chart components
│   │   ├── RevenueChart.tsx
│   │   ├── CustomerGrowthChart.tsx
│   │   ├── SatisfactionGauge.tsx
│   │   └── ProductPerformanceChart.tsx
│   ├── DataUpload.tsx          # File upload functionality
│   ├── InteractiveSection.tsx  # Expandable sections
│   ├── LoadingSpinner.tsx      # Loading states
│   ├── NewsletterPreview.tsx   # Main newsletter display
│   ├── QuickDemo.tsx           # Demo functionality
│   └── SampleDataViewer.tsx    # Sample data display
├── App.tsx                     # Main application component
├── main.tsx                    # Application entry point
└── index.css                   # Global styles
```

## 🎨 Key Technologies

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Recharts** - Interactive data visualizations
- **Lucide React** - Beautiful icons
- **Vite** - Fast development and building

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎯 Development Tips

### VS Code Extensions (Recommended)
- **ES7+ React/Redux/React-Native snippets** - React code snippets
- **Tailwind CSS IntelliSense** - Tailwind class autocomplete
- **TypeScript Importer** - Auto import TypeScript modules
- **Prettier** - Code formatting
- **Auto Rename Tag** - Rename paired HTML/JSX tags

### Code Organization
- Each chart component is self-contained with its own props interface
- Interactive sections use consistent color schemes
- All components are fully typed with TypeScript
- Responsive design uses Tailwind's mobile-first approach

### Customization
- **Colors**: Modify the gradient schemes in component files
- **Charts**: Customize chart types and data in the chart components
- **Layout**: Adjust responsive breakpoints in Tailwind classes
- **Animations**: Modify transition classes for different effects

## 📊 Chart Components

### RevenueChart
- Line chart showing revenue trends over time
- Compares current year vs previous year
- Includes formatted currency tooltips

### CustomerGrowthChart
- Bar chart displaying new customer acquisition
- Shows monthly growth patterns
- Includes growth narrative

### SatisfactionGauge
- Circular progress indicator
- Shows current score vs target
- Color-coded based on performance

### ProductPerformanceChart
- Horizontal bar chart for product comparison
- Revenue-based ranking
- Includes units sold data

## 🎨 Styling Guide

The application uses a consistent design system:
- **Primary Colors**: Blue to purple gradients
- **Secondary Colors**: Green, orange, purple accents
- **Typography**: System fonts with proper hierarchy
- **Spacing**: 8px grid system
- **Shadows**: Subtle elevation effects

## 🚀 Deployment

To build for production:
```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is open source and available under the MIT License.

## 🆘 Support

If you encounter any issues:
1. Check the console for error messages
2. Ensure all dependencies are installed
3. Verify Node.js version compatibility
4. Check the GitHub issues for similar problems

---

Built with ❤️ using React, TypeScript, and Tailwind CSS