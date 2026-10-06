import { useState } from 'react'
import { Plus, Edit2, Trash2, AlertTriangle } from 'lucide-react'
import { Card, Button, Select, Tabs, Modal, Input, PageHeader } from '../components/ui'
import { timetableData, periodTimings, teachers, subjects, classes, sections, academicYears, days } from '../data/mockData'

const subjectColors: Record<string, string> = {
  Mathematics: 'bg-indigo-50 border-indigo-200 text-indigo-800',
  Physics: 'bg-blue-50 border-blue-200 text-blue-800',
  Chemistry: 'bg-purple-50 border-purple-200 text-purple-800',
  English: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  Hindi: 'bg-amber-50 border-amber-200 text-amber-800',
  'Social Studies': 'bg-orange-50 border-orange-200 text-orange-800',
  Biology: 'bg-green-50 border-green-200 text-green-800',
  'Computer Science': 'bg-cyan-50 border-cyan-200 text-cyan-800',
  'Physical Education': 'bg-rose-50 border-rose-200 text-rose-800',
}

const getSubjectColor = (subj: string) => subjectColors[subj] || 'bg-slate-50 border-slate-200 text-slate-800'

const conflicts = [
  { type: 'Teacher Conflict', message: 'Mr. Suresh Patel assigned to Class 10A and Class 9B during Monday Period 4', severity: 'error' },
  { type: 'Room Conflict', message: 'Lab 201 assigned to Class 10A and Class 8C during Wednesday Period 3', severity: 'warning' },
]

export default function Timetable() {
  const [tab, setTab] = useState('class')
  const [ay, setAy] = useState('2024-25')
  const [cls, setCls] = useState('Class 10')
  const [sec, setSec] = useState('A')
  const [selectedTeacher, setSelectedTeacher] = useState('Mrs. Priya Sharma')
  const [activeDay, setActiveDay] = useState('Monday')
  const [showAddModal, setShowAddModal] = useState(false)
  const [newEntry, setNewEntry] = useState({ period: '1', subject: 'Mathematics', teacher: teachers[0].name, room: 'Room 101', day: 'Monday' })
  const [showConflicts, setShowConflicts] = useState(true)

  const dayPeriods = timetableData[activeDay] || []

  // Teacher timetable (weekly grid)

  return (
    <div className="space-y-5">
      <PageHeader
        breadcrumb={['Timetable']}
        title="Timetable Management"
        subtitle="Manage class and teacher timetables"
        actions={
          <Button variant="primary" onClick={() => setShowAddModal(true)}>
            <Plus size={13} /> Add Entry
          </Button>
        }
      />

      {/* Conflict alerts */}
      {showConflicts && conflicts.length > 0 && (
        <div className="space-y-2">
          {conflicts.map((c, i) => (
            <div key={i} className={`flex items-start gap-3 p-4 rounded-xl border ${c.severity === 'error' ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'}`}>
              <AlertTriangle size={15} className={c.severity === 'error' ? 'text-red-500' : 'text-amber-500'} />
              <div className="flex-1">
                <p className={`text-xs font-700 ${c.severity === 'error' ? 'text-red-700' : 'text-amber-700'}`}>{c.type}</p>
                <p className={`text-xs mt-0.5 ${c.severity === 'error' ? 'text-red-600' : 'text-amber-600'}`}>{c.message}</p>
              </div>
              <button onClick={() => setShowConflicts(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
          ))}
        </div>
      )}

      <Tabs
        tabs={[
          { id: 'class', label: 'Class Timetable' },
          { id: 'teacher', label: 'Teacher Timetable' },
          { id: 'overview', label: 'School Overview' },
        ]}
        active={tab}
        onChange={setTab}
      />

      {/* Filters */}
      <Card>
        <div className="flex flex-wrap items-end gap-4">
          <Select
            label="Academic Year"
            value={ay}
            onChange={setAy}
            options={academicYears.map(y => ({ value: y, label: y }))}
            className="w-32"
          />
          {tab !== 'teacher' && (
            <>
              <Select label="Class" value={cls} onChange={setCls} options={classes.map(c => ({ value: c, label: c }))} className="w-32" />
              <Select label="Section" value={sec} onChange={setSec} options={sections.map(s => ({ value: s, label: `Section ${s}` }))} className="w-32" />
            </>
          )}
          {tab === 'teacher' && (
            <Select
              label="Teacher"
              value={selectedTeacher}
              onChange={setSelectedTeacher}
              options={teachers.map(t => ({ value: t.name, label: t.name }))}
              className="w-52"
            />
          )}
        </div>
      </Card>

      {/* Class Timetable */}
      {tab === 'class' && (
        <div className="space-y-4">
          {/* Day tabs */}
          <div className="flex gap-1 flex-wrap">
            {days.map(d => (
              <button
                key={d}
                onClick={() => setActiveDay(d)}
                className={`px-4 py-2 rounded-lg text-sm font-600 transition-all cursor-pointer ${
                  activeDay === d ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {d.slice(0, 3)}
              </button>
            ))}
          </div>

          <div className="text-sm font-600 text-slate-500">{cls} – Section {sec} · {activeDay}</div>

          <div className="grid grid-cols-1 gap-2">
            {/* Period timing header */}
            <div className="grid gap-2" style={{ gridTemplateColumns: '80px repeat(8, 1fr)' }}>
              <div className="text-[10px] font-700 text-slate-400 uppercase flex items-end pb-1">Period</div>
              {periodTimings.map(t => (
                <div key={t.period} className="text-center">
                  <div className="text-[10px] font-700 text-slate-500">P{t.period}</div>
                  <div className="text-[9px] text-slate-400 font-mono">{t.start}–{t.end}</div>
                  {(t.period === 4 || t.period === 6) && (
                    <div className="text-[9px] text-blue-500 font-600">{t.period === 4 ? 'Break' : 'Lunch'}</div>
                  )}
                </div>
              ))}
            </div>

            {/* The actual grid for the day */}
            <Card padding={false}>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px]">
                  <tbody>
                    {['Subject', 'Teacher', 'Room'].map(row => (
                      <tr key={row} className="border-b border-slate-100 last:border-0">
                        <td className="px-4 py-3 text-[10px] font-700 text-slate-400 uppercase w-20 whitespace-nowrap">{row}</td>
                        {periodTimings.map(t => {
                          const entry = dayPeriods.find(p => p.period === t.period)
                          return (
                            <td key={t.period} className="px-2 py-2 text-center">
                              {entry ? (
                                <div>
                                  {row === 'Subject' && (
                                    <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-600 border ${getSubjectColor(entry.subject)}`}>
                                      {entry.subject}
                                    </span>
                                  )}
                                  {row === 'Teacher' && <span className="text-[11px] text-slate-600">{entry.teacher.split(' ').slice(-1)[0]}</span>}
                                  {row === 'Room' && <span className="text-[10px] text-slate-400 font-mono">{entry.room}</span>}
                                </div>
                              ) : (
                                <span className="text-slate-300 text-xs">—</span>
                              )}
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Card view */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
              {dayPeriods.map(p => {
                const timing = periodTimings[p.period - 1]
                return (
                  <div key={p.period} className={`border rounded-xl p-3 ${getSubjectColor(p.subject)}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-700 uppercase opacity-60">Period {p.period}</span>
                      <div className="flex gap-1">
                        <button className="w-5 h-5 flex items-center justify-center rounded hover:bg-white/50 text-current opacity-60 hover:opacity-100 transition-opacity">
                          <Edit2 size={9} />
                        </button>
                        <button className="w-5 h-5 flex items-center justify-center rounded hover:bg-white/50 text-current opacity-60 hover:opacity-100 transition-opacity">
                          <Trash2 size={9} />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm font-700 leading-tight">{p.subject}</p>
                    <p className="text-[11px] opacity-70 mt-0.5">{p.teacher}</p>
                    <p className="text-[10px] opacity-50 mt-0.5 font-mono">{timing?.start} – {timing?.end}</p>
                    <p className="text-[10px] opacity-50">{p.room}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Teacher Timetable */}
      {tab === 'teacher' && (
        <div className="space-y-4">
          <Card>
            <h3 className="text-sm font-700 text-slate-900 mb-1">{selectedTeacher}</h3>
            <p className="text-xs text-slate-500 mb-4">Weekly schedule overview</p>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-xs">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left py-2 px-3 text-[10px] font-700 text-slate-400 uppercase w-24">Period</th>
                    {days.map(d => (
                      <th key={d} className="text-center py-2 px-2 text-[10px] font-700 text-slate-400 uppercase">{d.slice(0, 3)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {periodTimings.map(t => (
                    <tr key={t.period} className="border-b border-slate-50">
                      <td className="py-2 px-3">
                        <div className="text-[11px] font-700 text-slate-600">P{t.period}</div>
                        <div className="text-[9px] text-slate-400 font-mono">{t.start}–{t.end}</div>
                      </td>
                      {days.map(d => {
                        const entry = (timetableData[d] || []).find(p => p.period === t.period)
                        // Show only some periods for teacher (simulated)
                        const shows = t.period % 3 === 0 || t.period === 1 || t.period === 5
                        return (
                          <td key={d} className="py-1.5 px-1 text-center">
                            {entry && shows ? (
                              <div className={`rounded-lg p-1.5 border ${getSubjectColor(entry.subject)}`}>
                                <p className="text-[10px] font-700">{entry.subject.split(' ')[0]}</p>
                                <p className="text-[9px] opacity-60">10 A</p>
                                <p className="text-[9px] opacity-50 font-mono">{entry.room}</p>
                              </div>
                            ) : (
                              <div className="text-slate-200 text-sm">—</div>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* School Overview */}
      {tab === 'overview' && (
        <Card padding={false}>
          <div className="p-5 pb-3">
            <h3 className="text-sm font-700 text-slate-900">School Timetable Overview</h3>
            <p className="text-xs text-slate-500 mt-0.5">All classes – Monday schedule</p>
          </div>
          <div className="overflow-x-auto">
            <table className="erp-table">
              <thead>
                <tr>
                  <th>Class</th>
                  {periodTimings.map(t => <th key={t.period}>P{t.period} <span className="font-400 text-slate-400">({t.start})</span></th>)}
                </tr>
              </thead>
              <tbody>
                {['Class 9 A', 'Class 10 A', 'Class 10 B', 'Class 11 A', 'Class 12 A'].map((c, ci) => (
                  <tr key={c}>
                    <td className="font-600 text-xs text-slate-700 whitespace-nowrap">{c}</td>
                    {periodTimings.map(t => {
                      const subjects = ['Mathematics', 'Physics', 'English', 'Chemistry', 'Hindi', 'Social Studies', 'Biology', 'Computer Science']
                      const subj = subjects[(t.period + ci) % subjects.length]
                      return (
                        <td key={t.period}>
                          <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-600 border whitespace-nowrap ${getSubjectColor(subj)}`}>
                            {subj.split(' ')[0]}
                          </span>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Add entry modal */}
      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="Add Timetable Entry">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Day"
              value={newEntry.day}
              onChange={v => setNewEntry(p => ({ ...p, day: v }))}
              options={days.map(d => ({ value: d, label: d }))}
            />
            <Select
              label="Period"
              value={newEntry.period}
              onChange={v => setNewEntry(p => ({ ...p, period: v }))}
              options={periodTimings.map(t => ({ value: String(t.period), label: `Period ${t.period} (${t.start}–${t.end})` }))}
            />
          </div>
          <Select
            label="Subject"
            value={newEntry.subject}
            onChange={v => setNewEntry(p => ({ ...p, subject: v }))}
            options={subjects.map(s => ({ value: s, label: s }))}
          />
          <Select
            label="Teacher"
            value={newEntry.teacher}
            onChange={v => setNewEntry(p => ({ ...p, teacher: v }))}
            options={teachers.map(t => ({ value: t.name, label: t.name }))}
          />
          <Input label="Room / Classroom" value={newEntry.room} onChange={v => setNewEntry(p => ({ ...p, room: v }))} placeholder="e.g., Room 101, Lab 201" />
          <div className="flex gap-2 justify-end pt-2">
            <Button variant="ghost" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => setShowAddModal(false)}>
              <Plus size={13} /> Add Entry
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
