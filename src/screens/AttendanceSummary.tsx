import { useState } from 'react'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import { Download, Filter, TrendingUp, AlertTriangle, Users, UserCheck } from 'lucide-react'
import { Card, StatCard, Select, Button, Tabs, Badge, PageHeader, ProgressBar, Avatar } from '../components/ui'
import { classAttendanceSummary, weeklyAttendanceTrend, monthlyAttendance, teachers, students } from '../data/mockData'

const pctDistribution = [
  { range: '90–100%', count: 68, color: '#059669' },
  { range: '75–89%', count: 124, color: '#4f46e5' },
  { range: '60–74%', count: 43, color: '#d97706' },
  { range: '<60%', count: 12, color: '#dc2626' },
]

const teacherAttSummary = [
  { month: 'Apr', pct: 96 }, { month: 'May', pct: 94 }, { month: 'Jun', pct: 97 },
  { month: 'Jul', pct: 93 }, { month: 'Aug', pct: 91 }, { month: 'Sep', pct: 95 },
  { month: 'Oct', pct: 94 }, { month: 'Nov', pct: 88 }, { month: 'Dec', pct: 92 },
  { month: 'Jan', pct: 89 }, { month: 'Feb', pct: 95 }, { month: 'Mar', pct: 97 },
]

export default function AttendanceSummary() {
  const [tab, setTab] = useState('students')
  const [filterClass, setFilterClass] = useState('All')
  const [filterAy, setFilterAy] = useState('2024-25')

  return (
    <div className="space-y-5">
      <PageHeader
        breadcrumb={['Attendance', 'Attendance Summary']}
        title="Attendance Summary"
        subtitle="School-wide attendance overview and analysis"
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" size="sm">
              <Download size={13} /> Export PDF
            </Button>
            <Button variant="secondary" size="sm">
              <Download size={13} /> Export Excel
            </Button>
          </div>
        }
      />

      <Tabs
        tabs={[
          { id: 'students', label: 'Student Summary' },
          { id: 'teachers', label: 'Teacher Summary' },
        ]}
        active={tab}
        onChange={setTab}
      />

      {tab === 'students' && (
        <div className="space-y-5">
          {/* KPI */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Total Students" value="1,347" sub="2024–25" icon={<Users size={18} />} color="indigo" />
            <StatCard label="Present Today" value="1,195" sub="88.7%" icon={<UserCheck size={18} />} color="emerald" />
            <StatCard label="Avg Attendance" value="89.3%" sub="This year" icon={<TrendingUp size={18} />} color="blue" />
            <StatCard label="Low Attendance" value="12" sub="Below 60%" icon={<AlertTriangle size={18} />} color="red" />
          </div>

          {/* Filters */}
          <Card>
            <div className="flex flex-wrap items-end gap-4">
              <Select
                label="Academic Year"
                value={filterAy}
                onChange={setFilterAy}
                options={['2024-25', '2023-24'].map(y => ({ value: y, label: y }))}
                className="w-36"
              />
              <Select
                label="Class"
                value={filterClass}
                onChange={setFilterClass}
                options={[{ value: 'All', label: 'All Classes' }, ...['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'].map(c => ({ value: c, label: c }))]}
                className="w-36"
              />
              <Select
                label="Section"
                value="All"
                onChange={() => {}}
                options={[{ value: 'All', label: 'All Sections' }, ...['A', 'B', 'C', 'D'].map(s => ({ value: s, label: `Section ${s}` }))]}
                className="w-36"
              />
              <div className="flex-1 flex justify-end">
                <Button variant="primary" size="sm">
                  <Filter size={13} /> Apply Filters
                </Button>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Class-wise */}
            <Card className="lg:col-span-2" padding={false}>
              <div className="p-5 pb-3">
                <h3 className="text-sm font-700 text-slate-900">Class-wise Attendance Summary</h3>
                <p className="text-xs text-slate-500 mt-0.5">Today – January 20, 2025</p>
              </div>
              <div className="overflow-x-auto">
                <table className="erp-table">
                  <thead>
                    <tr>
                      <th>Class</th>
                      <th>Total</th>
                      <th>Present</th>
                      <th>Absent</th>
                      <th>Attendance %</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classAttendanceSummary.map((c, i) => (
                      <tr key={i}>
                        <td>
                          <span className="text-xs font-700 text-slate-800">{c.class} – {c.section}</span>
                        </td>
                        <td className="text-sm text-slate-600">{c.total}</td>
                        <td className="text-sm text-emerald-600 font-600">{c.present}</td>
                        <td className="text-sm text-red-600 font-600">{c.absent}</td>
                        <td>
                          <div className="flex items-center gap-2 min-w-32">
                            <div className="flex-1">
                              <ProgressBar value={c.pct} />
                            </div>
                            <span className={`text-xs font-700 w-8 ${c.pct >= 90 ? 'text-emerald-600' : c.pct >= 75 ? 'text-indigo-600' : 'text-amber-600'}`}>{c.pct}%</span>
                          </div>
                        </td>
                        <td>
                          <Badge variant={c.pct >= 90 ? 'success' : c.pct >= 75 ? 'indigo' : 'warning'}>
                            {c.pct >= 90 ? 'Excellent' : c.pct >= 75 ? 'Good' : 'Low'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Distribution */}
            <Card>
              <h3 className="text-sm font-700 text-slate-900 mb-4">Attendance Distribution</h3>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={pctDistribution} cx="50%" cy="50%" outerRadius={72} paddingAngle={3} dataKey="count">
                    {pctDistribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: '#0f172a', border: 'none', borderRadius: 8 }}
                    itemStyle={{ color: '#f8fafc', fontSize: 12 }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {pctDistribution.map(d => (
                  <div key={d.range} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                      <span className="text-xs text-slate-600">{d.range}</span>
                    </div>
                    <span className="text-xs font-700 text-slate-900">{d.count} students</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Trend charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Card padding={false}>
              <div className="p-5 pb-0">
                <h3 className="text-sm font-700 text-slate-900">Weekly Attendance Trend</h3>
              </div>
              <div className="px-4 pb-5 mt-2">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={weeklyAttendanceTrend} barSize={28}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: '#0f172a', border: 'none', borderRadius: 8 }} itemStyle={{ color: '#f8fafc', fontSize: 12 }} />
                    <Bar dataKey="present" name="Present" fill="#4f46e5" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="absent" name="Absent" fill="#fca5a5" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card padding={false}>
              <div className="p-5 pb-0">
                <h3 className="text-sm font-700 text-slate-900">Monthly Percentage Trend</h3>
              </div>
              <div className="px-4 pb-5 mt-2">
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={monthlyAttendance}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: '#0f172a', border: 'none', borderRadius: 8 }} itemStyle={{ color: '#f8fafc', fontSize: 12 }} formatter={(v: unknown) => [`${v}%`, 'Attendance']} />
                    <Line type="monotone" dataKey="pct" stroke="#059669" strokeWidth={2.5} dot={{ fill: '#059669', r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Low attendance students */}
          <Card padding={false}>
            <div className="p-5 pb-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-700 text-slate-900">Low Attendance Students</h3>
                <Badge variant="danger"><AlertTriangle size={9} /> 12 students below 60%</Badge>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="erp-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Class</th>
                    <th>Present</th>
                    <th>Absent</th>
                    <th>Attendance %</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {students.filter(s => s.attendance < 80).map(s => (
                    <tr key={s.id}>
                      <td>
                        <div className="flex items-center gap-2">
                          <Avatar name={s.name} size="sm" />
                          <div>
                            <p className="text-xs font-600 text-slate-800">{s.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono">{s.admNo}</p>
                          </div>
                        </div>
                      </td>
                      <td className="text-xs text-slate-600">{s.class} – {s.section}</td>
                      <td className="text-sm text-emerald-600 font-600">{Math.round(s.attendance * 2.2)}</td>
                      <td className="text-sm text-red-600 font-600">{Math.round((100 - s.attendance) * 0.5)}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${s.attendance >= 75 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${s.attendance}%` }} />
                          </div>
                          <span className={`text-xs font-700 ${s.attendance >= 75 ? 'text-amber-600' : 'text-red-600'}`}>{s.attendance}%</span>
                        </div>
                      </td>
                      <td>
                        <Button variant="ghost" size="sm">View Details</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {tab === 'teachers' && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Total Teachers" value="68" icon={<Users size={18} />} color="indigo" />
            <StatCard label="Present Today" value="61" sub="89.7%" icon={<UserCheck size={18} />} color="emerald" />
            <StatCard label="Absent Today" value="4" icon={<AlertTriangle size={18} />} color="red" />
            <StatCard label="On Leave" value="3" icon={<Users size={18} />} color="purple" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Card padding={false}>
              <div className="p-5 pb-0">
                <h3 className="text-sm font-700 text-slate-900">Monthly Attendance %</h3>
              </div>
              <div className="px-4 pb-5 mt-2">
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={teacherAttSummary}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis domain={[80, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: '#0f172a', border: 'none', borderRadius: 8 }} itemStyle={{ color: '#f8fafc', fontSize: 12 }} formatter={(v: unknown) => [`${v}%`, 'Attendance']} />
                    <Line type="monotone" dataKey="pct" stroke="#4f46e5" strokeWidth={2.5} dot={{ fill: '#4f46e5', r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card>
              <h3 className="text-sm font-700 text-slate-900 mb-4">Department Summary</h3>
              <div className="space-y-3">
                {[
                  { dept: 'Science', total: 22, present: 20, pct: 91 },
                  { dept: 'Languages', total: 18, present: 16, pct: 89 },
                  { dept: 'Mathematics', total: 12, present: 11, pct: 92 },
                  { dept: 'Social Science', total: 10, present: 9, pct: 90 },
                  { dept: 'Technology', total: 6, present: 5, pct: 83 },
                ].map(d => (
                  <div key={d.dept} className="flex items-center gap-3">
                    <span className="text-xs font-600 text-slate-700 w-24 truncate">{d.dept}</span>
                    <div className="flex-1">
                      <ProgressBar value={d.pct} showLabel />
                    </div>
                    <span className="text-xs text-slate-400 w-14 text-right">{d.present}/{d.total}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <Card padding={false}>
            <div className="p-5 pb-3">
              <h3 className="text-sm font-700 text-slate-900">Teacher Attendance Today</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="erp-table">
                <thead>
                  <tr>
                    <th>Teacher</th>
                    <th>Department</th>
                    <th>Status</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                    <th>Monthly %</th>
                    <th>Late Count</th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.map((t, i) => {
                    const statuses = ['present', 'present', 'present', 'late', 'leave', 'absent', 'present', 'present']
                    const st = statuses[i % statuses.length]
                    const pcts = [96, 92, 98, 87, 94, 78, 95, 91]
                    const lateCounts = [0, 2, 0, 3, 1, 0, 0, 1]
                    return (
                      <tr key={t.id}>
                        <td>
                          <div className="flex items-center gap-2">
                            <Avatar name={t.name} size="sm" />
                            <div>
                              <p className="text-xs font-600 text-slate-800">{t.name}</p>
                              <p className="text-[10px] text-slate-400">{t.subject}</p>
                            </div>
                          </div>
                        </td>
                        <td><span className="text-xs text-slate-600">{t.department}</span></td>
                        <td>
                          <Badge variant={st === 'present' ? 'success' : st === 'absent' ? 'danger' : st === 'late' ? 'warning' : 'purple'}>
                            {st}
                          </Badge>
                        </td>
                        <td><span className="font-mono text-xs text-slate-600">{st === 'present' ? '07:58' : st === 'late' ? '08:20' : '—'}</span></td>
                        <td><span className="font-mono text-xs text-slate-600">{st === 'present' || st === 'late' ? '16:00' : '—'}</span></td>
                        <td>
                          <div className="flex items-center gap-2">
                            <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${pcts[i % pcts.length]}%` }} />
                            </div>
                            <span className="text-xs font-700 text-slate-700">{pcts[i % pcts.length]}%</span>
                          </div>
                        </td>
                        <td>
                          {lateCounts[i % lateCounts.length] > 0 ? (
                            <Badge variant="warning">{lateCounts[i % lateCounts.length]}x</Badge>
                          ) : (
                            <span className="text-xs text-slate-400">—</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
