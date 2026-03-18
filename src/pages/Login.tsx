import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Search, Loader2, ChevronRight, BarChart3, TrendingUp, Users, Award, BookOpen, FileText, GraduationCap } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { fetchOnetData } from '../lib/googleSheets';
import { StudentScore, Statistics } from '../types';
import { cn } from '../lib/utils';

export default function Login() {
  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState<StudentScore[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchOnetData();
        setStudents(data.students);
        setStatistics(data.statistics);
        
        if (data.logos.obec) localStorage.setItem('obecLogo', data.logos.obec);
        else localStorage.removeItem('obecLogo');
        
        if (data.logos.school) localStorage.setItem('schoolLogo', data.logos.school);
        else localStorage.removeItem('schoolLogo');
        
        if (data.logos.niets) localStorage.setItem('nietsLogo', data.logos.niets);
        else localStorage.removeItem('nietsLogo');
        
        setLoading(false);
      } catch (err) {
        setError('ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง');
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredStudents = students.filter(student => 
    searchQuery.trim() !== '' && student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectStudent = (student: StudentScore) => {
    localStorage.setItem('selectedStudent', JSON.stringify(student));
    if (statistics) {
      localStorage.setItem('statistics', JSON.stringify(statistics));
    }
    navigate('/dashboard');
  };

  const schoolChartData = statistics ? [
    {
      subject: 'ภาษาไทย',
      โรงเรียน: statistics.school.thai,
      เขต: statistics.district.thai,
      จังหวัด: statistics.province.thai,
      'ศธ.ภาค': statistics.region.thai,
      ประเทศ: statistics.national.thai,
    },
    {
      subject: 'คณิตศาสตร์',
      โรงเรียน: statistics.school.math,
      เขต: statistics.district.math,
      จังหวัด: statistics.province.math,
      'ศธ.ภาค': statistics.region.math,
      ประเทศ: statistics.national.math,
    },
    {
      subject: 'วิทยาศาสตร์',
      โรงเรียน: statistics.school.science,
      เขต: statistics.district.science,
      จังหวัด: statistics.province.science,
      'ศธ.ภาค': statistics.region.science,
      ประเทศ: statistics.national.science,
    },
    {
      subject: 'ภาษาอังกฤษ',
      โรงเรียน: statistics.school.english,
      เขต: statistics.district.english,
      จังหวัด: statistics.province.english,
      'ศธ.ภาค': statistics.region.english,
      ประเทศ: statistics.national.english,
    },
  ] : [];

  const schoolRadarData = statistics ? [
    { subject: 'ภาษาไทย', score: statistics.school.thai, fullMark: 100 },
    { subject: 'คณิตศาสตร์', score: statistics.school.math, fullMark: 100 },
    { subject: 'วิทยาศาสตร์', score: statistics.school.science, fullMark: 100 },
    { subject: 'ภาษาอังกฤษ', score: statistics.school.english, fullMark: 100 },
  ] : [];

  const schoolSubjects = statistics ? [
    { name: 'ภาษาไทย', score: statistics.school.thai, obj: statistics.school.thai_obj, sub: statistics.school.thai_sub, icon: BookOpen, color: 'text-pink-600', bg: 'bg-pink-50' },
    { name: 'คณิตศาสตร์', score: statistics.school.math, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
    { name: 'วิทยาศาสตร์', score: statistics.school.science, icon: Award, color: 'text-green-600', bg: 'bg-green-50' },
    { name: 'ภาษาอังกฤษ', score: statistics.school.english, icon: GraduationCap, color: 'text-purple-600', bg: 'bg-purple-50' },
  ] : [];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      {/* Hero Section with Search */}
      <div className="w-full bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 pt-12 pb-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-white blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-white blur-[100px]" />
        </div>

        <div className="max-w-6xl mx-auto flex flex-col items-center text-center relative z-10">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/30 shadow-xl overflow-hidden">
              {localStorage.getItem('schoolLogo') ? (
                <img src={localStorage.getItem('schoolLogo')!} alt="School" className="w-full h-full object-contain p-2" />
              ) : (
                <span className="text-4xl">🎓</span>
              )}
            </div>
            <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/30 shadow-xl overflow-hidden">
              {localStorage.getItem('obecLogo') ? (
                <img src={localStorage.getItem('obecLogo')!} alt="OBEC" className="w-full h-full object-contain p-2" />
              ) : (
                <span className="text-4xl">🏫</span>
              )}
            </div>
            <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/30 shadow-xl overflow-hidden">
              {localStorage.getItem('nietsLogo') ? (
                <img src={localStorage.getItem('nietsLogo')!} alt="NIETS" className="w-full h-full object-contain p-2" />
              ) : (
                <span className="text-4xl">📝</span>
              )}
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4 drop-shadow-sm">
            ระบบรายงานผลสอบ O-NET
          </h1>
          <p className="text-indigo-100 text-lg md:text-xl font-medium mb-10 max-w-2xl opacity-90">
            โรงเรียนบ้านตะโละ ระดับชั้นประถมศึกษาปีที่ 6 ปีการศึกษา 2568
          </p>
        </div>
      </div>

      {/* Dashboard Section */}
      <main className="max-w-6xl mx-auto w-full px-6 -mt-12 pb-20 relative z-10 flex-1">
        {loading ? (
          <div className="bg-white rounded-[40px] p-20 shadow-xl border border-slate-100 flex flex-col items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mb-6" />
            <h3 className="text-xl font-bold text-slate-800">กำลังประมวลผลข้อมูลระดับโรงเรียน</h3>
            <p className="text-slate-500 mt-2">กรุณารอสักครู่...</p>
          </div>
        ) : statistics && (
          <div className="space-y-8">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {schoolSubjects.map((sub) => (
                <Card key={sub.name} className="rounded-[32px] border-none shadow-lg overflow-hidden group hover:scale-[1.02] transition-transform">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-colors", sub.bg)}>
                      <sub.icon className={cn("w-7 h-7", sub.color)} />
                    </div>
                    <p className="text-slate-500 text-sm font-bold mb-1">{sub.name}</p>
                    <h3 className="text-3xl font-black text-slate-800">{sub.score.toFixed(2)}</h3>
                    {sub.name === 'ภาษาไทย' && (
                      <div className="flex gap-2 mt-2 text-[10px] font-medium text-slate-500">
                        <span className="bg-slate-50 px-2 py-1 rounded-md">ปรนัย: {sub.obj?.toFixed(2)}</span>
                        <span className="bg-slate-50 px-2 py-1 rounded-md">อัตนัย: {sub.sub?.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="mt-4 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={cn("h-full rounded-full transition-all duration-1000", 
                          sub.name === 'ภาษาไทย' ? 'bg-pink-500' : 
                          sub.name === 'คณิตศาสตร์' ? 'bg-blue-500' : 
                          sub.name === 'วิทยาศาสตร์' ? 'bg-green-500' : 'bg-purple-500'
                        )}
                        style={{ width: `${sub.score}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 justify-center">
              <Card className="md:col-start-2 rounded-[32px] border-none shadow-xl bg-indigo-600 text-white p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold mb-1">จำนวนนักเรียน</h3>
                    <p className="text-indigo-100 text-xs opacity-80">ปีการศึกษา 2568</p>
                  </div>
                  <Users className="w-8 h-8 opacity-40" />
                </div>
                <div className="mt-6 flex items-baseline gap-2">
                  <span className="text-4xl font-black">{students.length}</span>
                  <span className="text-sm font-bold opacity-80">คน</span>
                </div>
              </Card>

              <Card className="rounded-[32px] border-none shadow-xl bg-white p-6 border-l-8 border-pink-500">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-1">คะแนนเฉลี่ยรวม</h3>
                    <p className="text-slate-500 text-xs">ทุกรายวิชา</p>
                  </div>
                  <Award className="w-8 h-8 text-pink-500 opacity-20" />
                </div>
                <div className="mt-6 flex items-baseline gap-2">
                  <span className="text-4xl font-black text-slate-800">
                    {((statistics.school.thai + statistics.school.math + statistics.school.science + statistics.school.english) / 4).toFixed(2)}
                  </span>
                  <span className="text-sm font-bold text-slate-400">คะแนน</span>
                </div>
              </Card>
            </div>

            {/* Search Box */}
            <div className="w-full max-w-xl mx-auto relative group my-12">
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-[24px] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-400" />
                <Input 
                  placeholder="ค้นหาชื่อนักเรียนเพื่อดูผลรายบุคคล..." 
                  className="pl-14 h-16 rounded-[22px] bg-white border-none shadow-2xl text-lg focus-visible:ring-2 focus-visible:ring-yellow-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  disabled={loading}
                />
                {loading && (
                  <div className="absolute right-5 top-1/2 -translate-y-1/2">
                    <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
                  </div>
                )}
              </div>

              {/* Search Results Dropdown */}
              {searchQuery.trim() !== '' && (
                <div className="absolute top-full left-0 w-full mt-3 bg-white rounded-[24px] shadow-2xl border border-slate-100 overflow-hidden z-50 max-h-[400px] overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-top-2">
                  {filteredStudents.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">
                      <p className="font-medium">ไม่พบรายชื่อที่ค้นหา</p>
                    </div>
                  ) : (
                    <div className="p-2">
                      {filteredStudents.map(student => (
                        <button
                          key={student.id}
                          onClick={() => handleSelectStudent(student)}
                          className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors text-left group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold">
                              {student.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-slate-800">{student.name}</p>
                              <p className="text-xs text-slate-500">เลขประจำตัว: {student.id}</p>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Main Charts */}
            <div className="flex flex-col gap-8">
              {/* Bar Chart - Comparison */}
              <Card className="rounded-[40px] border-none shadow-xl bg-white overflow-hidden">
                <CardHeader className="p-8 pb-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                      <BarChart3 className="w-5 h-5 text-indigo-600" />
                    </div>
                    <CardTitle className="text-xl font-bold text-slate-800">เปรียบเทียบคะแนนเฉลี่ย</CardTitle>
                  </div>
                  <CardDescription>เปรียบเทียบคะแนนเฉลี่ยโรงเรียนกับระดับต่างๆ</CardDescription>
                </CardHeader>
                <CardContent className="p-8 h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={schoolChartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="subject" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} domain={[0, 100]} />
                      <Tooltip 
                        formatter={(value: number) => value.toFixed(2)}
                        itemSorter={(item) => {
                          const order = ['นักเรียน', 'โรงเรียน', 'เขต', 'จังหวัด', 'ศธ.ภาค', 'ประเทศ'];
                          return order.indexOf(item.dataKey as string);
                        }}
                        cursor={{ fill: '#f8fafc' }}
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      />
                      <Legend verticalAlign="top" height={36} iconType="circle" />
                      <Bar dataKey="โรงเรียน" fill="#8b5cf6" radius={[6, 6, 0, 0]} barSize={20} />
                      <Bar dataKey="เขต" fill="#0ea5e9" radius={[6, 6, 0, 0]} barSize={20} />
                      <Bar dataKey="จังหวัด" fill="#10b981" radius={[6, 6, 0, 0]} barSize={20} />
                      <Bar dataKey="ศธ.ภาค" fill="#f59e0b" radius={[6, 6, 0, 0]} barSize={20} />
                      <Bar dataKey="ประเทศ" fill="#f97316" radius={[6, 6, 0, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Radar Chart - School Profile */}
              <Card className="rounded-[40px] border-none shadow-xl bg-white overflow-hidden">
                <CardHeader className="p-8 pb-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-pink-50 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-pink-600" />
                    </div>
                    <CardTitle className="text-xl font-bold text-slate-800">ภาพรวมสมรรถนะ</CardTitle>
                  </div>
                  <CardDescription>จุดแข็งและจุดที่ควรพัฒนาของโรงเรียน</CardDescription>
                </CardHeader>
                <CardContent className="p-4 h-[400px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={schoolRadarData}>
                      <PolarGrid stroke="#e2e8f0" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar
                        name="โรงเรียน"
                        dataKey="score"
                        stroke="#8b5cf6"
                        fill="#8b5cf6"
                        fillOpacity={0.5}
                      />
                      <Tooltip 
                        formatter={(value: number) => value.toFixed(2)}
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }}
                        itemStyle={{ fontWeight: 600 }}
                        labelStyle={{ fontWeight: 700, color: '#1e293b' }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>

      <footer className="py-6 text-center text-slate-400 text-xs font-medium border-t border-slate-200 bg-white">
        พัฒนาโดยฝ่ายวิชาการ โรงเรียนบ้านตะโละ - @2569
      </footer>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(0,0,0,0.1);
          border-radius: 20px;
        }
      `}</style>
    </div>
  );
}
