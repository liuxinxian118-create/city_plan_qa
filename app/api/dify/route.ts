import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()

    // 验证输入
    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: '问题文本不能为空' },
        { status: 400 }
      )
    }

    // 获取环境变量
    const difyApiKey = process.env.DIFY

    if (!difyApiKey) {
      console.error('[v0] 缺少环境变量：DIFY_API_KEY')
      return NextResponse.json(
        { error: '服务器配置不完整：Dify API Key 未配置' },
        { status: 500 }
      )
    }

    // 调用 Dify API
    const response = await fetch('https://api.dify.ai/v1/chat-messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${difyApiKey}`,
      },
      body: JSON.stringify({
        query: query,
        user: "web-user",
        response_mode: "blocking",
        inputs: {},   // 必须添加这个字段，即使为空
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('[v0] Dify API 请求失败:', response.status, errorData)
      return NextResponse.json(
        { error: `Dify API 请求失败: ${response.status}` },
        { status: response.status }
      )
    }

    const data = await response.json()

    console.log('[v0] 成功调用 Dify API，问题:', query.substring(0, 50))

    // 提取和处理来源信息
    let answer = data.answer || ''
    let sources: any[] = []

    // 处理 retriever_resources（来自知识库的引用）
    if (data.retriever_resources && Array.isArray(data.retriever_resources)) {
      console.log('[v0] 找到知识库资源数量:', data.retriever_resources.length)
      
      sources = data.retriever_resources.map((res: any, index: number) => ({
        id: res.document_id || `source-${index}`,
        name: res.document_name || res.title || '未知文档',
        department: res.source || '知识库',
        date: res.create_date || new Date().toISOString().split('T')[0],
        status: 'effective' as const,
        content: res.content || res.text || '',
        metadata: res.metadata || {},
        score: res.score || null,
        link: res.url || undefined,
      }))
    }

    // 返回答案和来源信息
    return NextResponse.json({
      answer: answer,
      sources: sources,
      retriever_resources: data.retriever_resources || [],  // 原始数据也返回，便于调试
      conversation_id: data.conversation_id,
      message_id: data.message_id,
      metadata: data.metadata,
    })
  } catch (error) {
    console.error('[v0] Dify API 路由错误:', error)
    return NextResponse.json(
      { error: '处理请求时出错' },
      { status: 500 }
    )
  }
}
