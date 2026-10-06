import { useState } from 'react'
import { CheckCircle, Clock, XCircle, AlertTriangle, LogIn, LogOut, Send, Calendar } from 'lucide-react'
import { Card, Button, Badge, Tabs, PageHeader, StatCard, Modal, Input, Select, Avatar } from '../components/ui'
import { monthlyAttendance, teachers } from '../data/mockData'

const calendarData: Record<string, { status: 'present' | 'absent' | 'leave' | 'holiday' | 'weekend'; checkIn?: string; checkOut?: string; late?: boolean }> = {
  '2025-01-01': { status: 'present', checkIn: '07:55', checkOut: '16:05' },
  '2025-01-02': { status: 'present', checkIn: '08:10', checkOut: '15:50', late: true },
  '2025-01-03': { status: 'absent' },
  '2025-01-04': { status: 'weekend' },
  '2025-01-05': { status: 'weekend' },
  '2025-01-06': { status: 'present', checkIn: '07:58', checkOut: '16:00' },
  '2025-01-07': { status: 'leave' },
  '2025-01-08': { status: 'present', checkIn: '08:00', checkOut: '16:05' },
  '2025-01-09': { status: 'present', checkIn: '08:15', checkOut: '15:45', late: true },
  '2025-01-10': { status: 'present', checkIn: '07:55', checkOut: '16:10' },
  '2025-01-11': { status: 'weekend' },
  '2025-01-12': { status: 'weekend' },
  '2025-01-13': { status: 'present', checkIn: '08:02', checkOut: '16:00' },
  '2025-01-14': { status: 'holiday' },
  '2025-01-15': { status: 'present', checkIn: '07:50', checkOut: '16:15' },
  '2025-01-16': { status: 'present', checkIn: '08:05', checkOut: '16:00' },
  '2025-01-17': { status: 'leave' },
  '2025-01-18': { status: 'weekend' },
  '2025-01-19': { status: 'weekend' },
  '2025-01-20': { status: 'present', checkIn: '07:58', checkOut: '-' },
}

const statusColors: Record<string, string> = {
  present: 'bg-emerald-500',
  absent: 'bg-red-500',
  leave: 'bg-purple-400',
  holiday: 'bg-blue-300',
  weekend: 'bg-slate-200',
}

const statusText: Record<string, string> = {
  present: 'text-emerald-700',
  absent: 'text-red-700',
  leave: 'text-purple-700',
  holiday: 'text-blue-600',
  weekend: 'text-slate-400',
}

export default function TeacherAttendance() {
  const [activeTab, setActiveTab] = useState('my-attendance')
  const [showLeaveModal, setShowLeaveModal] = useState(false)
  const [leaveType, setLeaveType] = useState('Medical')
  const [leaveFrom, setLeaveFrom] = useState('')
  const [leaveTo, setLeaveTo] = useState('')
  const [leaveReason, setLeaveReason] = useState('')
  const [selectedDate, setSelectedDate] = useState('2025-01-20')
  const [checkedIn] = useState(true)

  // Generate calendar for Jan 2025
  const daysInMonth = 31
  const firstDay = 3 // Wednesday

  const calendarCells = []
  for (let i = 0; i < firstDay; i++) {
    calendarCells.push(null)
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const key = `2025-01-${d.toString().padStart(2, '0')}`
    calendarCells.push({ day: d, data: calendarData[key] })
  }

  const selectedData = calendarData[selectedDate]

  return (
    <div className="space-y-5">
      <PageHeader
        breadcrumb={['Attendance', 'Teacher Attendance']}
        title="Teacher Attendance"
        subtitle="Mark and track daily attendance"
        actions={
          <Button variant="secondary" onClick={() => setShowLeaveModal(true)}>
            <Send size={13} /> Apply for Leave
          </Button>
        }
      />

      <Tabs
        tabs={[
          { id: 'my-attendance', label: 'My Attendance' },
          { id: 'all-teachers', label: 'All Teachers' },
        ]}
        active={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === 'my-attendance' && (
        <div className="space-y-5">
          {/* Today's status */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 col-span-2 md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <Avatar name="Priya Sharma" size="lg" />
                <div>
                  <p className="text-sm font-700 text-slate-900">Mrs. Priya Sharma</p>
                  <p className="text-xs text-slate-500">EMP001 · Mathematics</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Today's Status</span>
                  <Badge variant="success"><CheckCircle size={9} /> Present</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Check-In</span>
                  <span className="text-xs font-700 text-slate-800 font-mono">07:58 AM</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Check-Out</span>
                  <span className="text-xs font-700 text-slate-400 font-mono">—</span>
                </div>
              </div>
            </div>

            <StatCard label="Working Days" value="20" sub="January 2025" icon={<Calendar size={18} />} color="indigo" />
            <StatCard label="Present Days" value="17" sub="85% attendance" icon={<CheckCircle size={18} />} color="emerald" />
            <StatCard label="Leave Days" value="2" sub="1 absent" icon={<XCircle size={18} />} color="amber" />
          </div>

          {/* Check in/out */}
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-700 text-slate-900">Today – Monday, January 20, 2025</p>
                <p className="text-xs text-slate-500 mt-0.5">Check-in at 07:58 AM · No late mark</p>
              </div>
              <div className="flex gap-2">
                <Button variant="success" size="sm" disabled={checkedIn}>
                  <LogIn size={13} /> {checkedIn ? 'Checked In' : 'Check In'}
                </Button>
                <Button variant="secondary" size="sm">
                  <LogOut size={13} /> Check Out
                </Button>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Calendar */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-700 text-slate-900">January 2025</h3>
                <div className="flex gap-1.5 text-xs text-slate-500">
                  {[
                    { color: 'bg-emerald-500', label: 'Present' },
                    { color: 'bg-red-500', label: 'Absent' },
                    { color: 'bg-purple-400', label: 'Leave' },
                    { color: 'bg-blue-300', label: 'Holiday' },
                  ].map(l => (
                    <div key={l.label} className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${l.color}`} />
                      <span>{l.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Day headers */}
              <div className="grid grid-cols-7 mb-1">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                  <div key={d} className="text-center text-[10px] font-700 text-slate-400 py-1">{d}</div>
                ))}
              </div>

              {/* Calendar cells */}
              <div className="grid grid-cols-7 gap-1">
                {calendarCells.map((cell, i) => {
                  if (!cell) return <div key={i} />
                  const key = `2025-01-${cell.day.toString().padStart(2, '0')}`
                  const isSelected = selectedDate === key
                  const color = cell.data ? statusColors[cell.data.status] : 'bg-slate-100'
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedDate(key)}
                      className={`relative aspect-square rounded-lg flex flex-col items-center justify-center text-[11px] font-600 transition-all cursor-pointer ${
                        isSelected ? 'ring-2 ring-indigo-500 ring-offset-1' : ''
                      } ${cell.data?.status === 'weekend' ? 'bg-slate-50 text-slate-300' : 'hover:opacity-80'}`}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${color} ${cell.data?.status === 'weekend' ? 'bg-transparent' : 'text-white'}`}>
                        {cell.day}
                      </div>
                      {cell.data?.late && (
                        <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-amber-400 rounded-full" />
                      )}
                    </button>
                  )
                })}
              </div>
            </Card>

            {/* Selected day detail */}
            <Card>
              <h3 className="text-sm font-700 text-slate-900 mb-4">Day Details – {selectedDate}</h3>
              {selectedData ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${statusColors[selectedData.status]}`}>
                      {selectedData.status === 'present' ? <CheckCircle size={18} className="text-white" /> : selectedData.status === 'leave' ? <Clock size={18} className="text-white" /> : <XCircle size={18} className="text-white" />}
                    </div>
                    <div>
                      <p className={`text-sm font-700 capitalize ${statusText[selectedData.status]}`}>{selectedData.status}</p>
                      {selectedData.late && <p className="text-xs text-amber-600 font-600 flex items-center gap-1"><AlertTriangle size={10} /> Late arrival</p>}
                    </div>
                  </div>

                  {selectedData.checkIn && (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-emerald-50 rounded-xl">
                        <p className="text-[10px] text-emerald-600 font-600 uppercase tracking-wide mb-1">Check In</p>
                        <p className="text-lg font-800 text-emerald-700 font-mono">{selectedData.checkIn}</p>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl">
                        <p className="text-[10px] text-slate-500 font-600 uppercase tracking-wide mb-1">Check Out</p>
                        <p className="text-lg font-800 text-slate-700 font-mono">{selectedData.checkOut || '—'}</p>
                      </div>
                    </div>
                  )}

                  {selectedData.status === 'leave' && (
                    <div className="p-3 bg-purple-50 rounded-xl">
                      <p className="text-xs text-purple-700">Medical leave applied – approved</p>
                    </div>
                  )}
                  {selectedData.status === 'absent' && (
                    <div className="p-3 bg-red-50 rounded-xl flex items-start gap-2">
                      <AlertTriangle size={14} className="text-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-red-700">Marked absent – no leave applied</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                  <Calendar size={32} className="mb-2 opacity-40" />
                  <p className="text-sm">No data for this date</p>
                </div>
              )}
            </Card>
          </div>

          {/* Monthly breakdown */}
          <Card>
            <h3 className="text-sm font-700 text-slate-900 mb-4">Monthly Attendance Overview</h3>
            <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-12 gap-2">
              {monthlyAttendance.map(m => (
                <div key={m.month} className="text-center">
                  <div className={`text-lg font-800 ${m.pct >= 90 ? 'text-emerald-600' : m.pct >= 75 ? 'text-indigo-600' : 'text-amber-600'}`}>{m.pct}%</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{m.month}</div>
                  <div className="mt-1 h-1 rounded-full bg-slate-100 overflow-hidden">
                    <div className={`h-full rounded-full ${m.pct >= 90 ? 'bg-emerald-500' : m.pct >= 75 ? 'bg-indigo-500' : 'bg-amber-500'}`} style={{ width: `${m.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'all-teachers' && (
        <Card padding={false}>
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-700 text-slate-900">All Teachers – January 20, 2025</h3>
              <div className="flex gap-2">
                <Badge variant="success">61 Present</Badge>
                <Badge variant="danger">4 Absent</Badge>
                <Badge variant="purple">3 Leave</Badge>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="erp-table">
              <thead>
                <tr>
                  <th>Teacher</th>
                  <th>Employee ID</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((t, i) => {
                  const statuses = ['present', 'present', 'present', 'late', 'leave', 'absent', 'present', 'present']
                  const st = statuses[i % statuses.length]
                  const checkIns = ['07:55', '08:10', '07:58', '08:22', '-', '-', '07:52', '08:00']
                  const checkOuts = ['16:05', '15:50', '16:00', '16:10', '-', '-', '16:00', '15:45']
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
                      <td><span className="font-mono text-xs text-slate-500">{t.empId}</span></td>
                      <td><span className="text-xs text-slate-600">{t.department}</span></td>
                      <td>
                        <Badge variant={st === 'present' ? 'success' : st === 'absent' ? 'danger' : st === 'late' ? 'warning' : 'purple'}>
                          {st}
                        </Badge>
                      </td>
                      <td><span className="font-mono text-xs text-slate-600">{checkIns[i % checkIns.length]}</span></td>
                      <td><span className="font-mono text-xs text-slate-600">{checkOuts[i % checkOuts.length]}</span></td>
                      <td>
                        {st === 'late' && <span className="text-xs text-amber-600 font-600">Late by 22 min</span>}
                        {st === 'leave' && <span className="text-xs text-purple-600 font-600">Medical leave</span>}
                        {st === 'absent' && <span className="text-xs text-red-600 font-600">No reason</span>}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Leave modal */}
      <Modal open={showLeaveModal} onClose={() => setShowLeaveModal(false)} title="Apply for Leave">
        <div className="space-y-4">
          <Select
            label="Leave Type"
            value={leaveType}
            onChange={setLeaveType}
            options={[{ value: 'Medical', label: 'Medical Leave' }, { value: 'Personal', label: 'Personal Leave' }, { value: 'Emergency', label: 'Emergency' }, { value: 'Casual', label: 'Casual Leave' }]}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input type="date" label="From Date" value={leaveFrom} onChange={setLeaveFrom} />
            <Input type="date" label="To Date" value={leaveTo} onChange={setLeaveTo} />
          </div>
          <div>
            <label className="block text-xs font-600 text-slate-600 mb-1">Reason</label>
            <textarea
              value={leaveReason}
              onChange={e => setLeaveReason(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              placeholder="Reason for leave..."
            />
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <Button variant="ghost" onClick={() => setShowLeaveModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => { setShowLeaveModal(false) }}>
              <Send size={13} /> Submit Request
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
