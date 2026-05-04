import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calculator, 
  Utensils, 
  Activity, 
  Scale, 
  ChevronRight, 
  RefreshCcw, 
  Dumbbell,
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip as RechartsTooltip 
} from 'recharts';
import { cn } from './lib/utils.ts';
import { 
  UserMetrics, 
  ActivityLevel, 
  activityLevelLabels, 
  calculateStats, 
  BodyStats 
} from './lib/calculations.ts';
import { generateMealPlan } from './services/geminiService.ts';

const BMI_RANGES = [
  { name: '저체중', value: 18.5, color: '#93c5fd' }, // Blue
  { name: '정상', value: 4.5, color: '#4ade80' },   // Green
  { name: '과체중', value: 2, color: '#facc15' },    // Yellow
  { name: '비만', value: 5, color: '#fb923c' },     // Orange
  { name: '고도비만', value: 10, color: '#f87171' },  // Red
];

export default function App() {
  const [metrics, setMetrics] = useState<UserMetrics>({
    height: 175,
    weight: 70,
    age: 25,
    gender: 'male',
    activityLevel: ActivityLevel.MODERATE,
  });

  const [isCalculated, setIsCalculated] = useState(false);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [mealPlan, setMealPlan] = useState<string | null>(null);

  const stats = useMemo(() => calculateStats(metrics), [metrics]);

  const handleCalculate = () => {
    setIsCalculated(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGeneratePlan = async () => {
    setIsGeneratingPlan(true);
    const plan = await generateMealPlan(metrics, stats);
    setMealPlan(plan);
    setIsGeneratingPlan(false);
  };

  const reset = () => {
    setIsCalculated(false);
    setMealPlan(null);
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#2D2D2D] font-sans selection:bg-[#8E9775]/20">
      {/* Header */}
      <header className="border-b border-[#E5E1D8] bg-white/40 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#2D2D2D] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-200">
              <Activity size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter text-[#2D2D2D]">PULSE.</h1>
              <p className="text-[10px] font-black text-[#8E9775] uppercase tracking-[0.4em]">Personal Health</p>
            </div>
          </div>
          {isCalculated && (
            <button 
              onClick={reset}
              className="p-3 hover:bg-white rounded-2xl transition-all text-[#2D2D2D] border-2 border-[#E5E1D8] hover:border-[#2D2D2D] shadow-sm active:scale-95"
            >
              <RefreshCcw size={18} strokeWidth={2.5} />
            </button>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-8 py-16">
        {!isCalculated ? (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-16"
          >
            <div className="text-center space-y-4">
              <h2 className="text-5xl md:text-6xl font-black text-[#2D2D2D] leading-[1.1] tracking-tighter">당신의 몸을<br />데이터로 읽다</h2>
              <p className="text-[#A8A398] max-w-sm mx-auto text-base font-medium tracking-tight">가장 정확하고 트렌디한 신체 분석 시스템</p>
            </div>

            <div className="bg-white rounded-[3rem] p-10 md:p-14 shadow-2xl shadow-slate-200/50 border border-[#F0EEE6]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Inputs Left */}
                <div className="space-y-10">
                  <div className="space-y-5">
                    <label className="text-xs font-black text-[#2D2D2D] flex items-center gap-2 uppercase tracking-widest">
                      <Scale size={16} strokeWidth={3} className="text-[#8E9775]" /> GENDER / 성별
                    </label>
                    <div className="flex gap-2 p-1.5 bg-[#F9F8F4] rounded-2xl">
                      {(['male', 'female'] as const).map((g) => (
                        <button
                          key={g}
                          onClick={() => setMetrics(m => ({ ...m, gender: g }))}
                          className={cn(
                            "flex-1 py-4 px-6 rounded-xl text-sm font-black uppercase tracking-wider transition-all duration-300",
                            metrics.gender === g 
                              ? "bg-[#2D2D2D] text-white shadow-lg" 
                              : "text-[#A8A398] hover:text-[#2D2D2D]"
                          )}
                        >
                          {g === 'male' ? 'MALE' : 'FEMALE'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                    <div className="space-y-5">
                      <label className="text-xs font-black text-[#2D2D2D] uppercase tracking-widest">AGE / 나이</label>
                      <input 
                        type="number"
                        value={metrics.age}
                        onChange={(e) => setMetrics(m => ({ ...m, age: parseInt(e.target.value) || 0 }))}
                        className="w-full bg-[#F9F8F4] border-2 border-transparent rounded-2xl px-6 py-5 focus:border-[#2D2D2D] outline-none transition-all text-[#2D2D2D] font-black text-xl"
                        placeholder="25"
                      />
                    </div>
                    <div className="space-y-5">
                      <label className="text-xs font-black text-[#2D2D2D] uppercase tracking-widest">ACTIVITY</label>
                      <div className="relative">
                        <select
                          value={metrics.activityLevel}
                          onChange={(e) => setMetrics(m => ({ ...m, activityLevel: e.target.value as ActivityLevel }))}
                          className="w-full bg-[#F9F8F4] border-2 border-transparent rounded-2xl pl-6 pr-12 py-5 focus:border-[#2D2D2D] outline-none transition-all appearance-none cursor-pointer text-xs md:text-sm text-[#2D2D2D] font-black truncate"
                        >
                          {Object.entries(activityLevelLabels).map(([val, label]) => (
                            <option key={val} value={val}>{label}</option>
                          ))}
                        </select>
                        <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-[#A8A398] pointer-events-none" size={18} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Inputs Right */}
                <div className="space-y-10">
                  <div className="space-y-5">
                    <label className="text-xs font-black text-[#2D2D2D] uppercase tracking-widest">HEIGHT / 키</label>
                    <div className="relative group">
                      <input 
                        type="number"
                        value={metrics.height}
                        onChange={(e) => setMetrics(m => ({ ...m, height: parseInt(e.target.value) || 0 }))}
                        className="w-full bg-[#F9F8F4] border-2 border-transparent rounded-2xl px-6 py-6 focus:border-[#2D2D2D] outline-none transition-all text-[#2D2D2D] text-4xl font-black tracking-tighter"
                        placeholder="175"
                      />
                      <span className="absolute right-8 top-1/2 -translate-y-1/2 text-[#A8A398] text-sm font-black uppercase tracking-widest">CM</span>
                    </div>
                    <input 
                      type="range" min="100" max="230" step="1"
                      value={metrics.height}
                      onChange={(e) => setMetrics(m => ({ ...m, height: parseInt(e.target.value) }))}
                      className="w-full accent-[#2D2D2D] h-2 bg-[#F9F8F4] rounded-full appearance-none cursor-pointer"
                    />
                  </div>

                  <div className="space-y-5">
                    <label className="text-xs font-black text-[#2D2D2D] uppercase tracking-widest">WEIGHT / 체중</label>
                    <div className="relative group">
                      <input 
                        type="number"
                        value={metrics.weight}
                        onChange={(e) => setMetrics(m => ({ ...m, weight: parseInt(e.target.value) || 0 }))}
                        className="w-full bg-[#F9F8F4] border-2 border-transparent rounded-2xl px-6 py-6 focus:border-[#2D2D2D] outline-none transition-all text-[#2D2D2D] text-4xl font-black tracking-tighter"
                        placeholder="70"
                      />
                      <span className="absolute right-8 top-1/2 -translate-y-1/2 text-[#A8A398] text-sm font-black uppercase tracking-widest">KG</span>
                    </div>
                    <input 
                      type="range" min="30" max="180" step="1"
                      value={metrics.weight}
                      onChange={(e) => setMetrics(m => ({ ...m, weight: parseInt(e.target.value) }))}
                      className="w-full accent-[#2D2D2D] h-2 bg-[#F9F8F4] rounded-full appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <motion.button 
                whileHover={{ scale: 1.01, backgroundColor: '#000' }}
                whileTap={{ scale: 0.99 }}
                onClick={handleCalculate}
                className="w-full mt-14 bg-[#2D2D2D] text-white font-black py-6 rounded-[2rem] shadow-2xl shadow-slate-200 transition-all flex items-center justify-center gap-4 group uppercase tracking-[0.2em] text-sm"
              >
                CALCULATE STATS
                <ArrowRight size={18} strokeWidth={3} className="group-hover:translate-x-2 transition-transform" />
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-12"
          >
            {/* Results Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* BMI Card */}
              <div className="bg-white rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-12 shadow-sm border border-[#F0EEE6] lg:col-span-2 relative overflow-hidden group">
                <div className="relative z-10">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10 md:mb-12">
                    <div>
                      <h3 className="text-[10px] md:text-xs font-black text-[#A8A398] uppercase tracking-[0.4em] mb-2 md:mb-3">BMI Analysis</h3>
                      <p className="text-3xl md:text-4xl font-black text-[#2D2D2D] tracking-tighter">현재 체질량 지수</p>
                    </div>
                    <div className={cn(
                      "px-6 md:px-8 py-2 md:py-3 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest shadow-sm shrink-0",
                      stats.bmiCategory === '정상' 
                        ? "bg-[#8E9775] text-white" 
                        : "bg-[#E28F83] text-white"
                    )}>
                      {stats.bmiCategory}
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                    <div className="w-full md:w-[280px] h-64 md:h-72 relative shrink-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={BMI_RANGES}
                            cx="50%"
                            cy="75%"
                            startAngle={180}
                            endAngle={0}
                            innerRadius={75}
                            outerRadius={105}
                            paddingAngle={6}
                            dataKey="value"
                            stroke="none"
                          >
                            {BMI_RANGES.map((entry, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={index === 0 ? '#C8D5B9' : index === 1 ? '#8E9775' : index === 2 ? '#D4C3A3' : index === 3 ? '#E28F83' : '#AD6A6C'} 
                              />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center pt-20 md:pt-24">
                        <span className="text-6xl md:text-7xl font-black text-[#2D2D2D] tracking-tighter">{stats.bmi}</span>
                        <span className="text-[10px] md:text-[11px] font-black text-[#A8A398] uppercase tracking-[0.3em] mt-2 border-t-2 border-[#F0EEE6] pt-1">SCORE</span>
                      </div>
                    </div>

                    <div className="space-y-6 md:space-y-8 flex-1 w-full text-center md:text-left">
                      <p className="text-[#2D2D2D] md:leading-[1.6] leading-[1.4] font-bold text-lg md:text-2xl tracking-tighter text-pretty md:text-balance break-keep">
                        사용자님은 <strong className="text-[#8E9775] font-black underline decoration-4 underline-offset-4 md:underline-offset-8 decoration-[#8E9775]/30">{stats.bmiCategory}</strong> 상태입니다. 
                        건강한 몸은 숫자가 아닌 <span className="italic text-[#8E9775]">밸런스</span>에서 나옵니다.
                      </p>
                      
                      <div className="grid grid-cols-5 gap-3">
                        {BMI_RANGES.map((range, idx) => (
                          <div key={range.name} className="space-y-4 text-center">
                            <div className={cn(
                              "h-2.5 rounded-full",
                              idx === 0 ? 'bg-[#C8D5B9]' : idx === 1 ? 'bg-[#8E9775]' : idx === 2 ? 'bg-[#D4C3A3]' : idx === 3 ? 'bg-[#E28F83]' : 'bg-[#AD6A6C]'
                            )} />
                            <span className="text-[10px] font-black text-[#A8A398] uppercase tracking-tighter leading-none">{range.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Energy Stats Card */}
              <div className="flex flex-col gap-8">
                <div className="bg-[#2D2D2D] rounded-[3.5rem] p-12 text-white shadow-2xl shadow-[#2D2D2D]/20 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-white/30 text-xs font-black uppercase tracking-[0.4em] mb-4">ENERGY</h3>
                    <p className="text-3xl font-black mb-12 tracking-tighter leading-tight">하루 필요<br />에너지 총량</p>
                    
                    <div className="space-y-12">
                      <div>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-4 gap-2">
                          <span className="text-[#8E9775] text-[10px] md:text-[11px] font-black uppercase tracking-widest leading-none">BMR 기초대사량</span>
                          <span className="text-2xl md:text-3xl font-black tracking-tighter whitespace-nowrap">{stats.bmr.toLocaleString()} <span className="text-xs font-medium opacity-50 ml-1">kcal</span></span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            className="h-full bg-[#8E9775]"
                          />
                        </div>
                      </div>

                      <div className="pt-4 border-t border-white/5">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-4 gap-2">
                          <span className="text-[#8E9775] text-[10px] md:text-[11px] font-black uppercase tracking-widest leading-none">TDEE 총 소비량</span>
                          <div className="flex items-baseline gap-1">
                            <span className="text-5xl md:text-6xl font-black tracking-tighter whitespace-nowrap">{stats.tdee.toLocaleString()}</span>
                            <span className="text-xs md:text-sm opacity-50 font-black">KCAL</span>
                          </div>
                        </div>
                        <p className="text-[10px] text-[#A8A398] leading-relaxed mt-6 italic font-bold uppercase tracking-[0.2em] bg-white/5 p-4 rounded-xl border border-white/5 break-keep">
                          *활동 에너지를 포함한 소비량
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

              {/* Meal Plan Section */}
              <div className="space-y-10">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 px-4">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl md:rounded-[1.5rem] bg-[#2D2D2D] flex items-center justify-center text-white shadow-xl shadow-slate-200 shrink-0">
                      <Utensils size={28} strokeWidth={2.5} />
                    </div>
                    <div>
                      <h3 className="text-3xl md:text-4xl font-black text-[#2D2D2D] tracking-tighter leading-none">RECIPE GUIDE.</h3>
                      <p className="text-[10px] md:text-xs font-black text-[#8E9775] uppercase tracking-[0.3em] mt-2">Personalized Nutrition</p>
                    </div>
                  </div>
                {!mealPlan && !isGeneratingPlan && (
                  <button 
                    onClick={handleGeneratePlan}
                    className="px-10 py-5 bg-[#2D2D2D] text-white rounded-[2rem] text-xs font-black uppercase tracking-[0.25em] flex items-center gap-4 hover:bg-black transition-all shadow-xl active:scale-95 group"
                  >
                    <Sparkles size={16} fill="currentColor" /> 제안서 생성하기
                    <ChevronRight size={16} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                )}
              </div>

              {!mealPlan && !isGeneratingPlan && (
                <div className="bg-[#FAF3E0] border-4 border-white rounded-[3rem] md:rounded-[4rem] p-12 md:p-24 text-center space-y-8 shadow-sm">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto text-[#8E9775] shadow-inner">
                    <Utensils className="w-8 h-8 md:w-10 md:h-10" strokeWidth={2.5} />
                  </div>
                  <div className="max-w-xs mx-auto space-y-3 md:space-y-4">
                    <p className="text-[#2D2D2D] font-black text-xl md:text-2xl tracking-tighter">당신만을 위한 식단</p>
                    <p className="text-[#A8A398] text-xs md:text-sm font-semibold leading-relaxed">AI가 분석한 데이터에 기반하여 정교한 식단 가이드를 생성합니다.</p>
                  </div>
                </div>
              )}

              {isGeneratingPlan && (
                <div className="bg-white border border-[#F0EEE6] rounded-[3rem] md:rounded-[4rem] p-16 md:p-32 text-center space-y-10 md:space-y-12 shadow-sm relative overflow-hidden">
                  <div className="relative w-24 h-24 md:w-32 md:h-32 mx-auto">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 border-[4px] md:border-[6px] border-[#F9F8F4] border-t-[#8E9775] rounded-full"
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-[#2D2D2D]">
                      <Sparkles className="w-8 h-8 md:w-10 md:h-10 animate-pulse" />
                    </div>
                  </div>
                  <div className="space-y-3 md:space-y-4 relative z-10">
                    <p className="text-2xl md:text-3xl font-black text-[#2D2D2D] tracking-tighter">AI 분석 중...</p>
                    <p className="text-[#8E9775] text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] md:tracking-[0.5em]">Optimizing your health balance</p>
                  </div>
                </div>
              )}

              {mealPlan && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-[2.5rem] md:rounded-[4rem] p-6 md:p-20 shadow-2xl shadow-slate-200/50 border border-[#F0EEE6] relative"
                >
                  <div className="prose prose-stone max-w-none 
                    prose-p:text-[#4A4A4A] prose-p:leading-[1.8] prose-p:text-base md:prose-p:text-lg prose-p:font-medium
                    prose-headings:font-black prose-headings:text-[#2D2D2D] prose-headings:tracking-tighter
                    prose-h1:text-3xl md:prose-h1:text-5xl prose-h2:text-2xl md:prose-h2:text-4xl prose-h2:mt-10 md:prose-h2:mt-16 prose-h3:text-xl md:prose-h3:text-2xl prose-h3:mt-8
                    prose-li:text-[#4A4A4A] prose-li:font-medium prose-li:text-base md:prose-li:text-lg prose-li:mb-2
                    prose-ul:my-6 md:prose-ul:my-8
                    prose-strong:text-[#8E9775] prose-strong:font-black prose-strong:bg-[#8E9775]/5 prose-strong:px-1.5 prose-strong:rounded
                    prose-hr:border-[#E5E1D8] prose-hr:my-8 md:prose-hr:my-12
                    break-keep text-pretty">
                    <ReactMarkdown>{mealPlan}</ReactMarkdown>
                  </div>
                  
                  <div className="mt-20 pt-12 border-t-4 border-[#F9F8F4] flex flex-col items-center gap-8">
                    <p className="text-[#A8A398] text-[10px] font-black text-center max-w-sm uppercase tracking-[0.3em] leading-loose">
                      Generated by HealthPulse AI Core.<br />Consult a professional for specific medical needs.
                    </p>
                    <button 
                      onClick={handleGeneratePlan}
                      className="px-8 py-4 bg-[#F9F8F4] hover:bg-[#2D2D2D] hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-3 transition-all active:scale-95 border-2 border-transparent hover:border-black"
                    >
                      <RefreshCcw size={14} strokeWidth={3} /> RE-GENERATE
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </main>

      <footer className="max-w-4xl mx-auto px-8 py-24 text-center space-y-12">
        <div className="h-1 bg-[#F0EEE6] w-full rounded-full" />
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-4xl font-black text-[#2D2D2D] tracking-tighter">PULSE.</h2>
          <p className="text-[#A8A398] text-[11px] font-black uppercase tracking-[0.6em]">Wellness Architecture 2026</p>
        </div>
      </footer>
    </div>
  );
}
