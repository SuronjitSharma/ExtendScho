import { useState } from 'react'
import {
  LayoutDashboard, Users, GraduationCap, BookOpen, CalendarCheck,
  BarChart3, Clock, DollarSign, ClipboardList, Settings,
  ChevronDown, ChevronRight, School, UserCheck, TrendingUp,
  ClipboardCheck, Calendar, FileBadge, BookCheck, CalendarX, RefreshCw
} from 'lucide-react'

interface NavItem {
  id: string
  label: string
  icon: React.ReactNode
  children?: NavItem[]
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={15} /> },
  { id: 'admissions', label: 'Admissions', icon: <School size={15} /> },
  { id: 'students', label: 'Students', icon: <GraduationCap size={15} /> },
  { id: 'teachers', label: 'Teachers', icon: <Users size={15} /> },
  {
    id: 'attendance', label: 'Attendance', icon: <CalendarCheck size={15} />,
    children: [
      { id: 'mark-attendance', label: 'Mark Attendance', icon: <ClipboardCheck size={13} /> },
      { id: 'teacher-attendance', label: 'Teacher Attendance', icon: <UserCheck size={13} /> },
      { id: 'student-attendance-details', label: 'Student Details', icon: <BookCheck size={13} /> },
      { id: 'attendance-summary', label: 'Attendance Summary', icon: <BarChart3 size={13} /> },
      { id: 'attendance-report', label: 'Attendance Reports', icon: <TrendingUp size={13} /> },
      { id: 'leave-management', label: 'Leave Management', icon: <CalendarX size={13} /> },
      { id: 'attendance-correction', label: 'Corrections', icon: <RefreshCw size={13} /> },
    ],
  },
  {
    id: 'timetable', label: 'Timetable', icon: <Clock size={15} />,
    children: [
      { id: 'class-timetable', label: 'Class Timetable', icon: <Calendar size={13} /> },
      { id: 'teacher-timetable', label: 'Teacher Timetable', icon: <Users size={13} /> },
      { id: 'timetable-management', label: 'Timetable Management', icon: <Settings size={13} /> },
    ],
  },
  { id: 'transfer-certificate', label: 'Transfer Certificates', icon: <FileBadge size={15} /> },
  { id: 'fees', label: 'Fees', icon: <DollarSign size={15} /> },
  { id: 'examinations', label: 'Examinations', icon: <BookOpen size={15} /> },
  { id: 'reports', label: 'Reports', icon: <ClipboardList size={15} /> },
  { id: 'settings', label: 'Settings', icon: <Settings size={15} /> },
]

interface SidebarProps {
  activeScreen: string
  onNavigate: (screen: string) => void
  collapsed: boolean
}

export default function Sidebar({ activeScreen, onNavigate, collapsed }: SidebarProps) {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    attendance: true,
    timetable: false,
  })

  const toggleGroup = (id: string) => {
    setOpenGroups(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const isActive = (id: string) => activeScreen === id

  const handleNavClick = (item: NavItem) => {
    if (item.children) {
      toggleGroup(item.id)
      if (!openGroups[item.id] && !collapsed) {
        // open first child by default
      }
    } else {
      onNavigate(item.id)
    }
  }

  return (
    <aside
      className={`h-screen flex flex-col transition-all duration-300 flex-shrink-0 ${collapsed ? 'w-14' : 'w-56'}`}
      style={{ background: '#0f172a' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-3 py-4 border-b border-white/10 flex-shrink-0">
        <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
          <School size={16} className="text-white" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-white font-800 text-sm leading-tight truncate">EduManage</p>
            <p className="text-slate-500 text-[10px] truncate">School ERP Pro</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto sidebar-scroll py-3 px-2 space-y-0.5">
        {navItems.map(item => {
          const active = isActive(item.id) || (item.children?.some(c => isActive(c.id)))
          const open = openGroups[item.id]

          return (
            <div key={item.id}>
              <button
                onClick={() => handleNavClick(item)}
                title={collapsed ? item.label : undefined}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all duration-150 cursor-pointer group ${
                  active && !item.children
                    ? 'bg-indigo-600 text-white'
                    : active
                    ? 'bg-white/10 text-white'
                    : 'text-slate-400 hover:bg-white/8 hover:text-slate-200'
                }`}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {!collapsed && (
                  <>
                    <span className="flex-1 text-[13px] font-500 truncate">{item.label}</span>
                    {item.children && (
                      <span className="text-slate-500 group-hover:text-slate-300">
                        {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                      </span>
                    )}
                  </>
                )}
              </button>

              {/* Sub items */}
              {!collapsed && item.children && open && (
                <div className="ml-4 mt-0.5 pl-2 border-l border-white/10 space-y-0.5">
                  {item.children.map(child => (
                    <button
                      key={child.id}
                      onClick={() => onNavigate(child.id)}
                      className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-left text-[12px] font-500 transition-all cursor-pointer ${
                        isActive(child.id)
                          ? 'bg-indigo-600 text-white'
                          : 'text-slate-400 hover:bg-white/8 hover:text-slate-200'
                      }`}
                    >
                      {child.icon}
                      <span className="truncate">{child.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-white/10 p-3 flex items-center gap-2.5">
        <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-700">
          PS
        </div>
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <p className="text-white text-xs font-600 truncate">Mrs. Priya Sharma</p>
            <p className="text-slate-500 text-[10px] truncate">Teacher</p>
          </div>
        )}
      </div>
    </aside>
  )
}
