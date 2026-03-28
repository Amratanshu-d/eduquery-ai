import React, { useEffect, useState } from 'react';
import { getStudents, getAIReport, getMLPredictions } from '../api';

const s = {
  title:    { fontSize:'24px', fontWeight:'700', marginBottom:'8px' },
  subtitle: { color:'#64748b', marginBottom:'28px', fontSize:'14px' },
  grid:     { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px' },
  card:     { background:'#1e293b', borderRadius:'12px', padding:'24px', border:'1px solid #334155' },
  label:    { color:'#94a3b8', fontSize:'13px', marginBottom:'6px', display:'block' },
  select:   {
    width:'100%', padding:'10px 14px', borderRadius:'8px',
    background:'#0f172a', border:'1px solid #334155',
    color:'#e2e8f0', fontSize:'14px', marginBottom:'16px', outline:'none'
  },
  btn: {
    width:'100%', padding:'12px', borderRadius:'8px',
    background:'#6366f1', color:'#fff', border:'none',
    fontSize:'14px', fontWeight:'600', cursor:'pointer'
  },
  report: {
    marginTop:'16px', padding:'16px', borderRadius:'8px',
    background:'#0f172a', border:'1px solid #334155',
    color:'#e2e8f0', lineHeight:'1.9', fontSize:'14px'
  },
  table: { width:'100%', borderCollapse:'collapse', fontSize:'13px' },
  th:    { textAlign:'left', color:'#64748b', padding:'10px 12px', borderBottom:'1px solid #334155' },
  td:    { padding:'10px 12px', borderBottom:'1px solid #1e293b', color:'#e2e8f0' },
};

export default function AIReports() {
  const [students,    setStudents]    = useState([]);
  const [selectedId,  setSelectedId]  = useState('');
  const [report,      setReport]      = useState(null);
  const [loading,     setLoading]     = useState(false);
  const [predictions, setPredictions] = useState([]);
  const [predLoading, setPredLoading] = useState(true);

  useEffect(() => {
    getStudents().then(r => {
      setStudents(r.data);
      if (r.data[0]) setSelectedId(r.data[0].student_id);
    });
    getMLPredictions()
      .then(r => setPredictions(r.data))
      .finally(() => setPredLoading(false));
  }, []);

  const handleGenerate = async () => {
    if (!selectedId) return;
    setLoading(true); setReport(null);
    try {
      const res = await getAIReport(selectedId);
      setReport(res.data);
    } catch {
      setReport({ ai_report: '⚠ Error — check your GEMINI_API_KEY in backend/.env' });
    }
    setLoading(false);
  };

  const riskColor = (label) =>
    label === 'HIGH RISK' ? '#ef4444' :
    label === 'MEDIUM'    ? '#f59e0b' : '#10b981';

  return (
    <>
      <div style={s.title}>🤖 AI Reports</div>
      <div style={s.subtitle}>ML risk predictions + Gemini AI performance summaries</div>
      <div style={s.grid}>

        {/* Left — AI Report Generator */}
        <div style={s.card}>
          <div style={{ fontWeight:'600', marginBottom:'16px', color:'#e2e8f0' }}>
            ✨ AI Report Generator
          </div>
          <label style={s.label}>Select a student</label>
          <select style={s.select} value={selectedId}
            onChange={e => { setSelectedId(e.target.value); setReport(null); }}>
            {students.map(st => (
              <option key={st.student_id} value={st.student_id}>
                {st.full_name} — avg: {st.avg_marks}
              </option>
            ))}
          </select>
          <button style={s.btn} onClick={handleGenerate} disabled={loading}>
            {loading ? '✨ Generating...' : '✨ Generate AI Report'}
          </button>
          {report && (
            <div style={s.report}>
              <div style={{ color:'#6366f1', fontWeight:'600', marginBottom:'8px' }}>
                📄 {report.student_name} — {report.avg_marks}/100 avg
              </div>
              {report.ai_report}
            </div>
          )}
        </div>

        {/* Right — ML Predictions Table */}
        <div style={s.card}>
          <div style={{ fontWeight:'600', marginBottom:'16px', color:'#e2e8f0' }}>
            🔬 ML Risk Predictions
          </div>
          {predLoading
            ? <div style={{ color:'#64748b' }}>Loading predictions...</div>
            : <div style={{ maxHeight:'500px', overflowY:'auto' }}>
                <table style={s.table}>
                  <thead>
                    <tr>
                      {['Student','Avg','Attend%','Risk %','Label'].map(h =>
                        <th key={h} style={s.th}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {predictions.map(p => (
                      <tr key={p.student_id}>
                        <td style={s.td}>{p.full_name}</td>
                        <td style={s.td}>{p.avg_marks}</td>
                        <td style={s.td}>{p.attend_pct}%</td>
                        <td style={s.td}>
                          <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                            <div style={{ flex:1, background:'#334155', borderRadius:'4px', height:'5px' }}>
                              <div style={{
                                width:`${p.risk_score}%`,
                                background: riskColor(p.risk_label),
                                height:'5px', borderRadius:'4px'
                              }}/>
                            </div>
                            <span style={{ fontSize:'12px' }}>{p.risk_score}%</span>
                          </div>
                        </td>
                        <td style={{ ...s.td, color: riskColor(p.risk_label), fontWeight:'600', fontSize:'12px' }}>
                          {p.risk_label}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
          }
        </div>
      </div>
    </>
  );
}