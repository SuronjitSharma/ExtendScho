import { Bell, Search, Menu, ChevronDown, LogOut, User, Settings } from 'lucide-react'
import { useState } from 'react'

const screenTitles: Record<string, string> = {
  dashboard: 'Dashboard',
  'mark-attendance': 'Mark Attendance',
  'teacher-attendance': 'Teacher Attendance',
  'student-attendance-details': 'Student Attendance Details',
  'attendance-summary': 'Attendance Summary',
  'attendance-report': 'Attendance Reports',
  'leave-management': 'Leave Management',
  'attendance-correction': 'Attendance Corrections',
  'class-timetable': 'Class Timetable',
  'teacher-timetable': 'Teacher Timetable',
  'timetable-management': 'Timetable Management',
  'transfer-certificate': 'Transfer Certificates',
  fees: 'Fee Management',
  examinations: 'Examinations',
  reports: 'Reports',
  settings: 'Settings',
  admissions: 'Admissions',
  students: 'Students',
  teachers: 'Teachers',
}

interface HeaderProps {
  activeScreen: string
  onToggleSidebar: () => void
}

export default function Header({ activeScreen, onToggleSidebar }: HeaderProps) {
  const [showProfile, setShowProfile] = useState(false)
  const [showNotifs, setShowNotifs] = useState(false)

  const notifs = [
    { id: 1, text: 'Attendance not submitted for Class 10-B Period 3', time: '5m ago', type: 'warning' },
    { id: 2, text: 'Leave request from Karan Gupta approved', time: '1h ago', type: 'success' },
    { id: 3, text: 'Timetable conflict detected for Monday Period 4', time: '2h ago', type: 'error' },
    { id: 4, text: 'TC #TC/2024-25/004 generated for Divya Menon', time: '3h ago', type: 'info' },
  ]

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center px-4 gap-3 flex-shrink-0 z-20">
      {/* Toggle sidebar */}
      <button
        onClick={onToggleSidebar}
        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
      >
        <Menu size={16} />
      </button>

      {/* Title */}
      <div className="flex-1 min-w-0">
        <h1 className="text-sm font-700 text-slate-900 truncate">{screenTitles[activeScreen] || 'EduManage'}</h1>
        <p className="text-xs text-slate-400">Academic Year 2024–25</p>
      </div>

      {/* Search */}
      <div className="hidden md:flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-1.5 w-52">
        <Search size={13} className="text-slate-400 flex-shrink-0" />
        <input
          placeholder="Search students, classes..."
          className="bg-transparent text-xs text-slate-700 outline-none w-full placeholder:text-slate-400"
        />
      </div>

      {/* Notifs */}
      <div className="relative">
        <button
          onClick={() => { setShowNotifs(!showNotifs); setShowProfile(false) }}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 transition-colors relative"
        >
          <Bell size={15} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        {showNotifs && (
          <div className="absolute right-0 top-10 w-80 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <p className="text-sm font-700 text-slate-800">Notifications</p>
              <span className="text-xs text-indigo-600 font-600 cursor-pointer hover:underline">Mark all read</span>
            </div>
            <div className="divide-y divide-slate-50">
              {notifs.map(n => (
                <div key={n.id} className="px-4 py-3 hover:bg-slate-50 cursor-pointer">
                  <div className="flex items-start gap-2.5">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                      n.type === 'warning' ? 'bg-amber-400' : n.type === 'success' ? 'bg-emerald-400' : n.type === 'error' ? 'bg-red-400' : 'bg-blue-400'
                    }`} />
                    <div className="min-w-0">
                      <p className="text-xs text-slate-700 leading-relaxed">{n.text}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{n.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-4 py-2.5 border-t border-slate-100 text-center">
              <span className="text-xs text-indigo-600 font-600 cursor-pointer hover:underline">View all notifications</span>
            </div>
          </div>
        )}
      </div>

      {/* Profile */}
      <div className="relative">
        <button
          onClick={() => { setShowProfile(!showProfile); setShowNotifs(false) }}
          className="flex items-center gap-2 hover:bg-slate-100 rounded-lg px-2 py-1.5 transition-colors"
        >
          <div className="w-7 h-7 bg-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-700">PS</div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-600 text-slate-800 leading-tight">Mrs. Priya Sharma</p>
            <p className="text-[10px] text-slate-400 leading-tight">Class Teacher – 10A</p>
          </div>
          <ChevronDown size={12} className="text-slate-400 hidden md:block" />
        </button>
        {showProfile && (
          <div className="absolute right-0 top-10 w-48 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden py-1">
            <button className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-slate-50 text-xs text-slate-700 font-500">
              <User size={13} className="text-slate-400" /> My Profile
            </button>
            <button className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-slate-50 text-xs text-slate-700 font-500">
              <Settings size={13} className="text-slate-400" /> Settings
            </button>
            <div className="my-1 border-t border-slate-100" />
            <button className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-red-50 text-xs text-red-600 font-500">
              <LogOut size={13} /> Sign Out
            </button>
          </div>
        )}
      </div>

      {/* Overlay to close dropdowns */}
      {(showProfile || showNotifs) && (
        <div className="fixed inset-0 z-40" onClick={() => { setShowProfile(false); setShowNotifs(false) }} />
      )}
    </header>
  )
}
