import React, { useState, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export default function AdminPanel({ onBackToLanding }) {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountryFilter, setSelectedCountryFilter] = useState('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('All');
  const [selectedRegistrant, setSelectedRegistrant] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // New manual registration form state
  const [newReg, setNewReg] = useState({
    fullName: '',
    email: '',
    whatsapp: '',
    country: 'India',
    fee: 'FREE',
    stuckArea: 'Manual addition via admin panel',
    liveCommit: "Yes, I'll be there live",
    goDeeper: "Yes, if it's right for me",
    status: 'Confirmed',
    notes: ''
  });

  // Fetch from persistent backend DB
  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/admin/registrations`);
      if (res.ok) {
        const data = await res.json();
        if (data.registrations) {
          setRegistrations(data.registrations);
        }
      }
    } catch (err) {
      console.error('Error fetching registrations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  // Update Status in DB
  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/registrations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setRegistrations(prev =>
          prev.map(r => (r.id === id ? { ...r, status: newStatus } : r))
        );
        if (selectedRegistrant && selectedRegistrant.id === id) {
          setSelectedRegistrant(prev => ({ ...prev, status: newStatus }));
        }
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  // Update Notes in DB
  const handleNotesUpdate = async (id, notes) => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/registrations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes })
      });
      if (res.ok) {
        setRegistrations(prev =>
          prev.map(r => (r.id === id ? { ...r, notes } : r))
        );
      }
    } catch (err) {
      console.error('Error updating notes:', err);
    }
  };

  // Delete from DB
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this registration?')) {
      try {
        const res = await fetch(`${API_BASE}/api/admin/registrations/${id}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          setRegistrations(prev => prev.filter(r => r.id !== id));
          if (selectedRegistrant && selectedRegistrant.id === id) {
            setSelectedRegistrant(null);
          }
        }
      } catch (err) {
        console.error('Error deleting registration:', err);
      }
    }
  };

  // Add Manual Entry to DB
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReg)
      });
      if (res.ok) {
        const data = await res.json();
        setRegistrations(prev => [data.registration, ...prev]);
        setIsAddModalOpen(false);
        setNewReg({
          fullName: '',
          email: '',
          whatsapp: '',
          country: 'India',
          fee: 'FREE',
          stuckArea: 'Manual addition via admin panel',
          liveCommit: "Yes, I'll be there live",
          goDeeper: "Yes, if it's right for me",
          status: 'Confirmed',
          notes: ''
        });
      }
    } catch (err) {
      console.error('Error adding registration:', err);
    }
  };

  // Filtered List
  const filteredRegistrations = registrations.filter(r => {
    const matchesSearch =
      (r.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.whatsapp || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.stuckArea || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCountry =
      selectedCountryFilter === 'All' || r.country === selectedCountryFilter;

    const matchesStatus =
      selectedStatusFilter === 'All' || r.status === selectedStatusFilter;

    return matchesSearch && matchesCountry && matchesStatus;
  });

  // Calculate Metrics
  const totalCount = registrations.length;
  const remainingSeats = Math.max(0, 20 - totalCount);
  const indiaCount = registrations.filter(r => r.country === 'India').length;
  const uaeCount = registrations.filter(r => r.country === 'UAE').length;
  const usaCount = registrations.filter(r => r.country === 'USA').length;
  const otherCount = registrations.filter(r => !['India', 'UAE', 'USA'].includes(r.country)).length;
  const liveConfirmedCount = registrations.filter(r => r.liveCommit?.includes('live')).length;

  return (
    <div className="admin-dashboard-layout">
      {/* Top Admin Header */}
      <header className="admin-header">
        <div className="container admin-header-inner">
          <div className="admin-brand">
            <span className="brand-symbol">ॐ</span>
            <div>
              <h1 className="admin-portal-title">Narayan Presence — Admin Portal</h1>
              <p className="admin-portal-subtitle">Founding Batch · Registrations &amp; Live Cohort Manager</p>
            </div>
          </div>

          <div className="admin-header-actions">
            <button onClick={() => setIsAddModalOpen(true)} className="btn btn-sm btn-primary">
              + Add Registrant
            </button>
            <a href={`${API_BASE}/api/admin/export`} className="btn btn-sm btn-outline-admin" download>
              📥 Export CSV
            </a>
            <button
              onClick={() => {
                if (onBackToLanding) onBackToLanding();
                else window.location.href = 'http://localhost:5173/';
              }}
              className="btn btn-sm btn-landing-switch"
            >
              &larr; View Live Website
            </button>
          </div>
        </div>
      </header>

      <main className="container admin-main-content">
        {/* KPI Metrics Dashboard Cards */}
        <section className="admin-metrics-grid">
          <div className="metric-card metric-primary">
            <div className="metric-label">Total Registrations</div>
            <div className="metric-value">{totalCount} <span className="metric-limit">/ 20</span></div>
            <div className="metric-progress-bar">
              <div
                className="metric-progress-fill"
                style={{ width: `${Math.min(100, (totalCount / 20) * 100)}%` }}
              ></div>
            </div>
            <div className="metric-subtext">
              {remainingSeats > 0 ? (
                <span className="text-warning">⚡ {remainingSeats} seats remaining for Batch 01</span>
              ) : (
                <span className="text-success">🎉 Cohort capacity fully filled!</span>
              )}
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Country Breakdown</div>
            <div className="country-pill-breakdown">
              <span className="country-tag">🇮🇳 India: <strong>{indiaCount}</strong></span>
              <span className="country-tag">🇦🇪 UAE: <strong>{uaeCount}</strong></span>
              <span className="country-tag">🇺🇸 USA: <strong>{usaCount}</strong></span>
              {otherCount > 0 && <span className="country-tag">🌍 Other: <strong>{otherCount}</strong></span>}
            </div>
            <div className="metric-subtext">Automatic timezone routing enabled</div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Live Attendance Readiness</div>
            <div className="metric-value">{liveConfirmedCount} <span className="metric-sub-unit">Confirmed Live</span></div>
            <div className="metric-subtext">
              {totalCount > 0
                ? `${Math.round((liveConfirmedCount / totalCount) * 100)}% committed to live sessions`
                : 'Awaiting participants'}
            </div>
          </div>
        </section>

        {/* Search & Filter Toolbar */}
        <div className="admin-toolbar">
          <div className="search-box-wrap">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="admin-search-input"
              placeholder="Search by name, email, WhatsApp, or response..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className="clear-search-btn" onClick={() => setSearchTerm('')}>✕</button>
            )}
          </div>

          <div className="filter-group">
            <label className="filter-label">Country:</label>
            <select
              className="admin-select"
              value={selectedCountryFilter}
              onChange={e => setSelectedCountryFilter(e.target.value)}
            >
              <option value="All">All Countries</option>
              <option value="India">🇮🇳 India</option>
              <option value="UAE">🇦🇪 UAE</option>
              <option value="USA">🇺🇸 USA</option>
              <option value="Other">🌍 Other</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Status:</label>
            <select
              className="admin-select"
              value={selectedStatusFilter}
              onChange={e => setSelectedStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Contacted">Contacted</option>
              <option value="Attended">Attended</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <button onClick={fetchRegistrations} className="btn-icon-refresh" title="Refresh data">
            ↻ Refresh
          </button>
        </div>

        {/* Registrations List / Table */}
        <div className="admin-table-card">
          {loading ? (
            <div className="table-loading-state">Loading registrations from database...</div>
          ) : filteredRegistrations.length === 0 ? (
            <div className="table-empty-state">
              <span className="empty-icon">📂</span>
              <h3>No registrations match your search criteria.</h3>
              <p>Try clearing filters or search keywords.</p>
            </div>
          ) : (
            <div className="table-responsive-wrapper">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>Participant</th>
                    <th>WhatsApp / Phone</th>
                    <th>Country &amp; Fee</th>
                    <th>What Feels Stuck</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRegistrations.map((reg) => {
                    const cleanPhone = (reg.whatsapp || '').replace(/[^0-9]/g, '');
                    const waLink = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                      `Namaste ${reg.fullName}, this is Ranu Patel from Narayan Presence. Welcome to the Founding Batch of The Narayan Method workshop!`
                    )}`;

                    return (
                      <tr key={reg.id} className="admin-row">
                        <td>
                          <div className="participant-cell">
                            <div className="avatar-initials">
                              {(reg.fullName || 'P').charAt(0).toUpperCase()}
                            </div>
                            <div className="participant-info">
                              <strong className="participant-name">{reg.fullName}</strong>
                              <a href={`mailto:${reg.email}`} className="participant-email">{reg.email}</a>
                              <span className="registered-time">
                                {reg.registeredAt ? new Date(reg.registeredAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td>
                          <div className="phone-cell">
                            <span className="phone-number">{reg.whatsapp}</span>
                            <a
                              href={waLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="wa-action-badge"
                              title="Message directly on WhatsApp"
                            >
                              💬 WhatsApp
                            </a>
                          </div>
                        </td>

                        <td>
                          <div className="country-cell">
                            <span className="country-badge">
                              {reg.country === 'India' && '🇮🇳'}
                              {reg.country === 'UAE' && '🇦🇪'}
                              {reg.country === 'USA' && '🇺🇸'}
                              {reg.country === 'Other' && '🌍'} {reg.country}
                            </span>
                            <span className="fee-amount">{reg.fee}</span>
                          </div>
                        </td>

                        <td>
                          <div className="stuck-snippet" onClick={() => setSelectedRegistrant(reg)}>
                            <p className="stuck-text-preview">{reg.stuckArea || 'No details provided'}</p>
                            <span className="view-more-link">View details &rarr;</span>
                          </div>
                        </td>

                        <td>
                          <select
                            className={`status-select status-${(reg.status || 'Confirmed').toLowerCase()}`}
                            value={reg.status || 'Confirmed'}
                            onChange={(e) => handleStatusChange(reg.id, e.target.value)}
                          >
                            <option value="Confirmed">Confirmed</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Attended">Attended</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>

                        <td>
                          <div className="row-actions">
                            <button
                              onClick={() => setSelectedRegistrant(reg)}
                              className="btn-action-icon view"
                              title="Full Details"
                            >
                              👁️
                            </button>
                            <button
                              onClick={() => handleDelete(reg.id)}
                              className="btn-action-icon delete"
                              title="Delete Entry"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Detail Modal for Selected Registrant */}
      {selectedRegistrant && (
        <div className="admin-modal-backdrop" onClick={() => setSelectedRegistrant(null)}>
          <div className="admin-modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Participant Dossier</h3>
              <button className="modal-close-btn" onClick={() => setSelectedRegistrant(null)}>✕</button>
            </div>

            <div className="modal-body">
              <div className="modal-person-top">
                <div className="avatar-initials large">
                  {selectedRegistrant.fullName?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="modal-name">{selectedRegistrant.fullName}</h4>
                  <p className="modal-sub">{selectedRegistrant.email} · {selectedRegistrant.whatsapp}</p>
                </div>
              </div>

              <div className="modal-grid-info">
                <div className="modal-info-item">
                  <label>Country &amp; Cohort:</label>
                  <span>{selectedRegistrant.country} ({selectedRegistrant.fee})</span>
                </div>

                <div className="modal-info-item">
                  <label>Live Commitment:</label>
                  <span>{selectedRegistrant.liveCommit}</span>
                </div>

                <div className="modal-info-item">
                  <label>Open To Going Deeper:</label>
                  <span>{selectedRegistrant.goDeeper}</span>
                </div>

                <div className="modal-info-item">
                  <label>Current Status:</label>
                  <select
                    className="status-select"
                    value={selectedRegistrant.status || 'Confirmed'}
                    onChange={(e) => handleStatusChange(selectedRegistrant.id, e.target.value)}
                  >
                    <option value="Confirmed">Confirmed</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Attended">Attended</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="modal-section-box">
                <label className="modal-label-bold">What Feels Most "Stuck" For Them:</label>
                <div className="stuck-full-content">
                  "{selectedRegistrant.stuckArea || 'None'}"
                </div>
              </div>

              <div className="modal-section-box">
                <label className="modal-label-bold">Coach's Private Notes:</label>
                <textarea
                  className="modal-notes-textarea"
                  placeholder="Add private prep notes for this participant..."
                  defaultValue={selectedRegistrant.notes || ''}
                  onBlur={(e) => handleNotesUpdate(selectedRegistrant.id, e.target.value)}
                />
                <span className="field-hint">Notes auto-save when clicking outside the box.</span>
              </div>

              <div className="modal-actions-footer">
                <a
                  href={`https://wa.me/${(selectedRegistrant.whatsapp || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    `Namaste ${selectedRegistrant.fullName}, this is Ranu Patel from Narayan Presence. Looking forward to having you live this weekend!`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-block"
                >
                  💬 Open WhatsApp Chat with {selectedRegistrant.fullName?.split(' ')[0]}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manual Add Registrant Modal */}
      {isAddModalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setIsAddModalOpen(false)}>
          <div className="admin-modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Manual Registration</h3>
              <button className="modal-close-btn" onClick={() => setIsAddModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleAddSubmit} className="modal-body">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="e.g. Vikram Joshi"
                  value={newReg.fullName}
                  onChange={e => setNewReg({ ...newReg, fullName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  className="form-input"
                  required
                  placeholder="vikram@example.com"
                  value={newReg.email}
                  onChange={e => setNewReg({ ...newReg, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">WhatsApp / Phone *</label>
                <input
                  type="tel"
                  className="form-input"
                  required
                  placeholder="+91 98765 43210"
                  value={newReg.whatsapp}
                  onChange={e => setNewReg({ ...newReg, whatsapp: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Country</label>
                <select
                  className="admin-select"
                  value={newReg.country}
                  onChange={e => {
                    const country = e.target.value;
                    setNewReg({ ...newReg, country, fee: 'FREE' });
                  }}
                >
                  <option value="India">India (FREE)</option>
                  <option value="UAE">UAE (FREE)</option>
                  <option value="USA">USA (FREE)</option>
                  <option value="Other">Other (FREE)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">What Feels Stuck</label>
                <textarea
                  className="form-input form-textarea"
                  rows={2}
                  value={newReg.stuckArea}
                  onChange={e => setNewReg({ ...newReg, stuckArea: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Private Coach Notes</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Optional notes..."
                  value={newReg.notes}
                  onChange={e => setNewReg({ ...newReg, notes: e.target.value })}
                />
              </div>

              <div className="modal-actions-footer">
                <button type="submit" className="btn btn-primary btn-block">
                  Save Registration to Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
