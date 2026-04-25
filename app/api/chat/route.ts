import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { question } = await request.json()

    // 验证输入
    if (!question || typeof question !== 'string') {
      return NextResponse.json(
        { error: '问题文本不能为空' },
        { status: 400 }
      )
    }

    // 获取环境变量
    const apiKey = process.env.VOLC_ACCESS_KEY
    const modelId = process.env.VOLC_MODEL_ID

    if (!apiKey || !modelId) {
      console.error('[v0] 缺少环境变量：VOLC_ACCESS_KEY 或 VOLC_MODEL_ID')
      return NextResponse.json(
        { error: '服务器配置不完整' },
        { status: 500 }
      )
    }

    // 调用火山引擎 DeepSeek API
    const response = await fetch(
      'https://ark.cn-beijing.volces.com/api/v3/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: modelId,
          messages: [
            {
              role: 'system',
              content: '你是一个专业的中国城市发展和土地政策专家。请根据最新的法律法规和政策文件准确回答用户的问题。',
            },
            {
              role: 'user',
              content: question,
            },
          ],
          temperature: 0.7,
          max_tokens: 2000,
        }),
      }
    )

    if (!response.ok) {
      const errorData = await response.text()
      console.error('[v0] API 请求失败:', response.status, errorData)
      return NextResponse.json(
        { error: `API 请求失败: ${response.status}` },
        { status: response.status }
      )
    }

    const data = await response.json()

    // 提取回答文本
    let answer = ''
    if (data.choices && data.choices.length > 0) {
      answer = data.choices[0].message?.content || '无法获取回答'
    } else {
      answer = '无法获取回答'
    }

    console.log('[v0] 成功调用 API，问题:', question.substring(0, 50))

    return NextResponse.json({ answer })
  } catch (error) {
    console.error('[v0] API 路由错误:', error)
    return NextResponse.json(
      { error: '处理请求时出错' },
      { status: 500 }
    )
  }
}
