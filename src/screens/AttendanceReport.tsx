import { useState } from 'react'
import { Download, Filter, Search, Eye, AlertCircle, CheckCircle, XCircle } from 'lucide-react'
import { Card, Select, Button, Badge, PageHeader, Input, Avatar } from '../components/ui'
import { students, classAttendanceSummary, subjects, teachers } from '../data/mockData'

const attendanceStatuses = ['All', 'Present', 'Absent', 'Late', 'Leave']

export default function AttendanceReport() {
  const [filterClass, setFilterClass] = useState('All')
  const [filterSection, setFilterSection] = useState('All')
  const [filterSubject, setFilterSubject] = useState('All')
  const [filterStatus, setFilterStatus] = useState('All')
  const [filterTeacher, setFilterTeacher] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [dateFrom, setDateFrom] = useState('2025-01-01')
  const [dateTo, setDateTo] = useState('2025-01-20')

  const filtered = students.filter(s => {
    if (filterClass !== 'All' && s.class !== filterClass) return false
    if (searchQuery && !s.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const pendingClasses = [
    { class: 'Class 9 B', period: 'Period 3', subject: 'Chemistry', teacher: 'Mr. Suresh Patel', time: '10:30 AM' },
    { class: 'Class 8 A', period: 'Period 5', subject: 'Hindi', teacher: 'Mrs. Meena Joshi', time: '11:15 AM' },
    { class: 'Class 7 C', period: 'Period 6', subject: 'Social Studies', teacher: 'Mr. Amit Singh', time: '1:00 PM' },
    { class: 'Class 11 B', period: 'Period 7', subject: 'Biology', teacher: 'Mrs. Kavita Rao', time: '1:45 PM' },
  ]

  return (
    <div className="space-y-5">
      <PageHeader
        breadcrumb={['Attendance', 'Attendance Reports']}
        title="Attendance Reports"
        subtitle="Class-wise attendance checking and reporting"
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" size="sm">
              <Download size={13} /> PDF
            </Button>
            <Button variant="secondary" size="sm">
              <Download size={13} /> Excel
            </Button>
          </div>
        }
      />

      {/* Pending attendance */}
      {pendingClasses.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle size={15} className="text-amber-500" />
            <p className="text-sm font-700 text-amber-800">Attendance Not Submitted – {pendingClasses.length} classes pending</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {pendingClasses.map((p, i) => (
              <div key={i} className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-amber-100">
                <div>
                  <p className="text-xs font-600 text-slate-800">{p.class} – {p.period}</p>
                  <p className="text-[10px] text-slate-500">{p.subject} · {p.teacher}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-amber-600 font-600">{p.time}</span>
                  <Button variant="warning" size="sm">Mark Now</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
          <div className="lg:col-span-2">
            <label className="block text-xs font-600 text-slate-600 mb-1">Search Student</label>
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Student name..."
                className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-300 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <Select
            label="Class"
            value={filterClass}
            onChange={setFilterClass}
            options={[{ value: 'All', label: 'All Classes' }, ...['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'].map(c => ({ value: c, label: c }))]}
          />
          <Select
            label="Section"
            value={filterSection}
            onChange={setFilterSection}
            options={[{ value: 'All', label: 'All Sections' }, ...['A', 'B', 'C', 'D'].map(s => ({ value: s, label: `Section ${s}` }))]}
          />
          <Select
            label="Subject"
            value={filterSubject}
            onChange={setFilterSubject}
            options={[{ value: 'All', label: 'All Subjects' }, ...subjects.slice(0, 8).map(s => ({ value: s, label: s }))]}
          />
          <Select
            label="Status"
            value={filterStatus}
            onChange={setFilterStatus}
            options={attendanceStatuses.map(s => ({ value: s, label: s }))}
          />
        </div>
        <div className="flex flex-wrap items-end gap-4 pt-3 border-t border-slate-100">
          <Input type="date" label="From Date" value={dateFrom} onChange={setDateFrom} className="w-36" />
          <Input type="date" label="To Date" value={dateTo} onChange={setDateTo} className="w-36" />
          <Select
            label="Teacher"
            value={filterTeacher}
            onChange={setFilterTeacher}
            options={[{ value: 'All', label: 'All Teachers' }, ...teachers.map(t => ({ value: t.id, label: t.name }))]}
            className="w-48"
          />
          <Button variant="primary" size="sm" className="mb-0.5">
            <Filter size={13} /> Apply Filters
          </Button>
        </div>
      </Card>

      {/* Class summary */}
      <Card padding={false}>
        <div className="p-5 pb-3">
          <h3 className="text-sm font-700 text-slate-900">Class-wise Attendance Status</h3>
          <p className="text-xs text-slate-500 mt-0.5">January 1–20, 2025</p>
        </div>
        <div className="overflow-x-auto">
          <table className="erp-table">
            <thead>
              <tr>
                <th>Class</th>
                <th>Section</th>
                <th>Total Students</th>
                <th>Working Days</th>
                <th>Avg Attendance</th>
                <th>Present</th>
                <th>Absent</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {classAttendanceSummary.map((c, i) => (
                <tr key={i}>
                  <td className="text-xs font-700 text-slate-800">{c.class}</td>
                  <td className="text-xs text-slate-600">{c.section}</td>
                  <td className="text-sm text-slate-700">{c.total}</td>
                  <td className="text-sm text-slate-700">20</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${c.pct >= 90 ? 'bg-emerald-500' : c.pct >= 75 ? 'bg-indigo-500' : 'bg-amber-500'}`} style={{ width: `${c.pct}%` }} />
                      </div>
                      <span className={`text-xs font-700 ${c.pct >= 90 ? 'text-emerald-600' : c.pct >= 75 ? 'text-indigo-600' : 'text-amber-600'}`}>{c.pct}%</span>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1 text-xs text-emerald-600 font-600">
                      <CheckCircle size={11} /> {c.present}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1 text-xs text-red-600 font-600">
                      <XCircle size={11} /> {c.absent}
                    </div>
                  </td>
                  <td>
                    <Badge variant={c.pct >= 90 ? 'success' : c.pct >= 75 ? 'indigo' : c.pct >= 60 ? 'warning' : 'danger'}>
                      {c.pct >= 90 ? 'Excellent' : c.pct >= 75 ? 'Good' : c.pct >= 60 ? 'Low' : 'Critical'}
                    </Badge>
                  </td>
                  <td>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm"><Eye size={11} /> View</Button>
                      <Button variant="ghost" size="sm"><Download size={11} /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Student-level detail */}
      <Card padding={false}>
        <div className="p-5 pb-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-700 text-slate-900">Student-wise Attendance</h3>
              <p className="text-xs text-slate-500 mt-0.5">{filtered.length} students matching filters</p>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="erp-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Admission No</th>
                <th>Class</th>
                <th>Present</th>
                <th>Absent</th>
                <th>Late</th>
                <th>Leave</th>
                <th>Attendance %</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => {
                const present = Math.round(s.attendance * 2.2)
                const absent = Math.round((100 - s.attendance) * 0.3)
                const late = Math.round((100 - s.attendance) * 0.1)
                const leave = Math.round((100 - s.attendance) * 0.15)
                return (
                  <tr key={s.id}>
                    <td>
                      <div className="flex items-center gap-2">
                        <Avatar name={s.name} size="sm" />
                        <div>
                          <p className="text-xs font-600 text-slate-800">{s.name}</p>
                          <p className="text-[10px] text-slate-400">Roll #{s.rollNo}</p>
                        </div>
                      </div>
                    </td>
                    <td><span className="font-mono text-xs text-slate-500">{s.admNo}</span></td>
                    <td className="text-xs text-slate-600">{s.class} – {s.section}</td>
                    <td className="text-xs text-emerald-600 font-600">{present}</td>
                    <td className="text-xs text-red-600 font-600">{absent}</td>
                    <td className="text-xs text-amber-600 font-600">{late}</td>
                    <td className="text-xs text-purple-600 font-600">{leave}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${s.attendance >= 90 ? 'bg-emerald-500' : s.attendance >= 75 ? 'bg-indigo-500' : s.attendance >= 60 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${s.attendance}%` }} />
                        </div>
                        <span className={`text-xs font-700 ${s.attendance >= 90 ? 'text-emerald-600' : s.attendance >= 75 ? 'text-indigo-600' : s.attendance >= 60 ? 'text-amber-600' : 'text-red-600'}`}>{s.attendance}%</span>
                      </div>
                    </td>
                    <td>
                      <Badge variant={s.attendance >= 90 ? 'success' : s.attendance >= 75 ? 'indigo' : s.attendance >= 60 ? 'warning' : 'danger'}>
                        {s.attendance >= 90 ? 'Excellent' : s.attendance >= 75 ? 'Good' : s.attendance >= 60 ? 'Low' : 'Critical'}
                      </Badge>
                    </td>
                    <td>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm"><Eye size={11} /> View</Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
