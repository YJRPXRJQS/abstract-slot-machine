// Vercel Serverless Function for Zhipu AI API
const https = require('https');

module.exports = async (req, res) => {
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { authorization, model, messages, temperature, max_tokens } = req.body;

    const options = {
      hostname: 'open.bigmodel.cn',
      port: 443,
      path: '/api/paas/v4/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authorization
      }
    };

    const proxyReq = https.request(options, (proxyRes) => {
      let data = '';
      proxyRes.on('data', chunk => data += chunk);
      proxyRes.on('end', () => {
        res.status(proxyRes.statusCode).setHeader('Content-Type', 'application/json');
        res.end(data);
      });
    });

    proxyReq.on('error', (error) => {
      console.error('Zhipu API请求错误:', error);
      res.status(500).json({ error: '代理请求失败', message: error.message });
    });

    proxyReq.write(JSON.stringify({
      model: model || 'glm-4',
      messages: messages,
      temperature: temperature || 0.9,
      max_tokens: max_tokens || 20000
    }));
    proxyReq.end();

  } catch (error) {
    console.error('代理错误:', error);
    res.status(500).json({ error: '服务器错误', message: error.message });
  }
};
