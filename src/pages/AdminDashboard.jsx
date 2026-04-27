import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3, Users, ShieldAlert, Globe, MessageSquare,
  ArrowUpRight, ArrowDownRight, Clock, Search
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getStats, getLogs } from '../services/loggingService';

export default function AdminDashboard() {
  const { t } = useApp();
  const [stats, setStats] = useState(getStats());
  const [recentIncidents, setRecentIncidents] = useState(getLogs());

  useEffect(() => {
    // Refresh every 5 seconds for "real-time" feel
    const interval = setInterval(() => {
      setStats(getStats());
      setRecentIncidents(getLogs());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const topIntents = [
    { name: 'Voter Registration', count: 3200 + (stats.totalMessages % 50), growth: 12 },
    { name: 'Polling Station Search', count: 2100 + (stats.totalMessages % 30), growth: 8 },
    { name: 'Eligibility Check', count: 1500 + (stats.totalMessages % 20), growth: -2 },
    { name: 'Document Checklist', count: 1200 + (stats.totalMessages % 10), growth: 15 },
  ];

  const languageBreakdown = [
    { lang: 'English', percentage: 45 },
    { lang: 'Hindi', percentage: 35 },
    { lang: 'Bengali', percentage: 10 },
    { lang: 'Others', percentage: 10 },
  ];

  const exportReport = () => {
    const logs = getLogs();
    const csvContent = "data:text/csv;charset=utf-8,"
      + "Type,Query,Resolution,Timestamp\n"
      + logs.map(l => `"${l.type}","${l.query.replace(/"/g, '""')}","${l.resolution}","${new Date(l.timestamp).toLocaleString()}"`).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Matdata_Mitra_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8" style={{ paddingTop: 'calc(var(--topbar-height) + 24px)' }}>
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-india-navy">{t('Admin Intelligence Dashboard')}</h1>
          <p className="text-sm text-mid-gray">{t('Monitoring Matdata Mitra performance & safety')}</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 rounded-lg bg-white border border-light-gray text-sm font-medium flex items-center gap-2">
            <Clock size={16} /> Last 24 Hours
          </button>
          <button
            onClick={exportReport}
            className="px-4 py-2 rounded-lg bg-india-navy text-white text-sm font-medium hover:bg-blue-900 transition-colors shadow-md"
          >
            {t('Export Report')}
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: t('total_users', 'Total Users'), value: stats.totalUsers, icon: Users, color: 'blue' },
          { label: t('total_chats', 'Total Chats'), value: stats.totalMessages, icon: MessageSquare, color: 'indigo' },
          { label: t('rumors_blocked', 'Rumors Blocked'), value: stats.rumorsDetected, icon: ShieldAlert, color: 'red' },
          { label: t('avg_latency', 'Avg Latency'), value: stats.avgLatency + 's', icon: Clock, color: 'green' },
          { label: t('satisfaction', 'Satisfaction'), value: Math.round(stats.satisfaction) + '%', icon: BarChart3, color: 'orange' },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-4 rounded-2xl bg-white border border-light-gray shadow-sm"
          >
            <div className={`w-10 h-10 rounded-xl bg-${item.color}-50 flex items-center justify-center mb-3 text-${item.color}-600`}>
              <item.icon size={20} />
            </div>
            <div className="text-xs text-mid-gray font-medium">{item.label}</div>
            <div className="text-xl font-bold text-near-black mt-1">{item.value}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Intents */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-light-gray">
          <h3 className="text-lg font-bold text-india-navy mb-6">{t('top_user_intents', 'Top User Intents')}</h3>
          <div className="space-y-6">
            {topIntents.map((intent, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-near-black">{intent.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-mid-gray">{intent.count} queries</span>
                    <span className={`flex items-center text-xs ${intent.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {intent.growth > 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                      {Math.abs(intent.growth)}%
                    </span>
                  </div>
                </div>
                <div className="h-2 w-full bg-off-white rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(intent.count / 3200) * 100}%` }}
                    className="h-full bg-india-navy rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Language Breakdown */}
        <div className="p-6 rounded-2xl bg-white border border-light-gray">
          <h3 className="text-lg font-bold text-india-navy mb-6">{t('language_adoption', 'Language Adoption')}</h3>
          <div className="space-y-6">
            {languageBreakdown.map((lang, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full border-4 border-off-white flex items-center justify-center relative">
                  <svg className="w-full h-full -rotate-90">
                    <circle
                      cx="24" cy="24" r="20" fill="transparent"
                      stroke="var(--navy)" strokeWidth="4"
                      strokeDasharray={`${(lang.percentage / 100) * 125} 125`}
                    />
                  </svg>
                  <span className="absolute text-[10px] font-bold">{lang.percentage}%</span>
                </div>
                <div>
                  <div className="text-sm font-bold text-near-black">{lang.lang}</div>
                  <div className="text-xs text-mid-gray">Regional Activity</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Incidents */}
      <div className="p-6 rounded-2xl bg-white border border-light-gray">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-india-navy">{t('Safety & Moderation Log')}</h3>
          <button className="text-sm text-india-navy font-medium">{t('View All Logs')}</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs text-mid-gray border-bottom">
                <th className="pb-3 font-medium">Type</th>
                <th className="pb-3 font-medium">Query Snippet</th>
                <th className="pb-3 font-medium">Resolution</th>
                <th className="pb-3 font-medium">Timestamp</th>
                <th className="pb-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {recentIncidents.map((incident) => (
                <tr key={incident.id} className="border-t border-light-gray">
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${incident.type === 'Rumor' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' :
                      incident.type === 'Safety' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' :
                        'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      }`}>
                      {incident.type}
                    </span>
                  </td>
                  <td className="py-4 font-medium text-near-black">"{incident.query}"</td>
                  <td className="py-4 text-mid-gray">{incident.resolution}</td>
                  <td className="py-4 text-mid-gray">{new Date(incident.timestamp).toLocaleTimeString()}</td>
                  <td className="py-4">
                    <button className="p-2 hover:bg-off-white rounded-lg transition-colors">
                      <ArrowUpRight size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
