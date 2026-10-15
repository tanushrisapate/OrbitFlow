import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  SquareKanban, 
  Menu, 
  X, 
  Moon, 
  Sun,
  FolderKanban,
  Columns3,
  Users,
  ClipboardCheck,
  TrendingUp,
  BarChart3,
  Briefcase,
  ListTodo,
  Rocket,
  CheckCircle2
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export default function LandingPage() {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                <SquareKanban className="h-8 w-8" />
                <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">DevTrack</span>
              </Link>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors">How it Works</a>
              
              <div className="flex items-center space-x-4 ml-4">
                <button 
                  onClick={toggleDarkMode}
                  className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>
                <Link to="/app/dashboard" className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors">Dashboard</Link>
                <Link to="/app/dashboard" className="text-sm font-medium px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors shadow-sm">Open App</Link>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-4">
              <button 
                onClick={toggleDarkMode}
                className="p-2 text-slate-500 dark:text-slate-400"
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a href="#features" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800">Features</a>
              <a href="#how-it-works" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800">How it Works</a>
              <Link to="/app/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800">Dashboard</Link>
              <Link to="/app/dashboard" className="block px-3 py-2 mt-4 text-center rounded-md text-base font-medium bg-indigo-600 text-white hover:bg-indigo-700">Open App</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 lg:pt-32 lg:pb-40">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMTQ4LCAxNjMsIDE4NCwgMC4xNSkiLz48L3N2Zz4=')] dark:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMTQ4LCAxNjMsIDE4NCwgMC4wNSkiLz48L3N2Zz4=')] bg-[length:24px_24px]"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6">
            Plan. Collaborate. <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Deliver.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-slate-600 dark:text-slate-400 mb-10">
            Manage projects, tasks, deadlines and teams from one centralized workspace designed for modern engineering and product teams.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <Link to="/app/dashboard" className="px-8 py-3.5 text-base font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-lg shadow-indigo-600/20 transition-all hover:-translate-y-0.5">
              Open Dashboard
            </Link>
            <Link to="/app/dashboard" className="px-8 py-3.5 text-base font-medium bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg shadow-sm transition-all">
              Launch Orbit Flow
            </Link>
          </div>

          {/* Hero Visual Mockup */}
          <div className="mx-auto max-w-5xl rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 p-2 sm:p-4 transform rotate-1 hover:rotate-0 transition-transform duration-500">
            <div className="rounded-lg sm:rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 overflow-hidden flex h-[400px] sm:h-[500px]">
              {/* Sidebar Mock */}
              <div className="hidden sm:flex flex-col w-48 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4">
                <div className="h-6 w-24 bg-slate-200 dark:bg-slate-800 rounded mb-8"></div>
                <div className="space-y-3">
                  <div className="h-8 w-full bg-indigo-50 dark:bg-indigo-900/20 rounded flex items-center px-3 gap-2">
                    <div className="h-4 w-4 bg-indigo-200 dark:bg-indigo-800 rounded-full"></div>
                    <div className="h-3 w-16 bg-indigo-200 dark:bg-indigo-700 rounded"></div>
                  </div>
                  <div className="h-8 w-full bg-transparent rounded flex items-center px-3 gap-2">
                    <div className="h-4 w-4 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
                    <div className="h-3 w-20 bg-slate-200 dark:bg-slate-700 rounded"></div>
                  </div>
                  <div className="h-8 w-full bg-transparent rounded flex items-center px-3 gap-2">
                    <div className="h-4 w-4 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
                    <div className="h-3 w-12 bg-slate-200 dark:bg-slate-700 rounded"></div>
                  </div>
                </div>
              </div>
              
              {/* Main Area Mock */}
              <div className="flex-1 p-4 sm:p-6 overflow-hidden flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <div className="h-8 w-48 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
                  <div className="flex gap-2">
                    <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                    <div className="h-8 w-24 rounded-md bg-indigo-600"></div>
                  </div>
                </div>

                {/* Kanban Board Mock */}
                <div className="flex-1 flex gap-4 overflow-hidden">
                  {/* Column 1 */}
                  <div className="flex-1 bg-slate-100 dark:bg-slate-800/50 rounded-lg p-3 flex flex-col gap-3">
                    <div className="h-5 w-20 bg-slate-300 dark:bg-slate-600 rounded mb-2"></div>
                    <div className="bg-white dark:bg-slate-900 p-3 rounded shadow-sm border border-slate-200 dark:border-slate-700">
                      <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded mb-3"></div>
                      <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded mb-1"></div>
                      <div className="h-3 w-5/6 bg-slate-100 dark:bg-slate-800 rounded"></div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-3 rounded shadow-sm border border-slate-200 dark:border-slate-700">
                      <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-700 rounded mb-3"></div>
                      <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded"></div>
                    </div>
                  </div>

                  {/* Column 2 */}
                  <div className="flex-1 bg-slate-100 dark:bg-slate-800/50 rounded-lg p-3 flex flex-col gap-3">
                    <div className="h-5 w-24 bg-slate-300 dark:bg-slate-600 rounded mb-2"></div>
                    <div className="bg-white dark:bg-slate-900 p-3 rounded shadow-sm border border-indigo-200 dark:border-indigo-900/50 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                      <div className="h-4 w-2/3 bg-slate-200 dark:bg-slate-700 rounded mb-3"></div>
                      <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded mb-4"></div>
                      <div className="flex justify-between items-center">
                        <div className="h-6 w-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full"></div>
                        <div className="h-6 w-6 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                      </div>
                    </div>
                  </div>

                  {/* Column 3 */}
                  <div className="hidden md:flex flex-1 bg-slate-100 dark:bg-slate-800/50 rounded-lg p-3 flex-col gap-3">
                    <div className="h-5 w-16 bg-slate-300 dark:bg-slate-600 rounded mb-2"></div>
                    <div className="bg-white dark:bg-slate-900 p-3 rounded shadow-sm border border-slate-200 dark:border-slate-700 opacity-60">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="h-4 w-4 rounded-full bg-green-500/20 flex items-center justify-center"><CheckCircle2 className="h-3 w-3 text-green-500" /></div>
                        <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-700 rounded line-through"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Everything you need to ship faster</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Powerful tools designed to keep your team aligned, focused, and productive without the clutter.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: FolderKanban, title: "Project Management", desc: "Organize work into distinct projects and workspaces tailored to your teams." },
              { icon: Columns3, title: "Kanban Workflow", desc: "Visualize progress with drag-and-drop boards that adapt to your agile processes." },
              { icon: Users, title: "Team Collaboration", desc: "Keep everyone in the loop with real-time updates, comments, and mentions." },
              { icon: ClipboardCheck, title: "Task Assignment", desc: "Clearly define responsibilities and ensure no task falls through the cracks." },
              { icon: TrendingUp, title: "Progress Tracking", desc: "Monitor sprint velocity and project health with intuitive visual indicators." },
              { icon: BarChart3, title: "Analytics", desc: "Gain insights into team performance and identify bottlenecks instantly." }
            ].map((feature, i) => (
              <div key={i} className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-6">
                  <feature.icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">How DevTrack Works</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">Get up and running in minutes, not days.</p>
          </div>

          <div className="relative">
            {/* Connecting Line (desktop only) */}
            <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-slate-200 dark:bg-slate-800 z-0"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
              {[
                { icon: Briefcase, step: "1", title: "Create a Workspace", desc: "Set up your company workspace and invite your team members." },
                { icon: ListTodo, step: "2", title: "Create Projects & Tasks", desc: "Define your workflow, build out your backlog, and assign tasks." },
                { icon: Rocket, step: "3", title: "Track Progress & Deliver", desc: "Move tasks across the board, track progress, and celebrate shipping." }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-full bg-white dark:bg-slate-900 shadow-xl border-4 border-slate-50 dark:border-slate-950 flex items-center justify-center mb-6 relative">
                    <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                      {item.step}
                    </div>
                    <item.icon className="h-10 w-10 text-slate-700 dark:text-slate-300" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{item.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 px-4">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">Ready to streamline your workflow?</h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-10">
            Join teams who use DevTrack to ship projects faster.
          </p>
          <Link to="/app/dashboard" className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-xl shadow-indigo-600/20 transition-all hover:-translate-y-1">
            Get Started
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 dark:bg-slate-950 py-12 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <Link to="/" className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-4">
                <SquareKanban className="h-6 w-6" />
                <span className="font-bold text-lg text-slate-900 dark:text-white">DevTrack</span>
              </Link>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Plan. Collaborate. Deliver.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Features</a></li>
                <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Pricing</a></li>
                <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Integrations</a></li>
                <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Changelog</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">About</a></li>
                <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Blog</a></li>
                <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Careers</a></li>
                <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Documentation</a></li>
                <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">API Reference</a></li>
                <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Community</a></li>
                <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Support</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
            <p>© 2026 DevTrack. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-slate-900 dark:hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-slate-900 dark:hover:text-white">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
