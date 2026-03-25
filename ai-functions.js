// AI脚本生成功能 - 可编辑提示词版本

let selectedDuration = 15;
const DEFAULT_KIMI_API_KEY = 'sk-4muwiAhoYt08CYkcFfGhdUIWhuQZK6hUcyE7FgkWB5YAEY38';

// 默认提示词模板
const DEFAULT_PROMPT_TEMPLATE = `你是一个深谙中文互联网抽象文化的创意编剧，熟悉B站、抖音、微博等平台的网络梗和流行语。

请基于以下元素，创作一个{DURATION}秒的短视频脚本：
{ELEMENTS}

要求：
1. 充分理解并运用这些网络梗，用抽象、幽默、有梗的方式呈现
2. 语言风格要符合B站鬼畜区/抽象区的调性，可以玩梗、造句、打破第四面墙
3. 脚本要包含：开场钩子、内容展开、结尾爆点/反转
4. 标注每个环节的时间节点（如 0-3s、3-8s 等）
5. 给出画面描述和台词/字幕建议
6. 可以自我调侃、玩meta梗（如"这段要是火了..."）
7. 语气不要太正经，要有"发疯文学"的松弛感

请直接输出脚本内容，用markdown格式，包含：
- 📋 脚本标题
- ⏱️ 时间轴（带具体秒数）
- 🎬 画面描述
- 💬 台词/字幕
- 🏷️ 3-5个推荐标签`;

function selectDuration(duration) {
    selectedDuration = duration;
    document.querySelectorAll('.duration-btn').forEach(btn => {
        btn.classList.remove('active');
        if (parseInt(btn.dataset.duration) === duration) {
            btn.classList.add('active');
        }
    });
}

function onProviderChange() {
    const provider = document.getElementById('aiProvider').value;
    const apiKeyInput = document.getElementById('apiKey');

    if (provider === 'kimi') {
        apiKeyInput.value = DEFAULT_KIMI_API_KEY;
        apiKeyInput.placeholder = '使用默认Kimi API Key';
    } else {
        apiKeyInput.value = '';
        apiKeyInput.placeholder = '输入API Key';
    }
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
    const apiKeyInput = document.getElementById('apiKey');
    if (apiKeyInput) {
        apiKeyInput.value = DEFAULT_KIMI_API_KEY;
    }
});

// 提示词编辑器功能
function togglePromptEditor() {
    const container = document.getElementById('promptEditorContainer');
    const toggleText = document.getElementById('promptToggleText');
    const textarea = document.getElementById('customPrompt');

    if (container.style.display === 'none') {
        container.style.display = 'block';
        toggleText.textContent = '收起';
        // 如果没有内容，填充默认模板
        if (!textarea.value.trim()) {
            textarea.value = DEFAULT_PROMPT_TEMPLATE;
        }
    } else {
        container.style.display = 'none';
        toggleText.textContent = '展开';
    }
}

function resetPrompt() {
    const textarea = document.getElementById('customPrompt');
    if (confirm('确定要恢复默认提示词吗？')) {
        textarea.value = DEFAULT_PROMPT_TEMPLATE;
    }
}

function previewPrompt() {
    const customPrompt = document.getElementById('customPrompt').value.trim();
    const finalPrompt = buildPrompt(selectedDuration, customPrompt);

    // 创建预览弹窗
    const modal = document.createElement('div');
    modal.className = 'preview-modal';
    modal.innerHTML = `
        <div class="preview-modal-content">
            <div class="preview-modal-header">
                <span class="preview-modal-title">👁️ 完整提示词预览</span>
                <button class="close-modal-btn" onclick="this.closest('.preview-modal').remove()">×</button>
            </div>
            <div class="preview-content">${escapeHtml(finalPrompt)}</div>
        </div>
    `;
    modal.onclick = (e) => {
        if (e.target === modal) modal.remove();
    };
    document.body.appendChild(modal);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function buildPrompt(duration, customTemplate = null) {
    const parts = [];
    if (!disabledState['classic']) parts.push(`经典梗：${currentResult.classic}`);
    if (!disabledState['trending']) parts.push(`热梗：${currentResult.trending}`);
    if (!disabledState['format']) parts.push(`形式：${currentResult.format}`);
    if (!disabledState['style']) parts.push(`风格：${currentResult.style}`);
    if (!disabledState['sound']) parts.push(`音效：${currentResult.sound}`);
    if (!disabledState['color']) parts.push(`配色：${currentResult.color}`);

    const elements = parts.join('、') || '随机抽象元素';

    // 使用自定义模板或默认模板
    const template = customTemplate || DEFAULT_PROMPT_TEMPLATE;

    // 替换模板中的变量
    return template
        .replace(/{DURATION}/g, duration)
        .replace(/{ELEMENTS}/g, elements);
}
