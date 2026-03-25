const http = require('http');
const https = require('https');
const url = require('url');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

// MIME类型映射
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // 设置CORS头
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // API代理路由 - Kimi
    if (pathname === '/api/kimi') {
        try {
            let body = '';
            req.on('data', chunk => body += chunk);
            req.on('end', async () => {
                const requestData = JSON.parse(body);

                const options = {
                    hostname: 'api.moonshot.cn',
                    port: 443,
                    path: '/v1/chat/completions',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': requestData.authorization
                    }
                };

                const proxyReq = https.request(options, (proxyRes) => {
                    let data = '';
                    proxyRes.on('data', chunk => data += chunk);
                    proxyRes.on('end', () => {
                        res.writeHead(proxyRes.statusCode, { 'Content-Type': 'application/json' });
                        res.end(data);
                    });
                });

                proxyReq.on('error', (error) => {
                    console.error('Kimi API请求错误:', error);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: '代理请求失败', message: error.message }));
                });

                proxyReq.write(JSON.stringify({
                    model: requestData.model,
                    messages: requestData.messages,
                    temperature: requestData.temperature,
                    max_tokens: requestData.max_tokens,
                    tools: [
                        {
                            type: "builtin_function",
                            function: {
                                name: "$web_search"
                            }
                        }
                    ]
                }));
                proxyReq.end();
            });
        } catch (error) {
            console.error('代理错误:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: '服务器错误', message: error.message }));
        }
        return;
    }

    // API代理路由 - 智谱AI
    if (pathname === '/api/zhipu') {
        try {
            let body = '';
            req.on('data', chunk => body += chunk);
            req.on('end', async () => {
                const requestData = JSON.parse(body);

                const options = {
                    hostname: 'open.bigmodel.cn',
                    port: 443,
                    path: '/api/paas/v4/chat/completions',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': requestData.authorization
                    }
                };

                const proxyReq = https.request(options, (proxyRes) => {
                    let data = '';
                    proxyRes.on('data', chunk => data += chunk);
                    proxyRes.on('end', () => {
                        res.writeHead(proxyRes.statusCode, { 'Content-Type': 'application/json' });
                        res.end(data);
                    });
                });

                proxyReq.on('error', (error) => {
                    console.error('智谱AI API请求错误:', error);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: '代理请求失败', message: error.message }));
                });

                proxyReq.write(JSON.stringify({
                    model: requestData.model,
                    messages: requestData.messages,
                    temperature: requestData.temperature,
                    max_tokens: requestData.max_tokens
                }));
                proxyReq.end();
            });
        } catch (error) {
            console.error('代理错误:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: '服务器错误', message: error.message }));
        }
        return;
    }

    // 静态文件服务
    let filePath = pathname === '/' ? '/index.html' : pathname;
    filePath = path.join(__dirname, filePath);

    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 Not Found</h1>');
            } else {
                res.writeHead(500);
                res.end(`Server Error: ${err.code}`);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log('='.repeat(60));
    console.log('🎰 赛博老虎机 - 本地代理服务器已启动');
    console.log('='.repeat(60));
    console.log(`📍 访问地址: http://localhost:${PORT}`);
    console.log(`📡 API代理: http://localhost:${PORT}/api/kimi`);
    console.log('='.repeat(60));
    console.log('按 Ctrl+C 停止服务器');
    console.log('='.repeat(60));
});
