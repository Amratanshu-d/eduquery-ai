import AIReports from './AIReports';
import React, { useEffect, useState } from 'react';
import { getDashboardSummary, getAtRisk, getRankings, getPassRate, getTopPerformers } from '../api';
import StatCard from '../components/StatCard';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#6366f1','#10b981','#f59e0b','#ef4444','#3b82f6'];

const styles = {
  layout: { display: 'flex', minHeight: '100vh' },
  sidebar: {
    width: '220px', background: '#1e293b', padding: '24px 16px',
    borderRight: '1px solid #334155', flexShrink: 0
  },
  logo: { fontSize: '18px', fontWeight: '700', color: '#6366f1', marginBottom: '32px' },
  navItem: (active) => ({
    padding: '10px 14px', borderRadius: '8px', cursor: 'pointer',
    marginBottom: '4px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '10px',
    background: active ? '#6366f133' : 'transparent',
    color: active ? '#6366f1' : '#94a3b8'
  }),
  main: { flex: 1, padding: '32px', overflowY: 'auto' },
  pageTitle: { fontSize: '24px', fontWeight: '700', marginBottom: '8px' },
  pageSubtitle: { color: '#64748b', marginBottom: '28px', fontSize: '14px' },
  grid4: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '28px' },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px' },
  card: { background: '#1e293b', borderRadius: '12px', padding: '24px', border: '1px solid #334155' },
  cardTitle: { fontWeight: '600', marginBottom: '16px', color: '#e2e8f0' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '13px' },
  th: { textAlign: 'left', color: '#64748b', padding: '10px 12px', borderBottom: '1px solid #334155' },
  td: { padding: '10px 12px', borderBottom: '1px solid #1e293b', color: '#e2e8f0' },
  badge: (grade) => ({
    padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
    background: grade === 'A+' ? '#10b98122' : grade === 'A' ? '#6366f122' :
                grade === 'B'  ? '#f59e0b22' : grade === 'F' ? '#ef444422' : '#94a3b822',
    color: grade === 'A+' ? '#10b981' : grade === 'A' ? '#6366f1' :
           grade === 'B'  ? '#f59e0b' : grade === 'F' ? '#ef4444' : '#94a3b8'
  }),
  riskBadge: {
    padding: '3px 10px', borderRadius: '20px', fontSize: '11px',
    background: '#ef444422', color: '#ef4444', fontWeight: '600'
  },
  logoutBtn: {
    marginTop: 'auto', padding: '10px 14px', borderRadius: '8px',
    background: 'transparent', border: '1px solid #334155',
    color: '#94a3b8', cursor: 'pointer', fontSize: '13px', width: '100%'
  }
};

const NAV = [
  { id: 'dashboard', label: 'Dashboard',     icon: '📊' },
  { id: 'rankings',  label: 'Rankings',      icon: '🏆' },
  { id: 'atrisk',    label: 'At-Risk',        icon: '⚠️' },
  { id: 'subjects',  label: 'Subjects',       icon: '📚' },
  { id: 'toppers',   label: 'Top Performers', icon: '⭐' },
  { id: 'ai', label: 'AI Reports', icon: '🤖' },
];

export default function Dashboard({ onLogout }) {
  const [page,       setPage]       = useState('dashboard');
  const [summary,    setSummary]    = useState(null);
  const [atRisk,     setAtRisk]     = useState([]);
  const [rankings,   setRankings]   = useState([]);
  const [passRate,   setPassRate]   = useState([]);
  const [toppers,    setToppers]    = useState([]);

  useEffect(() => {
    getDashboardSummary().then(r => setSummary(r.data));
    getAtRisk()          .then(r => setAtRisk(r.data));
    getRankings()        .then(r => setRankings(r.data));
    getPassRate()        .then(r => setPassRate(r.data));
    getTopPerformers()   .then(r => setToppers(r.data));
  }, []);

  // Bar chart data from rankings
  const gradeData = ['A+','A','B','C','F'].map(g => ({
    grade: g,
    count: rankings.filter(s => s.grade === g).length
  }));

  return (
    <div style={styles.layout}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.logo}>📚 EduQuery AI</div>
        {NAV.map(n => (
          <div key={n.id} style={styles.navItem(page === n.id)} onClick={() => setPage(n.id)}>
            <span>{n.icon}</span>{n.label}
          </div>
        ))}
        <div style={{ flex: 1 }} />
        <button style={{ ...styles.logoutBtn, marginTop: '32px' }} onClick={onLogout}>
          🚪 Logout
        </button>
      </div>

      {/* Main content */}
      <div style={styles.main}>

        {/* ── DASHBOARD PAGE ── */}
        {page === 'dashboard' && (
          <>
            <div style={styles.pageTitle}>Welcome back 👋</div>
            <div style={styles.pageSubtitle}>Here's your institution overview for today</div>

            {/* Stat cards */}
            <div style={styles.grid4}>
              <StatCard title="Total Students"  value={summary?.total_students ?? '—'} color="#6366f1" subtitle="Enrolled"/>
              <StatCard title="At-Risk Students" value={summary?.at_risk_count  ?? '—'} color="#ef4444" subtitle="Need attention"/>
              <StatCard title="Subjects"         value={summary?.total_subjects  ?? '—'} color="#10b981" subtitle="Active courses"/>
              <StatCard title="Overall Average"  value={summary?.overall_avg     ?? '—'} color="#f59e0b" subtitle="Marks out of 100"/>
            </div>

            {/* Charts */}
            <div style={styles.grid2}>
              <div style={styles.card}>
                <div style={styles.cardTitle}>Grade distribution</div>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={gradeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155"/>
                    <XAxis dataKey="grade" stroke="#64748b"/>
                    <YAxis stroke="#64748b"/>
                    <Tooltip contentStyle={{ background:'#1e293b', border:'1px solid #334155' }}/>
                    <Bar dataKey="count" radius={[4,4,0,0]}>
                      {gradeData.map((_, i) => <Cell key={i} fill={COLORS[i]}/>)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div style={styles.card}>
                <div style={styles.cardTitle}>Subject pass rates</div>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={passRate} dataKey="pass_rate_pct"
                         nameKey="subject_name" cx="50%" cy="50%" outerRadius={80} label>
                      {passRate.map((_, i) => <Cell key={i} fill={COLORS[i]}/>)}
                    </Pie>
                    <Tooltip contentStyle={{ background:'#1e293b', border:'1px solid #334155' }}/>
                    <Legend/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        {/* ── RANKINGS PAGE ── */}
        {page === 'rankings' && (
          <>
            <div style={styles.pageTitle}>🏆 Student Rankings</div>
            <div style={styles.pageSubtitle}>All students ranked by average marks</div>
            <div style={styles.card}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    {['Rank','Student','Avg Marks','Grade'].map(h =>
                      <th key={h} style={styles.th}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {rankings.map(s => (
                    <tr key={s.student_id}>
                      <td style={styles.td}>#{s.rank_overall}</td>
                      <td style={styles.td}>{s.full_name}</td>
                      <td style={styles.td}>{s.avg_marks}</td>
                      <td style={styles.td}><span style={styles.badge(s.grade)}>{s.grade}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ── AT-RISK PAGE ── */}
        {page === 'atrisk' && (
          <>
            <div style={styles.pageTitle}>⚠️ At-Risk Students</div>
            <div style={styles.pageSubtitle}>Students with avg marks below 50 AND attendance below 60%</div>
            <div style={styles.card}>
              {atRisk.length === 0
                ? <div style={{ color:'#10b981', textAlign:'center', padding:'40px' }}>
                    ✅ No at-risk students found!
                  </div>
                : <table style={styles.table}>
                    <thead>
                      <tr>{['Student','Avg Marks','Attendance %','Status'].map(h =>
                        <th key={h} style={styles.th}>{h}</th>)}</tr>
                    </thead>
                    <tbody>
                      {atRisk.map(s => (
                        <tr key={s.student_id}>
                          <td style={styles.td}>{s.full_name}</td>
                          <td style={{ ...styles.td, color:'#ef4444' }}>{s.avg_marks}</td>
                          <td style={{ ...styles.td, color:'#f59e0b' }}>{s.attend_pct}%</td>
                          <td style={styles.td}><span style={styles.riskBadge}>AT RISK</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
              }
            </div>
          </>
        )}

        {/* ── SUBJECTS PAGE ── */}
        {page === 'subjects' && (
          <>
            <div style={styles.pageTitle}>📚 Subject Pass Rates</div>
            <div style={styles.pageSubtitle}>Final exam pass/fail breakdown per subject</div>
            <div style={styles.card}>
              <table style={styles.table}>
                <thead>
                  <tr>{['Subject','Total Students','Passed','Failed','Pass Rate'].map(h =>
                    <th key={h} style={styles.th}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {passRate.map((s,i) => (
                    <tr key={i}>
                      <td style={styles.td}>{s.subject_name}</td>
                      <td style={styles.td}>{s.total_students}</td>
                      <td style={{ ...styles.td, color:'#10b981' }}>{s.passed}</td>
                      <td style={{ ...styles.td, color:'#ef4444' }}>{s.failed}</td>
                      <td style={styles.td}>
                        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                          <div style={{ flex:1, background:'#334155', borderRadius:'4px', height:'6px' }}>
                            <div style={{ width:`${s.pass_rate_pct}%`, background:'#10b981', height:'6px', borderRadius:'4px' }}/>
                          </div>
                          {s.pass_rate_pct}%
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ── TOP PERFORMERS PAGE ── */}
        {page === 'toppers' && (
          <>
            <div style={styles.pageTitle}>⭐ Top Performers</div>
            <div style={styles.pageSubtitle}>Best student in each subject</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'16px' }}>
              {toppers.map((t,i) => (
                <div key={i} style={{ ...styles.card, borderTop:`3px solid ${COLORS[i % COLORS.length]}` }}>
                  <div style={{ color:'#64748b', fontSize:'12px', marginBottom:'8px' }}>{t.subject_name}</div>
                  <div style={{ fontWeight:'700', fontSize:'18px', marginBottom:'4px' }}>{t.full_name}</div>
                  <div style={{ color: COLORS[i % COLORS.length], fontWeight:'600' }}>{t.avg_marks} avg marks</div>
                </div>
              ))}
            </div>
          </>
        )}

         {/* ── AI REPORTS PAGE ── */}
        {page === 'ai' && <AIReports />}

      </div>
    </div>
  );
}