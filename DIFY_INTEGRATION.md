# Dify API 集成指南

## 概述

本项目集成了 Dify 知识库问答系统，允许用户通过 API 调用获取基于知识库的答案，包括引用的文档信息。

## 关键特性

1. **Dify API 集成** - 接收用户问题并调用 Dify API 获取答案
2. **知识库引用展示** - 显示 Dify 返回的 `retriever_resources` 中的文档信息
3. **智能回退机制** - 当 Dify API 不可用时自动回退到火山引擎 API
4. **完整响应处理** - 保留 Dify API 的完整响应数据结构

## API 路由

### 端点：`/api/dify`

**方法：** POST

**请求体格式：**
```json
{
  "query": "用户的问题"
}
```

**响应格式：**
```json
{
  "answer": "回答内容",
  "retriever_resources": [
    {
      "document_id": "文档ID",
      "document_name": "文档名称",
      "segment_id": "段落ID",
      "position": 1,
      "content": "相关内容摘录",
      "metadata": {
        "key1": "value1",
        "key2": "value2"
      },
      "hit_count": 0.95
    }
  ],
  "conversation_id": "会话ID",
  "message_id": "消息ID",
  "metadata": { /* 元数据 */ }
}
```

## 环境变量配置

### 必需环境变量

```bash
# Dify API Key
DIFY_API_KEY=your_dify_api_key_here

# 可选：火山引擎回退 API
VOLC_ACCESS_KEY=your_volc_key_here
VOLC_MODEL_ID=your_model_id_here
```

### 本地开发配置

1. 在项目根目录创建 `.env.local` 文件
2. 添加你的 Dify API Key：

```bash
DIFY_API_KEY=your_actual_dify_api_key
```

### Vercel 部署配置

1. 在 Vercel 项目设置中进入 "Environment Variables"
2. 添加 `DIFY_API_KEY` 变量
3. 部署后会自动使用该配置

## Dify API 获取 API Key

1. **云端版本**：访问 https://cloud.dify.ai/
2. **自托管版本**：使用你的自托管 Dify 实例
3. 在 API Keys 页面生成新的 API Key
4. 复制 API Key 到环境变量配置中

## 知识库引用显示

项目包含 `RetrieverResources` 组件用于显示 Dify 返回的知识库文档引用：

```tsx
<RetrieverResources resources={retrieverResources} />
```

### 支持的字段

- `document_name` - 文档名称
- `document_id` - 文档标识符
- `content` - 相关内容摘录
- `metadata` - 文档元数据（标签、来源等）
- `hit_count` - 匹配度评分
- `position` - 段落位置

## 前端集成

在 `app/page.tsx` 中，应用会自动：

1. 首先尝试调用 Dify API (`/api/dify`)
2. 如果失败，自动回退到火山引擎 API (`/api/chat`)
3. 在结果页面显示知识库引用（如果有的话）

## API 调用示例

### 使用 cURL

```bash
curl -X POST http://localhost:3000/api/dify \
  -H "Content-Type: application/json" \
  -d '{"query":"什么是基本农田？"}'
```

### 使用 fetch (JavaScript)

```javascript
const response = await fetch('/api/dify', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ query: '用户的问题' })
})

const data = await response.json()
console.log('答案:', data.answer)
console.log('知识库来源:', data.retriever_resources)
```

## 错误处理

API 会返回以下错误情况：

| 状态码 | 错误信息 | 原因 |
|--------|---------|------|
| 400 | 问题文本不能为空 | query 参数为空或类型错误 |
| 500 | 服务器配置不完整 | DIFY_API_KEY 未设置 |
| 其他 | Dify API 请求失败 | Dify 服务不可用 |

## 日志记录

所有 API 调用都会记录到服务器日志：

```
[v0] 成功调用 Dify API，问题: ...
[v0] Dify API 请求失败: status_code
[v0] Dify API 路由错误: error_message
```

## 最佳实践

1. **API Key 安全**
   - 永远不要在代码中硬编码 API Key
   - 使用环境变量安全存储
   - 定期轮换 API Key

2. **错误处理**
   - 实施适当的重试机制
   - 显示用户友好的错误消息
   - 记录错误用于调试

3. **性能优化**
   - 缓存常见问题的答案
   - 实施请求限流
   - 异步处理长时间运行的请求

## 故障排除

### Dify API Key 验证失败

1. 确认 API Key 是否正确复制
2. 检查 API Key 是否已过期
3. 验证 API Key 的权限设置

### 知识库资源未显示

1. 检查 Dify 知识库是否已上传文档
2. 验证知识库是否已启用
3. 检查 `retriever_resources` 数组是否为空

### 回退到火山引擎 API

如果看到来自火山引擎的答案而不是 Dify，可能表示：

1. Dify API 暂时不可用
2. DIFY_API_KEY 未正确配置
3. Dify 知识库未返回结果

## 支持

如有问题，请参考：
- [Dify 文档](https://docs.dify.ai/)
- [API 参考](https://docs.dify.ai/guides/application-orchestration)
- 项目 GitHub Issues

