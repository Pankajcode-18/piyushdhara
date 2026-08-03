import React from 'react';

/**
 * ResponsiveTable wrapper component
 * Renders a standard HTML table on Desktop/Laptop (>768px)
 * Automatically converts rows into stacked cards on Mobile (<768px)
 */
const ResponsiveTable = ({ headers, data, renderRow, emptyMessage = "No data records found." }) => {
  if (!data || data.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 1.5rem', background: '#F8FAFC', borderRadius: '1rem', border: '1px dashed #CBD5E1', color: '#64748B' }}>
        <p style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem' }}>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="responsive-table-container responsive-table-card">
      <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.5rem' }}>
        <thead>
          <tr style={{ background: '#F8FAFC', borderRadius: '0.75rem' }}>
            {headers.map((h, idx) => (
              <th
                key={idx}
                style={{
                  padding: '0.85rem 1rem',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  color: '#475569',
                  textAlign: h.align || 'left',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em'
                }}
              >
                {h.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIdx) => (
            <tr key={row._id || rowIdx}>
              {renderRow(row, rowIdx)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResponsiveTable;
