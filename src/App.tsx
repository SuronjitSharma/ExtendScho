import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Dashboard from './screens/Dashboard'
import MarkAttendance from './screens/MarkAttendance'
import TeacherAttendance from './screens/TeacherAttendance'
import StudentAttendanceDetails from './screens/StudentAttendanceDetails'
import AttendanceSummary from './screens/AttendanceSummary'
import AttendanceReport from './screens/AttendanceReport'
import Timetable from './screens/Timetable'
import TransferCertificate from './screens/TransferCertificate'
import LeaveManagement from './screens/LeaveManagement'
import AttendanceCorrection from './screens/AttendanceCorrection'

type Screen =
  | 'dashboard'
  | 'admissions'
  | 'students'
  | 'teachers'
  | 'mark-attendance'
  | 'teacher-attendance'
  | 'student-attendance-details'
  | 'attendance-summary'
  | 'attendance-report'
  | 'leave-management'
  | 'attendance-correction'
  | 'class-timetable'
  | 'teacher-timetable'
  | 'timetable-management'
  | 'transfer-certificate'
  | 'fees'
  | 'examinations'
  | 'reports'
  | 'settings'

function ComingSoon({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mb-5">
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <path d="M18 3L3 33h30L18 3z" stroke="#4f46e5" strokeWidth="2" strokeLinejoin="round" fill="none" />
          <path d="M18 14v8M18 26v1" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <h2 className="text-xl font-800 text-slate-800 mb-2">{title}</h2>
      <p className="text-sm text-slate-500 max-w-sm">This module is under development and will be available soon. Contact your system administrator for more information.</p>
    </div>
  )
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const navigate = (s: string) => setScreen(s as Screen)

  const renderScreen = () => {
    switch (screen) {
      case 'dashboard': return <Dashboard onNavigate={navigate} />
      case 'mark-attendance': return <MarkAttendance />
      case 'teacher-attendance': return <TeacherAttendance />
      case 'student-attendance-details': return <StudentAttendanceDetails />
      case 'attendance-summary': return <AttendanceSummary />
      case 'attendance-report': return <AttendanceReport />
      case 'leave-management': return <LeaveManagement />
      case 'attendance-correction': return <AttendanceCorrection />
      case 'class-timetable':
      case 'teacher-timetable':
      case 'timetable-management':
        return <Timetable />
      case 'transfer-certificate': return <TransferCertificate />
      case 'admissions': return <ComingSoon title="Admissions" />
      case 'students': return <ComingSoon title="Students" />
      case 'teachers': return <ComingSoon title="Teachers" />
      case 'fees': return <ComingSoon title="Fee Management" />
      case 'examinations': return <ComingSoon title="Examinations" />
      case 'reports': return <ComingSoon title="Reports" />
      case 'settings': return <ComingSoon title="Settings" />
      default: return <Dashboard onNavigate={navigate} />
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      <Sidebar
        activeScreen={screen}
        onNavigate={navigate}
        collapsed={sidebarCollapsed}
      />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header
          activeScreen={screen}
          onToggleSidebar={() => setSidebarCollapsed(p => !p)}
        />
        <main className="flex-1 overflow-y-auto p-5">
          {renderScreen()}
        </main>
      </div>
    </div>
  )
}
