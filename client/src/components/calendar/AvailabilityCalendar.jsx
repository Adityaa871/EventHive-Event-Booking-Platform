import { useState, useEffect } from 'react';
import { getMonthAvailability } from '../../services/availabilityService';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const AvailabilityCalendar = ({ selectedDate, onSelectDate, packageId = null }) => {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const d = selectedDate ? new Date(selectedDate) : new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const [unavailableDates, setUnavailableDates] = useState(new Set());
  const [dateDetails, setDateDetails] = useState({});
  const [loading, setLoading] = useState(false);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth() + 1; // 1-12

  useEffect(() => {
    let active = true;
    const fetchDates = async () => {
      try {
        setLoading(true);
        const data = await getMonthAvailability(year, month, packageId);
        if (active) {
          setUnavailableDates(new Set(data?.unavailableDates || []));
          setDateDetails(data?.dateDetails || {});
        }
      } catch (err) {
        console.error('Failed to load availability:', err);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchDates();
    return () => {
      active = false;
    };
  }, [year, month, packageId]);

  const handlePrevMonth = () => {
    const today = new Date();
    // Don't navigate before current month
    if (year === today.getFullYear() && month - 1 < today.getMonth() + 1) return;
    setCurrentMonth(new Date(year, month - 2, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month, 1));
  };

  // Build grid of days
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay();
  const totalDays = new Date(year, month, 0).getDate();

  const days = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    days.push(null);
  }
  for (let day = 1; day <= totalDays; day++) {
    days.push(day);
  }

  const todayStr = new Date().toISOString().split('T')[0];

  const getDayString = (day) => {
    if (!day) return '';
    const mStr = String(month).padStart(2, '0');
    const dStr = String(day).padStart(2, '0');
    return `${year}-${mStr}-${dStr}`;
  };

  return (
    <div
      className="card-tactile p-3"
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
      }}
    >
      {/* Month Navigation */}
      <div className="d-flex align-items-center justify-content-between mb-3 px-1">
        <span className="fw-bold text-dark small text-uppercase" style={{ letterSpacing: '0.04em' }}>
          {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </span>
        <div className="d-flex gap-1">
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary btn-tactile p-1 px-2"
            onClick={handlePrevMonth}
            aria-label="Previous month"
            style={{ fontSize: '12px' }}
          >
            ←
          </button>
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary btn-tactile p-1 px-2"
            onClick={handleNextMonth}
            aria-label="Next month"
            style={{ fontSize: '12px' }}
          >
            →
          </button>
        </div>
      </div>

      {/* Weekday Labels */}
      <div className="d-grid text-center mb-2" style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}>
        {DAYS_OF_WEEK.map((d) => (
          <span
            key={d}
            className="text-muted fw-semibold"
            style={{ fontSize: '11px', textTransform: 'uppercase' }}
          >
            {d}
          </span>
        ))}
      </div>

      {/* Days Grid */}
      <div className="d-grid gap-1" style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}>
        {days.map((day, idx) => {
          if (!day) {
            return <div key={`empty-${idx}`} style={{ height: '36px' }} />;
          }

          const dayStr = getDayString(day);
          const isPast = dayStr <= todayStr;
          const isUnavailable = unavailableDates.has(dayStr);
          const isSelected = selectedDate === dayStr;
          const isDisabled = isPast || isUnavailable;

          let btnBg = 'transparent';
          let btnColor = 'var(--text-primary)';
          let borderColor = 'transparent';

          if (isSelected) {
            btnBg = 'var(--brand-primary)';
            btnColor = '#ffffff';
          } else if (isUnavailable) {
            btnBg = 'var(--status-cancelled-bg)';
            btnColor = 'var(--status-cancelled-text)';
            borderColor = 'var(--status-cancelled-border)';
          }

          return (
            <button
              key={dayStr}
              type="button"
              disabled={isDisabled}
              onClick={() => onSelectDate(dayStr)}
              className="btn p-0 d-flex flex-column align-items-center justify-content-center"
              style={{
                height: '36px',
                fontSize: '13px',
                fontWeight: isSelected ? '700' : '500',
                backgroundColor: btnBg,
                color: btnColor,
                border: `1px solid ${borderColor}`,
                borderRadius: 'var(--radius-sm)',
                opacity: isPast ? 0.35 : 1,
                cursor: isDisabled ? 'not-allowed' : 'pointer',
              }}
              title={
                isUnavailable
                  ? dateDetails[dayStr]?.reason || 'Date unavailable'
                  : isPast
                  ? 'Past date'
                  : `Select ${dayStr}`
              }
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="d-flex align-items-center justify-content-between mt-3 pt-2 border-top small text-muted" style={{ fontSize: '11px' }}>
        <div className="d-flex align-items-center gap-1">
          <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: 'var(--brand-primary)' }} />
          <span>Selected</span>
        </div>
        <div className="d-flex align-items-center gap-1">
          <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: 'var(--status-cancelled-bg)', border: '1px solid var(--status-cancelled-border)' }} />
          <span>Booked/Blocked</span>
        </div>
        <div className="d-flex align-items-center gap-1">
          <span style={{ width: '8px', height: '8px', borderRadius: '2px', border: '1px solid var(--border-medium)' }} />
          <span>Available</span>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityCalendar;
