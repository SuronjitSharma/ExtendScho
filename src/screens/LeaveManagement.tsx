import { useState } from 'react'
import { Plus, X, Eye, AlertCircle, Send, Calendar, Clock, User, CheckCircle, Check } from 'lucide-react'
import { Card, Button, Badge, Modal, Input, Select, PageHeader, Tabs, StatCard, Avatar, Toast } from '../components/ui'
import { students, teachers } from '../data/mockData'

type LeaveStatus = 'Pending' | 'Approved' | 'Rejected'

interface LeaveReq {
  id: string
  name: string
  role: 'student' | 'teacher'
  class?: string
  type: string
  from: string
  to: string
  days: number
  reason: string
  status: LeaveStatus
  appliedOn: string
  approvedBy?: string
}

const allLeaves: LeaveReq[] = [
  { id: 'LR001', name: 'Karan Gupta', role: 'student', class: 'Class 10 A', type: 'Medical', from: '2025-01-20', to: '2025-01-22', days: 3, reason: 'Fever and cold – doctor certificate attached', status: 'Approved', appliedOn: '2025-01-19', approvedBy: 'Mrs. Priya Sharma' },
  { id: 'LR002', name: 'Sneha Joshi', role: 'student', class: 'Class 10 A', type: 'Personal', from: '2025-01-25', to: '2025-01-25', days: 1, reason: 'Family function – attending sister\'s wedding', status: 'Pending', appliedOn: '2025-01-22' },
  { id: 'LR003', name: 'Vivek Reddy', role: 'student', class: 'Class 10 A', type: 'Medical', from: '2025-02-01', to: '2025-02-05', days: 5, reason: 'Hospitalization – dengue fever', status: 'Approved', appliedOn: '2025-01-31', approvedBy: 'Mrs. Priya Sharma' },
  { id: 'LR004', name: 'Rohan Mehta', role: 'student', class: 'Class 10 A', type: 'Personal', from: '2025-02-10', to: '2025-02-11', days: 2, reason: 'Travel – family trip', status: 'Rejected', appliedOn: '2025-02-08' },
  { id: 'LR005', name: 'Ananya Singh', role: 'student', class: 'Class 10 A', type: 'Medical', from: '2025-01-15', to: '2025-01-15', days: 1, reason: 'Dental appointment', status: 'Approved', appliedOn: '2025-01-14', approvedBy: 'Mrs. Priya Sharma' },
  { id: 'LR006', name: 'Mrs. Priya Sharma', role: 'teacher', type: 'Medical', from: '2025-01-07', to: '2025-01-07', days: 1, reason: 'Medical checkup', status: 'Approved', appliedOn: '2025-01-06', approvedBy: 'Dr. Ramesh Gupta (Principal)' },
  { id: 'LR007', name: 'Mr. Rajesh Kumar', role: 'teacher', type: 'Personal', from: '2025-01-17', to: '2025-01-17', days: 1, reason: 'Personal work', status: 'Approved', appliedOn: '2025-01-15', approvedBy: 'Dr. Ramesh Gupta (Principal)' },
  { id: 'LR008', name: 'Mrs. Kavita Rao', role: 'teacher', type: 'Emergency', from: '2025-02-03', to: '2025-02-04', days: 2, reason: 'Family emergency', status: 'Pending', appliedOn: '2025-02-02' },
  { id: 'LR009', name: 'Diya Nair', role: 'student', class: 'Class 10 A', type: 'Casual', from: '2025-02-14', to: '2025-02-14', days: 1, reason: 'Festival celebration', status: 'Pending', appliedOn: '2025-02-12' },
  { id: 'LR010', name: 'Pooja Sharma', role: 'student', class: 'Class 10 A', type: 'Medical', from: '2025-01-28', to: '2025-01-30', days: 3, reason: 'Eye surgery recovery', status: 'Approved', appliedOn: '2025-01-27', approvedBy: 'Mrs. Priya Sharma' },
]

const statusBadge: Record<LeaveStatus, 'success' | 'danger' | 'warning'> = {
  Approved: 'success', Rejected: 'danger', Pending: 'warning'
}

export default function LeaveManagement() {
  const [tab, setTab] = useState('all')
  const [leaves, setLeaves] = useState(allLeaves)
  const [showModal, setShowModal] = useState(false)
  const [viewLeave, setViewLeave] = useState<LeaveReq | null>(null)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  const [filterStatus, setFilterStatus] = useState('All')
  const [filterType, setFilterType] = useState('All')

  // New leave form
  const [form, setForm] = useState({ role: 'student', studentId: students[0].id, teacherId: teachers[0].id, type: 'Medical', from: '', to: '', reason: '' })

  const updateStatus = (id: string, status: LeaveStatus) => {
    setLeaves(prev => prev.map(l => l.id === id ? { ...l, status, approvedBy: 'Dr. Ramesh Gupta (Principal)' } : l))
    setViewLeave(null)
    setToast({ msg: `Leave request ${status.toLowerCase()} successfully`, type: status === 'Approved' ? 'success' : 'error' })
    setTimeout(() => setToast(null), 3000)
  }

  const filtered = leaves.filter(l => {
    if (tab === 'students' && l.role !== 'student') return false
    if (tab === 'teachers' && l.role !== 'teacher') return false
    if (tab === 'pending' && l.status !== 'Pending') return false
    if (filterStatus !== 'All' && l.status !== filterStatus) return false
    if (filterType !== 'All' && l.type !== filterType) return false
    return true
  })

  const pending = leaves.filter(l => l.status === 'Pending').length
  const approved = leaves.filter(l => l.status === 'Approved').length
  const studentLeaves = leaves.filter(l => l.role === 'student').length
  const teacherLeaves = leaves.filter(l => l.role === 'teacher').length

  return (
    <div className="space-y-5">
      <PageHeader
        breadcrumb={['Attendance', 'Leave Management']}
        title="Leave Management"
        subtitle="Manage student and teacher leave requests"
        actions={
          <Button variant="primary" onClick={() => setShowModal(true)}>
            <Plus size={13} /> Apply Leave
          </Button>
        }
      />

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard label="Total Requests" value={leaves.length} icon={<Calendar size={18} />} color="indigo" />
        <StatCard label="Pending" value={pending} sub="Awaiting approval" icon={<Clock size={18} />} color="amber" />
        <StatCard label="Approved" value={approved} icon={<CheckCircle size={18} />} color="emerald" />
        <StatCard label="Student Leaves" value={studentLeaves} icon={<User size={18} />} color="blue" />
        <StatCard label="Teacher Leaves" value={teacherLeaves} icon={<User size={18} />} color="purple" />
      </div>

      {/* Pending banner */}
      {pending > 0 && (
        <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <AlertCircle size={16} className="text-amber-500 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-700 text-amber-800">{pending} leave request{pending > 1 ? 's' : ''} awaiting your approval</p>
            <p className="text-xs text-amber-600 mt-0.5">Review and approve or reject pending requests promptly</p>
          </div>
          <Button variant="warning" size="sm" onClick={() => setTab('pending')}>View Pending</Button>
        </div>
      )}

      {/* Tabs + filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Tabs
          tabs={[
            { id: 'all', label: 'All Requests' },
            { id: 'students', label: 'Students' },
            { id: 'teachers', label: 'Teachers' },
            { id: 'pending', label: `Pending (${pending})` },
          ]}
          active={tab}
          onChange={setTab}
        />
        <div className="flex gap-2 ml-auto">
          <Select value={filterStatus} onChange={setFilterStatus} options={['All', 'Pending', 'Approved', 'Rejected'].map(s => ({ value: s, label: s }))} className="w-32" />
          <Select value={filterType} onChange={setFilterType} options={['All', 'Medical', 'Personal', 'Casual', 'Emergency'].map(t => ({ value: t, label: t }))} className="w-32" />
        </div>
      </div>

      {/* Table */}
      <Card padding={false}>
        <div className="overflow-x-auto">
          <table className="erp-table">
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Role</th>
                <th>Leave Type</th>
                <th>From</th>
                <th>To</th>
                <th>Days</th>
                <th>Reason</th>
                <th>Applied On</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(l => (
                <tr key={l.id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <Avatar name={l.name} size="sm" />
                      <div>
                        <p className="text-xs font-600 text-slate-800">{l.name}</p>
                        {l.class && <p className="text-[10px] text-slate-400">{l.class}</p>}
                      </div>
                    </div>
                  </td>
                  <td>
                    <Badge variant={l.role === 'student' ? 'indigo' : 'purple'}>
                      {l.role === 'student' ? 'Student' : 'Teacher'}
                    </Badge>
                  </td>
                  <td>
                    <Badge variant={l.type === 'Medical' ? 'info' : l.type === 'Emergency' ? 'danger' : 'gray'}>
                      {l.type}
                    </Badge>
                  </td>
                  <td className="text-xs text-slate-600 font-mono">{l.from}</td>
                  <td className="text-xs text-slate-600 font-mono">{l.to}</td>
                  <td className="text-xs font-700 text-slate-700 text-center">{l.days}</td>
                  <td>
                    <p className="text-xs text-slate-600 max-w-32 truncate" title={l.reason}>{l.reason}</p>
                  </td>
                  <td className="text-xs text-slate-500 font-mono">{l.appliedOn}</td>
                  <td>
                    <Badge variant={statusBadge[l.status]}>{l.status}</Badge>
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" onClick={() => setViewLeave(l)}>
                        <Eye size={11} />
                      </Button>
                      {l.status === 'Pending' && (
                        <>
                          <Button variant="success" size="sm" onClick={() => updateStatus(l.id, 'Approved')}>
                            <Check size={11} />
                          </Button>
                          <Button variant="danger" size="sm" onClick={() => updateStatus(l.id, 'Rejected')}>
                            <X size={11} />
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-16 text-center text-slate-400">
              <Calendar size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">No leave requests found</p>
            </div>
          )}
        </div>
      </Card>

      {/* View detail modal */}
      <Modal open={!!viewLeave} onClose={() => setViewLeave(null)} title="Leave Request Details" size="md">
        {viewLeave && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
              <Avatar name={viewLeave.name} size="lg" />
              <div>
                <p className="text-sm font-700 text-slate-900">{viewLeave.name}</p>
                {viewLeave.class && <p className="text-xs text-slate-500">{viewLeave.class}</p>}
                <Badge variant={viewLeave.role === 'student' ? 'indigo' : 'purple'} className="mt-1">
                  {viewLeave.role}
                </Badge>
              </div>
              <div className="ml-auto">
                <Badge variant={statusBadge[viewLeave.status]}>{viewLeave.status}</Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Leave Type', value: viewLeave.type },
                { label: 'Days Requested', value: `${viewLeave.days} day${viewLeave.days > 1 ? 's' : ''}` },
                { label: 'From Date', value: viewLeave.from },
                { label: 'To Date', value: viewLeave.to },
                { label: 'Applied On', value: viewLeave.appliedOn },
                { label: 'Approved By', value: viewLeave.approvedBy || '—' },
              ].map(f => (
                <div key={f.label} className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-[10px] font-700 text-slate-400 uppercase tracking-wide mb-1">{f.label}</p>
                  <p className="text-sm font-600 text-slate-800">{f.value}</p>
                </div>
              ))}
            </div>

            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-[10px] font-700 text-slate-400 uppercase tracking-wide mb-1">Reason</p>
              <p className="text-sm text-slate-700 leading-relaxed">{viewLeave.reason}</p>
            </div>

            {viewLeave.status === 'Pending' && (
              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <Button variant="danger" className="flex-1 justify-center" onClick={() => updateStatus(viewLeave.id, 'Rejected')}>
                  <X size={13} /> Reject
                </Button>
                <Button variant="success" className="flex-1 justify-center" onClick={() => updateStatus(viewLeave.id, 'Approved')}>
                  <Check size={13} /> Approve
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Apply leave modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="Apply for Leave" size="md">
        <div className="space-y-4">
          <Select
            label="Leave For"
            value={form.role}
            onChange={v => setForm(p => ({ ...p, role: v }))}
            options={[{ value: 'student', label: 'Student' }, { value: 'teacher', label: 'Teacher' }]}
          />
          {form.role === 'student' ? (
            <Select
              label="Student"
              value={form.studentId}
              onChange={v => setForm(p => ({ ...p, studentId: v }))}
              options={students.map(s => ({ value: s.id, label: `${s.name} (${s.class} ${s.section})` }))}
            />
          ) : (
            <Select
              label="Teacher"
              value={form.teacherId}
              onChange={v => setForm(p => ({ ...p, teacherId: v }))}
              options={teachers.map(t => ({ value: t.id, label: t.name }))}
            />
          )}
          <Select
            label="Leave Type"
            value={form.type}
            onChange={v => setForm(p => ({ ...p, type: v }))}
            options={['Medical', 'Personal', 'Casual', 'Emergency'].map(t => ({ value: t, label: t }))}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input type="date" label="From Date" value={form.from} onChange={v => setForm(p => ({ ...p, from: v }))} />
            <Input type="date" label="To Date" value={form.to} onChange={v => setForm(p => ({ ...p, to: v }))} />
          </div>
          <div>
            <label className="block text-xs font-600 text-slate-600 mb-1">Reason</label>
            <textarea
              value={form.reason}
              onChange={e => setForm(p => ({ ...p, reason: e.target.value }))}
              rows={3}
              placeholder="Enter the reason for leave..."
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <Button variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => {
              setShowModal(false)
              setToast({ msg: 'Leave request submitted successfully', type: 'success' })
              setTimeout(() => setToast(null), 3000)
            }}>
              <Send size={13} /> Submit Request
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
