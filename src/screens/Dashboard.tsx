import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import {
  Users, GraduationCap, CalendarCheck, TrendingUp, AlertTriangle,
  Clock, CheckCircle, UserX, FileText, ArrowRight
} from 'lucide-react'
import { StatCard, Card, SectionHeader, Badge, ProgressBar, Avatar } from '../components/ui'
import { weeklyAttendanceTrend, classAttendanceSummary, monthlyAttendance, students } from '../data/mockData'

const pieData = [
  { name: 'Present', value: 1195, color: '#059669' },
  { name: 'Absent', value: 87, color: '#dc2626' },
  { name: 'Late', value: 23, color: '#d97706' },
  { name: 'Leave', value: 42, color: '#7c3aed' },
]

const lowAttendanceStudents = students.filter(s => s.attendance < 75).slice(0, 5)

interface DashboardProps {
  onNavigate: (screen: string) => void
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  return (
    <div className="space-y-5">
      {/* Today's quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Students"
          value="1,347"
          sub="Enrolled this year"
          icon={<GraduationCap size={18} />}
          color="indigo"
          trend={{ value: 4.2, up: true }}
        />
        <StatCard
          label="Present Today"
          value="1,195"
          sub="88.7% attendance"
          icon={<CheckCircle size={18} />}
          color="emerald"
        />
        <StatCard
          label="Absent Today"
          value="87"
          sub="6.5% of students"
          icon={<UserX size={18} />}
          color="red"
        />
        <StatCard
          label="On Leave"
          value="42"
          sub="3.1% of students"
          icon={<CalendarCheck size={18} />}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Teachers"
          value="68"
          sub="Present: 61 today"
          icon={<Users size={18} />}
          color="blue"
        />
        <StatCard
          label="Classes Today"
          value="32"
          sub="8 periods active"
          icon={<Clock size={18} />}
          color="amber"
        />
        <StatCard
          label="Attendance Submitted"
          value="28/32"
          sub="4 classes pending"
          icon={<FileText size={18} />}
          color="indigo"
        />
        <StatCard
          label="Avg Attendance"
          value="89.3%"
          sub="This academic year"
          icon={<TrendingUp size={18} />}
          color="emerald"
          trend={{ value: 2.1, up: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Weekly trend */}
        <Card className="lg:col-span-2" padding={false}>
          <div className="p-5 pb-0">
            <SectionHeader
              title="Weekly Attendance Trend"
              subtitle="Student attendance breakdown by day"
              actions={
                <button onClick={() => onNavigate('attendance-summary')} className="text-xs text-indigo-600 font-600 flex items-center gap-1 hover:underline">
                  View all <ArrowRight size={12} />
                </button>
              }
            />
          </div>
          <div className="px-4 pb-5">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={weeklyAttendanceTrend} barSize={32} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#0f172a', border: 'none', borderRadius: 8, padding: '8px 12px' }}
                  labelStyle={{ color: '#94a3b8', fontSize: 11 }}
                  itemStyle={{ color: '#f8fafc', fontSize: 12 }}
                />
                <Bar dataKey="present" name="Present" fill="#4f46e5" radius={[3, 3, 0, 0]} />
                <Bar dataKey="absent" name="Absent" fill="#fca5a5" radius={[3, 3, 0, 0]} />
                <Bar dataKey="late" name="Late" fill="#fcd34d" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-4 mt-1 px-2">
              {[{ color: '#4f46e5', label: 'Present' }, { color: '#fca5a5', label: 'Absent' }, { color: '#fcd34d', label: 'Late' }].map(l => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ background: l.color }} />
                  <span className="text-xs text-slate-500">{l.label}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Today's distribution */}
        <Card>
          <SectionHeader title="Today's Distribution" subtitle="Jan 20, 2025" />
          <div className="flex justify-center">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={48} outerRadius={72} paddingAngle={3} dataKey="value">
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#0f172a', border: 'none', borderRadius: 8, padding: '6px 10px' }}
                  labelStyle={{ color: '#94a3b8', fontSize: 11 }}
                  itemStyle={{ color: '#f8fafc', fontSize: 12 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {pieData.map(d => (
              <div key={d.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                  <span className="text-xs text-slate-600">{d.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-700 text-slate-900">{d.value}</span>
                  <span className="text-[10px] text-slate-400">{((d.value / 1347) * 100).toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Class-wise summary */}
        <Card padding={false}>
          <div className="p-5 pb-3">
            <SectionHeader
              title="Class-wise Attendance"
              subtitle="Today's summary"
              actions={
                <button onClick={() => onNavigate('attendance-report')} className="text-xs text-indigo-600 font-600 flex items-center gap-1 hover:underline">
                  Full report <ArrowRight size={12} />
                </button>
              }
            />
          </div>
          <div className="px-5 pb-5 space-y-3">
            {classAttendanceSummary.slice(0, 6).map((cls, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-24 text-xs font-600 text-slate-700 truncate">{cls.class} – {cls.section}</div>
                <div className="flex-1">
                  <ProgressBar value={cls.pct} />
                </div>
                <div className="flex items-center gap-1 w-20 justify-end">
                  <span className="text-xs font-700 text-slate-900">{cls.pct}%</span>
                  <span className="text-[10px] text-slate-400">({cls.present}/{cls.total})</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Low attendance students */}
        <Card padding={false}>
          <div className="p-5 pb-3">
            <SectionHeader
              title="Low Attendance Alert"
              subtitle="Students below 75% attendance"
              actions={
                <Badge variant="danger">
                  <AlertTriangle size={9} /> {lowAttendanceStudents.length + 2} students
                </Badge>
              }
            />
          </div>
          <div className="px-5 pb-5">
            <table className="erp-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Class</th>
                  <th>Attendance</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ...lowAttendanceStudents,
                  { id: 'S99', name: 'Vivek Reddy', admNo: 'ADM2024009', class: 'Class 10', section: 'A', attendance: 55 },
                  { id: 'S98', name: 'Rohan Mehta', admNo: 'ADM2024003', class: 'Class 10', section: 'A', attendance: 65 },
                ].slice(0, 5).map(s => (
                  <tr key={s.id}>
                    <td>
                      <div className="flex items-center gap-2">
                        <Avatar name={s.name} size="sm" />
                        <div>
                          <p className="text-xs font-600 text-slate-800">{s.name}</p>
                          <p className="text-[10px] text-slate-400">{s.admNo}</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-xs text-slate-600">{s.class} – {s.section}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-700 ${s.attendance < 60 ? 'text-red-600' : 'text-amber-600'}`}>{s.attendance}%</span>
                        <div className="w-12">
                          <ProgressBar value={s.attendance} />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Monthly trend */}
      <Card padding={false}>
        <div className="p-5 pb-0">
          <SectionHeader
            title="Monthly Attendance Trend"
            subtitle="Academic Year 2024–25"
          />
        </div>
        <div className="px-4 pb-5">
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={monthlyAttendance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis domain={[50, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#0f172a', border: 'none', borderRadius: 8, padding: '8px 12px' }}
                labelStyle={{ color: '#94a3b8', fontSize: 11 }}
                itemStyle={{ color: '#f8fafc', fontSize: 12 }}
                formatter={(val: unknown) => [`${val}%`, 'Attendance']}
              />
              <Line type="monotone" dataKey="pct" stroke="#4f46e5" strokeWidth={2.5} dot={{ fill: '#4f46e5', r: 3 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Quick actions */}
      <Card>
        <SectionHeader title="Quick Actions" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Mark Attendance', screen: 'mark-attendance', color: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100', icon: <CalendarCheck size={20} /> },
            { label: 'View Timetable', screen: 'class-timetable', color: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100', icon: <Clock size={20} /> },
            { label: 'Attendance Summary', screen: 'attendance-summary', color: 'bg-amber-50 text-amber-700 hover:bg-amber-100', icon: <TrendingUp size={20} /> },
            { label: 'Transfer Certificate', screen: 'transfer-certificate', color: 'bg-purple-50 text-purple-700 hover:bg-purple-100', icon: <FileText size={20} /> },
          ].map(a => (
            <button
              key={a.label}
              onClick={() => onNavigate(a.screen)}
              className={`flex flex-col items-center gap-2.5 p-4 rounded-xl transition-colors cursor-pointer ${a.color}`}
            >
              {a.icon}
              <span className="text-sm font-600 text-center leading-tight">{a.label}</span>
            </button>
          ))}
        </div>
      </Card>
    </div>
  )
}
