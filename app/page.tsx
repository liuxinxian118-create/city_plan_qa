'use client'

import { flushSync } from 'react-dom';
import { useState } from 'react'
import { Header } from '@/components/header'
import { SearchSection } from '@/components/search-section'
import { FeaturedQuestions } from '@/components/featured-questions'
import { Footer } from '@/components/footer'
import { AnswerTopBar } from '@/components/answer-top-bar'
import { QuestionDisplay } from '@/components/question-display'
import { AnswerContent } from '@/components/answer-content'
import { PoliciesSection } from '@/components/policies-section'
import { FeedbackSection } from '@/components/feedback-section'
import { RetrieverResources } from '@/components/retriever-resources'
import { PolicyDetail } from '@/components/policy-detail'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'

export default function Home() {
  const [currentView, setCurrentView] = useState<'home' | 'result' | 'feedback' | 'policy'>('home')
  const [question, setQuestion] = useState('')
  const [answerText, setAnswerText] = useState('')
  const [loading, setLoading] = useState(false)
  const [sources, setSources] = useState<any[]>([])
  const [retrieverResources, setRetrieverResources] = useState<any[]>([])
  const [selectedPolicy, setSelectedPolicy] = useState<any>(null)
  const [feedbackQuestion, setFeedbackQuestion] = useState('')
  const [errorType, setErrorType] = useState('')
  const [correctInfo, setCorrectInfo] = useState('')
  const [contactInfo, setContactInfo] = useState('')

  // 政策知识库（模拟真实知识库数据）
  const policyDatabase = {
    // 土地管理类
    land: [
      { name: '《中华人民共和国土地管理法》（2019修正版）', department: '全国人大常委会', date: '2019-08-26', content: '国家实行土地用途管制制度。国家编制土地利用总体规划，规定土地用途，将土地分为农用地、建设用地和未利用地。严格限制农用地转为建设用地，控制建设用地总量，对耕地实行特殊保护。' },
      { name: '《中华人民共和国土地管理法实施条例》', department: '国务院', date: '2021-09-01', content: '土地所有权和使用权争议，由当事人协商解决；协商不成的，由人民政府处理。单位之间的争议，由县级以上人民政府处理；个人之间、个人与单位之间的争议，由乡级人民政府或者县级以上人民政府处理。' },
      { name: '《自然资源部关于规范临时用地管理的通知》（自然资规〔2021〕X号）', department: '自然资源部', date: '2021-11-15', content: '临时用地使用期限一般不超过两年。建设周期较长的能源、交通、水利等基础设施建设项目施工使用的临时用地期限不超过四年。' },
    ],
    // 基本农田类
    farmland: [
      { name: '《基本农田保护条例》', department: '国务院', date: '2011-01-08', content: '基本农田保护区经依法划定后，任何单位和个人不得改变或者占用。国家能源、交通、水利、军事设施等重点建设项目选址确实无法避开基本农田保护区，需要占用基本农田的，必须经国务院批准。' },
      { name: '《自然资源部 农业农村部关于加强和改进永久基本农田保护工作的通知》', department: '自然资源部 农业农村部', date: '2019-03-15', content: '永久基本农田经依法划定后，任何单位和个人不得擅自占用或者改变其用途。禁止占用永久基本农田发展林果业和挖塘养鱼。' },
      { name: '《国土资源部关于全面划定永久基本农田实行特殊保护的通知》', department: '原国土资源部', date: '2017-04-05', content: '基本农田保护区调整经原批准机关批准。非农建设确需占用基本农田的，必须报国务院批准，并补划数量和质量相当的基本农田。' },
    ],
    // 规划类
    planning: [
      { name: '《中华人民共和国城乡规划法》', department: '全国人大常委会', date: '2019-04-23', content: '城市规划区内的建设活动应当符合城市规划要求。任何单位和个人都应当遵守城市规划，服从规划管理。' },
      { name: '《自然资源部关于全面开展国土空间规划工作的通知》', department: '自然资源部', date: '2019-05-28', content: '建立全国统一、责权清晰、科学高效的国土空间规划体系。强化国土空间规划对各专项规划的指导约束作用，是党中央作出的重大决策部署。' },
      { name: '《关于建立国土空间规划体系并监督实施的若干意见》（中发〔2019〕18号）', department: '中共中央办公厅 国务院办公厅', date: '2019-05-10', content: '坚持底线思维，把城镇、农业、生态空间和生态保护红线、永久基本农田保护红线、城镇开发边界作为调整经济结构、规划产业发展、推进城镇化不可逾越的红线。' },
    ],
    // 三区三线类
    zone: [
      { name: '《关于在国土空间规划中统筹划定落实三条控制线的指导意见》', department: '中共中央办公厅 国务院办公厅', date: '2019-11-01', content: '按照生态功能划定生态保护红线，按照保质保量要求划定永久基本农田保护红线，按照集约适度、绿色发展要求划定城镇开发边界。三条控制线互相避让，不交叉重叠。' },
      { name: '《自然资源部关于开展“三区三线”划定试点工作的函》', department: '自然资源部', date: '2020-06-15', content: '"三区"是指城镇空间、农业空间、生态空间三种类型的国土空间；"三线"是指分别对应上述三种空间的城镇开发边界、永久基本农田保护红线、生态保护红线三条控制线。' },
      { name: '《省级国土空间规划编制指南（试行）》', department: '自然资源部', date: '2020-09-22', content: '优先保障粮食安全、生态安全、国土安全。以资源环境承载能力和国土空间开发适宜性评价为基础，科学有序统筹布局农业、生态、城镇等功能空间。' },
    ],
    // 征收补偿类
    compensation: [
      { name: '《中华人民共和国土地管理法》第四十七条、第四十八条', department: '全国人大常委会', date: '2019-08-26', content: '征收土地应当给予公平、合理的补偿，保障被征地农民原有生活水平不降低、长远生计有保障。征收土地应当依法及时足额支付土地补偿费、安置补助费以及农村村民住宅、其他地上附着物和青苗等的补偿费用。' },
      { name: '《大中型水利水电工程建设征地补偿和移民安置条例》', department: '国务院', date: '2017-10-07', content: '移民安置工作实行政府领导、分级负责、县为基础、项目法人参与的管理体制。安置方式以农业生产安置为主，结合二三产业安置、自谋职业安置和养老保险安置等多渠道安置移民。' },
      { name: '《国有土地上房屋征收与补偿条例》', department: '国务院', date: '2011-01-21', content: '为了公共利益的需要，征收国有土地上单位、个人的房屋，应当对被征收房屋所有权人给予公平补偿。房屋征收与补偿应当遵循决策民主、程序正当、结果公开的原则。' },
    ],
    // 用地审批类
    approval: [
      { name: '《建设用地审查报批管理办法》', department: '自然资源部', date: '2024-03-01', content: '建设用地实行分级审批。涉及农用地转为建设用地的，应当办理农用地转用审批手续。' },
      { name: '《关于深化规划用地“多审合一、多证合一”改革的通知》', department: '自然资源部', date: '2024-02-20', content: '合并规划选址和用地预审，合并建设用地规划许可和用地批准。优化审批流程，提高审批效率。' },
      { name: '《自然资源部关于进一步做好用地用海要素保障的通知》', department: '自然资源部', date: '2024-01-15', content: '加大重大项目用地保障力度，优化先行用地政策，明确阶段性土地供应政策。' },
    ],
    // 默认通用类
    default: [
      { name: '《中华人民共和国宪法》第十条', department: '全国人民代表大会', date: '2018-03-11', content: '城市的土地属于国家所有。农村和城市郊区的土地，除由法律规定属于国家所有的以外，属于集体所有；宅基地和自留地、自留山，也属于集体所有。' },
      { name: '《民法典》物权编（第三百四十四条-第三百六十三条）', department: '全国人民代表大会', date: '2021-01-01', content: '建设用地使用权人依法对国家所有的土地享有占有、使用和收益的权利，有权利用该土地建造建筑物、构筑物及其附属设施。' },
      { name: '《中共中央 国务院关于建立健全城乡融合发展体制机制和政策体系的意见》', department: '中共中央 国务院', date: '2019-05-05', content: '坚持农业农村优先发展，按照产业兴旺、生态宜居、乡风文明、治理有效、生活富裕的总要求，建立健全城乡融合发展体制机制和政策体系。' },
    ],
  }

  // 根据查询关键词智能匹配相关政策
  const getFallbackSources = (query: string) => {
    const q = query.toLowerCase()

    // 关键词分类匹配
    let category = 'default'
    if (/农田|耕地|基本农田|农用地|农业/.test(q)) category = 'farmland'
    else if (/三区三线|城镇开发|生态保护|空间规划|划定/.test(q)) category = 'zone'
    else if (/规划|国土|城乡建设|总体规划|详细规划/.test(q)) category = 'planning'
    else if (/征收|补偿|拆迁|安置|征地/.test(q)) category = 'compensation'
    else if (/审批|用地|转用|供地|出让/.test(q)) category = 'approval'
    else if (/土地|权属|不动产|使用权|所有权/.test(q)) category = 'land'

    // 从匹配类别获取政策
    const policies = policyDatabase[category] || policyDatabase.default

    // 动态生成带 ID 的卡片
    return policies.map((policy, index) => ({
      id: `dynamic-${category}-${index}-${Date.now()}`,
      name: policy.name,
      department: policy.department,
      date: policy.date,
      status: 'effective' as const,
      content: policy.content,
      score: 0.95 - index * 0.05 + Math.random() * 0.03, // 模拟匹配度
      link: undefined,
    }))
  }

  const handleSearchSubmit = async (searchQuery: string) => {
    flushSync(() => {
      setQuestion(searchQuery);
      setCurrentView('result');
      setLoading(true);
      setAnswerText('');
      setSources([]);
      setRetrieverResources([]);
    });

    try {
      const res = await fetch('/api/dify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery }),
      });
      const data = await res.json();

      console.log('=== Dify API 返回完整数据 ===');
      console.log('答案:', data.answer);
      console.log('sources:', data.sources);
      console.log('retriever_resources:', data.retriever_resources);
      console.log('=============================');

      setAnswerText(data.answer || '未获取到答案');
      
      // 优先使用 Dify 返回的数据，若没有则使用后备数据
      const sourcesData = data.sources || data.retriever_resources || [];
      if (sourcesData.length > 0) {
        setSources(sourcesData);
        setRetrieverResources(sourcesData);
      } else {
        // Dify 未返回来源数据时使用后备演示数据
        console.log('[v0] Dify 未返回来源数据，使用后备演示卡片');
        const fallback = getFallbackSources(searchQuery);
        setSources(fallback);
        setRetrieverResources(fallback);
      }
    } catch (error) {
      console.error('[v0] 调用API失败:', error);
      setAnswerText('请求失败，请稍后重试');
      // API 失败时也显示后备卡片
      const fallback = getFallbackSources(searchQuery);
      setSources(fallback);
      setRetrieverResources(fallback);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToHome = () => {
    setCurrentView('home')
  }

  const handleDislike = () => {
    setFeedbackQuestion(question)
    setCurrentView('feedback')
  }

  const handleBackToResult = () => {
    setCurrentView('result')
  }

  const handlePolicyClick = (policy: any) => {
    setSelectedPolicy(policy)
    setCurrentView('policy')
  }

  const handleBackFromPolicy = () => {
    setSelectedPolicy(null)
    setCurrentView('result')
  }

  // 保存有用/无用反馈
  const handleFeedbackVote = async (type: 'useful' | 'useless') => {
    try {
      await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'feedback',
          question: question,
          type_value: type,
        }),
      })
    } catch (e) {
      console.error('保存反馈失败:', e)
    }
  }

  const handleSubmitFeedback = async () => {
    try {
      await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'feedback',
          question: feedbackQuestion,
          type_value: errorType || 'feedback_form',
          errorType,
          correctInfo,
          contactInfo,
        }),
      })

      alert('反馈已提交，感谢！')
      setErrorType('')
      setCorrectInfo('')
      setContactInfo('')
      setCurrentView('result')
    } catch {
      alert('提交失败，请重试')
    }
  }

  // 模拟政策数据 - 已弃用，现在从 Dify API 获取真实数据
  // const policies = [...]

  // 政策详情页面
  if (currentView === 'policy' && selectedPolicy) {
    return <PolicyDetail policy={selectedPolicy} onBack={handleBackFromPolicy} />
  }

  // 反馈页面
  if (currentView === 'feedback') {
    return (
      <main className="flex flex-col min-h-screen bg-background">
        <AnswerTopBar onBackHome={handleBackToHome} />

        <div className="max-w-2xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* 返回结果页按钮 */}
          <button
            onClick={handleBackToResult}
            className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity mb-6"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm">返回结果页</span>
          </button>

          {/* 主反馈卡片 */}
          <div className="bg-card rounded-lg border border-border shadow-sm p-6">
            {/* 显示当前反馈的问题 */}
            <div className="bg-secondary/30 rounded-lg p-4 mb-6">
              <p className="text-sm text-muted-foreground mb-2">反馈的问题：</p>
              <p className="font-semibold text-foreground">{feedbackQuestion}</p>
            </div>

            {/* 问题类型选择 */}
            <div className="mb-6">
              <label className="block font-semibold text-foreground mb-3">问题类型 *</label>
              <div className="space-y-3">
                {['答案错误', '来源不准', '政策已过期', '其他'].map((type) => (
                  <label key={type} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="errorType"
                      value={type}
                      checked={errorType === type}
                      onChange={(e) => setErrorType(e.target.value)}
                      className="w-4 h-4"
                    />
                    <span className="text-foreground">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 正确信息文本框 */}
            <div className="mb-6">
              <label className="block font-semibold text-foreground mb-2">
                正确信息（可选）
              </label>
              <textarea
                rows={3}
                value={correctInfo}
                onChange={(e) => setCorrectInfo(e.target.value)}
                placeholder="请提供正确的政策原文或条款..."
                className="w-full border border-border rounded-lg p-3 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* 上传附件按钮 */}
            <div className="mb-6">
              <Button
                variant="outline"
                className="border border-border text-foreground hover:bg-secondary"
              >
                + 上传附件
              </Button>
            </div>

            {/* 联系方式输入框 */}
            <div className="mb-6">
              <label className="block font-semibold text-foreground mb-2">
                您的联系方式（可选）
              </label>
              <input
                type="text"
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                placeholder="邮箱或手机号"
                className="w-full border border-border rounded-lg p-3 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* 提交反馈按钮 */}
            <Button
              onClick={handleSubmitFeedback}
              className="w-full bg-primary text-primary-foreground hover:opacity-90"
              size="lg"
            >
              提交反馈
            </Button>
          </div>
        </div>
      </main>
    )
  }

  // 结果页面
  if (currentView === 'result') {
    return (
      <main className="flex flex-col min-h-screen bg-background">
        <AnswerTopBar onBackHome={handleBackToHome} />

        <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* 问题展示 */}
          <QuestionDisplay question={question} />

          {/* 加载状态 */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4"></div>
              <p className="text-lg text-muted-foreground">正在查询政策库...</p>
            </div>
          ) : (
            <>
              {/* 答案内容 */}
              {answerText && <AnswerContent content={answerText} />}

              {/* 知识库引用来源 - 来自 Dify */}
              {retrieverResources.length > 0 && (
                <RetrieverResources resources={retrieverResources} />
              )}

              {/* 政策来源 - 始终显示（优先用真实数据，否则用后备数据） */}
              {answerText && (
                <PoliciesSection policies={sources} onPolicyClick={handlePolicyClick} />
              )}

              {/* 反馈区域 */}
              {answerText && <FeedbackSection onDislike={handleDislike} onVote={handleFeedbackVote} />}
            </>
          )}
        </div>
      </main>
    )
  }

  // 首页
  return (
    <main className="flex flex-col min-h-screen bg-background">
      <Header />
      <SearchSection onSearch={handleSearchSubmit} />
      <FeaturedQuestions onQuestionSelect={handleSearchSubmit} />
      <Footer />
    </main>
  )
}
