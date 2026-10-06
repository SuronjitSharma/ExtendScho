import { useState } from 'react'
import { Plus, Eye, Edit2, Download, Printer, FileText, CheckCircle, Clock, ArrowLeft } from 'lucide-react'
import { Card, Button, Badge, Input, Select, PageHeader, Avatar, Toast } from '../components/ui'
import { transferCertificates, students } from '../data/mockData'

const tcStatuses: Record<string, 'success' | 'warning' | 'gray' | 'info'> = {
  Issued: 'success', Draft: 'warning', Pending: 'gray', Cancelled: 'danger' as any,
}

interface TCFormData {
  studentId: string; studentName: string; admNo: string; dob: string; gender: string
  fatherName: string; motherName: string; nationality: string; religion: string
  caste: string; dateAdmission: string; academicYear: string
  dateLeaving: string; reason: string; passed: string; conduct: string; feesClear: string
  tcNo: string; issueDate: string; principalName: string
}

const defaultForm: TCFormData = {
  studentId: students[0].id, studentName: students[0].name, admNo: students[0].admNo,
  dob: students[0].dob, gender: students[0].gender,
  fatherName: students[0].fatherName, motherName: students[0].motherName,
  nationality: 'Indian', religion: 'Hindu', caste: 'General',
  dateAdmission: '2020-04-01', academicYear: '2024-25',
  dateLeaving: '2025-01-20', reason: 'Family Relocation', passed: 'Yes',
  conduct: 'Good', feesClear: 'Yes',
  tcNo: 'TC/2024-25/005', issueDate: '2025-01-20', principalName: 'Dr. Ramesh Gupta',
}

function TCPreview({ data, onBack, onGenerate }: { data: TCFormData; onBack: () => void; onGenerate: () => void }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack}><ArrowLeft size={13} /> Back</Button>
        <div className="flex-1" />
        <Button variant="secondary" size="sm"><Printer size={13} /> Print</Button>
        <Button variant="primary" onClick={onGenerate}><Download size={13} /> Generate PDF</Button>
      </div>

      <div className="tc-preview shadow-xl">
        {/* Header */}
        <div className="text-center border-b-2 border-slate-800 pb-4 mb-6">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <FileText size={28} className="text-indigo-600" />
          </div>
          <h1 className="text-2xl font-800 text-slate-900 uppercase tracking-wider">Sunrise Public School</h1>
          <p className="text-sm text-slate-600 mt-0.5">123 Education Lane, Knowledge Park, Bangalore – 560001</p>
          <p className="text-xs text-slate-500">Phone: +91 80 2345 6789 | Email: info@sunriseschool.edu</p>
          <div className="mt-3 inline-block bg-slate-900 text-white px-6 py-1.5 rounded">
            <p className="text-sm font-700 uppercase tracking-widest">Transfer Certificate</p>
          </div>
        </div>

        {/* TC details */}
        <div className="flex justify-between text-sm mb-6">
          <div><span className="font-600">TC No:</span> <span className="font-mono text-indigo-700">{data.tcNo}</span></div>
          <div><span className="font-600">Date of Issue:</span> {data.issueDate}</div>
        </div>

        {/* Content */}
        <p className="text-sm text-slate-700 mb-4 leading-relaxed">
          This is to certify that <strong>{data.studentName}</strong>, {data.gender === 'Male' ? 'son' : 'daughter'} of
          <strong> {data.fatherName}</strong> and <strong>{data.motherName}</strong>, bearing Admission No.{' '}
          <span className="font-mono">{data.admNo}</span>, was a bonafide student of this school.
        </p>

        {/* Details table */}
        <div className="border border-slate-300 rounded">
          {[
            ['Student Name', data.studentName],
            ['Date of Birth', data.dob],
            ['Gender', data.gender],
            ['Father\'s Name', data.fatherName],
            ['Mother\'s Name', data.motherName],
            ['Nationality', data.nationality],
            ['Religion', data.religion],
            ['Caste / Category', data.caste],
            ['Date of Admission', data.dateAdmission],
            ['Academic Year', data.academicYear],
            ['Date of Leaving', data.dateLeaving],
            ['Reason for Leaving', data.reason],
            ['Whether Passed / Promoted', data.passed],
            ['General Conduct', data.conduct],
            ['Fee Clearance', data.feesClear],
          ].map(([label, val], i) => (
            <div key={i} className={`grid grid-cols-2 text-sm border-b border-slate-200 last:border-0 ${i % 2 === 0 ? 'bg-slate-50' : ''}`}>
              <div className="px-3 py-2 font-600 text-slate-700 border-r border-slate-200">{label}</div>
              <div className="px-3 py-2 text-slate-800">{val}</div>
            </div>
          ))}
        </div>

        {/* Signature */}
        <div className="mt-8 grid grid-cols-2 gap-8">
          <div className="text-center">
            <div className="h-12 border-b border-slate-400 mb-1" />
            <p className="text-xs text-slate-600 font-600">Class Teacher's Signature</p>
          </div>
          <div className="text-center">
            <div className="h-12 border-b border-slate-400 mb-1 flex items-end justify-center">
              <div className="w-16 h-14 border-2 border-dashed border-slate-300 rounded flex items-center justify-center mb-1">
                <p className="text-[9px] text-slate-400">School Stamp</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 font-700">{data.principalName}</p>
            <p className="text-xs text-slate-500">Principal</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function TransferCertificate() {
  const [view, setView] = useState<'list' | 'form' | 'preview'>('list')
  const [form, setForm] = useState<TCFormData>(defaultForm)
  const [toast, setToast] = useState<string | null>(null)

  const setField = (k: keyof TCFormData, v: string) => setForm(p => ({ ...p, [k]: v }))

  const handleStudentChange = (id: string) => {
    const s = students.find(st => st.id === id)
    if (!s) return
    setForm(p => ({ ...p, studentId: s.id, studentName: s.name, admNo: s.admNo, dob: s.dob, gender: s.gender, fatherName: s.fatherName, motherName: s.motherName }))
  }

  const handleGenerate = () => {
    setView('list')
    setToast('Transfer Certificate generated and saved successfully!')
    setTimeout(() => setToast(null), 3000)
  }

  if (view === 'preview') {
    return (
      <div className="space-y-5">
        <PageHeader breadcrumb={['Transfer Certificates', 'Preview']} title="TC Preview" />
        {toast && <Toast message={toast} type="success" onClose={() => setToast(null)} />}
        <TCPreview data={form} onBack={() => setView('form')} onGenerate={handleGenerate} />
      </div>
    )
  }

  if (view === 'form') {
    return (
      <div className="space-y-5">
        <PageHeader
          breadcrumb={['Transfer Certificates', 'Generate']}
          title="Generate Transfer Certificate"
          actions={
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setView('list')}><ArrowLeft size={13} /> Back</Button>
              <Button variant="secondary" onClick={() => setView('preview')}>
                <Eye size={13} /> Preview
              </Button>
              <Button variant="primary" onClick={() => setView('preview')}>
                <FileText size={13} /> Generate TC
              </Button>
            </div>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Student Information */}
          <Card>
            <h3 className="text-sm font-700 text-slate-900 mb-4 pb-3 border-b border-slate-100">Student Information</h3>
            <div className="space-y-3">
              <Select
                label="Select Student"
                value={form.studentId}
                onChange={handleStudentChange}
                options={students.map(s => ({ value: s.id, label: `${s.name} (${s.admNo})` }))}
              />
              <Input label="Student Name" value={form.studentName} onChange={v => setField('studentName', v)} />
              <Input label="Admission Number" value={form.admNo} onChange={v => setField('admNo', v)} />
              <div className="grid grid-cols-2 gap-3">
                <Input label="Date of Birth" type="date" value={form.dob} onChange={v => setField('dob', v)} />
                <Select label="Gender" value={form.gender} onChange={v => setField('gender', v)} options={['Male', 'Female', 'Other'].map(g => ({ value: g, label: g }))} />
              </div>
              <Input label="Father's Name" value={form.fatherName} onChange={v => setField('fatherName', v)} />
              <Input label="Mother's Name" value={form.motherName} onChange={v => setField('motherName', v)} />
              <div className="grid grid-cols-3 gap-3">
                <Input label="Nationality" value={form.nationality} onChange={v => setField('nationality', v)} />
                <Input label="Religion" value={form.religion} onChange={v => setField('religion', v)} />
                <Input label="Caste / Category" value={form.caste} onChange={v => setField('caste', v)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input label="Date of Admission" type="date" value={form.dateAdmission} onChange={v => setField('dateAdmission', v)} />
                <Select label="Academic Year" value={form.academicYear} onChange={v => setField('academicYear', v)} options={['2024-25', '2023-24', '2022-23'].map(y => ({ value: y, label: y }))} />
              </div>
            </div>
          </Card>

          {/* Leaving + Certificate Info */}
          <div className="space-y-5">
            <Card>
              <h3 className="text-sm font-700 text-slate-900 mb-4 pb-3 border-b border-slate-100">Leaving Information</h3>
              <div className="space-y-3">
                <Input label="Date of Leaving" type="date" value={form.dateLeaving} onChange={v => setField('dateLeaving', v)} />
                <Select
                  label="Reason for Leaving"
                  value={form.reason}
                  onChange={v => setField('reason', v)}
                  options={['Family Relocation', 'School Change', 'Migration', 'Completed Studies', 'Medical Reasons', 'Other'].map(r => ({ value: r, label: r }))}
                />
                <Select
                  label="Whether Passed / Promoted"
                  value={form.passed}
                  onChange={v => setField('passed', v)}
                  options={['Yes', 'No', 'Result Awaited'].map(v => ({ value: v, label: v }))}
                />
                <Select
                  label="Conduct / Character"
                  value={form.conduct}
                  onChange={v => setField('conduct', v)}
                  options={['Excellent', 'Very Good', 'Good', 'Satisfactory'].map(v => ({ value: v, label: v }))}
                />
                <Select
                  label="Fee Clearance Status"
                  value={form.feesClear}
                  onChange={v => setField('feesClear', v)}
                  options={['Yes', 'No', 'Partial'].map(v => ({ value: v, label: v }))}
                />
              </div>
            </Card>

            <Card>
              <h3 className="text-sm font-700 text-slate-900 mb-4 pb-3 border-b border-slate-100">Certificate Information</h3>
              <div className="space-y-3">
                <Input label="TC Number" value={form.tcNo} onChange={v => setField('tcNo', v)} />
                <Input label="Issue Date" type="date" value={form.issueDate} onChange={v => setField('issueDate', v)} />
                <Input label="Principal Name" value={form.principalName} onChange={v => setField('principalName', v)} />
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100">
                <Button variant="secondary" size="sm" className="w-full justify-center" onClick={() => setView('preview')}>
                  <Eye size={13} /> Preview Transfer Certificate
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <PageHeader
        breadcrumb={['Transfer Certificates']}
        title="Transfer Certificates"
        subtitle="Generate and manage student transfer certificates"
        actions={
          <Button variant="primary" onClick={() => setView('form')}>
            <Plus size={13} /> Generate New TC
          </Button>
        }
      />

      {toast && <Toast message={toast} type="success" onClose={() => setToast(null)} />}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total TCs', value: 4, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Issued', value: 2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Draft', value: 1, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Pending', value: 1, color: 'text-slate-600', bg: 'bg-slate-50' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-slate-200 rounded-xl p-5 flex items-center gap-3 shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.bg}`}>
              <FileText size={18} className={s.color} />
            </div>
            <div>
              <p className={`text-2xl font-800 ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* TC list */}
      <Card padding={false}>
        <div className="overflow-x-auto">
          <table className="erp-table">
            <thead>
              <tr>
                <th>TC Number</th>
                <th>Student</th>
                <th>Admission No</th>
                <th>Class</th>
                <th>Date of Leaving</th>
                <th>Reason</th>
                <th>Conduct</th>
                <th>Status</th>
                <th>Generated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transferCertificates.map(tc => (
                <tr key={tc.id}>
                  <td>
                    <span className="font-mono text-xs text-indigo-600 font-700">{tc.tcNo}</span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <Avatar name={tc.student} size="sm" />
                      <span className="text-xs font-600 text-slate-800">{tc.student}</span>
                    </div>
                  </td>
                  <td><span className="font-mono text-xs text-slate-500">{tc.admNo}</span></td>
                  <td className="text-xs text-slate-600">{tc.class} – {tc.section}</td>
                  <td className="text-xs text-slate-600">{tc.dateLeaving}</td>
                  <td className="text-xs text-slate-600">{tc.reason}</td>
                  <td>
                    <Badge variant={tc.conduct === 'Excellent' ? 'success' : tc.conduct === 'Very Good' ? 'indigo' : 'gray'}>
                      {tc.conduct}
                    </Badge>
                  </td>
                  <td>
                    <Badge variant={tcStatuses[tc.status] || 'gray'}>
                      {tc.status === 'Issued' ? <CheckCircle size={9} /> : tc.status === 'Pending' ? <Clock size={9} /> : null}
                      {tc.status}
                    </Badge>
                  </td>
                  <td className="text-xs text-slate-500">{tc.generatedDate}</td>
                  <td>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => setView('preview')}>
                        <Eye size={11} />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setView('form')}>
                        <Edit2 size={11} />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download size={11} />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Printer size={11} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
