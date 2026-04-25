# SearchSection 组件 Dify API 集成完成

## 更新概述

已成功修改 SearchSection 和 FeaturedQuestions 组件，使其直接集成 Dify API 调用。用户无需依赖路由，即可在搜索和热门问题选择时获得实时答案和知识库引用。

## 修改内容

### 1. SearchSection 组件 (`/components/search-section.tsx`)

**主要改进：**
- 新增 API 直接调用逻辑，支持 Dify API 和火山引擎 API 的自动回退
- 修改回调函数签名，从 `onSearch(question)` 改为 `onSearch(question, answer, retrieverResources)`
- 添加 `isLoading` 属性支持，优化用户界面反馈
- 集成完整的错误处理和日志记录

**请求流程：**
```
用户输入 → 点击提问 → 调用 /api/dify → 
收到答案 + retriever_resources → 
调用回调函数 → 页面更新
```

**请求格式：**
```json
{
  "query": "用户输入的问题"
}
```

**响应处理：**
```javascript
{
  "answer": "从data.answer提取",
  "retriever_resources": "从data.retriever_resources提取数组"
}
```

### 2. FeaturedQuestions 组件 (`/components/featured-questions.tsx`)

**主要改进：**
- 新增 Dify API 集成，每个热门问题卡片都会触发 API 调用
- 修改回调函数签名，匹配 SearchSection 的新格式
- 完整的错误处理，支持 Dify 和火山引擎 API 自动切换

### 3. page.tsx 修改

**核心变更：**
- 简化 `handleSearchSubmit` 函数，从异步 API 调用改为同步状态更新
- 移除了重复的 API 调用逻辑（现已在组件层实现）
- 添加 `retrieverResources` 状态来存储知识库引用

## 工作流程

### 首页搜索流程
1. 用户在搜索框输入问题
2. 点击"提问"按钮或按 Enter
3. SearchSection 组件调用 `/api/dify`
4. 获取答案和 retriever_resources
5. 调用回调函数 `handleSearchSubmit(question, answer, retrieverResources)`
6. 页面状态更新，展示结果页

### 热门问题流程
1. 用户点击热门问题卡片
2. FeaturedQuestions 组件调用 `/api/dify`
3. 获取答案和 retriever_resources
4. 调用相同的回调函数 `handleSearchSubmit`
5. 页面状态更新，展示结果页

## API 回退机制

如果 Dify API 不可用或未配置：
1. SearchSection 捕获错误
2. 自动回退到 `/api/chat`（火山引擎 API）
3. 继续处理用户请求，无中断

## 知识库资源显示

Dify 返回的 `retriever_resources` 数组会被保存到页面状态中，用于在结果页面显示：

```tsx
{retrieverResources.length > 0 && (
  <RetrieverResources resources={retrieverResources} />
)}
```

## 日志记录

应用会记录所有 API 调用的详细信息：

```javascript
console.log('[v0] 成功获取答案，知识库资源数:', retrieverResources.length)
console.log('[v0] Dify API 不可用或失败，尝试火山引擎 API')
console.error('[v0] 调用API失败:', error)
```

## 性能优化

- API 调用在组件层实现，避免不必要的重新渲染
- 错误处理优雅，用户体验流畅
- 支持 Loading 状态，提供视觉反馈

## 测试验证

所有功能已通过以下验证：
- ✅ 应用成功编译（无 TypeScript 错误）
- ✅ API 路由正常工作（返回有效响应）
- ✅ 前端页面正确渲染
- ✅ 搜索框和热门问题卡片可交互

## 配置要求

在 `.env.local` 中配置：

```bash
# Dify API Key
DIFY_API_KEY=your_actual_dify_api_key

# 可选：火山引擎回退 API
VOLC_ACCESS_KEY=your_volc_key_here
VOLC_MODEL_ID=your_model_id_here
```

## 文件修改汇总

| 文件 | 修改类型 | 说明 |
|------|--------|------|
| `/components/search-section.tsx` | 修改 | 集成 Dify API 调用 |
| `/components/featured-questions.tsx` | 修改 | 集成 Dify API 调用 |
| `/app/page.tsx` | 修改 | 简化回调逻辑 |

## 后续改进建议

1. 添加请求限流，防止过频繁的 API 调用
2. 实现本地缓存，优化重复问题的响应速度
3. 添加问题追踪，记录用户搜索历史
4. 实现分析统计，了解热门问题趋势

