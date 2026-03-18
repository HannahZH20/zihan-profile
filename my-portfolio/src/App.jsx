import React, { useState, useEffect, useLayoutEffect, useRef, useId, useMemo } from 'react';
import { ChevronDown, Mail, Github, Linkedin, User, Phone, Figma, Database, ArrowUpRight, Award, GraduationCap, PenTool, BookOpen, Play, FileText, Terminal, Zap, Layers, Mic, Moon, Sun, Monitor, Languages, Image as ImageIcon, Sparkles, Activity, Users, ExternalLink, Cpu, Check } from 'lucide-react';

// ============================================================================
// 1. 静态数据与样式外置 (Static Data Extraction)
// ============================================================================
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@500;700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,500;1,600;1,700&display=swap');

  html, body { 
    overflow-x: hidden; 
    max-width: 100%; 
    width: 100%;
    margin: 0;
    padding: 0;
    background-color: var(--bg-section-white);
  }
  
  html { scroll-behavior: smooth; scroll-padding-top: 80px; }
  
  .font-mono { font-family: 'JetBrains Mono', monospace; }
  .font-editorial { font-family: 'Noto Serif SC', 'Georgia', serif; }
  .font-sans { font-family: 'Inter', sans-serif; }
  .font-brand { font-family: 'Cormorant Garamond', serif; font-style: italic; }

  .no-scrollbar::-webkit-scrollbar { display: none; }
  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

  :root {
    --bg-hero: #F5F4F2;          
    --bg-section-white: #FFFFFF; 
    --bg-section-gray: #FAFAFA;  
    
    --text-main: #171717;        
    --text-muted: #5F5F5F;       
    --text-disabled: #A3A3A3;
    
    --accent: #F45B2D;           
    
    --border-line: rgba(0, 0, 0, 0.08); 
    --border-light: rgba(0, 0, 0, 0.04);
    
    --bg-card: #FFFFFF;
    --shadow-sm: 0 1px 2px rgba(0,0,0,0.02), 0 2px 4px rgba(0,0,0,0.02);
    --shadow-card: 0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -2px rgba(0, 0, 0, 0.02), 0 0 0 1px rgba(0,0,0,0.03);
    --shadow-card-hover: 0 12px 24px -4px rgba(0, 0, 0, 0.06), 0 8px 12px -4px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(0,0,0,0.06);
  }
  
  .dark-theme {
    --bg-hero: #05050A;          
    --bg-section-white: #020205; 
    --bg-section-gray: #080812;  
    
    --text-main: #F8F9FA;
    --text-muted: #94A3B8;
    --text-disabled: #475569;
    
    --accent: #818CF8; 
    
    --border-line: rgba(139, 92, 246, 0.15); 
    --border-light: rgba(139, 92, 246, 0.08);
    
    --bg-card: #0A0A16; 
    --shadow-sm: 0 1px 2px rgba(0,0,0,0.6);
    --shadow-card: 0 0 0 1px rgba(139,92,246,0.1), 0 4px 6px -1px rgba(0,0,0,0.6);
    --shadow-card-hover: 0 0 0 1px rgba(139,92,246,0.3), 0 12px 24px -4px rgba(0,0,0,0.8), 0 0 15px rgba(139,92,246,0.15); 
  }

  body {
    color: var(--text-main);
    transition: color 0.3s ease, background-color 0.3s ease;
  }

  .focus-ring:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }

  .linear-card {
    background: var(--bg-card);
    box-shadow: var(--shadow-card);
    border-radius: 1.25rem;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    position: relative;
    z-index: 1;
    border: 1px solid var(--border-light);
  }
  .linear-card:hover {
    box-shadow: var(--shadow-card-hover);
    transform: translateY(-2px);
    z-index: 10;
  }

  @keyframes hero-blob {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33% { transform: translate(3%, -3%) scale(1.05); }
    66% { transform: translate(-2%, 2%) scale(0.95); }
  }
  .animate-hero-blob { animation: hero-blob 15s ease-in-out infinite; }
  .animate-hero-blob-reverse { animation: hero-blob 20s ease-in-out infinite reverse; }

  @keyframes ribbon-wave-1 {
    0%, 100% { transform: translateY(0px) scaleY(1); }
    50% { transform: translateY(-8px) scaleY(1.02); }
  }
  @keyframes ribbon-wave-2 {
    0%, 100% { transform: translateY(0px) scaleY(1); }
    50% { transform: translateY(8px) scaleY(0.98); }
  }
  .animate-ribbon-1 { animation: ribbon-wave-1 6s ease-in-out infinite; }
  .animate-ribbon-2 { animation: ribbon-wave-2 8s ease-in-out infinite; }

  .btn-glow {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0.75rem 0.75rem;
    border-radius: 0.75rem;
    background: var(--bg-card);
    color: var(--text-main);
    font-weight: 500;
    font-size: 12px;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    border: 1px solid var(--border-line);
    z-index: 1;
    gap: 0.35rem;
    overflow: hidden;
  }
  
  .btn-glow:hover {
    border-color: var(--text-main);
    box-shadow: 0 0 5px 1px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04);
    transform: translateY(-2px);
  }
  
  .dark-theme .btn-glow:hover {
    border-color: var(--text-main);
    box-shadow: 0 0 5px 1px rgba(255,255,255,0.15), 0 2px 8px rgba(0,0,0,0.2);
  }

  .btn-glow.primary {
    background: var(--text-main);
    color: var(--bg-section-white);
    border-color: var(--text-main);
  }
  
  .btn-glow.primary:hover {
    box-shadow: 0 0 8px 1px rgba(0,0,0,0.25), 0 4px 12px rgba(0,0,0,0.1);
    opacity: 0.95;
  }
  
  .dark-theme .btn-glow.primary:hover {
    box-shadow: 0 0 8px 1px rgba(255,255,255,0.25), 0 4px 12px rgba(0,0,0,0.2);
  }

  /* --- 全局高级动态效果 --- */
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-8px); }
  }
  .animate-float { 
    animation: float 6s ease-in-out infinite; 
  }

  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  .shimmer-btn::after {
    content: '';
    position: absolute;
    top: 0; left: 0; width: 100%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
    animation: shimmer 2.5s infinite;
  }
`;

// 技能栈分类数据 (立体化架构展示)
const skillCategories = {
  zh: [
    { title: '产品 / Product', icon: Layers, skills: ['用户研究', '需求分析', '业务流程梳理', 'PRD撰写', '解决方案设计', 'UAT测试', 'Go-Live支持', '跨团队协作'] },
    { title: '技术 / Engineering', icon: Cpu, skills: ['Java基础', 'API接口逻辑', '数据结构基础', '系统集成流程', '字段字典设计', '异常码分析', '基础联调与问题排查'] },
    { title: '工具 / Tools', icon: PenTool, skills: ['Python (Pandas/NumPy)', 'SQL', 'Excel', 'Figma', 'Axure', 'Xmind', 'Notion', 'Git'] }
  ],
  en: [
    { title: 'Product', icon: Layers, skills: ['User Research', 'Requirement Analysis', 'Workflow Mapping', 'PRD Writing', 'Solution Design', 'UAT Testing', 'Go-Live Support', 'Cross-functional Collab'] },
    { title: 'Engineering', icon: Cpu, skills: ['Java Basics', 'API Logic', 'Data Structures', 'System Integration', 'Data Dictionary', 'Error Code Analysis', 'Debugging'] },
    { title: 'Tools', icon: PenTool, skills: ['Python (Pandas/NumPy)', 'SQL', 'Excel', 'Figma', 'Axure', 'Xmind', 'Notion', 'Git'] }
  ]
};

const ribbonLines = Array.from({ length: 20 }, (_, index) => ({
  id: `ribbon-${index}`,
  offsetY: index * 2.5,
  isHighlight: index === 9 || index === 10 || index === 11,
  animationClass: index % 2 === 0 ? "animate-ribbon-1" : "animate-ribbon-2",
  animationDelay: `${index * 0.1}s`
}));

// ============================================================================
// 2. 国际化翻译字典 (高度对齐中英文)
// ============================================================================
const translations = {
  zh: {
    nav: { home: '首页', works: '作品集', resume: '履历', tools: '技能', whyme: 'Why Me', contact: '联系' },
    hero: { role: 'Product Architect', title1: '理性的构建者，', title2: '感性的叙述者。', desc1: "Hi, I'm ", name: "张子涵", desc2: "。", btnWork: '浏览作品集', btnResume: '查看履历' },
    portfolio: {
      title: '作品集。',
      p1_title: 'NutriCALM',
      p1_slogan: 'AI驱动B2B2C健康管理平台',
      p1_desc: '面向营养健康管理场景，设计连接C端用户、AI中台与B端营养师的一体化平台。通过AI拍照/语音识别将饮食记录缩短至3秒内，并结合RAG与多智能体策略生成个性化饮食建议，最终推动营养师服务效率提升3–5倍，用户转化率达到18%。',
      p1_tags: ['AI健康产品', 'B2B2C系统', 'RAG / Multi-Agent'],
      p1_btn1: 'PRD+用户研究',
      p1_btn2: '可交互Demo',
      p2_title: 'ProDAIS',
      p2_slogan: '课堂协作讨论AI监控系统',
      p2_desc: '针对课堂协作中“少数人主导、沉默成员参与不足、讨论节奏失控”等问题，基于LLM与实时语音转写（STT）设计5个核心AI模块，包括阶段总结、沉默成员提醒、议程提示与头脑风暴建议。系统已在4个真实课堂、80+学生中验证，沉默成员发言率提升166%，偏题率下降32%，SUS可用性评分达到78。',
      p2_tags: ['AI教育产品', 'LLM + STT', '低干预引导'],
      p2_btn1: '需求文档 (PRD)',
      p2_btn2: '交互演示 (Demo)',
      p3_title: 'Aura Pro',
      p3_slogan: '灵感榨汁机',
      p3_desc: '围绕碎片化灵感难沉淀、内容收藏后难再利用的问题，设计一款面向高频创作者的AI“第二大脑”工具。产品支持低门槛收集截图、文本与链接，并通过多模态模型自动提炼为结构化Bento卡片，帮助用户完成从“记录”到“整理”再到“唤醒”的灵感闭环。',
      p3_tags: ['AI效率工具', '多模态产品', '第二大脑'],
      p3_btn1: '项目介绍 (Overview)',
      p3_btn2: '交互演示 (Demo)'
    },
    impact: { title: '业务影响。', s1: '转化率提升', s2: '海外系统上线', s3: '发言提升率', s4: 'AIED国际会议', s5: '高风险识别率', s6: '结算效率提升' },
    resume: {
      title: '核心链路。', edu: '学术背景', edu1_title: '计算机科学与技术硕士', edu1_sub: '莫纳什大学 (QS排名 36)', edu1_desc: '主修方向涵盖生成式 AI 应用、数据科学基础、软件工程底层逻辑与云计算架构。', edu1_badge: 'GPA 3.56/4.0 · HD一等荣誉 · Top 5%', edu2_title: '播音与主持艺术本科', edu2_sub: '四川电影电视学院', edu2_badge: 'Top 10% · 校学生会宣传部部长', edu2_desc: '系统化训练沟通同理心与叙事能力，主修内容产品策划、新媒体运营与用户诉求拆解。',
      exp: '关键实践', exp1_title: '海外数字化产品实习生', exp1_sub: '沪上阿姨实业股份有限公司', exp1_details: [
  "围绕“订单→支付→结算”核心链路开展需求分析，抽象多国业务规则，完成83项字段映射与47类异常处理设计，推动多国家系统规则统一。",
  "访谈海外运营、供应商与门店团队，拆解形成多国适配、跨平台对接、Go-Live机制等5类核心产品场景，并输出完整解决方案。",
  "对接熊猫外卖、Grab等5+海外平台，完成系统联调与UAT验证，支持8+国家上线，保障6家新店开业与12家门店稳定运行。",
  "设计Go-Live检查清单与P0/P1/P2问题分级机制，将上线故障率控制在0.5%以下，对账准确率提升至90%，结算效率提升35%。"
],
      exp2_title: 'AI产品助理（兼职）', exp2_sub: '莫纳什人机交互中心（Action Lab）', exp2_details: [
  "参与规划B2B2C三层产品架构（用户层 / AI能力层 / 专家层），输出PRD与交互原型，推动AI能力产品化落地。",
  "主导AI饮食识别、个性化推荐、3D趋势追踪与专家社区等核心功能设计，将单次记录时间压缩至3秒以内，识别精度达98%+。",
  "基于RAG与多智能体策略优化推荐逻辑，提升个性化匹配效果，同时设计XSS防护与数据脱敏方案保障系统安全。",
  "优化用户“触达→激活→留存→转化”链路，使核心功能使用率达78%，周活跃提升45%，转化率达18%。"
],
      exp3_title: '数据分析实习生', exp3_sub: '山东鲁泰热电有限公司', exp3_details: [
  "清洗10万+生产数据，统一30+核心指标口径（能耗/负荷/设备状态），构建标准化数据体系，解决数据割裂问题。",
  "基于Python（Pandas）搭建自动化数据看板，替代人工周报流程，显著提升数据获取效率与使用频率。",
  "结合时间序列与3σ方法构建设备异常识别模型，提前发现并定位4次关键异常。",
  "每周节省3-5小时人工处理时间，降低潜在生产风险，支撑调度与决策优化。"
],
      exp4_title: '产品运营实习生', exp4_sub: '任城区融媒体中心', exp4_details: [
  "基于用户反馈与播放数据，优化3档栏目内容结构与选题策略，推动平均播放量提升25%。",
  "搭建内容数据监测体系（阅读量 / 完播率 / 停留时长），建立复盘机制，驱动内容持续迭代优化。",
  "统筹多平台内容发布节奏，完成25+期内容运营与复盘，提升传播稳定性与覆盖效率。",
  "停留时长提升23%，完播率提升18%，互动率提升20%+。"
],
      proj: '核心项目', 
      proj1_title: 'AI课堂协作引导系统（ProDAIS）', 
      proj1_sub: '用户研究 / AI产品设计 · 2024.12 – 2026.02', 
      proj1_desc: [
        "基于25+用户访谈与6轮课堂观察，识别“沉默成员参与不足”与“讨论节奏失控”为核心问题，确定“低干预AI引导”产品方向，并输出完整PRD与触发机制设计。",
        "基于LLM + 实时语音转写（STT）设计阶段总结、沉默提醒、议程控制、行动项生成与头脑风暴等5个核心AI模块，通过Prompt策略与冷却机制控制干预频率。",
        "针对语音延迟与噪声带来的误触发问题，推进3轮产品迭代，优化语义过滤与触发逻辑，提升系统稳定性与准确性。",
        "在4个真实课堂（80+学生）中落地验证，沉默成员发言率提升166%+，讨论偏题率下降32%，系统SUS可用性评分达78。"
      ], 
      proj2_title: '学生行为早期预警系统（Learning Analytics）', 
      proj2_sub: '数据产品 / 解决方案设计 · 2024.07 – 2024.12', 
      proj2_desc: [
        "基于OULAD数据集（12万+行为日志）完成数据清洗与特征工程，构建覆盖活跃度、作业行为与学习节奏等维度的20+风险指标体系。",
        "对比Random Forest与XGBoost等模型，构建高解释性风险预测模型，并设计风险评分卡与可视化界面，提升教师决策效率。",
        "围绕模型输出设计“预警→诊断→干预”闭环，针对不同风险等级制定差异化干预策略（提醒/学习计划调整/人工辅导）。",
        "模型回测显示高风险识别准确率达85%+，较基线提升约15%，可提前3–4周识别潜在流失学生。"
      ]},
    tools: { title: '复合架构能力。', subtitle: 'Technical Proficiency' },
    whyme: { 
      tag: '02 / Perspective',
      title: '理性与感性的交汇。',
      hero_series: 'CORE IDENTITY',
      hero_title: 'Hybrid Advantage',
      hero_frames: '7,842',
      name: 'Hannah Zhang',
      role: 'Product Architect · Based in Global',
      stats_p1: 'CS', stats_p1_l: 'Master', stats_p2: '4 yrs', stats_p2_l: 'Broadcasting', stats_p3: 'AI', stats_p3_l: 'Product',
      bio: '播音主持艺术+计算机科学与技术硕士。用同理心感知世界，用逻辑重构体验，极致沟通训练与严密的底层架构思维结合。将复杂的人性诉求，精准翻译为大模型时代可落地的系统语言。',
      bio_tag1: '感性：敏锐洞察用户情绪与行为动因',
      bio_tag2: '理性：将需求转化为AI能力、数据结构与系统流程',
      btn_book: '探讨合作可能 ↗',
      latest_title: 'TWO PILLARS',
      archive: 'View logic',
      card1_tag: 'EMPATHY', card1_title: '极致同理心', card1_desc: 'Broadcasting · 挖掘核心诉求',
      card2_tag: 'ENGINEERING', card2_title: '严密架构力', card2_desc: 'CS Master · 转化为 API 数据流'
    },
    contact: { title: '期待与您开启新的协作。', subtitle: '随时准备好探讨产品、技术与业务的更多可能。', email: 'zzhannahz@163.com', phone: '152-5470-8512', copyMsg: '已复制！', copyError: '复制失败' }
  },
  en: {
  nav: { home: 'Home', works: 'Works', resume: 'Resume', tools: 'Skills', whyme: 'Why Me', contact: 'Contact' },
  hero: { 
    role: 'Product Architect', 
    title1: 'Rational Builder,', 
    title2: 'Empathetic Storyteller.', 
    desc1: "Hi, I'm ", 
    name: "Zihan Zhang", 
    desc2: ".", 
    btnWork: 'View Works', 
    btnResume: 'View Resume' 
  },
  portfolio: {
    title: 'Selected Works.',
    p1_title: 'NutriCALM',
    p1_slogan: 'AI-Driven B2B2C Health Management Platform',
    p1_desc: 'Designed an integrated health management platform connecting end users, an AI middle layer, and professional dietitians. Reduced dietary logging to under 3 seconds through AI-powered photo and voice input, and combined RAG with multi-agent strategies to generate personalized nutrition guidance, ultimately improving dietitian service efficiency by 3–5x and raising conversion to 18%.',
    p1_tags: ['AI Health Product', 'B2B2C System', 'RAG / Multi-Agent'],
    p1_btn1: 'PRD & User Research',
    p1_btn2: 'Interactive Demo',

    p2_title: 'ProDAIS',
    p2_slogan: 'AI Monitoring System for Classroom Collaboration',
    p2_desc: 'Designed five core AI modules based on LLMs and real-time speech-to-text to address common collaboration issues such as dominant speakers, low silent-member participation, and disrupted discussion flow. Modules include stage summarization, silent-member prompting, agenda pacing, and brainstorming support. Validated in 4 real classrooms with 80+ students, the system increased silent-member participation by 166%, reduced off-topic drift by 32%, and achieved an SUS score of 78.',
    p2_tags: ['AI Education Product', 'LLM + STT', 'Low-Intervention'],
    p2_btn1: 'PRD',
    p2_btn2: 'Interactive Demo',

    p3_title: 'Aura Pro',
    p3_slogan: 'Inspiration Juicer',
    p3_desc: 'Designed an AI-powered “second brain” tool for high-frequency creators struggling with fragmented inspiration and low reuse of saved content. The product supports frictionless capture of screenshots, text, and links, then uses multimodal models to distill them into structured Bento cards, helping users complete a full inspiration loop from capture to organization to reactivation.',
    p3_tags: ['AI Productivity', 'Multimodal', 'Second Brain'],
    p3_btn1: 'Project Overview',
    p3_btn2: 'Interactive Demo'
  },
  impact: { title: 'Selected Impact.', s1: 'Conversion Lift', s2: 'Global Launches', s3: 'Participation Lift', s4: 'AIED Conference (In Prep)', s5: 'High-Risk Detection Rate', s6: 'Settlement Efficiency Lift' },
  resume: {
    title: 'Career Architecture.',
    edu: 'EDUCATION',
    edu1_title: 'MSc in Computer Science',
    edu1_sub: 'Monash University (QS 36)',
    edu1_desc: 'Focused on Generative AI applications, Data Science fundamentals, Software Engineering logic, and Cloud Computing architecture.',
    edu1_badge: 'GPA 3.56/4.0 · HD First Class · Top 5%',
    edu2_title: 'BA in Broadcasting & Hosting Art',
    edu2_sub: 'Sichuan Film and Television College',
    edu2_badge: 'Top 10% · Head of Publicity, Student Union',
    edu2_desc: 'Systematic training in communication, empathy, and narrative expression, with a focus on content planning, new media operations, and user need analysis.',

    exp: 'WORK EXPERIENCE',
    exp1_title: 'Global Digital Product Intern',
    exp1_sub: 'Auntea Jenny (Shanghai) Co., Ltd.',
    exp1_details: [
      "Conducted requirement analysis across the core 'Order → Payment → Settlement' flow, abstracted cross-country business rules, and completed mapping for 83 fields and 47 exception-handling categories to unify rules across multiple country systems.",
      "Interviewed overseas operations, suppliers, and store teams; distilled five core product scenarios including multi-country adaptation, cross-platform integration, and Go-Live mechanisms, then delivered end-to-end solutions.",
      "Coordinated with 5+ overseas platforms such as HungryPanda and Grab, completed system integration and UAT, supported launches in 8+ countries, and ensured stable operations for 6 new stores and 12 stores.",
      "Designed a Go-Live checklist and P0/P1/P2 issue triage mechanism, keeping launch incident rate below 0.5%, improving reconciliation accuracy to 90%, and increasing settlement efficiency by 35%."
    ],

    exp2_title: 'AI Product Assistant (Part-time)',
    exp2_sub: 'Monash Human-Computer Interaction Centre (Action Lab)',
    exp2_details: [
      "Participated in planning a B2B2C three-layer architecture (user layer / AI capability layer / expert layer), produced PRDs and interaction prototypes, and drove productization of AI capabilities.",
      "Led design of core features including AI diet recognition, personalized recommendations, 3D trend tracking, and expert community functions; reduced single logging time to under 3 seconds with 98%+ recognition accuracy.",
      "Optimized recommendation logic with RAG and multi-agent strategies to improve personalization, while designing XSS protection and data desensitization schemes to safeguard system security.",
      "Optimized the user funnel from reach → activation → retention → conversion, achieving 78% core feature usage, 45% weekly active growth, and an 18% conversion rate."
    ],

    exp3_title: 'Data Analyst Intern',
    exp3_sub: 'Shandong Lutai Thermal Power Co.',
    exp3_details: [
      "Cleaned 100k+ production records and unified definitions for 30+ core indicators (energy consumption / load / equipment status), building a standardized data system to eliminate data silos.",
      "Built automated dashboards using Python (Pandas), replacing manual weekly reporting and significantly improving data access efficiency and usage frequency.",
      "Developed an equipment anomaly detection model using time-series methods and 3σ, proactively identifying and locating 4 critical anomalies.",
      "Saved 3–5 hours of manual processing per week, reduced potential production risk, and supported dispatch and decision optimization."
    ],
    exp4_title: 'Product Operations Intern',
    exp4_sub: 'Rencheng District Integrated Media Center',
    exp4_details: [
      "Optimized the content structure and topic strategy of three programs based on user feedback and playback data, driving a 25% increase in average views.",
      "Built a content performance monitoring framework (reads / completion rate / dwell time) and established a review loop to support continuous optimization.",
      "Coordinated multi-platform publishing cadence and delivered operations plus retrospective analysis for 25+ episodes, improving distribution stability and reach efficiency.",
      "Improved dwell time by 23%, completion rate by 18%, and engagement rate by 20%+."
    ],

    proj: 'RESEARCH & PROJECTS',
    proj1_title: 'AI Classroom Collaboration Guidance System (ProDAIS)',
    proj1_sub: 'User Research / AI Product Design · 2024.12 – 2026.02',
    proj1_desc: [
      "Based on 25+ user interviews and 6 rounds of classroom observation, identified “insufficient silent-member participation” and “loss of discussion pacing” as core problems, defined a low-intervention AI guidance direction, and delivered a full PRD plus trigger-mechanism design.",
      "Designed five core AI modules with LLM + real-time speech-to-text (STT): stage summary, silent-member nudges, agenda control, action-item generation, and brainstorming; controlled intervention frequency via prompt strategy and cooldown logic.",
      "Drove three product iterations to address false triggers caused by speech latency and noise, optimizing semantic filtering and trigger logic to improve system stability and accuracy.",
      "Validated in 4 real classrooms (80+ students), increasing silent-member speaking rate by 166%+, reducing off-topic discussion by 32%, and achieving an SUS usability score of 78."
    ],

    proj2_title: 'Student Early Warning System (Learning Analytics)',
    proj2_sub: 'Data Product / Solution Design · 2024.07 – 2024.12',
    proj2_desc: [
      "Completed data cleaning and feature engineering on the OULAD dataset (120k+ behavior logs), building a 20+ indicator risk framework covering engagement, assignment behavior, and learning pace.",
      "Compared models including Random Forest and XGBoost to build a highly interpretable risk prediction model, and designed a risk scorecard with a visualization interface to improve instructor decision efficiency.",
      "Designed a closed-loop workflow of “Alert → Diagnose → Intervene” around model outputs, with differentiated intervention strategies for each risk level (reminders / study-plan adjustments / human tutoring).",
      "Backtesting showed 85%+ accuracy in high-risk identification, about 15% improvement over baseline, and enabled detection of potential dropout students 3–4 weeks earlier."
    ]
  },
  tools: { title: 'Comprehensive Architectural Skills.', subtitle: 'Technical Proficiency' },
  whyme: { 
    tag: '02 / Perspective',
    title: 'Where Empathy Meets Logic.',
    hero_series: 'CORE IDENTITY',
    hero_title: 'Hybrid Advantage',
    hero_frames: '7,842',
    name: 'Hannah Zhang',
    role: 'Product Architect · Based in Global',
    stats_p1: 'CS', stats_p1_l: 'Master', stats_p2: '4 yrs', stats_p2_l: 'Broadcasting', stats_p3: 'AI', stats_p3_l: 'Product',
    bio: "Master's in Computer Science & BA in Broadcasting & Hosting Art. Perceiving the world with empathy and reconstructing experiences with logic. Bridging extreme communication training with rigorous architectural thinking to translate complex human needs into viable system languages in the LLM era.",
    bio_tag1: 'Empathy: Identifying emotional signals and behavioral drivers',
    bio_tag2: 'Logic: Turning needs into APIs, data structures, and system flows',
    btn_book: 'Discuss Collaboration ↗',
    latest_title: 'TWO PILLARS',
    archive: 'View logic',
    card1_tag: 'EMPATHY', card1_title: 'User Insight', card1_desc: 'Broadcasting · Digging into real needs',
    card2_tag: 'ENGINEERING', card2_title: 'System Architecture', card2_desc: 'CS Master · Translating to data flows'
  },
  contact: { 
    title: 'Ready to build something meaningful together.', 
    subtitle: 'Always open to discussing new possibilities in product, technology, and business.', 
    email: 'zzhannahz@163.com', 
    phone: '152-5470-8512',
    copyMsg: 'Copied!',
    copyError: 'Copy failed'
  }
}
};

// ============================================================================
// WebGL 粒子大脑组件 & 动画组件等工具类
// ============================================================================
const ParticleBrain = ({ colorStr = 'rgba(244, 91, 45,' }) => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId; let particles = []; const color = colorStr; let isVisible = false;
    
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; initParticles(); };
    
    const createParticle = () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4, size: Math.random() * 1 + 0.5,
      update() {
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      },
      draw() {
        ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `${color} 0.2)`; ctx.fill();
      }
    });
    
    const initParticles = () => { particles = []; const num = (canvas.width * canvas.height) / 12000; for (let i = 0; i < num; i++) particles.push(createParticle()); };
    
    const animate = () => {
      if (isVisible) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particles.length; i++) {
          particles[i].update(); particles[i].draw();
          for (let j = i; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y, distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 50) { 
              ctx.beginPath(); ctx.strokeStyle = `${color} ${0.15 * (1 - distance / 50)})`; 
              ctx.lineWidth = 0.5; ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y); ctx.stroke(); 
            }
          }
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    const observer = new IntersectionObserver((entries) => { isVisible = entries[0].isIntersecting; });
    if (canvas) observer.observe(canvas);

    resize(); window.addEventListener('resize', resize); animate();
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(animationFrameId); observer.disconnect(); };
  }, [colorStr]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-40 mix-blend-multiply" />;
};

const FadeIn = ({ children, delay = 0, className = "", tier = "b" }) => {
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [isVisible, setIsVisible] = useState(prefersReducedMotion); 
  const domRef = useRef();
  
  useEffect(() => {
    if (prefersReducedMotion) return;
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setTimeout(() => setIsVisible(true), delay); observer.unobserve(entries[0].target);
      }
    }, { rootMargin: tier === 'a' ? '0px 0px -50px 0px' : '0px 0px -20px 0px', threshold: tier === 'a' ? 0.1 : 0.05 });
    
    if (domRef.current) observer.observe(domRef.current); 
    return () => observer.disconnect();
  }, [delay, tier, prefersReducedMotion]);

  const durationClass = tier === 'a' ? 'duration-700' : 'duration-400';
  const hiddenClass = tier === 'a' ? 'opacity-0 translate-y-6' : 'opacity-0 translate-y-2';
  //移除了默认的 w-full，使得 FadeIn 不会破坏紧凑布局
  return <div ref={domRef} className={`transition-all ${durationClass} ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform ${isVisible ? 'opacity-100 translate-y-0' : hiddenClass} ${className}`}>{children}</div>;
};

const SlotCounter = ({ target }) => {
  const [count, setCount] = useState(0); const ref = useRef();
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        let current = 0; 
        const interval = setInterval(() => { 
          current += Math.ceil(target / 20);
          if (current >= target) { current = target; clearInterval(interval); } 
          setCount(current); 
        }, 30);
        observer.unobserve(ref.current);
      }
    });
    if (ref.current) observer.observe(ref.current); 
    return () => observer.disconnect();
  }, [target]);
  return <span ref={ref}>{count}</span>;
};

const AccordionBento = ({ title, subtitle, details, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const panelId = useId();
  const hasDetails = Array.isArray(details) && details.length > 0;
  
  return (
    <div className="bg-[var(--bg-section-white)] border border-[var(--border-line)] rounded-xl group w-full transition-colors hover:border-[var(--text-disabled)]">
      <button
        type="button"
        className="w-full px-5 py-4 flex items-center justify-between text-left gap-4 focus-ring rounded-xl"
        onClick={() => hasDetails && setIsOpen(!isOpen)}
        aria-expanded={hasDetails ? isOpen : undefined}
        aria-controls={hasDetails ? panelId : undefined}
      >
        <div className="flex-1">
          <h4 className="text-[1rem] sm:text-[1.05rem] font-bold mb-1 tracking-tight text-[var(--text-main)] group-hover:text-[var(--accent)] transition-colors duration-300">{title}</h4>
          <div className="text-[var(--text-muted)] font-medium text-[12px] sm:text-[13px] tracking-wide">{subtitle}</div>
        </div>
        {hasDetails && <div className={`p-1.5 rounded-full flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[var(--accent)]' : 'text-[var(--text-muted)]'}`}><ChevronDown size={16} /></div>}
      </button>
      
      {hasDetails && (
        <div id={panelId} className={`px-5 overflow-hidden transition-all duration-300 w-full ${isOpen ? 'max-h-[800px] opacity-100 pb-5' : 'max-h-0 opacity-0'}`}>
          <div className="border-t border-[var(--border-line)] pt-4 w-full">
            <ul className="space-y-3 w-full">
              {details.map((detail) => (
                <li key={`${subtitle}-${detail}`} className="flex items-start gap-3 text-[var(--text-muted)] font-normal leading-relaxed hover:text-[var(--text-main)] hover:translate-x-1 transition-all duration-300">
                  <div className="w-1 h-1 rounded-full bg-[var(--text-disabled)] mt-2 flex-shrink-0"></div>
                  <span className="text-[13px] sm:text-[14px] flex-1">{detail}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

const TimelineItem = ({ time, title, subtitle, details, defaultOpen = false, isLast = false, badge = null }) => (
  <div className="relative flex flex-col md:flex-row items-start pb-8 group w-full">
    {!isLast && <div className="absolute left-[5px] md:left-[110px] top-8 bottom-[-16px] w-[1px] bg-[var(--border-line)]"></div>}
    <div className="absolute left-[0px] md:left-[105px] top-[24px] w-3 h-3 rounded-full bg-[var(--bg-section-white)] border-2 border-[var(--border-line)] group-hover:border-[var(--accent)] transition-colors duration-300 z-10"></div>
    <div className="hidden md:block w-[95px] text-right pr-6 pt-[20px] shrink-0 text-[11px] font-mono font-medium text-[var(--text-muted)] tracking-wider">
      {time.split(' - ').map((t) => <div key={`${time}-${t}`} className={t === time.split(' - ')[0] ? "mb-1 text-[var(--text-main)]" : ""}>{t}</div>)}
    </div>
    <div className="md:hidden pl-6 pt-5 pb-3 text-[11px] font-mono font-medium text-[var(--text-muted)] tracking-wider w-full">{time}</div>
    <div className="flex-1 w-full min-w-0 pl-6 md:pl-8 mt-0">
      {badge && <div className="mb-3 w-full relative">{badge}</div>}
      <AccordionBento title={title} subtitle={subtitle} details={details} defaultOpen={defaultOpen} />
    </div>
  </div>
);

const ResumeProjectCard = ({ tag, title, subtitle, description, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const panelId = useId();
  const details = useMemo(() => {
    if (Array.isArray(description)) return description;
    if (typeof description !== 'string') return [];
    return description
      .split('\n')
      .map((line) => line.replace(/^•\s*/, '').trim())
      .filter(Boolean);
  }, [description]);

  return (
    <div className="p-6 rounded-xl border border-[var(--border-line)] bg-[var(--bg-section-gray)] hover:bg-[var(--bg-section-white)] transition-colors flex flex-col h-full w-full">
      <div className="font-mono text-[10px] text-[var(--text-muted)] mb-3 tracking-widest uppercase">{tag}</div>
      <button
        type="button"
        className="w-full text-left flex items-start gap-3 focus-ring rounded-lg"
        onClick={() => details.length > 0 && setIsOpen(!isOpen)}
        aria-expanded={details.length > 0 ? isOpen : undefined}
        aria-controls={details.length > 0 ? panelId : undefined}
      >
        <div className="flex-1 min-w-0">
          <h4 className="text-[14px] font-bold text-[var(--text-main)] mb-1 tracking-tight">{title}</h4>
          <p className="text-[12px] font-medium text-[var(--accent)]">{subtitle}</p>
        </div>
        {details.length > 0 && (
          <div className={`p-1 rounded-full mt-0.5 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[var(--accent)]' : 'text-[var(--text-muted)]'}`}>
            <ChevronDown size={15} />
          </div>
        )}
      </button>
      {details.length > 0 && (
        <div id={panelId} className={`overflow-hidden transition-all duration-300 w-full ${isOpen ? 'max-h-[900px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="mt-4 pt-4 border-t border-[var(--border-light)] w-full">
            <ul className="space-y-3 w-full">
              {details.map((detail) => (
                <li key={`${title}-${detail}`} className="flex items-start gap-3 text-[var(--text-muted)] font-light leading-relaxed">
                  <div className="w-1 h-1 rounded-full bg-[var(--text-disabled)] mt-2 flex-shrink-0"></div>
                  <span className="text-[13px] flex-1">{detail}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// 主应用组件 (Main App Component)
// ============================================================================
export default function App() {
  const [isDark, setIsDark] = useState(() => {
    try { return localStorage.getItem('portfolio-theme') === 'dark'; } 
    catch { return false; }
  });
  
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem('portfolio-lang') === 'en' ? 'en' : 'zh'; } 
    catch { return 'zh'; }
  });
  
  // 复制剪贴板状态管理
  const [copiedItem, setCopiedItem] = useState(null);
  const [openDocMenuId, setOpenDocMenuId] = useState(null);

  const t = translations[lang];

  useLayoutEffect(() => {
    document.documentElement.classList.toggle('dark-theme', isDark);
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
  }, [isDark]);

  useEffect(() => {
    try {
      localStorage.setItem('portfolio-theme', isDark ? 'dark' : 'light');
      localStorage.setItem('portfolio-lang', lang);
      document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    } catch (error) {
      void error;
    }
  }, [isDark, lang]);

  useEffect(() => {
    const closeMenuOnOutsideClick = (event) => {
      if (!(event.target instanceof Element)) return;
      if (!event.target.closest('[data-doc-menu-root]')) {
        setOpenDocMenuId(null);
      }
    };
    const closeMenuOnEsc = (event) => {
      if (event.key === 'Escape') {
        setOpenDocMenuId(null);
      }
    };
    document.addEventListener('mousedown', closeMenuOnOutsideClick);
    document.addEventListener('keydown', closeMenuOnEsc);
    return () => {
      document.removeEventListener('mousedown', closeMenuOnOutsideClick);
      document.removeEventListener('keydown', closeMenuOnEsc);
    };
  }, []);

  // 实现通用的点击复制文本功能，兼容 iframe 内部限制
  const handleCopy = (text, type) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      setCopiedItem(type);
      setTimeout(() => setCopiedItem(null), 2000);
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
    }
    document.body.removeChild(textArea);
  };

  const navLinks = useMemo(() => [ 
    { name: t.nav.home, href: '#home' }, { name: t.nav.works, href: '#portfolio' }, 
    { name: t.nav.whyme, href: '#why-me' }, { name: t.nav.resume, href: '#resume' }, 
    { name: t.nav.tools, href: '#tools' }, { name: t.nav.contact, href: '#contact' } 
  ], [t]);

  const projects = useMemo(() => [
    {
      id: 'aura-pro', title: t.portfolio.p3_title, slogan: t.portfolio.p3_slogan,
      icon: <Sparkles className="w-4 h-4 text-[var(--text-main)]" />,
      description: t.portfolio.p3_desc, tags: t.portfolio.p3_tags,
      links: [
        { text: t.portfolio.p3_btn1, url: 'https://aurademo.zihan.fun/', type: 'doc' },
        { text: t.portfolio.p3_btn2, url: 'https://aurademo.zihan.fun/', type: 'demo' }
      ],
      image: { src: 'aurapro.png', alt: 'Aura Pro' } 
    },
    {
      id: 'nutricalm', title: t.portfolio.p1_title, slogan: t.portfolio.p1_slogan,
      icon: <Activity className="w-4 h-4 text-[var(--text-main)]" />,
      description: t.portfolio.p1_desc, tags: t.portfolio.p1_tags,
      links: [
        { text: t.portfolio.p1_btn1, url: 'https://bjpl8hf23hgg.jp.larksuite.com/docx/XLfideuKAoksQTx7oFojM1BYps7', type: 'doc' },
        { text: t.portfolio.p1_btn2, url: 'https://hannahzh20.github.io/Nutridemo/', type: 'demo' }
      ],
      image: { src: 'nutri.png', alt: 'NutriCALM' }
    },
    {
      id: 'prodais', title: t.portfolio.p2_title, slogan: t.portfolio.p2_slogan,
      icon: <Users className="w-4 h-4 text-[var(--text-main)]" />,
      description: t.portfolio.p2_desc, tags: t.portfolio.p2_tags,
      links: [
        { text: t.portfolio.p2_btn1, url: 'https://bjpl8hf23hgg.jp.larksuite.com/wiki/TbkxwwGNkiDUFjkcppRj3JZFpBg?from=from_copylink', type: 'doc' },
        { text: t.portfolio.p2_btn2, url: 'https://hannahzh20.github.io/ProDAIS-demo/', type: 'demo' }
      ],
      image: { src: 'prodais.png', alt: 'ProDAIS' }
    }
  ], [t, lang]);

  return (
    <div className="min-h-screen selection:bg-[var(--text-main)] selection:text-[var(--bg-section-white)] antialiased flex flex-col items-center relative">
      <style>{globalStyles}</style>

      {/* TOP NAVIGATION */}
      <header className="fixed top-0 left-0 w-full z-50 bg-[var(--bg-section-white)]/80 backdrop-blur-xl border-b border-[var(--border-line)] transition-colors duration-300">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 h-14 flex items-center justify-between">
          <div className="font-brand text-[1.5rem] font-semibold tracking-wide text-[var(--text-main)] cursor-default select-none transition-colors">Hannah</div>
          <nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => (<a key={link.name} href={link.href} className="focus-ring px-3.5 py-1.5 rounded-full text-[12px] font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-section-gray)] transition-all">{link.name}</a>))}
          </nav>
          <div className="flex items-center gap-1.5">
            <button type="button" aria-label={lang === 'zh' ? 'Switch to English' : '切换为中文'} onClick={() => { setOpenDocMenuId(null); setLang(lang === 'zh' ? 'en' : 'zh'); }} className="focus-ring flex items-center justify-center w-7 h-7 rounded-full hover:bg-[var(--bg-section-gray)] transition-colors text-[var(--text-muted)] hover:text-[var(--text-main)]"><Languages size={14} /></button>
            <button type="button" aria-label={isDark ? '切换到浅色模式' : '切换到深色模式'} onClick={() => setIsDark(!isDark)} className="focus-ring flex items-center justify-center w-7 h-7 rounded-full hover:bg-[var(--bg-section-gray)] transition-colors text-[var(--text-muted)] hover:text-[var(--text-main)]">{isDark ? <Sun size={14} /> : <Moon size={14} />}</button>
          </div>
        </div>
      </header>

      {/* SECTION 1: HERO */}
      <section id="home" className="order-1 relative w-full min-h-[100svh] pt-20 pb-8 md:pt-24 md:pb-10 flex items-center justify-center overflow-hidden bg-[var(--bg-hero)]">
        {!isDark && (
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <ParticleBrain colorStr="rgba(244, 91, 45," />
            <div className="absolute bottom-[-10%] left-[-10%] w-[55vw] h-[55vw] rounded-full bg-[#E3EDEF] blur-[90px] mix-blend-multiply animate-hero-blob opacity-90"></div>
            <div className="absolute top-[-5%] right-[-5%] w-[50vw] h-[50vw] rounded-full bg-[#F2A480] blur-[100px] mix-blend-multiply animate-hero-blob-reverse opacity-70"></div>
          </div>
        )}
        
        {isDark && (
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-[#020205]">
            <div className="absolute top-[30%] left-[30%] w-[40vw] h-[30vw] bg-[#6D28D9] blur-[160px] opacity-20 mix-blend-screen"></div>
            <svg viewBox="0 0 1440 600" className="absolute w-full h-full object-cover opacity-90" preserveAspectRatio="xMidYMid slice">
              <title>{lang === 'zh' ? '深色模式下的飘带背景装饰' : 'Decorative ribbon background for dark mode'}</title>
              <defs>
                <linearGradient id="ribbon-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#020205" stopOpacity="0" />
                  <stop offset="20%" stopColor="#4C1D95" stopOpacity="0.4" />
                  <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.8" />
                  <stop offset="80%" stopColor="#3B82F6" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#020205" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="ribbon-light" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#020205" stopOpacity="0" />
                  <stop offset="35%" stopColor="#A78BFA" stopOpacity="0.6" />
                  <stop offset="50%" stopColor="#FFFFFF" stopOpacity="1" />
                  <stop offset="65%" stopColor="#A78BFA" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#020205" stopOpacity="0" />
                </linearGradient>
              </defs>
              <g>
                {ribbonLines.map((line) => {
                  const { id, offsetY, isHighlight, animationClass, animationDelay } = line;
                  return (
                    <path 
                      key={id}
                      d={`M-100,${350 + offsetY} C300,${380 + offsetY} 450,${150 + offsetY} 750,${250 + offsetY} C1050,${350 + offsetY} 1250,${200 + offsetY} 1540,${220 + offsetY}`}
                      fill="none" stroke={isHighlight ? "url(#ribbon-light)" : "url(#ribbon-grad)"}
                      strokeWidth={isHighlight ? "2.5" : "1.2"} opacity={isHighlight ? "1" : 0.15 + ((offsetY / 2.5) * 0.03)}
                      className={animationClass} style={{ animationDelay }}
                    />
                  );
                })}
              </g>
            </svg>
          </div>
        )}

        {/* 核心排版调整区域：左图右文紧贴式自适应居中布局 */}
        <div className="relative z-10 w-full flex justify-center px-4 sm:px-6">
          <div className="w-fit mx-auto rounded-[2rem] border border-[var(--border-line)] bg-[var(--bg-section-white)]/70 backdrop-blur-sm shadow-[var(--shadow-card)] p-6 sm:p-10 md:p-12">
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-7 md:gap-12">
              
              {/* 左侧 (桌面端) / 上方 (移动端)：照片出场 */}
              <FadeIn tier="a" delay={100} className="w-auto flex-shrink-0">
                <div className="relative z-10 w-[140px] sm:w-[160px] md:w-[180px] aspect-[3/4] rounded-[1.5rem] bg-[var(--bg-section-white)] border border-[var(--border-line)] shadow-[var(--shadow-card)] overflow-hidden group hover:-translate-y-1 transition-transform duration-500 animate-float mx-auto">
                  <img src="zzh.png" alt="Zihan Zhang" loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none"></div>
                  <div className="absolute bottom-5 left-1/2 -translate-x-1/2 font-mono text-[10px] font-medium tracking-widest uppercase text-white/85">
                    Profile
                  </div>
                </div>
              </FadeIn>

              {/* 右侧 (桌面端) / 下方 (移动端)：紧凑的文字信息，采用流式渐入序列 */}
              <div className="flex flex-col items-center md:items-start text-center md:text-left flex-shrink-0 w-auto max-w-[420px]">
                <FadeIn tier="a" delay={200} className="w-auto">
                  <div className="relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-section-white)] border border-[var(--border-line)] shadow-[var(--shadow-sm)] mb-4 sm:mb-5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse"></div>
                    <span className="text-[10px] font-semibold tracking-wider uppercase font-mono text-[var(--text-main)] opacity-80">{t.hero.role}</span>
                  </div>
                </FadeIn>
                
                <FadeIn tier="a" delay={300} className="w-auto">
                  <h1 className="font-editorial font-bold tracking-tight leading-[1.12] mb-3 sm:mb-4 text-[clamp(1.8rem,3vw,2.6rem)] text-[var(--text-main)] relative">
                    <span className="block">{t.hero.title1}</span>
                    <span className="block text-[var(--text-muted)]">{t.hero.title2}</span>
                  </h1>
                </FadeIn>

                <FadeIn tier="a" delay={400} className="w-auto">
                  <p className="font-light leading-relaxed mb-5 sm:mb-6 text-[14px] sm:text-[15px] text-[var(--text-muted)]">
                    {t.hero.desc1}
                    <strong className="inline-block font-editorial font-bold text-[16px] sm:text-[17px] text-[var(--text-main)] mx-0.5">{t.hero.name}</strong>
                    {t.hero.desc2}
                  </p>
                </FadeIn>

                <FadeIn tier="a" delay={500} className="w-auto w-full">
                  <div className="flex flex-row flex-wrap items-center justify-center md:justify-start gap-2.5 w-full">
                    <a href="#portfolio" className="focus-ring shimmer-btn overflow-hidden px-6 py-3 rounded-full text-[13px] font-medium flex items-center justify-center gap-2 bg-[var(--text-main)] text-[var(--bg-section-white)] hover:scale-105 transition-transform shadow-md shrink-0 relative">
                      <span>{t.hero.btnWork}</span> <ArrowUpRight size={14} />
                    </a>
                    <a href="#resume" className="focus-ring px-6 py-3 rounded-full text-[13px] font-medium flex items-center justify-center bg-[var(--bg-section-white)] border border-[var(--border-line)] text-[var(--text-main)] hover:bg-[var(--bg-section-gray)] transition-colors shadow-[var(--shadow-sm)] shrink-0">
                      {t.hero.btnResume}
                    </a>
                  </div>
                </FadeIn>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: PORTFOLIO */}
      <section id="portfolio" className="order-2 w-full pt-24 pb-32 bg-[var(--bg-section-white)] border-t border-[var(--border-line)] relative">
        <div className="w-full max-w-[1150px] mx-auto px-6 lg:px-8">
          <FadeIn tier="a">
            <div className="mb-12 flex flex-col items-center sm:items-start gap-1 relative z-10 w-full">
              <span className="font-mono text-[10px] font-medium uppercase tracking-widest text-[var(--accent)] mb-2 inline-block">01 / Featured Work</span>
              <h2 className="font-editorial font-bold text-[var(--text-main)] text-[2.2rem] sm:text-[2.8rem] leading-[1.1] tracking-tight">{t.portfolio.title}</h2>
            </div>
          </FadeIn>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 w-full">
            {projects.map((project, index) => {
              const isMiddle = index === 1; 
              return (
                <FadeIn key={project.id} tier="a" delay={(index + 1) * 100} className="w-full">
                  <div className="linear-card rounded-[1.25rem] sm:rounded-[1.5rem] p-4 flex flex-col h-full group w-full">
                    <div className={`relative w-full aspect-[3/2] rounded-[0.75rem] sm:rounded-[1rem] overflow-hidden border border-[var(--border-line)] bg-[var(--bg-section-gray)] shrink-0 shadow-inner ${isMiddle ? 'order-2 mt-4' : 'order-1 mb-4'}`}>
                      {project.image?.src ? (
                        <img src={project.image.src} alt={project.image.alt} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 z-10" />
                      ) : (
                        <>
                          <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
                          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-[var(--text-muted)] transition-transform duration-700 group-hover:scale-105 z-10">
                             <ImageIcon size={28} className="mb-2 opacity-20 text-[var(--text-main)]" strokeWidth={1.5} />
                             <span className="text-[10px] font-mono tracking-widest uppercase opacity-50">[{project.image.alt}]</span>
                          </div>
                        </>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent dark:from-white/10 pointer-events-none z-20"></div>
                    </div>

                    <div className={`flex flex-col flex-1 w-full ${isMiddle ? 'order-1' : 'order-2'}`}>
                      <div className="flex items-center gap-2.5 mb-3 w-full">
                        <div className="w-7 h-7 rounded-full bg-[var(--bg-section-gray)] border border-[var(--border-line)] flex items-center justify-center shrink-0 shadow-sm">{project.icon}</div>
                        <span className="font-mono text-[11px] tracking-widest uppercase text-[var(--text-main)] font-bold">{project.title}</span>
                      </div>
                      <h3 className="font-editorial text-[1.2rem] sm:text-[1.25rem] font-bold text-[var(--text-main)] leading-[1.3] tracking-tight mb-3 w-full">{project.slogan}</h3>
                      <p className="text-[13px] text-[var(--text-muted)] leading-relaxed font-light mb-5 flex-1 w-full">{project.description}</p>
                      <div className="flex flex-wrap gap-1.5 mb-5 w-full">
                        {project.tags.map(tag => (
                           <span key={tag} className="px-2 py-1 rounded-md border border-[var(--border-line)] bg-[var(--bg-section-gray)] text-[10px] font-mono tracking-wide text-[var(--text-muted)]">{tag}</span>
                        ))}
                      </div>
                      <div className="grid grid-cols-2 gap-2.5 pt-4 border-t border-[var(--border-light)] mt-auto w-full">
                        {project.links.map((link) => {
                          const isPrimary = link.type === 'demo';
                          const isDoc = link.type === 'doc';
                          const isDocMenu = link.type === 'doc-menu';
                          const menuId = `${project.id}-${link.type}`;
                          if (isDocMenu) {
                            return (
                              <div key={menuId} className="relative" data-doc-menu-root>
                                <button
                                  type="button"
                                  onClick={() => setOpenDocMenuId(prev => (prev === menuId ? null : menuId))}
                                  className="btn-glow !py-2 !px-3"
                                >
                                  <FileText size={13} className="opacity-80 flex-shrink-0" />
                                  <span className="tracking-wide truncate text-[11px]">{link.text}</span>
                                  <ChevronDown size={12} strokeWidth={2} className={`opacity-70 ml-auto flex-shrink-0 transition-transform ${openDocMenuId === menuId ? 'rotate-180' : ''}`} />
                                </button>
                                {openDocMenuId === menuId && (
                                  <div className="absolute left-0 right-0 bottom-[calc(100%+0.5rem)] z-30 rounded-xl border border-[var(--border-line)] bg-[var(--bg-card)] shadow-[var(--shadow-card)] p-1.5">
                                    {link.menuItems.map((item) => (
                                      <a
                                        key={`${menuId}-${item.text}`}
                                        href={item.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={() => setOpenDocMenuId(null)}
                                        className="focus-ring flex items-center gap-2 rounded-lg px-2.5 py-2 text-[11px] font-medium text-[var(--text-main)] hover:bg-[var(--bg-section-gray)] transition-colors"
                                      >
                                        <FileText size={12} className="opacity-70 flex-shrink-0" />
                                        <span className="tracking-wide truncate">{item.text}</span>
                                        <ArrowUpRight size={11} strokeWidth={2} className="opacity-60 ml-auto flex-shrink-0" />
                                      </a>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          }
                          return (
                            <a key={`${project.id}-${link.type}`} href={link.url} target="_blank" rel="noopener noreferrer" className={`btn-glow ${isPrimary ? 'primary' : ''} !py-2 !px-3`}>
                              {isDoc ? <FileText size={13} className="opacity-80 flex-shrink-0" /> : <Monitor size={13} className="opacity-80 flex-shrink-0" />}
                              <span className="tracking-wide truncate text-[11px]">{link.text}</span>
                              <ArrowUpRight size={12} strokeWidth={2} className="opacity-60 ml-auto flex-shrink-0" />
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 3: EXPERIENCE / RESUME */}
      <section id="resume" className="order-4 w-full pt-20 pb-28 bg-[var(--bg-section-gray)] border-t border-[var(--border-line)] relative">
        <div className="w-full max-w-[900px] mx-auto px-6">
          <FadeIn className="w-full">
            <div className="mb-10 flex flex-col items-start gap-1 relative w-full">
              <span className="font-mono text-[10px] font-medium uppercase tracking-widest text-[var(--accent)]">03 / Career & Education</span>
              <h2 className="font-editorial font-bold text-[var(--text-main)] text-[2rem] sm:text-[2.5rem] tracking-tight">{t.resume.title}</h2>
            </div>
          </FadeIn>

          <div className="w-full space-y-6 sm:space-y-8">
            <FadeIn delay={100} className="w-full">
              <div className="linear-card p-6 sm:p-10 w-full">
                <div className="mb-8 flex items-center gap-3 w-full">
                  <div className="w-8 h-8 rounded-full bg-[var(--bg-section-gray)] border border-[var(--border-line)] flex items-center justify-center"><GraduationCap size={14} className="text-[var(--text-main)]" /></div>
                  <h3 className="text-[14px] font-bold text-[var(--text-main)] tracking-wide">{t.resume.edu}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                  <FadeIn delay={150} className="w-full h-full">
                    <div className="p-6 rounded-xl border border-[var(--border-line)] bg-[var(--bg-section-gray)] hover:bg-[var(--bg-section-white)] transition-colors flex flex-col h-full w-full">
                      <div className="font-mono text-[10px] text-[var(--text-muted)] mb-3 tracking-widest">2024 - 2026</div>
                      <h4 className="text-[14px] font-bold text-[var(--text-main)] mb-1 tracking-tight">{t.resume.edu1_title}</h4>
                      <p className="text-[12px] font-medium text-[var(--text-muted)] mb-3">{t.resume.edu1_sub}</p>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 mb-3 rounded-md border border-[var(--border-line)] bg-[var(--bg-section-white)] shadow-sm w-max">
                         <Award size={12} className="text-[var(--accent)]" />
                         <span className="text-[10px] font-bold text-[var(--text-main)] truncate">{t.resume.edu1_badge}</span>
                      </div>
                      <p className="text-[13px] text-[var(--text-muted)] leading-relaxed font-light mt-auto pt-3 border-t border-[var(--border-light)]">{t.resume.edu1_desc}</p>
                    </div>
                  </FadeIn>
                  <FadeIn delay={250} className="w-full h-full">
                    <div className="p-6 rounded-xl border border-[var(--border-line)] bg-[var(--bg-section-gray)] hover:bg-[var(--bg-section-white)] transition-colors flex flex-col h-full w-full">
                      <div className="font-mono text-[10px] text-[var(--text-muted)] mb-3 tracking-widest">2018 - 2022</div>
                      <h4 className="text-[14px] font-bold text-[var(--text-main)] mb-1 tracking-tight">{t.resume.edu2_title}</h4>
                      <p className="text-[12px] font-medium text-[var(--text-muted)] mb-3">{t.resume.edu2_sub}</p>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 mb-3 rounded-md border border-[var(--border-line)] bg-[var(--bg-section-white)] shadow-sm w-max">
                         <Award size={12} className="text-[var(--accent)]" />
                         <span className="text-[10px] font-bold text-[var(--text-main)] truncate">{t.resume.edu2_badge}</span>
                      </div>
                      <p className="text-[13px] text-[var(--text-muted)] leading-relaxed font-light mt-auto pt-3 border-t border-[var(--border-light)]">{t.resume.edu2_desc}</p>
                    </div>
                  </FadeIn>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={200} className="w-full">
              <div className="linear-card p-6 sm:p-10 w-full">
                <div className="mb-8 flex items-center gap-3 w-full">
                  <div className="w-8 h-8 rounded-full bg-[var(--bg-section-gray)] border border-[var(--border-line)] flex items-center justify-center"><Terminal size={14} className="text-[var(--text-main)]" /></div>
                  <h3 className="text-[14px] font-bold text-[var(--text-main)] tracking-wide">{t.resume.exp}</h3>
                </div>
                <div className="w-full">
                  <TimelineItem time="2025.12 - Present" title={t.resume.exp1_title} subtitle={t.resume.exp1_sub} defaultOpen={true} details={t.resume.exp1_details} />
                  <TimelineItem time="2025.03 - 2025.12" title={t.resume.exp2_title} subtitle={t.resume.exp2_sub} details={t.resume.exp2_details} />
                  <TimelineItem time="2023.01 - 2023.10" title={t.resume.exp3_title} subtitle={t.resume.exp3_sub} details={t.resume.exp3_details} />
                  <TimelineItem time="2022.03 - 2022.07" title={t.resume.exp4_title} subtitle={t.resume.exp4_sub} isLast={true} details={t.resume.exp4_details} />
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={300} className="w-full">
              <div className="linear-card p-6 sm:p-10 w-full">
                <div className="mb-8 flex items-center gap-3 w-full">
                  <div className="w-8 h-8 rounded-full bg-[var(--bg-section-gray)] border border-[var(--border-line)] flex items-center justify-center"><Layers size={14} className="text-[var(--text-main)]" /></div>
                  <h3 className="text-[14px] font-bold text-[var(--text-main)] tracking-wide">{t.resume.proj}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                  <FadeIn delay={150} className="w-full h-full">
                    <ResumeProjectCard
                      tag="AI Education"
                      title={t.resume.proj1_title}
                      subtitle={t.resume.proj1_sub}
                      description={t.resume.proj1_desc}
                      defaultOpen={true}
                    />
                  </FadeIn>
                  <FadeIn delay={250} className="w-full h-full">
                    <ResumeProjectCard
                      tag="Data Product"
                      title={t.resume.proj2_title}
                      subtitle={t.resume.proj2_sub}
                      description={t.resume.proj2_desc}
                    />
                  </FadeIn>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={400} className="w-full">
              <div className="linear-card p-6 sm:p-10 w-full">
                <div className="mb-8 flex items-center gap-3 w-full">
                  <div className="w-8 h-8 rounded-full bg-[var(--bg-section-gray)] border border-[var(--border-line)] flex items-center justify-center"><Zap size={14} className="text-[var(--text-main)]" /></div>
                  <h3 className="text-[14px] font-bold text-[var(--text-main)] tracking-wide">{t.impact.title}</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full">
                  {[ 
                    { id: 'conversion', num: 18, suffix: '%', desc: t.impact.s1 }, 
                    { id: 'launches', num: 8, suffix: '+', desc: t.impact.s2 }, 
                    { id: 'participation', num: 166, suffix: '%', desc: t.impact.s3 }, 
                    { id: 'aied', num: 1, suffix: lang === 'zh' ? '篇' : '', desc: t.impact.s4 },
                    { id: 'prediction', num: 85, suffix: '%', desc: t.impact.s5 },
                    { id: 'efficiency', num: 35, suffix: '%', desc: t.impact.s6 }
                  ].map((stat, i) => (
                    <FadeIn key={stat.id} delay={i * 100} className="flex flex-col items-start px-2 border-l-2 border-[var(--border-line)] pl-4 w-full">
                      <div className="font-mono font-medium text-[2rem] sm:text-[2.5rem] text-[var(--text-main)] mb-1 tracking-tighter leading-none">
                        <SlotCounter target={stat.num} />{stat.suffix}
                      </div>
                      <div className="text-[11px] font-medium text-[var(--text-muted)] tracking-wide uppercase mt-2">{stat.desc}</div>
                    </FadeIn>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* SECTION 4: TOOLS & SKILLS */}
      <section id="tools" className="order-5 w-full pt-16 pb-24 bg-[var(--bg-section-white)] border-t border-[var(--border-line)] relative">
        <div className="w-full max-w-[1050px] mx-auto px-6">
          <FadeIn className="w-full">
            <div className="mb-10 flex flex-col items-center sm:items-start gap-1 relative z-10 w-full">
              <span className="font-mono text-[10px] font-medium uppercase tracking-widest text-[var(--accent)] mb-2 inline-block">04 / Tool Stack</span>
              <h2 className="font-editorial font-bold text-[var(--text-main)] text-[2rem] sm:text-[2.5rem] tracking-tight">{t.tools.title}</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 w-full">
              {skillCategories[lang].map((category, index) => (
                <FadeIn key={category.title} delay={(index + 1) * 150} className="linear-card p-6 sm:p-8 flex flex-col items-start bg-[var(--bg-section-gray)] hover:bg-[var(--bg-card)] transition-colors h-full w-full">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--border-line)] w-full">
                    <div className="w-9 h-9 rounded-full bg-[var(--bg-section-white)] border border-[var(--border-line)] flex items-center justify-center shadow-sm">
                      <category.icon size={16} className="text-[var(--text-main)]" />
                    </div>
                    <h3 className="text-[15px] font-bold text-[var(--text-main)] tracking-tight">{category.title}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2.5 w-full">
                    {category.skills.map(skill => (
                      <span key={skill} className="px-3 py-1.5 rounded-md border border-[var(--border-line)] bg-[var(--bg-section-white)] text-[12px] font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-[var(--text-disabled)] transition-colors cursor-default shadow-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </FadeIn>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* SECTION 5: WHY ME */}
      <section id="why-me" className="order-3 w-full pt-32 pb-40 bg-[var(--bg-section-gray)] border-t border-[var(--border-line)] relative">
        <div className="w-full max-w-[1100px] mx-auto px-6">
          <FadeIn className="w-full">
            <div className="flex flex-col items-start mb-10 relative z-10 w-full">
              <span className="font-mono text-[10px] font-medium uppercase tracking-widest text-[var(--accent)] mb-3 inline-block">{t.whyme.tag}</span>
              <h2 className="font-editorial font-bold text-[var(--text-main)] text-[2rem] sm:text-[2.8rem] leading-[1.1] tracking-tight">{t.whyme.title}</h2>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 w-full">
            <FadeIn delay={100} className="lg:col-span-5 w-full h-full">
              <div className="linear-card rounded-[1.5rem] sm:rounded-[2rem] p-4 flex flex-col h-full min-h-[450px] relative overflow-hidden group w-full">
                <div className="flex-1 rounded-[1rem] sm:rounded-[1.5rem] relative overflow-hidden border border-[var(--light)] bg-[var(--bg-section-gray)] w-full">
                   <img src="whyme.jpg" alt="Core Identity" loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="absolute bottom-6 left-6 right-6 bg-[var(--bg-section-white)]/80 dark:bg-[#121212]/90 backdrop-blur-lg border border-[var(--border-line)] rounded-[1rem] p-4 flex justify-between items-end shadow-md">
                  <div>
                    <div className="text-[9px] font-mono tracking-widest text-[var(--text-muted)] uppercase mb-1">{t.whyme.hero_series}</div>
                    <div className="text-[1.1rem] font-bold text-[var(--text-main)] font-editorial tracking-tight">{t.whyme.hero_title}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[9px] font-mono tracking-widest text-[var(--text-muted)] uppercase mb-1">Data points</div>
                    <div className="text-[1.1rem] font-bold text-[var(--text-main)] tracking-tight">{t.whyme.hero_frames}</div>
                  </div>
                </div>
              </div>
            </FadeIn>

            <div className="lg:col-span-7 flex flex-col gap-5 w-full">
              <FadeIn delay={200} className="w-full">
                <div className="linear-card rounded-[1.5rem] sm:rounded-[2rem] p-5 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 w-full">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-[var(--bg-section-gray)] border border-[var(--border-line)] flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
                      <User size={24} className="text-[var(--text-muted)]" />
                    </div>
                    <div>
                      <h3 className="text-[1.15rem] font-bold text-[var(--text-main)] mb-1 tracking-tight">{t.whyme.name}</h3>
                      <p className="text-[11px] font-medium text-[var(--text-muted)]">{t.whyme.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 sm:gap-8 w-full sm:w-auto border-t sm:border-t-0 border-[var(--border-light)] pt-4 sm:pt-0">
                    <div className="flex flex-col items-start sm:items-center w-1/3 sm:w-auto">
                      <div className="text-[18px] font-bold text-[var(--text-main)]">{t.whyme.stats_p1}</div>
                      <div className="text-[10px] font-mono tracking-widest text-[var(--text-muted)] uppercase mt-0.5">{t.whyme.stats_p1_l}</div>
                    </div>
                    <div className="flex flex-col items-start sm:items-center w-1/3 sm:w-auto">
                      <div className="text-[18px] font-bold text-[var(--text-main)]">{t.whyme.stats_p2}</div>
                      <div className="text-[10px] font-mono tracking-widest text-[var(--text-muted)] uppercase mt-0.5">{t.whyme.stats_p2_l}</div>
                    </div>
                    <div className="flex flex-col items-start sm:items-center w-1/3 sm:w-auto">
                      <div className="text-[18px] font-bold text-[var(--text-main)]">{t.whyme.stats_p3}</div>
                      <div className="text-[10px] font-mono tracking-widest text-[var(--text-muted)] uppercase mt-0.5">{t.whyme.stats_p3_l}</div>
                    </div>
                  </div>
                </div>
              </FadeIn>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-5 w-full">
                <FadeIn delay={300} className="sm:col-span-3 w-full h-full">
                  <div className="linear-card rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-7 flex flex-col justify-between h-full w-full">
                    <p className="text-[14px] text-[var(--text-main)] leading-relaxed font-light mb-6">
                      {t.whyme.bio}
                    </p>
                    <div className="space-y-3 mt-auto w-full">
                      <div className="flex items-center gap-3 text-[12px] text-[var(--text-muted)] font-medium w-full">
                        <Mic size={14} className="opacity-70 text-[var(--text-main)]" />
                        <span className="flex-1">{t.whyme.bio_tag1}</span>
                      </div>
                      <div className="flex items-center gap-3 text-[12px] text-[var(--text-muted)] font-medium w-full">
                        <Database size={14} className="opacity-70 text-[var(--text-main)]" />
                        <span className="flex-1">{t.whyme.bio_tag2}</span>
                      </div>
                    </div>
                  </div>
                </FadeIn>

                <FadeIn delay={400} className="sm:col-span-2 w-full h-full">
                  <div className="linear-card rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-7 flex flex-col gap-3 justify-center bg-gradient-to-b from-[var(--bg-card)] to-[var(--bg-section-gray)] h-full w-full">
                    <div className="px-4 py-2.5 bg-[var(--bg-section-white)] border border-[var(--border-line)] rounded-full text-[12px] font-medium text-[var(--text-main)] shadow-[var(--shadow-sm)] flex justify-between items-center cursor-default w-full">
                      <span>Empathy</span> <Mic size={12} className="text-[var(--text-muted)]" />
                    </div>
                    <div className="px-4 py-2.5 bg-[var(--bg-section-white)] border border-[var(--border-line)] rounded-full text-[12px] font-medium text-[var(--text-main)] shadow-[var(--shadow-sm)] flex justify-between items-center cursor-default w-full">
                      <span>Architecture</span> <Database size={12} className="text-[var(--text-muted)]" />
                    </div>
                    <div className="px-4 py-2.5 bg-[var(--bg-section-white)] border border-[var(--border-line)] rounded-full text-[12px] font-medium text-[var(--text-main)] shadow-[var(--shadow-sm)] flex justify-between items-center cursor-default w-full">
                      <span>RAG & LLM</span> <Zap size={12} className="text-[var(--text-muted)]" />
                    </div>
                    <a href="#contact" className="mt-2 px-4 py-3 bg-[var(--text-main)] text-[var(--bg-section-white)] hover:scale-[1.02] transition-transform rounded-full text-[12.5px] font-medium flex justify-center items-center shadow-md w-full">
                      {t.whyme.btn_book}
                    </a>
                  </div>
                </FadeIn>
              </div>

              <FadeIn delay={500} className="w-full">
                <div className="linear-card rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-7 w-full">
                  <div className="flex items-center justify-between mb-5 w-full">
                    <div className="text-[10px] font-mono tracking-widest uppercase text-[var(--text-disabled)]">{t.whyme.latest_title}</div>
                    <a href="#portfolio" className="text-[11px] font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] border-b border-transparent hover:border-[var(--text-main)] transition-all">{t.whyme.archive}</a>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                    <div className="rounded-xl bg-[var(--bg-section-gray)] border border-[var(--border-light)] overflow-hidden group w-full">
                      <div className="h-28 w-full relative overflow-hidden bg-gradient-to-r from-[#FFF3E0] to-[#FFE0B2] dark:from-[#3a1d12] dark:to-[#6a2b15]">
                        <div className="absolute top-3 left-3 px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-black/40 text-white tracking-wide uppercase backdrop-blur-sm z-10">{t.whyme.card1_tag}</div>
                        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors"></div>
                        <Mic size={40} strokeWidth={1} className="absolute -bottom-4 -right-2 text-black/10 dark:text-white/10 rotate-12 group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="p-4 bg-[var(--bg-section-white)] w-full">
                        <div className="font-editorial font-bold text-[14px] text-[var(--text-main)]">{t.whyme.card1_title}</div>
                        <div className="text-[11px] text-[var(--text-muted)] mt-1">{t.whyme.card1_desc}</div>
                      </div>
                    </div>
                    <div className="rounded-xl bg-[var(--bg-section-gray)] border border-[var(--border-light)] overflow-hidden group w-full">
                      <div className="h-28 w-full relative overflow-hidden bg-gradient-to-r from-[#E1F5FE] to-[#B3E5FC] dark:from-[#0d2a40] dark:to-[#1a517a]">
                        <div className="absolute top-3 left-3 px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-black/40 text-white tracking-wide uppercase backdrop-blur-sm z-10">{t.whyme.card2_tag}</div>
                        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors"></div>
                        <Database size={40} strokeWidth={1} className="absolute -bottom-4 -right-2 text-black/10 dark:text-white/10 -rotate-12 group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="p-4 bg-[var(--bg-section-white)] w-full">
                        <div className="font-editorial font-bold text-[14px] text-[var(--text-main)]">{t.whyme.card2_title}</div>
                        <div className="text-[11px] text-[var(--text-muted)] mt-1">{t.whyme.card2_desc}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>

            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: CONTACT */}
      <section id="contact" className="order-6 w-full pt-24 pb-32 bg-[var(--bg-section-white)] border-t border-[var(--border-line)] relative overflow-hidden">
        <svg viewBox="0 0 100 20" className="absolute bottom-10 left-1/2 -translate-x-1/2 w-1/2 h-40 pointer-events-none opacity-20" preserveAspectRatio="none">
            <title>{lang === 'zh' ? '联系区背景弧线装饰' : 'Decorative curved line in contact section'}</title>
            <path d="M 0,20 Q 50,-10 100,20" fill="none" stroke="var(--border-line)" strokeWidth="0.5" />
        </svg>

        <FadeIn className="w-full max-w-[900px] mx-auto px-4 sm:px-6 relative z-10">
          <div className="relative overflow-hidden rounded-[2.5rem] sm:rounded-[3rem] border border-[var(--border-line)] bg-[var(--bg-section-white)] p-12 sm:p-24 text-center shadow-[var(--shadow-card)] w-full">
            {!isDark && <div className="absolute top-[-50%] right-[-10%] w-[60%] h-[100%] bg-[#F2A480]/10 blur-[100px] pointer-events-none mix-blend-multiply"></div>}
            
            <div className="relative z-10 w-full">
              <h2 className="font-editorial font-bold text-[var(--text-main)] mb-4 text-[1.75rem] sm:text-[2.25rem] tracking-tight">{t.contact.title}</h2>
              <p className="text-[14px] text-[var(--text-muted)] mb-10 font-light max-w-sm mx-auto leading-relaxed">{t.contact.subtitle}</p>
              
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-10 w-full">
                {/* 使用 handleCopy 替代 href 锚点，实现一键无感复制 */}
                <button type="button" onClick={() => handleCopy(t.contact.email, 'email')} className="focus-ring flex items-center justify-center gap-3 px-8 py-3.5 bg-[var(--text-main)] text-[var(--bg-section-white)] rounded-full text-[13px] font-medium hover:scale-105 transition-all shadow-md w-full sm:w-auto relative group">
                  {copiedItem === 'email' ? <Check size={16} className="text-green-400" /> : <Mail size={16} />} 
                  <span className="tracking-wide">{copiedItem === 'email' ? t.contact.copyMsg : t.contact.email}</span>
                </button>
                <button type="button" onClick={() => handleCopy(t.contact.phone, 'phone')} className="focus-ring flex items-center justify-center gap-3 px-8 py-3.5 bg-[var(--bg-card)] border border-[var(--border-line)] rounded-full text-[13px] font-medium text-[var(--text-main)] hover:bg-[var(--bg-section-gray)] transition-all shadow-[var(--shadow-sm)] w-full sm:w-auto">
                  {copiedItem === 'phone' ? <Check size={16} className="text-green-500 dark:text-green-400" /> : <Phone size={16} />} 
                  <span className="tracking-wide">{copiedItem === 'phone' ? t.contact.copyMsg : t.contact.phone}</span>
                </button>
              </div>

              <div className="flex justify-center gap-4 w-full">
                <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="focus-ring p-3 bg-[var(--bg-card)] border border-[var(--border-line)] rounded-full text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-section-gray)] transition-colors shadow-[var(--shadow-sm)]"><Linkedin size={16} /></a>
                <a href="https://github.com/hannahzh20" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="focus-ring p-3 bg-[var(--bg-card)] border border-[var(--border-line)] rounded-full text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-section-gray)] transition-colors shadow-[var(--shadow-sm)]"><Github size={16} /></a>
              </div>
            </div>
          </div>
        </FadeIn>
        
        <div className="text-center mt-16 pb-8 relative z-10 w-full">
          <p className="font-mono text-[10px] text-[var(--text-disabled)] tracking-widest uppercase">© 2026 ZIHAN ZHANG. ALL RIGHTS RESERVED.</p>
        </div>
      </section>
    </div>
  );
}
