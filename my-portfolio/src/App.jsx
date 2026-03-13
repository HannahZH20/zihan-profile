import React, { useState, useEffect, useLayoutEffect, useRef, useId } from 'react';
import { ChevronDown, Mail, Github, Linkedin, User, Phone, Figma, Database, ArrowUpRight, Award, GraduationCap, PenTool, BookOpen, Play, FileText, Terminal, Zap, Layers, Mic, Moon, Sun, Monitor, Languages, Image as ImageIcon } from 'lucide-react';

// --- 全局与主题样式 ---
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

  /* --- 严谨的模块化色彩与层级系统 --- */
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
    --bg-hero: #0A0A0A;
    --bg-section-white: #000000;
    --bg-section-gray: #0A0A0A;
    
    --text-main: #EDEDED;
    --text-muted: #A3A3A3;
    --text-disabled: #525252;
    
    --accent: #F45B2D;
    
    --border-line: rgba(255, 255, 255, 0.1);
    --border-light: rgba(255, 255, 255, 0.05);
    
    --bg-card: #121212;
    --shadow-sm: 0 1px 2px rgba(0,0,0,0.4);
    --shadow-card: 0 0 0 1px rgba(255,255,255,0.08), 0 4px 6px -1px rgba(0,0,0,0.4);
    --shadow-card-hover: 0 0 0 1px rgba(255,255,255,0.15), 0 12px 24px -4px rgba(0,0,0,0.8);
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

  /* 使得手绘元素出现得自然 */
  @keyframes draw-in {
    from { stroke-dashoffset: 100; opacity: 0; }
    to { stroke-dashoffset: 0; opacity: 1; }
  }
  .animate-draw {
    stroke-dasharray: 100;
    animation: draw-in 1.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
  }
`;

// --- 国际化翻译字典 ---
const translations = {
  zh: {
    nav: { home: '首页', works: '作品集', resume: '履历', tools: '工具', whyme: 'Why Me', contact: '联系' },
    hero: { role: 'Product Architect', title1: '理性的构建者，', title2: '感性的叙述者。', desc1: "Hi, I'm ", name: "张子涵", desc2: "。", btnWork: '浏览作品集', btnResume: '查看履历' },
    portfolio: {
      title: '核心项目。', p1_title: 'AI 驱动的营养健康管理平台', p1_role: 'Role: 产品架构规划 & 核心交互设计', p1_desc: '面向个人用户与专业营养师的 B2B2C 平台。通过多模态 AI (RAG架构) 实现 3秒内极速饮食录入，解决用户记录焦虑；同时为 B 端营养师提供客户分级管理工具，提升服务效率 3-5 倍。', p1_tags: ['AI大模型', 'B2B2C架构', '需求调研', 'PRD撰写'], p1_btn1: '核心 PRD 拆解', p1_btn2: '高保真交互体验', hover_xray: 'Hover to reveal',
      p2_title: '课堂协作讨论智能引导系统', p2_role: 'Role: 用户研究 & 核心机制设计', p2_desc: '针对高校课堂“低质量讨论”痛点，基于 LLM 与语音转写技术设计的实时干预系统。真实 A/B 测试表明，系统能有效促进“沉默成员”参与度提升 166%，并输出高质量的结构化总结。', p2_tags: ['教育科技', '用户访谈(25+)', 'A/B Test', '数据驱动'], p2_btn1: '用研分析报告', p2_btn2: '交互式演示原型'
    },
    impact: { title: '业务影响。', s1: '海外系统上线', s2: '深度用户访谈', s3: '发言提升率', s4: '底层字典沉淀' },
    resume: {
      title: '核心链路。', edu: '学术背景', edu1_title: '计算机科学与技术硕士', edu1_sub: '莫纳什大学 (QS排名 36)', edu1_desc: '主修方向涵盖生成式 AI 应用、数据科学基础、软件工程底层逻辑与云计算架构。', edu1_badge: 'GPA 3.56/4.0 · HD一等荣誉 · Top 5%', edu2_title: '播音与主持艺术本科', edu2_sub: '四川电影电视学院', edu2_desc: '系统化训练沟通同理心与叙事能力，主修内容产品策划、新媒体运营与用户诉求拆解。',
      exp: '关键实践', exp1_title: '海外数字化产品实习生', exp1_sub: '沪上阿姨实业股份有限公司', exp1_details: ["多国系统规则统一设计：围绕“订单→支付结算”核心链路开展需求分析，抽象 83 项字段字典与 47 条异常码映射。","跨团队沟通与落地：对接熊猫外卖、Grab 等 5+ 平台，支持 8+ 国家系统上线，单店交付周期缩短 3-5 天。","机制保障优化：设计上线检查清单与问题分级机制，故障率严格控制在 0.5% 以下。"],
      exp2_title: '大模型产品经理', exp2_sub: '济南驯创人工智能有限公司', exp2_details: ["参与 B2B2C 三层架构（C端、中台AI、B端专家）整体规划并输出高保真 PRD。","结合 RAG 与多智能体协同，打造 3秒内极速 AI 饮食录入功能，识别精度达 98%+。","直接推动 B 端营养师服务效率提升 3-5 倍，用户付费转化率提升至 18%。"],
      exp3_title: '数据分析实习生', exp3_sub: '山东鲁泰热电有限公司', exp3_details: ["基于 Python 与 3σ 原则挖掘 10万+ 运行数据，精准拦截 4 次核心设备运行异常。","设计自动化数据监控看板，推动报表业务效率每周提升 3-5 小时。"],
      proj: '重点研发', proj1_title: '课堂协作智能引导系统 (ProDAIS)', proj1_sub: '全链路架构与算法落地规划', proj1_desc: '针对课堂协作场景，基于 LLM 与 STT 语音流解析技术设计干预算法模块。通过真实课堂 A/B 测试验证模型效度，核心指标（参与度、发言结构性）大幅上涨，SUS 系统可用性评分达 78。', proj2_title: '学生行为早期预警中台', proj2_sub: '数据建模与预警体系设计', proj2_desc: '深挖 12 万+ 条教育日志，完成数据清洗聚合。构建风险特征预测模型，并在此基础上打造“预警-干预-复盘”的闭环产品链路，确保高风险学生群体识别准确率稳定在 85% 以上。'
    },
    tools: { title: '核心技能栈。', subtitle: 'Technical Proficiency' },
    whyme: { quote1: '不只是写需求文档，', quote2: '我将 ', quote_hl: '人性的诉求', quote3: ' 翻译成系统的架构。', card1_title: '播音与主持艺术', card1_desc: '专业的声音训练赋予我极致的同理心，捕捉细微情绪，从表象中挖掘最真实的底层需求。', card2_title: 'CS 硕士', card2_desc: '逻辑严密的架构思维，将抽象的需求转化为大模型落地' },
    contact: { title: '期待与您开启新的协作。', subtitle: '随时准备好探讨产品、技术与业务的更多可能。', email: 'zzhannahz@163.com', phone: '152-5470-8512' }
  },
  en: {
    nav: { home: 'Home', works: 'Works', resume: 'Resume', tools: 'Tools', whyme: 'Why Me', contact: 'Contact' },
    hero: { role: 'Product Architect', title1: 'Rational Builder,', title2: 'Empathetic Storyteller.', desc1: "Hi, I'm ", name: "Zihan Zhang", desc2: ".", btnWork: 'View Works', btnResume: 'View Resume' },
    portfolio: {
      title: 'Selected Works.', p1_title: 'AI-Driven Nutrition & Health Platform', p1_role: 'Role: Product Architecture & Core UI/UX', p1_desc: 'A B2B2C platform for users and dietitians. Powered by Multimodal AI (RAG), it achieves sub-3s dietary input, curing tracking anxiety, while equipping B-end dietitians with CRM tools that boost efficiency by 3-5x.', p1_tags: ['LLM', 'B2B2C Architecture', 'User Research', 'PRD Writing'], p1_btn1: 'Core PRD Specs', p1_btn2: 'Interactive Prototype', hover_xray: 'Hover to reveal',
      p2_title: 'AI Facilitator for Classroom Collab', p2_role: 'Role: User Research & Logic Design', p2_desc: 'A real-time intervention system addressing "low-quality discussions" using LLM & STT. A/B testing proved it boosts participation from "silent members" by 166% and outputs highly structured meeting summaries.', p2_tags: ['EdTech', '25+ Interviews', 'A/B Testing', 'Data-Driven'], p2_btn1: 'UX Research PDF', p2_btn2: 'Logic Demo'
    },
    impact: { title: 'Selected Impact.', s1: 'Global Launches', s2: 'User Interviews', s3: 'Participation Lift', s4: 'Dict Fields' },
    resume: {
      title: 'Career Architecture.', edu: 'EDUCATION', edu1_title: 'MSc in Computer Science', edu1_sub: 'Monash University (QS 36)', edu1_desc: 'Focusing on Generative AI applications, Data Science fundamentals, Software Engineering logic, and Cloud Computing architecture.', edu1_badge: 'GPA 3.56/4.0 · HD First Class · Top 5%', edu2_title: 'BA in Broadcasting & Hosting', edu2_sub: 'Sichuan Film and Television College', edu2_desc: 'Systematic training in empathetic communication and storytelling. Major in content planning, media operations, and user needs analysis.',
      exp: 'WORK EXPERIENCE', exp1_title: 'Global Digital Product Intern', exp1_sub: 'Auntea Jenny (Shanghai) Co., Ltd.', exp1_details: ["Global Rule Unification: Analyzed requirements for the 'Order-to-Payment' core link, abstracting 83 data dictionary fields and 47 error code mappings.", "Cross-team Execution: Connected 5+ overseas platforms (HungryPanda, Grab), launched systems in 8+ countries, reducing single-store delivery time by 3-5 days.", "Optimization: Designed deployment checklists and issue grading, cutting failure rate to under 0.5%."],
      exp2_title: 'AI Product Manager', exp2_sub: 'Jinan Xunchuang AI Co., Ltd.', exp2_details: ["Architected the B2B2C framework (C-end, AI Mid-end, B-end experts) and delivered high-fidelity PRDs.", "Integrated RAG and Multi-Agent synergy to build a sub-3s dietary input feature with 98%+ accuracy.", "Boosted dietitian service efficiency by 3-5x and increased user conversion rate to 18%."],
      exp3_title: 'Data Analyst Intern', exp3_sub: 'Shandong Lutai Thermal Power Co.', exp3_details: ["Mined 100k+ operation logs using Python and the 3σ principle to accurately intercept 4 core equipment anomalies.", "Designed automated dashboards, saving 3-5 hours of weekly reporting time."],
      proj: 'RESEARCH & PROJECTS', proj1_title: 'AI Classroom Facilitator (ProDAIS)', proj1_sub: 'Full-stack Architecture & Algorithm Planning', proj1_desc: 'Designed intervention algorithms based on LLM & STT for collaborative settings. Validated through real-classroom A/B testing, significantly boosting participation and structured speech. SUS Usability score: 78.', proj2_title: 'Student Risk Warning Data Hub', proj2_sub: 'Data Modeling & Alert System Design', proj2_desc: 'Cleansed and aggregated 120k+ educational logs. Built risk prediction models and formulated an "Alert-Intervene-Review" product loop, maintaining an 85%+ accuracy rate for high-risk student identification.'
    },
    tools: { title: 'Technical Stack.', subtitle: 'Core Competencies' },
    whyme: { quote1: 'Beyond writing PRDs, ', quote2: 'I translate ', quote_hl: 'Human Empathy', quote3: ' into scalable System Architecture.', card1_title: 'Broadcasting Arts', card1_desc: 'Professional voice training grants me extreme empathy to capture subtle emotions and dig out true underlying needs from superficial chaos.', card2_title: 'CS Master', card2_desc: 'Rigorous architectural logic transforms abstract needs into LLM deployments.' },
    contact: { title: 'Ready for new challenges.', subtitle: 'Always open to discussing product, technology, and business possibilities.', email: 'zzhannahz@163.com', phone: '152-5470-8512' }
  }
};

// ============================================================================
// SVG HAND-DRAWN EDITORIAL COMPONENTS库
// 极简、克制、仅占总体视觉的 5%-10%
// ============================================================================

const ScribbleCircle = ({ className, color = "currentColor" }) => (
  <svg viewBox="0 0 100 100" className={`absolute pointer-events-none scale-[1.2] ${className}`} preserveAspectRatio="none">
    <path d="M 50,8 C 25,12 8,35 12,65 C 15,85 35,95 60,88 C 85,80 92,45 80,20 C 68,0 45,5 35,15" fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round" className="animate-draw" opacity="0.5" />
  </svg>
);

// ============================================================================

// --- WebGL 粒子组件 ---
const ParticleBrain = ({ colorStr = 'rgba(244, 91, 45,' }) => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId; let particles = []; const color = colorStr; 
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; initParticles(); };
    const createParticle = () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 1 + 0.5,
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      },
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `${color} 0.2)`;
        ctx.fill();
      }
    });
    const initParticles = () => { particles = []; const num = (canvas.width * canvas.height) / 12000; for (let i = 0; i < num; i++) particles.push(createParticle()); };
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update(); particles[i].draw();
        for (let j = i; j < particles.length; j++) {
          let dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y; let distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 50) { ctx.beginPath(); ctx.strokeStyle = `${color} ${0.15 * (1 - distance / 50)})`; ctx.lineWidth = 0.5; ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y); ctx.stroke(); }
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };
    resize(); window.addEventListener('resize', resize); animate();
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(animationFrameId); };
  }, [colorStr]);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
};

// --- 技能指示器组件 ---
const SkillIndicator = ({ name, icon }) => (
  <div className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[var(--bg-section-white)] border border-[var(--border-line)] rounded-full hover:border-[var(--accent)] hover:text-[var(--accent)] hover:-translate-y-0.5 transition-all shadow-[var(--shadow-sm)] cursor-default relative">
    {React.createElement(icon, { size: 14, className: 'opacity-70 flex-shrink-0' })}
    <span className="font-medium text-[12px] tracking-wide truncate">{name}</span>
  </div>
);

// --- 极简结构图卡片 (增加线框感注释) ---
const XRayCard = ({ baseUI, revealUI, hintText }) => {
  const containerRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const handleMove = (clientX, clientY) => {
    if (!containerRef.current) return; const rect = containerRef.current.getBoundingClientRect();
    containerRef.current.style.setProperty('--xray-x', `${clientX - rect.left}px`); containerRef.current.style.setProperty('--xray-y', `${clientY - rect.top}px`);
  };

  return (
    <div ref={containerRef} onMouseMove={(e) => handleMove(e.clientX, e.clientY)} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} 
      className="relative w-full aspect-[4/3] rounded-2xl border border-[var(--border-line)] bg-[var(--bg-section-white)] overflow-hidden group cursor-crosshair"
    >
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '12px 12px' }}></div>
      <div className="absolute inset-0 p-4 flex items-center justify-center bg-transparent z-0">
        {/* 草图感结构线 */}
        <div className="absolute inset-4 border border-[var(--border-line)] border-dashed opacity-50 rounded-lg pointer-events-none"></div>
        {baseUI}
      </div>
      
      <div className="xray-layer absolute inset-0 p-4 bg-[var(--text-main)] flex items-center justify-center shadow-inner z-10" style={{ '--xray-radius': hovered ? '100px' : '0px' }}>
        <div className="transform scale-105 text-[var(--bg-section-white)] font-editorial font-bold text-lg sm:text-xl tracking-wide flex flex-col items-center text-center">
           <Monitor size={32} strokeWidth={1.5} className="mb-3 opacity-80 hidden sm:block" />{revealUI}
        </div>
      </div>
      
      <div className="absolute top-3 left-3 z-20 px-2.5 py-1 bg-[var(--bg-section-white)] border border-[var(--border-line)] rounded-full text-[9px] font-mono font-medium text-[var(--text-muted)] shadow-[var(--shadow-sm)] flex items-center gap-1.5 pointer-events-none">
        <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] opacity-80 animate-pulse"></div><span>{hintText}</span>
      </div>

    </div>
  );
};

// ============================================================================
// 新增：层叠卡片相册组件 (HoverCardGallery)
// 用于展示3张动态重叠的图片，鼠标悬停时激活特定卡片并顶置
// ============================================================================
const HoverCardGallery = () => {
  const [activeIndex, setActiveIndex] = useState(1); // 默认中间的图片激活

  // 占位数据结构，你可以直接在此处替换为真实的图片链接 (src)
  const cards = [
    { id: 1, title: 'Logic Tree', desc: '逻辑树视图', src: '' },
    { id: 2, title: 'Dashboard', desc: '控制台界面', src: '' },
    { id: 3, title: 'Intervention', desc: '干预机制流', src: '' }
  ];

  return (
    <div className="relative w-full h-[260px] flex items-center justify-center group" onMouseLeave={() => setActiveIndex(1)}>
      {cards.map((card, i) => {
        const isActive = activeIndex === i;
        
        // 分别为 3 张卡片设定散开的初始位移和旋转角度
        // 0: 左侧 (-10度，向左平移 35px)
        // 1: 中间 (0度，居中)
        // 2: 右侧 (10度，向右平移 35px)
        const baseRotations = [-10, 0, 10];
        const baseXOffsets = [-35, 0, 35];
        const baseYOffsets = [10, 0, 10];

        return (
          <div
            key={card.id}
            onMouseEnter={() => setActiveIndex(i)}
            className={`absolute w-[180px] h-[220px] sm:w-[200px] sm:h-[240px] rounded-xl border border-[var(--border-line)] overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] cursor-pointer
              ${isActive ? 'shadow-[var(--shadow-card-hover)]' : 'shadow-[var(--shadow-card)]'}
            `}
            style={{
              // 激活状态：向上浮起，放大，回正角度
              // 未激活状态：根据其索引散开排布
              transform: isActive
                ? `translateY(-15px) scale(1.05) rotate(0deg)`
                : `translate(${baseXOffsets[i]}px, ${baseYOffsets[i]}px) rotate(${baseRotations[i]}deg) scale(0.95)`,
              zIndex: isActive ? 30 : 10 + i,
              backgroundColor: 'var(--bg-section-white)',
            }}
          >
            {/* ====== 💡 替换提示 ====== */}
            {/* 方案A：如果有真实图片，取消下方 img 标签的注释并填入 card.src */}
            {/* <img src={card.src} alt={card.title} className="w-full h-full object-cover" /> */}

            {/* 方案B：目前的极简结构线框占位符 (在没填入图片时显示这个) */}
            <div className="w-full h-full flex flex-col items-center justify-center relative bg-[var(--bg-section-gray)]">
              <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
              <ImageIcon size={28} className={`mb-3 transition-colors duration-300 ${isActive ? 'text-[var(--accent)]' : 'text-[var(--text-disabled)]'}`} strokeWidth={1.5} />
              <span className={`text-[12px] font-mono tracking-widest uppercase transition-colors duration-300 ${isActive ? 'text-[var(--text-main)]' : 'text-[var(--text-muted)]'}`}>
                {card.title}
              </span>
              <span className={`text-[10px] mt-1 transition-opacity duration-300 ${isActive ? 'opacity-100 text-[var(--text-muted)]' : 'opacity-0'}`}>
                {card.desc}
              </span>
            </div>
            {/* ====== 结束 ====== */}
          </div>
        );
      })}
    </div>
  );
};


// --- 渐隐加载组件 ---
const FadeIn = ({ children, delay = 0, className = "", tier = "b" }) => {
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [isVisible, setIsVisible] = useState(prefersReducedMotion); const domRef = useRef();
  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setTimeout(() => setIsVisible(true), delay);
        observer.unobserve(entries[0].target);
      }
    }, {
      rootMargin: tier === 'a' ? '0px 0px -50px 0px' : '0px 0px -20px 0px',
      threshold: tier === 'a' ? 0.1 : 0.05
    });

    if (domRef.current) observer.observe(domRef.current); return () => observer.disconnect();
  }, [delay, tier, prefersReducedMotion]);

  const durationClass = tier === 'a' ? 'duration-700' : 'duration-400';
  const hiddenClass = tier === 'a' ? 'opacity-0 translate-y-6' : 'opacity-0 translate-y-2';
  return <div ref={domRef} className={`transition-all ${durationClass} ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform ${isVisible ? 'opacity-100 translate-y-0' : hiddenClass} ${className} w-full min-w-0`}>{children}</div>;
};

// --- 计数器组件 ---
const SlotCounter = ({ target }) => {
  const [count, setCount] = useState(0); const ref = useRef();
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        let current = 0; const interval = setInterval(() => { current += Math.ceil(target / 20); if (current >= target) { current = target; clearInterval(interval); } setCount(current); }, 30);
        observer.unobserve(ref.current);
      }
    });
    if (ref.current) observer.observe(ref.current); return () => observer.disconnect();
  }, [target]);
  return <span ref={ref}>{count}</span>;
};

// --- 手风琴履历子组件 ---
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
              {details.map((detail, idx) => (
                <li key={idx} className="flex items-start gap-3 text-[var(--text-muted)] font-normal leading-relaxed">
                  <div className="w-1 h-1 rounded-full bg-[var(--text-disabled)] mt-2 flex-shrink-0"></div><span className="text-[13px] sm:text-[14px] flex-1">{detail}</span>
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
      {time.split(' - ').map((t, i) => <div key={i} className={i === 0 ? "mb-1 text-[var(--text-main)]" : ""}>{t}</div>)}
    </div>
    <div className="md:hidden pl-6 pt-5 pb-3 text-[11px] font-mono font-medium text-[var(--text-muted)] tracking-wider w-full">{time}</div>
    <div className="flex-1 w-full min-w-0 pl-6 md:pl-8 mt-0">
      {badge && <div className="mb-3 w-full relative">{badge}</div>}
      <AccordionBento title={title} subtitle={subtitle} details={details} defaultOpen={defaultOpen} />
    </div>
  </div>
);

const CaseLinkCard = ({ title, icon, href }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="focus-ring flex items-center justify-center gap-2.5 px-4 py-2.5 bg-[var(--bg-section-gray)] border border-[var(--border-line)] rounded-lg group hover:border-[var(--text-main)] hover:bg-[var(--bg-section-white)] transition-all duration-300 w-full sm:w-auto relative">
    {React.createElement(icon, { size: 14, className: 'text-[var(--text-muted)] group-hover:text-[var(--text-main)] transition-colors' })}
    <span className="text-[12.5px] font-medium text-[var(--text-main)]">{title} <span aria-hidden="true">↗</span></span>
  </a>
);

// --- 主应用结构 ---
export default function App() {
  const [isDark, setIsDark] = useState(() => {
    try {
      return localStorage.getItem('portfolio-theme') === 'dark';
    } catch {
      return false;
    }
  });
  const [lang, setLang] = useState(() => {
    try {
      const saved = localStorage.getItem('portfolio-lang');
      return saved === 'en' ? 'en' : 'zh';
    } catch {
      return 'zh';
    }
  });
  const t = translations[lang];

  useLayoutEffect(() => {
    document.documentElement.classList.toggle('dark-theme', isDark);
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
  }, [isDark]);

  useEffect(() => {
    try {
      localStorage.setItem('portfolio-theme', isDark ? 'dark' : 'light');
    } catch (error) {
      void error;
    }
  }, [isDark]);

  useEffect(() => {
    try {
      localStorage.setItem('portfolio-lang', lang);
    } catch (error) {
      void error;
    }
  }, [lang]);

  const navLinks = [ { name: t.nav.home, href: '#home' }, { name: t.nav.works, href: '#portfolio' }, { name: t.nav.whyme, href: '#why-me' }, { name: t.nav.resume, href: '#resume' }, { name: t.nav.tools, href: '#tools' }, { name: t.nav.contact, href: '#contact' } ];
  const toolsData = [ { name: 'Figma / UI', icon: Figma }, { name: 'Axure / Proto', icon: PenTool }, { name: 'Python / Data', icon: Database }, { name: 'SQL / Query', icon: Database }, { name: 'PRD / Notion', icon: BookOpen }, { name: 'User Research', icon: Mic } ];

  return (
    <div className="min-h-screen selection:bg-[var(--text-main)] selection:text-[var(--bg-section-white)] antialiased flex flex-col items-center relative">
      <style>{globalStyles}</style>

      {/* --- Header --- */}
      <header className="fixed top-0 left-0 w-full z-50 bg-[var(--bg-section-white)]/80 backdrop-blur-xl border-b border-[var(--border-line)] transition-colors duration-300">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 h-14 flex items-center justify-between">
          <div className="font-brand text-[1.5rem] font-semibold tracking-wide text-[var(--text-main)] cursor-default select-none transition-colors">Hannah</div>
          <nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => (<a key={link.name} href={link.href} className="focus-ring px-3.5 py-1.5 rounded-full text-[12px] font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-section-gray)] transition-all">{link.name}</a>))}
          </nav>
          <div className="flex items-center gap-1.5">
            <button type="button" aria-label={lang === 'zh' ? 'Switch to English' : '切换为中文'} onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')} className="focus-ring flex items-center justify-center w-7 h-7 rounded-full hover:bg-[var(--bg-section-gray)] transition-colors text-[var(--text-muted)] hover:text-[var(--text-main)]"><Languages size={14} /></button>
            <button type="button" aria-label={isDark ? '切换到浅色模式' : '切换到深色模式'} onClick={() => setIsDark(!isDark)} className="focus-ring flex items-center justify-center w-7 h-7 rounded-full hover:bg-[var(--bg-section-gray)] transition-colors text-[var(--text-muted)] hover:text-[var(--text-main)]">{isDark ? <Sun size={14} /> : <Moon size={14} />}</button>
          </div>
        </div>
      </header>

      {/* =========================================================
          SECTION 1: HERO 
          手绘点缀：Role 旁的指向箭头、Name 下方的波浪线
          ========================================================= */}
      <section id="home" className="order-1 relative w-full min-h-[100svh] pt-20 pb-8 md:pt-24 md:pb-10 flex items-center justify-center overflow-hidden bg-[var(--bg-hero)]">
        {!isDark && (
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <div className="absolute bottom-[-10%] left-[-10%] w-[55vw] h-[55vw] rounded-full bg-[#E3EDEF] blur-[90px] mix-blend-multiply animate-hero-blob opacity-90"></div>
            <div className="absolute top-[-5%] right-[-5%] w-[50vw] h-[50vw] rounded-full bg-[#F2A480] blur-[100px] mix-blend-multiply animate-hero-blob-reverse opacity-70"></div>
          </div>
        )}
        {isDark && (
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-50">
            <div className="absolute bottom-[-10%] left-[-10%] w-[55vw] h-[55vw] rounded-full bg-sky-900/30 blur-[100px] mix-blend-screen animate-hero-blob"></div>
            <div className="absolute top-[-5%] right-[-5%] w-[50vw] h-[50vw] rounded-full bg-orange-900/20 blur-[100px] mix-blend-screen animate-hero-blob-reverse"></div>
          </div>
        )}

        <div className="relative z-10 w-full">
          <div className="mx-auto w-full max-w-[900px] px-5 sm:px-8 lg:px-12">
            <div className="w-full rounded-[2rem] border border-[var(--border-line)] bg-[var(--bg-section-white)]/70 backdrop-blur-sm shadow-[var(--shadow-card)] px-6 py-7 sm:px-8 sm:py-8 md:px-10 md:py-9">
              <div className="flex flex-col md:flex-row items-center justify-center gap-7 md:gap-10">
            
            <div className="w-full md:w-[390px] max-w-[390px] flex flex-col items-center md:items-start text-center md:text-left shrink-0">
              <FadeIn tier="a" delay={100}>
                <div className="relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-section-white)] border border-[var(--border-line)] shadow-[var(--shadow-sm)] mb-5 sm:mb-6">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse"></div>
                  <span className="text-[10px] font-semibold tracking-wider uppercase font-mono text-[var(--text-main)] opacity-80">{t.hero.role}</span>
                </div>
              </FadeIn>
              
              <FadeIn tier="a" delay={200}>
                <h1 className="font-editorial font-bold tracking-tight leading-[1.12] mb-4 sm:mb-5 text-[clamp(2rem,4.4vw,3.2rem)] text-[var(--text-main)] relative">
                  <span className="block sm:whitespace-nowrap">{t.hero.title1}</span>
                  <span className="block sm:whitespace-nowrap text-[var(--text-muted)]">{t.hero.title2}</span>
                </h1>
              </FadeIn>

              <FadeIn tier="a" delay={300}>
                <p className="font-light leading-relaxed mb-6 sm:mb-7 text-[15px] sm:text-[16px] text-[var(--text-muted)]">
                  {t.hero.desc1}
                  <strong className="inline-block font-editorial font-bold text-[17px] sm:text-[18px] text-[var(--text-main)] mx-0.5">{t.hero.name}</strong>
                  {t.hero.desc2}
                </p>
              </FadeIn>

              <FadeIn tier="a" delay={400}>
                <div className="flex flex-row flex-wrap items-center justify-center md:justify-start gap-2.5 w-full">
                  <a href="#portfolio" className="focus-ring px-6 py-3 rounded-full text-[13px] font-medium flex items-center justify-center gap-2 bg-[var(--text-main)] text-[var(--bg-section-white)] hover:scale-105 transition-transform shadow-md shrink-0 relative">
                    <span>{t.hero.btnWork}</span> <ArrowUpRight size={14} />
                  </a>
                  <a href="#resume" className="focus-ring px-6 py-3 rounded-full text-[13px] font-medium flex items-center justify-center bg-[var(--bg-section-white)] border border-[var(--border-line)] text-[var(--text-main)] hover:bg-[var(--bg-section-gray)] transition-colors shadow-[var(--shadow-sm)] shrink-0">
                    {t.hero.btnResume}
                  </a>
                </div>
              </FadeIn>
            </div>

            <div className="flex flex-none justify-center md:-ml-1">
              <FadeIn tier="a" delay={500}>
                <div className="relative z-10 w-[clamp(170px,15vw,220px)] aspect-[3/4] rounded-[1.5rem] bg-[var(--bg-section-white)] border border-[var(--border-line)] shadow-[var(--shadow-card)] flex flex-col items-center justify-center overflow-hidden group hover:-translate-y-1.5 transition-transform duration-500">
                   <ParticleBrain colorStr={isDark ? 'rgba(255,255,255,' : 'rgba(23,23,23,'} />
                   <User size={34} strokeWidth={1.5} className="text-[var(--text-muted)] opacity-30 relative z-10" />
                   <div className="absolute bottom-6 font-mono text-[10px] font-medium tracking-widest uppercase text-[var(--text-muted)]">Profile</div>
                </div>
              </FadeIn>
            </div>

          </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 2: PORTFOLIO 
          手绘点缀：数字圈注、草图引导线
          ========================================================= */}
      <section id="portfolio" className="order-2 w-full pt-24 pb-32 bg-[var(--bg-section-white)] border-t border-[var(--border-line)] relative">
        <div className="w-full max-w-[1000px] mx-auto px-6">
          <FadeIn tier="a">
            <div className="mb-12 flex flex-col items-start gap-1 relative">
              <span className="font-mono text-[10px] font-medium uppercase tracking-widest text-[var(--accent)] relative inline-block">01 / Featured Work</span>
              <h2 className="font-editorial font-bold text-[var(--text-main)] text-[2rem] sm:text-[2.5rem] tracking-tight">{t.portfolio.title}</h2>
            </div>
          </FadeIn>
          
          <div className="space-y-16 w-full">
            <FadeIn tier="a">
              <div className="linear-card overflow-hidden relative">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="p-8 sm:p-10 border-b md:border-b-0 md:border-r border-[var(--border-light)]">
                    <h3 className="font-editorial font-bold text-[var(--text-main)] mb-2 text-[1.4rem] leading-snug tracking-tight">{t.portfolio.p1_title}</h3>
                    <div className="text-[12px] font-medium text-[var(--text-muted)] mb-5">{t.portfolio.p1_role}</div>
                    <p className="text-[var(--text-muted)] leading-relaxed text-[13.5px] sm:text-[14.5px] mb-8 font-light">{t.portfolio.p1_desc}</p>
                    <div className="flex flex-wrap gap-2 mb-8">
                      {t.portfolio.p1_tags.map(tag => (<span key={tag} className="px-2.5 py-1 bg-[var(--bg-section-gray)] rounded-md text-[11px] font-medium text-[var(--text-muted)]">{tag}</span>))}
                    </div>
                    <div className="flex gap-3">
                      <CaseLinkCard title={t.portfolio.p1_btn1} icon={FileText} href="#" />
                      <CaseLinkCard title={t.portfolio.p1_btn2} icon={Play} href="#" />
                    </div>
                  </div>
                  <div className="relative min-h-[250px] bg-[var(--bg-section-gray)] flex items-center justify-center p-6">
                    <div className="w-full max-w-[300px]">
                      <XRayCard hintText={t.portfolio.hover_xray} baseUI={<div className="font-mono text-[11px] sm:text-[12px] text-[var(--text-disabled)] text-center tracking-widest">[ RAG AI Architecture ]<br/>Data Flow Model</div>} revealUI={<span className="text-[14px]">NutriCALM System</span>} />
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>

            <FadeIn tier="a">
              <div className="linear-card overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="order-2 md:order-1 relative min-h-[280px] bg-[var(--bg-section-gray)] flex items-center justify-center p-4 sm:p-6 border-t md:border-t-0 md:border-r border-[var(--border-light)] overflow-hidden">
                    <div className="w-full relative">
                      {/* === 新增的动态堆叠卡片 === */}
                      <HoverCardGallery />
                    </div>
                  </div>
                  <div className="order-1 md:order-2 p-8 sm:p-10">
                    <h3 className="font-editorial font-bold text-[var(--text-main)] mb-2 text-[1.4rem] leading-snug tracking-tight">{t.portfolio.p2_title}</h3>
                    <div className="text-[12px] font-medium text-[var(--text-muted)] mb-5">{t.portfolio.p2_role}</div>
                    <p className="text-[var(--text-muted)] leading-relaxed text-[13.5px] sm:text-[14.5px] mb-8 font-light">{t.portfolio.p2_desc}</p>
                    <div className="flex flex-wrap gap-2 mb-8">
                      {t.portfolio.p2_tags.map(tag => (<span key={tag} className="px-2.5 py-1 bg-[var(--bg-section-gray)] rounded-md text-[11px] font-medium text-[var(--text-muted)]">{tag}</span>))}
                    </div>
                    <div className="flex gap-3">
                      <CaseLinkCard title={t.portfolio.p2_btn1} icon={BookOpen} href="#" />
                      <CaseLinkCard title={t.portfolio.p2_btn2} icon={Play} href="https://hannahzh20.github.io/ProDAIS-demo/" />
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>

          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 3: EXPERIENCE / RESUME 
          手绘点缀：极弱的角落星号，保持克制专业
          ========================================================= */}
      <section id="resume" className="order-4 w-full pt-20 pb-28 bg-[var(--bg-section-gray)] border-t border-[var(--border-line)] relative">
        <div className="w-full max-w-[900px] mx-auto px-6">
          <FadeIn>
            <div className="mb-10 flex flex-col items-start gap-1 relative">
              <span className="font-mono text-[10px] font-medium uppercase tracking-widest text-[var(--accent)]">03 / Career & Education</span>
              <h2 className="font-editorial font-bold text-[var(--text-main)] text-[2rem] sm:text-[2.5rem] tracking-tight">{t.resume.title}</h2>
            </div>
          </FadeIn>

          <div className="w-full space-y-6 sm:space-y-8">
            
            <FadeIn delay={100}>
              <div className="linear-card p-6 sm:p-10">
                <div className="mb-8 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[var(--bg-section-gray)] border border-[var(--border-line)] flex items-center justify-center"><GraduationCap size={14} className="text-[var(--text-main)]" /></div>
                  <h3 className="text-[14px] font-bold text-[var(--text-main)] tracking-wide">{t.resume.edu}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                  <div className="p-6 rounded-xl border border-[var(--border-line)] bg-[var(--bg-section-gray)] hover:bg-[var(--bg-section-white)] transition-colors">
                    <div className="font-mono text-[10px] text-[var(--text-muted)] mb-3 tracking-widest">2024 - 2026</div>
                    <h4 className="text-[14px] font-bold text-[var(--text-main)] mb-1 tracking-tight">{t.resume.edu1_title}</h4>
                    <p className="text-[12px] font-medium text-[var(--text-muted)] mb-4">{t.resume.edu1_sub}</p>
                    <p className="text-[13px] text-[var(--text-muted)] leading-relaxed font-light">{t.resume.edu1_desc}</p>
                  </div>
                  <div className="p-6 rounded-xl border border-[var(--border-line)] bg-[var(--bg-section-gray)] hover:bg-[var(--bg-section-white)] transition-colors">
                    <div className="font-mono text-[10px] text-[var(--text-muted)] mb-3 tracking-widest">2018 - 2022</div>
                    <h4 className="text-[14px] font-bold text-[var(--text-main)] mb-1 tracking-tight">{t.resume.edu2_title}</h4>
                    <p className="text-[12px] font-medium text-[var(--text-muted)] mb-4">{t.resume.edu2_sub}</p>
                    <p className="text-[13px] text-[var(--text-muted)] leading-relaxed font-light">{t.resume.edu2_desc}</p>
                  </div>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={200}>
              <div className="linear-card p-6 sm:p-10">
                <div className="mb-8 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[var(--bg-section-gray)] border border-[var(--border-line)] flex items-center justify-center"><Terminal size={14} className="text-[var(--text-main)]" /></div>
                  <h3 className="text-[14px] font-bold text-[var(--text-main)] tracking-wide">{t.resume.exp}</h3>
                </div>
                <div className="w-full">
                  <TimelineItem time="2025.12 - Present" title={t.resume.exp1_title} subtitle={t.resume.exp1_sub} defaultOpen={true} details={t.resume.exp1_details} />
                  <TimelineItem time="2025.08 - 2025.11" title={t.resume.exp2_title} subtitle={t.resume.exp2_sub} details={t.resume.exp2_details} />
                  <TimelineItem time="2022.11 - 2023.03" title={t.resume.exp3_title} subtitle={t.resume.exp3_sub} isLast={true} details={t.resume.exp3_details} />
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={300}>
              <div className="linear-card p-6 sm:p-10">
                <div className="mb-8 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[var(--bg-section-gray)] border border-[var(--border-line)] flex items-center justify-center"><Layers size={14} className="text-[var(--text-main)]" /></div>
                  <h3 className="text-[14px] font-bold text-[var(--text-main)] tracking-wide">{t.resume.proj}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                  <div className="p-6 rounded-xl border border-[var(--border-line)] bg-[var(--bg-section-gray)] hover:bg-[var(--bg-section-white)] transition-colors flex flex-col h-full">
                    <div className="font-mono text-[10px] text-[var(--text-muted)] mb-3 tracking-widest uppercase">AI Education</div>
                    <h4 className="text-[14px] font-bold text-[var(--text-main)] mb-1 tracking-tight">{t.resume.proj1_title}</h4>
                    <p className="text-[12px] font-medium text-[var(--text-muted)] mb-4">{t.resume.proj1_sub}</p>
                    <p className="text-[13px] text-[var(--text-muted)] leading-relaxed font-light mt-auto pt-4 border-t border-[var(--border-light)]">{t.resume.proj1_desc}</p>
                  </div>
                  <div className="p-6 rounded-xl border border-[var(--border-line)] bg-[var(--bg-section-gray)] hover:bg-[var(--bg-section-white)] transition-colors flex flex-col h-full">
                    <div className="font-mono text-[10px] text-[var(--text-muted)] mb-3 tracking-widest uppercase">Data Product</div>
                    <h4 className="text-[14px] font-bold text-[var(--text-main)] mb-1 tracking-tight">{t.resume.proj2_title}</h4>
                    <p className="text-[12px] font-medium text-[var(--text-muted)] mb-4">{t.resume.proj2_sub}</p>
                    <p className="text-[13px] text-[var(--text-muted)] leading-relaxed font-light mt-auto pt-4 border-t border-[var(--border-light)]">{t.resume.proj2_desc}</p>
                  </div>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={400}>
              <div className="linear-card p-6 sm:p-10">
                <div className="mb-8 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[var(--bg-section-gray)] border border-[var(--border-line)] flex items-center justify-center"><Zap size={14} className="text-[var(--text-main)]" /></div>
                  <h3 className="text-[14px] font-bold text-[var(--text-main)] tracking-wide">{t.impact.title}</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
                  {[ { num: 8, suffix: '+', desc: t.impact.s1 }, { num: 25, suffix: '+', desc: t.impact.s2 }, { num: 166, suffix: '%', desc: t.impact.s3 }, { num: 83, suffix: '', desc: t.impact.s4 }
                  ].map((stat, i) => (
                    <div key={i} className="flex flex-col items-start px-2 border-l-2 border-[var(--border-line)] pl-4">
                      <div className="font-mono font-medium text-[2rem] sm:text-[2.5rem] text-[var(--text-main)] mb-1 tracking-tighter leading-none">
                        <SlotCounter target={stat.num} />{stat.suffix}
                      </div>
                      <div className="text-[11px] font-medium text-[var(--text-muted)] tracking-wide uppercase mt-2">{stat.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={500}>
              <div className="linear-card p-6 sm:p-10">
                <div className="mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[var(--bg-section-gray)] border border-[var(--border-line)] flex items-center justify-center"><Award size={14} className="text-[var(--text-main)]" /></div>
                  <h3 className="text-[14px] font-bold text-[var(--text-main)] tracking-wide">{lang === 'zh' ? '荣誉与奖项' : 'Honors & Awards'}</h3>
                </div>
                <div className="relative flex items-center gap-3 p-4 rounded-xl border border-[var(--border-line)] bg-[var(--bg-section-gray)] hover:bg-[var(--bg-section-white)] transition-colors w-max max-w-full">
                   <Award size={16} className="text-[var(--accent)] flex-shrink-0" />
                   <span className="text-[13px] font-medium text-[var(--text-main)] truncate">{t.resume.edu1_badge}</span>
                </div>
              </div>
            </FadeIn>

          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 4: TOOLS & SKILLS 
          ========================================================= */}
      <section id="tools" className="order-5 w-full pt-16 pb-24 bg-[var(--bg-section-white)] border-t border-[var(--border-line)] relative">
        <div className="w-full max-w-[850px] mx-auto px-6">
          <FadeIn>
            <div className="linear-card p-10 md:p-14 flex flex-col items-center justify-center">
              <span className="font-mono text-[10px] font-medium uppercase tracking-widest text-[var(--accent)] mb-3">04 / Tool Stack</span>
              <h2 className="font-editorial font-bold text-[var(--text-main)] mb-10 text-[1.75rem] sm:text-[2rem] tracking-tight">{t.tools.title}</h2>
              <div className="flex flex-wrap justify-center gap-3 sm:gap-4 max-w-[600px]">
                 {toolsData.map((tool, idx) => (
                   <SkillIndicator key={idx} name={tool.name} icon={tool.icon} />
                 ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* =========================================================
          SECTION 5: WHY ME 
          手绘点缀核心区：强化叙述张力，添加圈注与连线
          ========================================================= */}
      <section id="why-me" className="order-3 w-full pt-32 pb-40 bg-[var(--bg-section-gray)] border-t border-[var(--border-line)] relative">
        <div className="w-full max-w-[1000px] mx-auto px-6">
          <FadeIn>
            <div className="mb-16 flex flex-col items-start gap-1">
              <span className="font-mono text-[10px] font-medium uppercase tracking-widest text-[var(--accent)]">02 / Perspective</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-start relative">
              <div className="md:col-span-5 relative md:border-r border-[var(--border-line)] md:pr-12">
                <span className="absolute -top-10 -left-6 text-[clamp(5rem,12vw,10rem)] text-[var(--border-line)] leading-none font-editorial select-none z-0">“</span>
                <h2 className="font-editorial font-bold text-[var(--text-main)] leading-[1.4] relative z-10 text-[1.5rem] sm:text-[1.8rem]">
                  <span className="block mb-2 opacity-60 font-medium">{t.whyme.quote1}</span>
                  {t.whyme.quote2}
                  
                  {/* 使用手绘红圈替代生硬的下划线 */}
                  <span className="relative inline-block font-bold text-[var(--text-main)] italic">
                    {t.whyme.quote_hl}
                    <ScribbleCircle color="var(--accent)" className="-inset-2 z-[-1]" />
                  </span>
                  
                  <span className="block mt-2">{t.whyme.quote3}</span>
                </h2>
              </div>

              <div className="md:col-span-7 flex flex-col gap-10 mt-6 md:mt-0 relative">
                <div className="pt-6 border-t-2 border-[var(--text-main)] relative group">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-editorial text-[1.1rem] font-bold text-[var(--text-main)] tracking-tight">{t.whyme.card1_title}</h4>
                    <span className="font-mono text-[9px] text-[var(--text-muted)] tracking-widest uppercase">Chapter 01</span>
                  </div>
                  <p className="text-[var(--text-muted)] text-[14px] leading-relaxed font-light">{t.whyme.card1_desc}</p>
                </div>
                
                <div className="pt-6 border-t border-[var(--border-line)] relative group">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-editorial text-[1.1rem] font-bold text-[var(--text-main)] tracking-tight">{t.whyme.card2_title}</h4>
                    <span className="font-mono text-[9px] text-[var(--text-muted)] tracking-widest uppercase">Chapter 02</span>
                  </div>
                  <p className="text-[var(--text-muted)] text-[14px] leading-relaxed font-light">{t.whyme.card2_desc}</p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* =========================================================
          SECTION 6: CONTACT 
          手绘点缀：结尾极淡弧线，保持干净
          ========================================================= */}
      <section id="contact" className="order-6 w-full pt-24 pb-32 bg-[var(--bg-section-white)] border-t border-[var(--border-line)] relative overflow-hidden">
        {/* 背景微弱的手绘弧线，收尾气场 */}
        <svg viewBox="0 0 100 20" className="absolute bottom-10 left-1/2 -translate-x-1/2 w-1/2 h-40 pointer-events-none opacity-20" preserveAspectRatio="none">
            <path d="M 0,20 Q 50,-10 100,20" fill="none" stroke="var(--border-line)" strokeWidth="0.5" />
        </svg>

        <FadeIn className="w-full max-w-[900px] mx-auto px-4 sm:px-6 relative z-10">
          <div className="relative overflow-hidden rounded-[2.5rem] sm:rounded-[3rem] border border-[var(--border-line)] bg-[var(--bg-section-white)] p-12 sm:p-24 text-center shadow-[var(--shadow-card)]">
            
            {!isDark && <div className="absolute top-[-50%] right-[-10%] w-[60%] h-[100%] bg-[#F2A480]/10 blur-[100px] pointer-events-none mix-blend-multiply"></div>}
            
            <div className="relative z-10">
              <h2 className="font-editorial font-bold text-[var(--text-main)] mb-4 text-[1.75rem] sm:text-[2.25rem] tracking-tight">{t.contact.title}</h2>
              <p className="text-[14px] text-[var(--text-muted)] mb-10 font-light max-w-sm mx-auto leading-relaxed">{t.contact.subtitle}</p>
              
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-10">
                <a href={`mailto:${t.contact.email}`} className="focus-ring flex items-center justify-center gap-3 px-8 py-3.5 bg-[var(--text-main)] text-[var(--bg-section-white)] rounded-full text-[13px] font-medium hover:scale-105 transition-transform shadow-md w-full sm:w-auto relative group">
                  <Mail size={16} /> <span className="tracking-wide">{t.contact.email}</span>
                </a>
                <a href={`tel:${t.contact.phone.replace(/-/g, '')}`} className="focus-ring flex items-center justify-center gap-3 px-8 py-3.5 bg-[var(--bg-card)] border border-[var(--border-line)] rounded-full text-[13px] font-medium text-[var(--text-main)] hover:bg-[var(--bg-section-gray)] transition-colors shadow-[var(--shadow-sm)] w-full sm:w-auto">
                  <Phone size={16} /> <span className="tracking-wide">{t.contact.phone}</span>
                </a>
              </div>

              <div className="flex justify-center gap-4">
                <a href="#" aria-label="LinkedIn" className="focus-ring p-3 bg-[var(--bg-card)] border border-[var(--border-line)] rounded-full text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-section-gray)] transition-colors shadow-[var(--shadow-sm)]"><Linkedin size={16} /></a>
                <a href="#" aria-label="GitHub" className="focus-ring p-3 bg-[var(--bg-card)] border border-[var(--border-line)] rounded-full text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-section-gray)] transition-colors shadow-[var(--shadow-sm)]"><Github size={16} /></a>
              </div>
            </div>
          </div>
        </FadeIn>
        
        <div className="text-center mt-16 pb-8 relative z-10">
          <p className="font-mono text-[10px] text-[var(--text-disabled)] tracking-widest uppercase">© 2026 ZIHAN ZHANG. ALL RIGHTS RESERVED.</p>
        </div>
      </section>
    </div>
  );
}