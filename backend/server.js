import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';

// Convert file URL to path for ES Modules (__dirname equivalent)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse incoming JSON payloads
  app.use(express.json());

  // Log API requests during development for debugging ease
  app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    next();
  });

  // Register backend API routes
  app.use('/api/products', productRoutes);
  app.use('/api/users', userRoutes);

  // Health Check Endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Setup client serving based on environment
  if (process.env.NODE_ENV !== 'production') {
    console.log('Running in DEVELOPMENT mode. Initializing Vite middleware...');
    
    // Dynamically import Vite server only in development to keep production builds lean
    const { createServer: createViteServer } = await import('vite');
    
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {}
      },
      appType: 'spa',
    });

    // Use Vite's connect instance as middleware to serve frontend
    app.use(vite.middlewares);
  } else {
    console.log('Running in PRODUCTION mode. Serving static files from /dist...');
    
    // Serve static files from the dist directory (output of 'npm run build')
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));

    // Handle SPA routing - send index.html for any unhandled page request
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`=================================================`);
    console.log(`  MERN E-COMMERCE SERVER RUNNING AT:`);
    console.log(`  http://localhost:${PORT}`);
    console.log(`=================================================`);
  });
}

// Start the full-stack server
startServer().catch(err => {
  console.error('Failed to start server:', err);
});
