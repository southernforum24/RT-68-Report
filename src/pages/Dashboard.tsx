import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { Download, Award, BookOpen, GraduationCap, FileText, ChevronLeft, Sparkles, Loader2 } from 'lucide-react';
import { getQualityLevel, mockStatistics } from '../lib/mockData';
import { StudentScore, Statistics } from '../types';
import { cn } from '../lib/utils';
import { toJpeg } from 'html-to-image';
import { jsPDF } from 'jspdf';

export default function Dashboard() {
  const [student, setStudent] = useState<StudentScore | null>(null);
  const [statistics, setStatistics] = useState<Statistics>(mockStatistics);
  const schoolLogo = localStorage.getItem('schoolLogo');
  const obecLogo = localStorage.getItem('obecLogo');
  const nietsLogo = localStorage.getItem('nietsLogo');
  const [isDownloading, setIsDownloading] = useState(false);
  
  const reportRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const studentData = localStorage.getItem('selectedStudent');
    const statsData = localStorage.getItem('statistics');
    
    if (!studentData) {
      navigate('/');
      return;
    }
    
    setStudent(JSON.parse(studentData));
    if (statsData) {
      setStatistics(JSON.parse(statsData));
    }
  }, [navigate]);

  if (!student) return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex items-center justify-center">
      <div className="animate-pulse text-purple-600 font-medium flex items-center gap-2">
        <Loader2 className="w-6 h-6 animate-spin" /> กำลังโหลดข้อมูล...
      </div>
    </div>
  );

  const handleLogout = () => {
    localStorage.removeItem('selectedStudent');
    navigate('/');
  };

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    setIsDownloading(true);
    
    try {
      // Scroll to top to prevent clipping bugs
      window.scrollTo(0, 0);
      
      // Wait a bit longer for any scroll effects or rendering to finish completely
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const element = reportRef.current;
      
      // Use html-to-image to generate a JPEG data URL
      const imgData = await toJpeg(element, {
        quality: 0.95,
        backgroundColor: '#ffffff',
        pixelRatio: 2, // 2 is optimal for quality vs performance
        style: {
          boxShadow: 'none',
          border: 'none',
          borderRadius: '0'
        }
      });
      
      // Calculate dimensions for 9:16 aspect ratio
      const pdf = new jsPDF('p', 'mm', [210, 373.33]); // 210mm width, 373.33mm height = 9:16
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`ผลการทดสอบ ONET68 ${student.name}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert(`เกิดข้อผิดพลาดในการสร้างไฟล์ PDF: ${error instanceof Error ? error.message : 'กรุณาลองใหม่อีกครั้ง'}`);
    } finally {
      setIsDownloading(false);
    }
  };

  const getStudentIcon = (name: string) => {
    if (name.includes('เด็กหญิง') || name.includes('ด.ญ.')) return '👧🏻';
    if (name.includes('เด็กชาย') || name.includes('ด.ช.')) return '👦🏻';
    if (name.includes('นางสาว') || name.includes('น.ส.')) return '👩🏻';
    if (name.includes('นาย')) return '👨🏻';
    return '🧑🏻';
  };

  const chartData = [
    {
      subject: 'ภาษาไทย',
      นักเรียน: student.scores.thai,
      โรงเรียน: statistics.school.thai,
      เขต: statistics.district.thai,
      จังหวัด: statistics.province.thai,
      'ศธ.ภาค': statistics.region.thai,
      ประเทศ: statistics.national.thai,
    },
    {
      subject: 'คณิตศาสตร์',
      นักเรียน: student.scores.math,
      โรงเรียน: statistics.school.math,
      เขต: statistics.district.math,
      จังหวัด: statistics.province.math,
      'ศธ.ภาค': statistics.region.math,
      ประเทศ: statistics.national.math,
    },
    {
      subject: 'วิทยาศาสตร์',
      นักเรียน: student.scores.science,
      โรงเรียน: statistics.school.science,
      เขต: statistics.district.science,
      จังหวัด: statistics.province.science,
      'ศธ.ภาค': statistics.region.science,
      ประเทศ: statistics.national.science,
    },
    {
      subject: 'ภาษาอังกฤษ',
      นักเรียน: student.scores.english,
      โรงเรียน: statistics.school.english,
      เขต: statistics.district.english,
      จังหวัด: statistics.province.english,
      'ศธ.ภาค': statistics.region.english,
      ประเทศ: statistics.national.english,
    },
  ];

  const radarData = [
    { subject: 'ภาษาไทย', score: student.scores.thai, fullMark: 100 },
    { subject: 'คณิตศาสตร์', score: student.scores.math, fullMark: 100 },
    { subject: 'วิทยาศาสตร์', score: student.scores.science, fullMark: 100 },
    { subject: 'ภาษาอังกฤษ', score: student.scores.english, fullMark: 100 },
  ];

  const subjects = [
    { name: 'ภาษาไทย', score: student.scores.thai, obj: student.scores.thai_obj, sub: student.scores.thai_sub, icon: BookOpen, color: 'bg-pink-100 text-pink-600', border: 'border-pink-200' },
    { name: 'คณิตศาสตร์', score: student.scores.math, icon: FileText, color: 'bg-blue-100 text-blue-600', border: 'border-blue-200' },
    { name: 'วิทยาศาสตร์', score: student.scores.science, icon: Award, color: 'bg-green-100 text-green-600', border: 'border-green-200' },
    { name: 'ภาษาอังกฤษ', score: student.scores.english, icon: GraduationCap, color: 'bg-purple-100 text-purple-600', border: 'border-purple-200' },
  ];

  const averageScore = ((student.scores.thai + student.scores.math + student.scores.science + student.scores.english) / 4).toFixed(2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 pb-20 font-sans selection:bg-purple-200">
      {/* Header */}
      <header className="bg-white/70 backdrop-blur-2xl sticky top-0 z-20 border-b border-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-16 flex justify-between items-center">
          <button onClick={handleLogout} className="flex items-center text-purple-600 font-semibold active:opacity-70 transition-opacity bg-white/50 px-4 py-2 rounded-full hover:bg-white shadow-sm">
            <ChevronLeft className="w-5 h-5 mr-1" />
            กลับ
          </button>
          <h1 className="text-[18px] font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            รายงานผลการพัฒนาผู้เรียน
          </h1>
          <button 
            onClick={handleDownloadPDF} 
            disabled={isDownloading}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-full shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-70 disabled:hover:scale-100"
          >
            {isDownloading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
            <span className="hidden sm:inline">{isDownloading ? 'กำลังสร้าง PDF...' : 'ดาวน์โหลด PDF'}</span>
          </button>
        </div>
      </header>

      <main className="w-full overflow-x-auto px-4 py-8 flex justify-center">
        
        {/* Printable Report Container */}
        <div 
          id="pdf-report-container"
          ref={reportRef} 
          className="bg-white rounded-[40px] shadow-xl overflow-hidden border border-slate-100 shrink-0 flex flex-col"
          style={{ width: '794px', height: '1411px', padding: '40px' }} // 9:16 aspect ratio
        >
          {/* Report Header */}
          <div className="flex justify-between items-center mb-6 bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-700 py-4 px-6 rounded-3xl shadow-lg">
            <div className="w-20 h-20 flex items-center justify-center bg-transparent shrink-0 relative">
              {obecLogo ? (
                <img src={obecLogo} alt="OBEC" className="w-full h-full object-contain drop-shadow-md" crossOrigin="anonymous" />
              ) : (
                <span className="text-xs text-indigo-200/60 text-center font-medium">ไม่มี<br/>โลโก้ สพฐ.</span>
              )}
            </div>
            
            <div className="flex-1 text-center px-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-1 drop-shadow-md">รายงานผลการพัฒนาผู้เรียน</h2>
              <h3 className="text-base sm:text-lg font-bold text-indigo-100 mb-1 tracking-tight">การทดสอบทางการศึกษาระดับชาติขั้นพื้นฐาน (O-NET)</h3>
              <p className="text-indigo-200 font-medium text-sm sm:text-base">ระดับชั้นประถมศึกษาปีที่ 6 ปีการศึกษา 2568</p>
            </div>

            <div className="w-20 h-20 flex items-center justify-center bg-transparent shrink-0 relative">
              {nietsLogo ? (
                <img src={nietsLogo} alt="NIETS" className="w-full h-full object-contain drop-shadow-md" crossOrigin="anonymous" />
              ) : (
                <span className="text-xs text-indigo-200/60 text-center font-medium">ไม่มี<br/>โลโก้ สทศ.</span>
              )}
            </div>
          </div>

          {/* Student Info Banner */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-3xl p-6 mb-6 border border-purple-100 flex items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-white rounded-full shadow-sm flex items-center justify-center text-4xl border-2 border-white shrink-0">
                {getStudentIcon(student.name)}
              </div>
              <div>
                <p className="text-sm font-bold text-purple-500 mb-1 uppercase tracking-wider">ข้อมูลนักเรียน</p>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight mb-2">{student.name}</h2>
                <p className="text-slate-600 font-medium flex items-center gap-2 text-base">
                  <span className="w-2 h-2 rounded-full bg-green-400"></span>
                  โรงเรียนบ้านตะโละ
                </p>
              </div>
            </div>
            <div className="w-20 h-20 flex items-center justify-center bg-transparent shrink-0 relative">
              {schoolLogo ? (
                <img src={schoolLogo} alt="School" className="w-full h-full object-contain drop-shadow-md" crossOrigin="anonymous" />
              ) : (
                <span className="text-xs text-purple-400/60 text-center font-medium">ไม่มี<br/>โลโก้โรงเรียน</span>
              )}
            </div>
          </div>

          {/* Average Score Panel */}
          <div className="mb-6 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-3xl p-6 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold opacity-95">คะแนนเฉลี่ยรวม 4 วิชา</h3>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black tracking-tight">{averageScore}</span>
              <span className="text-lg font-bold opacity-80">/ 100</span>
            </div>
          </div>

          {/* Score Summary Grid */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Award className="w-6 h-6 text-yellow-500" />
              สรุปคะแนนรายวิชา
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {subjects.map((sub, idx) => {
                const quality = getQualityLevel(sub.score);
                return (
                  <div key={idx} className={cn("bg-white rounded-3xl p-4 shadow-sm border", sub.border)}>
                    <div className="flex justify-between items-start mb-3">
                      <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center", sub.color)}>
                        <sub.icon className="w-5 h-5" />
                      </div>
                      <span className={cn("inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold", quality.bgColor, quality.textColor)}>
                        {quality.name}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 font-bold mb-1">{sub.name}</p>
                    <div className="flex items-baseline gap-1 mb-1">
                      <span className="text-3xl font-black text-slate-800 tracking-tight">{sub.score.toFixed(2)}</span>
                      <span className="text-xs text-slate-400 font-bold">/ 100</span>
                    </div>
                    {sub.name === 'ภาษาไทย' && (
                      <div className="flex gap-2 mt-2 text-[10px] font-medium text-slate-600">
                        <span className="bg-slate-100 px-2 py-1 rounded-md">ปรนัย: {sub.obj?.toFixed(2)}</span>
                        <span className="bg-slate-100 px-2 py-1 rounded-md">อัตนัย: {sub.sub?.toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Charts Section */}
          <div className="flex flex-col gap-6 flex-1">
            {/* Bar Chart */}
            <div className="bg-slate-50 rounded-3xl py-3 px-6 border border-slate-100 flex-1 flex flex-col">
              <div className="flex items-baseline gap-2 mb-2">
                <h3 className="text-lg font-bold text-slate-800">📊 เปรียบเทียบคะแนน 5 ระดับ</h3>
                <span className="text-xs text-slate-500 font-medium">เทียบกับค่าเฉลี่ยโรงเรียน เขต จังหวัด ศธ.ภาค และประเทศ</span>
              </div>
              <div className="flex-1 w-full min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5EA" />
                    <XAxis dataKey="subject" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} />
                    <Tooltip 
                      formatter={(value: number) => value.toFixed(2)}
                      itemSorter={(item) => {
                        const order = ['นักเรียน', 'โรงเรียน', 'เขต', 'จังหวัด', 'ศธ.ภาค', 'ประเทศ'];
                        return order.indexOf(item.dataKey as string);
                      }}
                      cursor={{ fill: '#f1f5f9' }}
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', padding: '12px' }}
                      itemStyle={{ fontSize: '12px', fontWeight: 600, padding: '2px 0' }}
                      labelStyle={{ fontSize: '14px', fontWeight: 700, marginBottom: '8px', color: '#1e293b' }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '11px', fontWeight: 600 }} />
                    <Bar dataKey="นักเรียน" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={16} isAnimationActive={false} />
                    <Bar dataKey="โรงเรียน" fill="#8b5cf6" radius={[4, 4, 0, 0]} maxBarSize={16} isAnimationActive={false} />
                    <Bar dataKey="เขต" fill="#0ea5e9" radius={[4, 4, 0, 0]} maxBarSize={16} isAnimationActive={false} />
                    <Bar dataKey="จังหวัด" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={16} isAnimationActive={false} />
                    <Bar dataKey="ศธ.ภาค" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={16} isAnimationActive={false} />
                    <Bar dataKey="ประเทศ" fill="#f97316" radius={[4, 4, 0, 0]} maxBarSize={16} isAnimationActive={false} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Radar Chart */}
            <div className="bg-slate-50 rounded-3xl py-3 px-6 border border-slate-100 flex-1 flex flex-col">
              <div className="flex items-baseline gap-2 mb-1">
                <h3 className="text-lg font-bold text-slate-800">🎯 จุดเด่นของนักเรียน</h3>
                <span className="text-xs text-slate-500 font-medium">แสดงความถนัดในแต่ละวิชา</span>
              </div>
              <div className="flex-1 w-full min-h-[220px] flex justify-center items-center mt-0">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid stroke="#cbd5e1" strokeDasharray="3 3" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 12, fontWeight: 700 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar name="คะแนน" dataKey="score" stroke="#f43f5e" strokeWidth={3} fill="#f43f5e" fillOpacity={0.4} isAnimationActive={false} />
                    <Tooltip 
                      formatter={(value: number) => value.toFixed(2)}
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }}
                      itemStyle={{ fontWeight: 600 }}
                      labelStyle={{ fontWeight: 700, color: '#1e293b' }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          {/* Footer Note */}
          <div className="mt-auto text-center text-slate-400 text-xs font-medium border-t border-slate-100 pt-6">
            พัฒนาโดยฝ่ายวิชาการ โรงเรียนบ้านตะโละ - @2569
          </div>
        </div>

      </main>
      
      <footer className="py-6 text-center text-slate-400 text-xs font-medium border-t border-slate-200 bg-white mt-auto">
        พัฒนาโดยฝ่ายวิชาการ โรงเรียนบ้านตะโละ - @2569
      </footer>
    </div>
  );
}
