import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { CheckCircle, XCircle, Clock, Calendar, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react'
import { Card, Tabs, StatCard, Badge, PageHeader, Select, ProgressBar, Avatar } from '../components/ui'
import { monthlyAttendance, subjectAttendance, students } from '../data/mockData'

const dayStatus: Record<string, 'present' | 'absent' | 'late' | 'leave' | 'holiday' | 'weekend'> = {
  '1': 'present', '2': 'late', '3': 'absent', '6': 'present', '7': 'leave',
  '8': 'present', '9': 'present', '10': 'late', '13': 'present', '14': 'holiday',
  '15': 'present', '16': 'present', '17': 'leave', '20': 'present',
}

const periodStatus = [
  { period: 1, subject: 'Mathematics', status: 'present' },
  { period: 2, subject: 'Physics', status: 'present' },
  { period: 3, subject: 'English', status: 'late' },
  { period: 4, subject: 'Chemistry', status: 'present' },
  { period: 5, subject: 'Hindi', status: 'present' },
  { period: 6, subject: 'Social Studies', status: 'present' },
  { period: 7, subject: 'Biology', status: 'absent' },
  { period: 8, subject: 'Computer Science', status: 'present' },
]

const statusColor: Record<string, string> = {
  present: 'bg-emerald-500',
  absent: 'bg-red-400',
  late: 'bg-amber-400',
  leave: 'bg-purple-400',
  holiday: 'bg-blue-300',
  weekend: 'bg-slate-200',
}
const statusBadge: Record<string, 'success' | 'danger' | 'warning' | 'purple' | 'info'> = {
  present: 'success', absent: 'danger', late: 'warning', leave: 'purple', holiday: 'info',
}

export default function StudentAttendanceDetails() {
  const [tab, setTab] = useState('daily')
  const [selectedStudent, setSelectedStudent] = useState(students[0])
  const [selectedDate, setSelectedDate] = useState('20')
  const [month, setMonth] = useState('January 2025')
  const [ay, setAy] = useState('2024-25')

  const daysInMonth = 31
  const firstDay = 3 // Wed
  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) {
    const dayOfWeek = (firstDay + d - 1) % 7
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
    cells.push({ day: d, status: isWeekend ? 'weekend' : (dayStatus[String(d)] || 'present') })
  }

  const totalWorkingDays = monthlyAttendance.reduce((a, m) => a + m.total, 0)
  const totalPresent = monthlyAttendance.reduce((a, m) => a + m.present, 0)
  const totalAbsent = monthlyAttendance.reduce((a, m) => a + m.absent, 0)
  const totalLate = monthlyAttendance.reduce((a, m) => a + m.late, 0)
  const totalLeave = monthlyAttendance.reduce((a, m) => a + m.leave, 0)
  const overallPct = Math.round((totalPresent / totalWorkingDays) * 100)

  return (
    <div className="space-y-5">
      <PageHeader
        breadcrumb={['Attendance', 'Student Attendance Details']}
        title="Student Attendance Details"
        subtitle="Detailed attendance history for individual students"
      />

      {/* Student selector */}
      <Card>
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center gap-4 flex-1">
            <Avatar name={selectedStudent.name} size="lg" />
            <div>
              <h2 className="text-base font-700 text-slate-900">{selectedStudent.name}</h2>
              <div className="flex flex-wrap items-center gap-3 mt-1">
                <span className="text-xs text-slate-500 font-mono">{selectedStudent.admNo}</span>
                <span className="text-slate-300">·</span>
                <span className="text-xs text-slate-500">{selectedStudent.class} – Section {selectedStudent.section}</span>
                <span className="text-slate-300">·</span>
                <span className="text-xs text-slate-500">Roll No: {selectedStudent.rollNo}</span>
              </div>
            </div>
          </div>
          <Select
            value={selectedStudent.id}
            onChange={id => setSelectedStudent(students.find(s => s.id === id) || students[0])}
            options={students.map(s => ({ value: s.id, label: s.name }))}
            className="w-full md:w-52"
          />
        </div>
      </Card>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="md:col-span-1">
          <div className="bg-indigo-600 rounded-xl p-5 text-white text-center shadow-sm">
            <p className="text-3xl font-800">{overallPct}%</p>
            <p className="text-indigo-200 text-xs mt-1 font-600">Overall Attendance</p>
            <div className="mt-3 h-1.5 bg-indigo-700 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full" style={{ width: `${overallPct}%` }} />
            </div>
          </div>
        </div>
        <StatCard label="Total Present" value={totalPresent} sub={`of ${totalWorkingDays} days`} icon={<CheckCircle size={18} />} color="emerald" />
        <StatCard label="Total Absent" value={totalAbsent} icon={<XCircle size={18} />} color="red" />
        <StatCard label="Total Late" value={totalLate} icon={<Clock size={18} />} color="amber" />
        <StatCard label="Total Leave" value={totalLeave} icon={<Calendar size={18} />} color="purple" />
      </div>

      {/* Tabs */}
      <Tabs
        tabs={[
          { id: 'daily', label: 'Daily View' },
          { id: 'monthly', label: 'Monthly View' },
          { id: 'annual', label: 'Annual View' },
        ]}
        active={tab}
        onChange={setTab}
      />

      {/* Daily View */}
      {tab === 'daily' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-700 text-slate-900">January 2025</h3>
              <div className="flex items-center gap-1">
                <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500"><ChevronLeft size={14} /></button>
                <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500"><ChevronRight size={14} /></button>
              </div>
            </div>
            <div className="grid grid-cols-7 mb-1">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                <div key={d} className="text-center text-[10px] font-700 text-slate-400 py-1">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {cells.map((cell, i) => {
                if (!cell) return <div key={i} />
                const isSelected = selectedDate === String(cell.day)
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedDate(String(cell.day))}
                    className={`aspect-square rounded-lg flex items-center justify-center text-[11px] font-600 transition-all cursor-pointer ${
                      cell.status === 'weekend' ? 'text-slate-300' : isSelected ? 'ring-2 ring-indigo-500 ring-offset-1' : 'hover:opacity-80'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center ${statusColor[cell.status]} ${cell.status === 'weekend' ? '' : 'text-white'}`}>
                      {cell.day}
                    </div>
                  </button>
                )
              })}
            </div>
            {/* Legend */}
            <div className="mt-4 flex flex-wrap gap-3">
              {[{ color: 'bg-emerald-500', label: 'Present' }, { color: 'bg-red-400', label: 'Absent' }, { color: 'bg-amber-400', label: 'Late' }, { color: 'bg-purple-400', label: 'Leave' }, { color: 'bg-blue-300', label: 'Holiday' }].map(l => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <div className={`w-2.5 h-2.5 rounded-full ${l.color}`} />
                  <span className="text-xs text-slate-500">{l.label}</span>
                </div>
              ))}
            </div>
          </Card>

          <div className="space-y-4">
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-700 text-slate-900">Jan {selectedDate}, 2025</h3>
                <Badge variant={statusBadge[dayStatus[selectedDate] || 'present'] || 'success'}>
                  {dayStatus[selectedDate] || 'Present'}
                </Badge>
              </div>
              <div className="space-y-2">
                {periodStatus.map(p => (
                  <div key={p.period} className="flex items-center gap-3 py-1.5 border-b border-slate-50 last:border-0">
                    <span className="text-xs font-700 text-slate-400 w-16">P{p.period}</span>
                    <div className="flex items-center gap-2 flex-1">
                      <BookOpen size={11} className="text-slate-400" />
                      <span className="text-xs text-slate-700">{p.subject}</span>
                    </div>
                    <Badge variant={statusBadge[p.status] || 'success'}>
                      {p.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Monthly View */}
      {tab === 'monthly' && (
        <div className="space-y-5">
          <Card>
            <div className="flex items-center gap-4 mb-4">
              <Select
                value={month}
                onChange={setMonth}
                options={['April 2024', 'May 2024', 'June 2024', 'July 2024', 'August 2024', 'September 2024', 'October 2024', 'November 2024', 'December 2024', 'January 2025', 'February 2025', 'March 2025'].map(m => ({ value: m, label: m }))}
                className="w-48"
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Monthly Attendance', value: '88%', color: 'text-indigo-600' },
                { label: 'Present', value: '23', color: 'text-emerald-600' },
                { label: 'Absent', value: '2', color: 'text-red-600' },
                { label: 'Late', value: '1', color: 'text-amber-600' },
              ].map(s => (
                <div key={s.label} className="text-center p-4 bg-slate-50 rounded-xl">
                  <p className={`text-2xl font-800 ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-slate-500 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card padding={false}>
            <div className="p-5 pb-3">
              <h3 className="text-sm font-700 text-slate-900">Subject-wise Attendance</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="erp-table">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Present</th>
                    <th>Absent</th>
                    <th>Late</th>
                    <th>Total Classes</th>
                    <th>Attendance %</th>
                  </tr>
                </thead>
                <tbody>
                  {subjectAttendance.map(s => (
                    <tr key={s.subject}>
                      <td className="text-sm font-600 text-slate-700">{s.subject}</td>
                      <td className="text-sm text-emerald-600 font-600">{s.present}</td>
                      <td className="text-sm text-red-600 font-600">{s.absent}</td>
                      <td className="text-sm text-amber-600 font-600">{s.late}</td>
                      <td className="text-sm text-slate-600">{s.total}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${s.pct >= 90 ? 'bg-emerald-500' : s.pct >= 75 ? 'bg-indigo-500' : 'bg-amber-500'}`} style={{ width: `${s.pct}%` }} />
                          </div>
                          <span className={`text-xs font-700 w-8 ${s.pct >= 90 ? 'text-emerald-600' : s.pct >= 75 ? 'text-indigo-600' : 'text-amber-600'}`}>{s.pct}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Annual View */}
      {tab === 'annual' && (
        <div className="space-y-5">
          <div className="flex items-center gap-4">
            <Select
              value={ay}
              onChange={setAy}
              options={['2024-25', '2023-24', '2022-23'].map(y => ({ value: y, label: y }))}
              className="w-36"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-xl p-5 text-white text-center">
              <p className="text-4xl font-800">{overallPct}%</p>
              <p className="text-indigo-200 text-xs mt-1">Annual Attendance</p>
            </div>
            <StatCard label="Total Present" value={totalPresent} icon={<CheckCircle size={18} />} color="emerald" />
            <StatCard label="Total Absent" value={totalAbsent} icon={<XCircle size={18} />} color="red" />
            <StatCard label="Total Late" value={totalLate} icon={<Clock size={18} />} color="amber" />
            <StatCard label="Total Leave" value={totalLeave} icon={<Calendar size={18} />} color="purple" />
          </div>

          <Card padding={false}>
            <div className="p-5 pb-0">
              <h3 className="text-sm font-700 text-slate-900 mb-1">Monthly Attendance Trend</h3>
              <p className="text-xs text-slate-500">Academic Year 2024–25</p>
            </div>
            <div className="px-4 pb-5 mt-2">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={monthlyAttendance} barSize={28}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: '#0f172a', border: 'none', borderRadius: 8, padding: '8px 12px' }}
                    labelStyle={{ color: '#94a3b8', fontSize: 11 }}
                    itemStyle={{ color: '#f8fafc', fontSize: 12 }}
                  />
                  <Bar dataKey="present" name="Present" fill="#4f46e5" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="absent" name="Absent" fill="#fca5a5" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card padding={false}>
            <div className="p-5 pb-3">
              <h3 className="text-sm font-700 text-slate-900">Subject-wise Annual Summary</h3>
            </div>
            <div className="px-5 pb-5 space-y-3">
              {subjectAttendance.map(s => (
                <div key={s.subject} className="flex items-center gap-4">
                  <span className="text-xs font-600 text-slate-700 w-32 truncate">{s.subject}</span>
                  <div className="flex-1">
                    <ProgressBar value={s.pct} showLabel />
                  </div>
                  <span className="text-xs text-slate-500 w-20 text-right">{s.present}/{s.total} classes</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
