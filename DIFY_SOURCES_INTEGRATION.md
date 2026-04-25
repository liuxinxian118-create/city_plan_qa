# Dify 知识库来源集成完成

## 项目完成总结

已成功实现了智慧城市政策问答助手与 Dify 知识库的完整集成，包括动态来源数据的提取、处理和展示。

## 核心改进

### 1. 后端 API 改进 (`/app/api/dify/route.ts`)

**增强功能：**
- 新增 `sources` 字段处理，将 `retriever_resources` 转换为标准的政策卡片格式
- 每个来源对象包含：
  - `id`: 文档ID
  - `name`: 文档名称
  - `department`: 来源单位
  - `date`: 发布日期
  - `status`: 有效性状态
  - `content`: 文档内容摘录
  - `score`: 匹配度评分（来自Dify）
  - `link`: 原文链接

**返回格式：**
```json
{
  "answer": "回答内容",
  "sources": [
    {
      "id": "doc-id",
      "name": "文档名称",
      "department": "发布单位",
      "date": "2024-01-01",
      "status": "effective",
      "content": "内容摘录",
      "score": 0.95,
      "metadata": {}
    }
  ],
  "retriever_resources": [...],
  "conversation_id": "...",
  "message_id": "..."
}
```

### 2. 前端状态管理改进 (`/app/page.tsx`)

**核心变化：**
- 新增 `sources` 状态，专门存储来自 Dify 的知识库来源
- 修改 `handleSearchSubmit` 处理逻辑，从 `retriever_resources` 中提取来源数据
- 移除模拟政策数据，改为使用真实 Dify 返回的来源

**状态数据流：**
```
SearchSection/FeaturedQuestions 
  ↓ (调用 /api/dify)
后端处理并返回 sources
  ↓
handleSearchSubmit(question, answer, sources)
  ↓
setSources() 设置状态
  ↓
PoliciesSection 渲染动态政策卡片
```

### 3. 政策卡片增强 (`/components/policies-section.tsx`)

**新功能：**
- 支持动态数据展示，不依赖模拟数据
- 显示文档摘要内容（`content` 字段）
- 显示匹配度评分（`score` 字段）
- 空状态提示（当无来源时显示友好提示）
- 改进的样式和布局

**显示的字段：**
- 文档名称、发布单位、发布日期
- 内容摘要（带截断）
- 匹配度评分百分比
- 有效性状态徽章
- 查看原文链接

### 4. 组件集成改进

**SearchSection 和 FeaturedQuestions：**
- 优先使用处理后的 `sources` 字段
- 如果不存在则回退到 `retriever_resources`
- 完整的错误处理和日志记录

## 工作流程

### 用户查询流程
1. 用户在搜索框输入问题或点击热门问题
2. SearchSection/FeaturedQuestions 调用 `/api/dify`
3. 后端处理 Dify API 响应：
   - 提取答案
   - 处理 retriever_resources
   - 转换为标准 sources 格式
4. 返回 `{ answer, sources, retriever_resources, ... }`
5. 前端接收并设置状态
6. 结果页显示答案和动态政策卡片

## 数据格式转换

### Dify API 原始格式 → 标准格式

```javascript
// Dify API 返回的 retriever_resources
{
  "document_id": "doc-123",
  "document_name": "《土地管理法》",
  "content": "第35条规定...",
  "score": 0.95,
  "create_date": "2019-08-26"
}

// 转换后的 sources 格式
{
  "id": "doc-123",
  "name": "《土地管理法》",
  "department": "知识库",  // 从 source 或默认值获取
  "date": "2019-08-26",
  "status": "effective",
  "content": "第35条规定...",
  "score": 0.95,
  "link": undefined  // 如果有 URL 则填充
}
```

## 特性优势

1. **动态内容** - 不再依赖硬编码的模拟数据
2. **智能匹配** - 显示 Dify 计算的匹配度评分
3. **内容摘要** - 在卡片中展示文档摘要
4. **优雅降级** - 无来源数据时显示友好提示
5. **完整链路** - 从 API 到渲染的完整数据处理流程

## 测试验证

所有功能已通过以下验证：

- ✅ 应用成功编译（生产构建通过）
- ✅ Dify API 路由正常工作，返回有效响应
- ✅ 前端正确处理 sources 数据
- ✅ 政策卡片动态渲染
- ✅ 空状态处理（无来源时显示提示）
- ✅ 错误处理完整

## API 测试示例

```bash
curl -X POST http://localhost:3000/api/dify \
  -H "Content-Type: application/json" \
  -d '{"query":"什么是基本农田？"}'

# 响应
{
  "answer": "基本农田是指...",
  "sources": [
    {
      "id": "doc-1",
      "name": "《中华人民共和国土地管理法》",
      "department": "知识库",
      "date": "2019-08-26",
      "status": "effective",
      "content": "第三十五条规定...",
      "score": 0.98
    }
  ],
  ...
}
```

## 文件修改清单

| 文件 | 修改内容 |
|------|--------|
| `/app/api/dify/route.ts` | 新增 sources 处理、数据转换逻辑 |
| `/app/page.tsx` | 添加 sources 状态、优化数据处理 |
| `/components/search-section.tsx` | 优先使用 sources，回退 retriever_resources |
| `/components/featured-questions.tsx` | 同步修改，使用 sources 数据 |
| `/components/policies-section.tsx` | 支持空状态、显示内容摘要和评分 |

## 生产部署建议

1. 配置 `DIFY_API_KEY` 环境变量
2. 测试 Dify 知识库索引和检索效果
3. 监控 API 响应时间和准确性
4. 定期更新知识库内容

## 后续优化方向

1. 实现查询结果缓存
2. 添加知识库反馈机制
3. 支持多轮对话上下文
4. 实现问题意图识别
5. 添加相关问题推荐

