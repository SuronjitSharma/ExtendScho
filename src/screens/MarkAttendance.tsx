import { useState } from 'react'
import { CheckCircle, AlertCircle, RotateCcw, Save, Users, Clock, BookOpen } from 'lucide-react'
import { Card, Select, Button, PageHeader, Toast, Badge, Avatar } from '../components/ui'
import { students, academicYears, classes, sections, periods, subjects, periodTimings } from '../data/mockData'

type AttStatus = 'present' | 'absent' | 'late' | 'leave' | ''

interface StudentAtt {
  id: string
  name: string
  admNo: string
  rollNo: number
  status: AttStatus
}

const subjectForPeriod: Record<string, string> = {
  'Period 1': 'Mathematics',
  'Period 2': 'Physics',
  'Period 3': 'English',
  'Period 4': 'Chemistry',
  'Period 5': 'Hindi',
  'Period 6': 'Social Studies',
  'Period 7': 'Biology',
  'Period 8': 'Computer Science',
}

export default function MarkAttendance() {
  const [ay, setAy] = useState('2024-25')
  const [cls, setCls] = useState('Class 10')
  const [sec, setSec] = useState('A')
  const [date, setDate] = useState('2025-01-20')
  const [period, setPeriod] = useState('Period 1')
  const [subject, setSubject] = useState('Mathematics')
  const [saved, setSaved] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'warning' } | null>(null)
  const [showWarning, setShowWarning] = useState(false)

  const [attendance, setAttendance] = useState<StudentAtt[]>(
    students.map(s => ({ id: s.id, name: s.name, admNo: s.admNo, rollNo: s.rollNo, status: '' }))
  )

  const setStatus = (id: string, status: AttStatus) => {
    setAttendance(prev => prev.map(s => s.id === id ? { ...s, status } : s))
  }

  const markAll = (status: AttStatus) => {
    setAttendance(prev => prev.map(s => ({ ...s, status })))
  }

  const reset = () => {
    setAttendance(prev => prev.map(s => ({ ...s, status: '' })))
    setSaved(false)
  }

  const marked = attendance.filter(s => s.status !== '').length
  const total = attendance.length
  const progress = Math.round((marked / total) * 100)

  const counts = {
    present: attendance.filter(s => s.status === 'present').length,
    absent: attendance.filter(s => s.status === 'absent').length,
    late: attendance.filter(s => s.status === 'late').length,
    leave: attendance.filter(s => s.status === 'leave').length,
  }

  const handleSave = () => {
    if (marked < total) {
      setShowWarning(true)
      return
    }
    doSave()
  }

  const doSave = () => {
    setShowWarning(false)
    setSaved(true)
    setToast({ msg: `Attendance saved for ${cls} ${sec} – ${period}`, type: 'success' })
    setTimeout(() => setToast(null), 3000)
  }

  const periodIdx = parseInt(period.replace('Period ', '')) - 1
  const timing = periodTimings[periodIdx]

  return (
    <div className="space-y-5">
      <PageHeader
        breadcrumb={['Attendance', 'Mark Attendance']}
        title="Mark Attendance"
        subtitle="Period-wise student attendance marking"
      />

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Select
            label="Academic Year"
            value={ay}
            onChange={setAy}
            options={academicYears.map(y => ({ value: y, label: y }))}
          />
          <Select
            label="Class"
            value={cls}
            onChange={setCls}
            options={classes.map(c => ({ value: c, label: c }))}
          />
          <Select
            label="Section"
            value={sec}
            onChange={setSec}
            options={sections.map(s => ({ value: s, label: `Section ${s}` }))}
          />
          <div>
            <label className="block text-xs font-600 text-slate-600 mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <Select
            label="Period"
            value={period}
            onChange={v => { setPeriod(v); setSubject(subjectForPeriod[v] || 'Mathematics') }}
            options={periods.map(p => ({ value: p, label: p }))}
          />
          <Select
            label="Subject"
            value={subject}
            onChange={setSubject}
            options={subjects.map(s => ({ value: s, label: s }))}
          />
        </div>

        {/* Period info bar */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Clock size={13} className="text-indigo-500" />
            <span className="font-600">{timing?.start} – {timing?.end}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <BookOpen size={13} className="text-indigo-500" />
            <span>{subject}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Users size={13} className="text-indigo-500" />
            <span>Teacher: Mrs. Priya Sharma</span>
          </div>
          {saved && (
            <Badge variant="success" className="ml-auto">
              <CheckCircle size={10} /> Attendance Submitted
            </Badge>
          )}
        </div>
      </Card>

      {/* Progress */}
      <div className="flex items-center gap-4 bg-white rounded-xl border border-slate-200 shadow-sm p-4">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-600 text-slate-700">{marked} of {total} students marked</span>
            <span className="text-sm font-700 text-indigo-600">{progress}%</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <div className="hidden md:flex gap-4">
          {[
            { label: 'Present', count: counts.present, color: 'text-emerald-600' },
            { label: 'Absent', count: counts.absent, color: 'text-red-600' },
            { label: 'Late', count: counts.late, color: 'text-amber-600' },
            { label: 'Leave', count: counts.leave, color: 'text-purple-600' },
          ].map(c => (
            <div key={c.label} className="text-center">
              <p className={`text-lg font-800 ${c.color}`}>{c.count}</p>
              <p className="text-[10px] text-slate-400 font-600 uppercase tracking-wide">{c.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-2">
        <Button variant="success" size="sm" onClick={() => markAll('present')}>
          <CheckCircle size={13} /> Mark All Present
        </Button>
        <Button variant="danger" size="sm" onClick={() => markAll('absent')}>
          Mark All Absent
        </Button>
        <Button variant="ghost" size="sm" onClick={reset}>
          <RotateCcw size={13} /> Reset
        </Button>
        <div className="flex-1" />
        <Button variant="primary" onClick={handleSave} disabled={saved}>
          <Save size={13} /> {saved ? 'Saved' : 'Save Attendance'}
        </Button>
      </div>

      {/* Warning */}
      {showWarning && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-600 text-amber-800">Incomplete Attendance</p>
            <p className="text-xs text-amber-700 mt-0.5">{total - marked} students have not been marked. Do you want to save anyway?</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={() => setShowWarning(false)}>Cancel</Button>
            <Button size="sm" variant="warning" onClick={doSave}>Save Anyway</Button>
          </div>
        </div>
      )}

      {/* Student table */}
      <Card padding={false}>
        <div className="overflow-x-auto">
          <table className="erp-table">
            <thead>
              <tr>
                <th className="w-10">#</th>
                <th>Student</th>
                <th>Admission No</th>
                <th>Roll No</th>
                <th>Attendance</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((s, i) => (
                <tr key={s.id}>
                  <td className="text-center text-xs text-slate-400 font-mono">{i + 1}</td>
                  <td>
                    <div className="flex items-center gap-2.5">
                      <Avatar name={s.name} size="sm" />
                      <span className="text-sm font-600 text-slate-800">{s.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className="font-mono text-xs text-slate-500">{s.admNo}</span>
                  </td>
                  <td className="text-center text-sm font-600 text-slate-700">{s.rollNo}</td>
                  <td>
                    <div className="att-radio flex flex-wrap gap-1.5">
                      <div className="att-p">
                        <label>
                          <input type="radio" name={`att-${s.id}`} checked={s.status === 'present'} onChange={() => setStatus(s.id, 'present')} />
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md border text-xs font-600 cursor-pointer transition-all ${
                            s.status === 'present' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 text-slate-500 hover:border-emerald-200 hover:bg-emerald-50'
                          }`}>P</span>
                        </label>
                      </div>
                      <div className="att-a">
                        <label>
                          <input type="radio" name={`att-${s.id}`} checked={s.status === 'absent'} onChange={() => setStatus(s.id, 'absent')} />
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md border text-xs font-600 cursor-pointer transition-all ${
                            s.status === 'absent' ? 'border-red-500 bg-red-50 text-red-700' : 'border-slate-200 text-slate-500 hover:border-red-200 hover:bg-red-50'
                          }`}>A</span>
                        </label>
                      </div>
                      <div className="att-l">
                        <label>
                          <input type="radio" name={`att-${s.id}`} checked={s.status === 'late'} onChange={() => setStatus(s.id, 'late')} />
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md border text-xs font-600 cursor-pointer transition-all ${
                            s.status === 'late' ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-slate-200 text-slate-500 hover:border-amber-200 hover:bg-amber-50'
                          }`}>L</span>
                        </label>
                      </div>
                      <div className="att-lv">
                        <label>
                          <input type="radio" name={`att-${s.id}`} checked={s.status === 'leave'} onChange={() => setStatus(s.id, 'leave')} />
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md border text-xs font-600 cursor-pointer transition-all ${
                            s.status === 'leave' ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-slate-200 text-slate-500 hover:border-purple-200 hover:bg-purple-50'
                          }`}>LV</span>
                        </label>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="px-4 py-3 border-t border-slate-100 flex flex-wrap items-center gap-4 bg-slate-50 rounded-b-xl">
          {[
            { code: 'P', label: 'Present', color: 'bg-emerald-100 text-emerald-700' },
            { code: 'A', label: 'Absent', color: 'bg-red-100 text-red-700' },
            { code: 'L', label: 'Late', color: 'bg-amber-100 text-amber-700' },
            { code: 'LV', label: 'Leave', color: 'bg-purple-100 text-purple-700' },
          ].map(l => (
            <div key={l.code} className="flex items-center gap-1.5">
              <span className={`w-6 h-5 rounded flex items-center justify-center text-[10px] font-700 ${l.color}`}>{l.code}</span>
              <span className="text-xs text-slate-500">{l.label}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
