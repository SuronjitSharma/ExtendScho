import { useState } from 'react'
import { Plus, Check, X, Eye, AlertCircle, Clock, CheckCircle, XCircle, ArrowRight } from 'lucide-react'
import { Card, Button, Badge, Modal, Select, PageHeader, StatCard, Tabs, Avatar, Toast } from '../components/ui'
import { students, subjects, periods } from '../data/mockData'

type CorrectionStatus = 'Pending' | 'Approved' | 'Rejected'

interface CorrectionReq {
  id: string
  teacherName: string
  studentName: string
  studentClass: string
  admNo: string
  date: string
  period: string
  subject: string
  currentStatus: string
  requestedStatus: string
  reason: string
  status: CorrectionStatus
  submittedOn: string
  reviewedBy?: string
  reviewedOn?: string
  reviewNote?: string
}

const corrections: CorrectionReq[] = [
  {
    id: 'CR001', teacherName: 'Mrs. Priya Sharma', studentName: 'Karan Gupta', studentClass: 'Class 10 A',
    admNo: 'ADM2024005', date: '2025-01-15', period: 'Period 2', subject: 'Mathematics',
    currentStatus: 'Absent', requestedStatus: 'Present',
    reason: 'Student was present but marked absent due to a biometric error. I have verified his presence from the CCTV footage.',
    status: 'Approved', submittedOn: '2025-01-16', reviewedBy: 'Dr. Ramesh Gupta', reviewedOn: '2025-01-16',
    reviewNote: 'Correction approved. Attendance updated.'
  },
  {
    id: 'CR002', teacherName: 'Mr. Rajesh Kumar', studentName: 'Vivek Reddy', studentClass: 'Class 10 A',
    admNo: 'ADM2024009', date: '2025-01-18', period: 'Period 1', subject: 'Physics',
    currentStatus: 'Late', requestedStatus: 'Present',
    reason: 'Student arrived on time but was marked late due to a system timestamp mismatch.',
    status: 'Pending', submittedOn: '2025-01-19'
  },
  {
    id: 'CR003', teacherName: 'Mrs. Anita Verma', studentName: 'Rohan Mehta', studentClass: 'Class 10 A',
    admNo: 'ADM2024003', date: '2025-01-10', period: 'Period 3', subject: 'English',
    currentStatus: 'Present', requestedStatus: 'Leave',
    reason: 'Student had an approved leave for this period but attendance was incorrectly marked as present.',
    status: 'Rejected', submittedOn: '2025-01-11', reviewedBy: 'Dr. Ramesh Gupta', reviewedOn: '2025-01-12',
    reviewNote: 'Request rejected – leave approval was not submitted before the attendance date.'
  },
  {
    id: 'CR004', teacherName: 'Mrs. Priya Sharma', studentName: 'Ananya Singh', studentClass: 'Class 10 A',
    admNo: 'ADM2024004', date: '2025-01-20', period: 'Period 4', subject: 'Mathematics',
    currentStatus: 'Absent', requestedStatus: 'Present',
    reason: 'Attendance was submitted before all students arrived. Ananya was present but missed in the initial marking.',
    status: 'Pending', submittedOn: '2025-01-20'
  },
  {
    id: 'CR005', teacherName: 'Mr. Suresh Patel', studentName: 'Aarav Sharma', studentClass: 'Class 10 A',
    admNo: 'ADM2024001', date: '2025-01-14', period: 'Period 5', subject: 'Chemistry',
    currentStatus: 'Absent', requestedStatus: 'Leave',
    reason: 'Student was on approved medical leave. The leave was approved but attendance system was not updated.',
    status: 'Approved', submittedOn: '2025-01-14', reviewedBy: 'Dr. Ramesh Gupta', reviewedOn: '2025-01-15',
    reviewNote: 'Approved – medical leave documentation verified.'
  },
]

const statusColor: Record<CorrectionStatus, 'success' | 'danger' | 'warning'> = {
  Approved: 'success', Rejected: 'danger', Pending: 'warning'
}

const attBadgeColor: Record<string, 'success' | 'danger' | 'warning' | 'purple'> = {
  Present: 'success', Absent: 'danger', Late: 'warning', Leave: 'purple'
}

function WorkflowStep({ step, label, active, done }: { step: number; label: string; active: boolean; done: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-700 flex-shrink-0 ${
        done ? 'bg-emerald-500 text-white' : active ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'
      }`}>
        {done ? <Check size={12} /> : step}
      </div>
      <span className={`text-xs font-600 ${active ? 'text-indigo-700' : done ? 'text-emerald-700' : 'text-slate-400'}`}>{label}</span>
    </div>
  )
}

export default function AttendanceCorrection() {
  const [reqs, setReqs] = useState(corrections)
  const [activeTab, setActiveTab] = useState('all')
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [showReviewModal, setShowReviewModal] = useState<CorrectionReq | null>(null)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  const [reviewNote, setReviewNote] = useState('')

  // Form state
  const [form, setForm] = useState({
    studentId: students[0].id, date: '2025-01-20', period: 'Period 1',
    subject: subjects[0], currentStatus: 'Absent', requestedStatus: 'Present', reason: ''
  })

  const approveReq = (id: string) => {
    setReqs(prev => prev.map(r => r.id === id ? { ...r, status: 'Approved', reviewedBy: 'Dr. Ramesh Gupta', reviewedOn: '2025-01-20', reviewNote } : r))
    setShowReviewModal(null)
    setReviewNote('')
    setToast({ msg: 'Correction request approved. Attendance updated.', type: 'success' })
    setTimeout(() => setToast(null), 3000)
  }

  const rejectReq = (id: string) => {
    setReqs(prev => prev.map(r => r.id === id ? { ...r, status: 'Rejected', reviewedBy: 'Dr. Ramesh Gupta', reviewedOn: '2025-01-20', reviewNote } : r))
    setShowReviewModal(null)
    setReviewNote('')
    setToast({ msg: 'Correction request rejected.', type: 'error' })
    setTimeout(() => setToast(null), 3000)
  }

  const pending = reqs.filter(r => r.status === 'Pending').length
  const approved = reqs.filter(r => r.status === 'Approved').length
  const rejected = reqs.filter(r => r.status === 'Rejected').length

  const filtered = reqs.filter(r => {
    if (activeTab === 'pending') return r.status === 'Pending'
    if (activeTab === 'approved') return r.status === 'Approved'
    if (activeTab === 'rejected') return r.status === 'Rejected'
    return true
  })

  return (
    <div className="space-y-5">
      <PageHeader
        breadcrumb={['Attendance', 'Correction Requests']}
        title="Attendance Correction"
        subtitle="Submit and review attendance correction requests"
        actions={
          <Button variant="primary" onClick={() => setShowSubmitModal(true)}>
            <Plus size={13} /> New Correction Request
          </Button>
        }
      />

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* Workflow explainer */}
      <Card>
        <p className="text-xs font-700 text-slate-500 uppercase tracking-wide mb-3">Correction Workflow</p>
        <div className="flex items-center gap-2 flex-wrap">
          <WorkflowStep step={1} label="Teacher Submits Request" active={false} done={true} />
          <ArrowRight size={14} className="text-slate-300" />
          <WorkflowStep step={2} label="Principal/Admin Reviews" active={true} done={false} />
          <ArrowRight size={14} className="text-slate-300" />
          <WorkflowStep step={3} label="Approve or Reject" active={false} done={false} />
          <ArrowRight size={14} className="text-slate-300" />
          <WorkflowStep step={4} label="Attendance Auto-Updated" active={false} done={false} />
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Requests" value={reqs.length} icon={<AlertCircle size={18} />} color="indigo" />
        <StatCard label="Pending Review" value={pending} sub="Needs action" icon={<Clock size={18} />} color="amber" />
        <StatCard label="Approved" value={approved} sub="Attendance updated" icon={<CheckCircle size={18} />} color="emerald" />
        <StatCard label="Rejected" value={rejected} icon={<XCircle size={18} />} color="red" />
      </div>

      {/* Pending alert */}
      {pending > 0 && (
        <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <AlertCircle size={15} className="text-amber-500 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-700 text-amber-800">{pending} correction request{pending > 1 ? 's' : ''} awaiting principal review</p>
            <p className="text-xs text-amber-600 mt-0.5">Approve or reject to update attendance records</p>
          </div>
          <Button variant="warning" size="sm" onClick={() => setActiveTab('pending')}>Review Now</Button>
        </div>
      )}

      <Tabs
        tabs={[
          { id: 'all', label: 'All Requests' },
          { id: 'pending', label: `Pending (${pending})` },
          { id: 'approved', label: 'Approved' },
          { id: 'rejected', label: 'Rejected' },
        ]}
        active={activeTab}
        onChange={setActiveTab}
      />

      {/* Table */}
      <Card padding={false}>
        <div className="overflow-x-auto">
          <table className="erp-table">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Student</th>
                <th>Submitted By</th>
                <th>Date & Period</th>
                <th>Subject</th>
                <th>Change</th>
                <th>Status</th>
                <th>Submitted On</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id}>
                  <td>
                    <span className="font-mono text-xs text-indigo-600 font-700">{r.id}</span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <Avatar name={r.studentName} size="sm" />
                      <div>
                        <p className="text-xs font-600 text-slate-800">{r.studentName}</p>
                        <p className="text-[10px] text-slate-400">{r.studentClass} · {r.admNo}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1.5">
                      <Avatar name={r.teacherName} size="sm" />
                      <span className="text-xs text-slate-600">{r.teacherName.split(' ').slice(-1)[0]}</span>
                    </div>
                  </td>
                  <td>
                    <div>
                      <p className="text-xs font-600 text-slate-700 font-mono">{r.date}</p>
                      <p className="text-[10px] text-slate-400">{r.period}</p>
                    </div>
                  </td>
                  <td className="text-xs text-slate-600">{r.subject}</td>
                  <td>
                    <div className="flex items-center gap-1.5">
                      <Badge variant={attBadgeColor[r.currentStatus] || 'gray'}>{r.currentStatus}</Badge>
                      <ArrowRight size={11} className="text-slate-400" />
                      <Badge variant={attBadgeColor[r.requestedStatus] || 'gray'}>{r.requestedStatus}</Badge>
                    </div>
                  </td>
                  <td>
                    <Badge variant={statusColor[r.status]}>{r.status}</Badge>
                  </td>
                  <td className="text-xs text-slate-500 font-mono">{r.submittedOn}</td>
                  <td>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => setShowReviewModal(r)}>
                        <Eye size={11} />
                      </Button>
                      {r.status === 'Pending' && (
                        <>
                          <Button variant="success" size="sm" onClick={() => { setShowReviewModal(r) }}>
                            <Check size={11} />
                          </Button>
                          <Button variant="danger" size="sm" onClick={() => rejectReq(r.id)}>
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
              <CheckCircle size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">No correction requests</p>
            </div>
          )}
        </div>
      </Card>

      {/* Review modal */}
      <Modal open={!!showReviewModal} onClose={() => setShowReviewModal(null)} title="Review Correction Request" size="lg">
        {showReviewModal && (
          <div className="space-y-4">
            {/* Header info */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-[10px] font-700 text-slate-400 uppercase mb-1">Student</p>
                <div className="flex items-center gap-2">
                  <Avatar name={showReviewModal.studentName} size="sm" />
                  <div>
                    <p className="text-xs font-700 text-slate-800">{showReviewModal.studentName}</p>
                    <p className="text-[10px] text-slate-500">{showReviewModal.studentClass} · {showReviewModal.admNo}</p>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-[10px] font-700 text-slate-400 uppercase mb-1">Submitted By</p>
                <div className="flex items-center gap-2">
                  <Avatar name={showReviewModal.teacherName} size="sm" />
                  <div>
                    <p className="text-xs font-700 text-slate-800">{showReviewModal.teacherName}</p>
                    <p className="text-[10px] text-slate-500">on {showReviewModal.submittedOn}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-[10px] font-700 text-slate-400 uppercase mb-1">Date</p>
                <p className="text-sm font-700 text-slate-800 font-mono">{showReviewModal.date}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-[10px] font-700 text-slate-400 uppercase mb-1">Period</p>
                <p className="text-sm font-700 text-slate-800">{showReviewModal.period}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-[10px] font-700 text-slate-400 uppercase mb-1">Subject</p>
                <p className="text-sm font-700 text-slate-800">{showReviewModal.subject}</p>
              </div>
            </div>

            {/* Change request visual */}
            <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
              <p className="text-xs font-700 text-indigo-600 uppercase tracking-wide mb-3">Requested Change</p>
              <div className="flex items-center justify-center gap-6">
                <div className="text-center">
                  <p className="text-[10px] text-slate-500 mb-1">Current Status</p>
                  <Badge variant={attBadgeColor[showReviewModal.currentStatus] || 'gray'} className="text-sm px-3 py-1">
                    {showReviewModal.currentStatus}
                  </Badge>
                </div>
                <ArrowRight size={20} className="text-indigo-400" />
                <div className="text-center">
                  <p className="text-[10px] text-slate-500 mb-1">Requested Status</p>
                  <Badge variant={attBadgeColor[showReviewModal.requestedStatus] || 'gray'} className="text-sm px-3 py-1">
                    {showReviewModal.requestedStatus}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Reason */}
            <div className="p-3 bg-slate-50 rounded-xl">
              <p className="text-[10px] font-700 text-slate-400 uppercase mb-1">Reason for Correction</p>
              <p className="text-sm text-slate-700 leading-relaxed">{showReviewModal.reason}</p>
            </div>

            {/* If already reviewed */}
            {showReviewModal.status !== 'Pending' ? (
              <div className={`p-4 rounded-xl border ${showReviewModal.status === 'Approved' ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                <p className={`text-xs font-700 mb-1 ${showReviewModal.status === 'Approved' ? 'text-emerald-700' : 'text-red-700'}`}>
                  {showReviewModal.status} by {showReviewModal.reviewedBy} on {showReviewModal.reviewedOn}
                </p>
                {showReviewModal.reviewNote && (
                  <p className={`text-xs ${showReviewModal.status === 'Approved' ? 'text-emerald-600' : 'text-red-600'}`}>
                    {showReviewModal.reviewNote}
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-600 text-slate-600 mb-1">Review Note (optional)</label>
                  <textarea
                    value={reviewNote}
                    onChange={e => setReviewNote(e.target.value)}
                    rows={2}
                    placeholder="Add a note for the teacher..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  />
                </div>
                <div className="flex gap-2 pt-1">
                  <Button variant="danger" className="flex-1 justify-center" onClick={() => rejectReq(showReviewModal.id)}>
                    <X size={13} /> Reject Request
                  </Button>
                  <Button variant="success" className="flex-1 justify-center" onClick={() => approveReq(showReviewModal.id)}>
                    <Check size={13} /> Approve & Update
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Submit new correction modal */}
      <Modal open={showSubmitModal} onClose={() => setShowSubmitModal(false)} title="Submit Correction Request" size="md">
        <div className="space-y-4">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs text-amber-700 font-600 flex items-center gap-1.5">
              <AlertCircle size={12} /> Corrections require principal/admin approval before attendance is updated
            </p>
          </div>

          <Select
            label="Student"
            value={form.studentId}
            onChange={v => setForm(p => ({ ...p, studentId: v }))}
            options={students.map(s => ({ value: s.id, label: `${s.name} (${s.class} ${s.section})` }))}
          />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-600 text-slate-600 mb-1">Date</label>
              <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <Select label="Period" value={form.period} onChange={v => setForm(p => ({ ...p, period: v }))}
              options={periods.map(pr => ({ value: pr, label: pr }))} />
          </div>
          <Select label="Subject" value={form.subject} onChange={v => setForm(p => ({ ...p, subject: v }))}
            options={subjects.slice(0, 8).map(s => ({ value: s, label: s }))} />
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Current Status (Marked As)"
              value={form.currentStatus}
              onChange={v => setForm(p => ({ ...p, currentStatus: v }))}
              options={['Present', 'Absent', 'Late', 'Leave'].map(s => ({ value: s, label: s }))}
            />
            <Select
              label="Correct Status (Should Be)"
              value={form.requestedStatus}
              onChange={v => setForm(p => ({ ...p, requestedStatus: v }))}
              options={['Present', 'Absent', 'Late', 'Leave'].map(s => ({ value: s, label: s }))}
            />
          </div>
          <div>
            <label className="block text-xs font-600 text-slate-600 mb-1">Reason for Correction</label>
            <textarea
              value={form.reason}
              onChange={e => setForm(p => ({ ...p, reason: e.target.value }))}
              rows={3}
              placeholder="Explain why this correction is needed..."
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <Button variant="ghost" onClick={() => setShowSubmitModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => {
              setShowSubmitModal(false)
              setToast({ msg: 'Correction request submitted. Awaiting principal approval.', type: 'success' })
              setTimeout(() => setToast(null), 3500)
            }}>
              Submit for Review
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
