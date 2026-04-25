import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'data', 'data.json')

function readData() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return { questions: [], feedbacks: [] }
  }
}

function writeData(data: any) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8')
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')
  const data = readData()

  if (type === 'questions') {
    const enabledQuestions = data.questions
      .filter((q: any) => q.enabled !== false)
      .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
    return NextResponse.json(enabledQuestions)
  }

  if (type === 'feedbacks') {
    return NextResponse.json(data.feedbacks || [])
  }

  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = readData()

    if (body.type === 'feedback') {
      const feedback = {
        id: Date.now(),
        question: body.question,
        type: body.type_value,
        errorType: body.errorType || '',
        correctInfo: body.correctInfo || '',
        contactInfo: body.contactInfo || '',
        createdAt: new Date().toISOString(),
      }
      data.feedbacks.push(feedback)
      writeData(data)
      return NextResponse.json({ success: true, feedback })
    }

    if (body.type === 'question') {
      const question = {
        id: Date.now(),
        title: body.title,
        category: body.category || '默认分类',
        enabled: true,
        order: data.questions.length + 1,
      }
      data.questions.push(question)
      writeData(data)
      return NextResponse.json({ success: true, question })
    }

    return NextResponse.json({ error: '未知操作类型' }, { status: 400 })
  } catch {
    return NextResponse.json({ error: '请求数据格式错误' }, { status: 400 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const data = readData()

    if (body.action === 'update-question') {
      const index = data.questions.findIndex((q: any) => q.id === body.id)
      if (index !== -1) {
        data.questions[index] = { ...data.questions[index], ...body.updates }
        writeData(data)
        return NextResponse.json({ success: true })
      }
      return NextResponse.json({ error: '问题不存在' }, { status: 404 })
    }

    if (body.action === 'delete-question') {
      data.questions = data.questions.filter((q: any) => q.id !== body.id)
      writeData(data)
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: '未知操作类型' }, { status: 400 })
  } catch {
    return NextResponse.json({ error: '请求数据格式错误' }, { status: 400 })
  }
}
