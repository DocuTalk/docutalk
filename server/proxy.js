import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Enable CORS for your React app
app.use(cors({
    origin: 'http://localhost:5173', // Your React dev server
    methods: ['POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept']
}));

// Proxy middleware configuration
app.use('/api', createProxyMiddleware({
    target: 'https://hswjwoazxj.execute-api.eu-west-2.amazonaws.com',
    changeOrigin: true,
    pathRewrite: {
        '^/api': '/docutalk_upload_prod'
    },
    onProxyReq: (proxyReq, req, res) => {
        // Log the outgoing request
        console.log('Proxying request to:', proxyReq.path);
    },
    onProxyRes: (proxyRes, req, res) => {
        // Log the response
        console.log('Received response with status:', proxyRes.statusCode);
    }
}));

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Proxy server running on http://localhost:${PORT}`);
}); 