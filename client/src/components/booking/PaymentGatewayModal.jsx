import { useState } from 'react';
import { validateCoupon } from '../../services/couponService';

const TOP_BANKS = [
  { id: 'HDFC', name: 'HDFC Bank', icon: 'bi-bank' },
  { id: 'SBI', name: 'State Bank of India', icon: 'bi-bank2' },
  { id: 'ICICI', name: 'ICICI Bank', icon: 'bi-building' },
  { id: 'AXIS', name: 'Axis Bank', icon: 'bi-bank' },
  { id: 'KOTAK', name: 'Kotak Mahindra', icon: 'bi-building' },
  { id: 'PNB', name: 'Punjab National', icon: 'bi-bank2' },
];

export default function PaymentGatewayModal({
  show,
  onClose,
  bookingDetails,
  onPaymentSuccess,
}) {
  if (!show) return null;

  const {
    name,
    email,
    phone,
    eventType,
    eventDate,
    guestCount,
    packageName,
    packagePrice = 0,
    budget = 0,
  } = bookingDetails;

  const basePrice = packagePrice > 0 ? packagePrice : budget > 0 ? budget : 25000;

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Payment configuration
  const [paymentType, setPaymentType] = useState('full'); // 'full' | 'advance'
  const [activeTab, setActiveTab] = useState('upi'); // 'upi' | 'card' | 'netbanking'

  // Card form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState(name || '');

  // UPI form state
  const [upiId, setUpiId] = useState('');
  const [selectedUpiApp, setSelectedUpiApp] = useState('gpay');

  // Net banking state
  const [selectedBank, setSelectedBank] = useState('HDFC');

  // Processing state
  const [processing, setProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(1);

  // Calculations
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const subtotal = Math.max(0, basePrice - discountAmount);
  const totalAmount = paymentType === 'advance' ? Math.round(subtotal * 0.25) : subtotal;

  // Format Card Number
  const handleCardNumberChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.match(/.{1,4}/g)?.join(' ') || raw;
    setCardNumber(formatted);
  };

  // Format Expiry
  const handleExpiryChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 2) {
      setCardExpiry(`${raw.slice(0, 2)}/${raw.slice(2)}`);
    } else {
      setCardExpiry(raw);
    }
  };

  // Apply Coupon
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError('');
    try {
      const res = await validateCoupon(couponCode.trim(), basePrice);
      if (res?.data) {
        setAppliedCoupon(res.data);
      }
    } catch (err) {
      setCouponError(err?.response?.data?.message || 'Invalid or expired coupon code.');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  // Demo autofill shortcut
  const handleAutofillDemo = () => {
    if (activeTab === 'card') {
      setCardNumber('4532 8923 7412 8890');
      setCardExpiry('12/28');
      setCardCvv('842');
      setCardName(name || 'Verified Customer');
    } else if (activeTab === 'upi') {
      setUpiId(`${email.split('@')[0] || 'customer'}@okhdfcbank`);
    }
  };

  // Process Payment
  const handlePay = () => {
    setProcessing(true);
    setProcessingStep(1);

    setTimeout(() => {
      setProcessingStep(2);
    }, 800);

    setTimeout(() => {
      setProcessingStep(3);
    }, 1600);

    setTimeout(() => {
      const txnId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
      onPaymentSuccess({
        paymentMethod: activeTab,
        transactionId: txnId,
        paidAmount: totalAmount,
        totalBookingPrice: subtotal,
        originalPrice: basePrice,
        discountAmount,
        couponCode: appliedCoupon?.code || null,
        isAdvanceOnly: paymentType === 'advance',
      });
      setProcessing(false);
    }, 2400);
  };

  return (
    <div
      className="modal d-block"
      tabIndex="-1"
      style={{ backgroundColor: 'rgba(9, 9, 11, 0.75)', zIndex: 1060 }}
      role="dialog"
      aria-modal="true"
    >
      <div className="modal-dialog modal-dialog-centered modal-xl">
        <div
          className="modal-content card-tactile shadow-lg border overflow-hidden"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            maxHeight: '92vh',
          }}
        >
          {/* Header */}
          <div
            className="modal-header px-4 py-3 border-bottom d-flex align-items-center justify-content-between"
            style={{ backgroundColor: '#ffffff' }}
          >
            <div className="d-flex align-items-center gap-2">
              <div
                className="d-flex align-items-center justify-content-center rounded bg-dark text-white fw-bold"
                style={{ width: '30px', height: '30px', fontSize: '13px' }}
              >
                EH
              </div>
              <div>
                <h5 className="modal-title fw-bold text-dark mb-0 fs-6">
                  EventHive Secure Checkout
                </h5>
                <span className="text-muted small" style={{ fontSize: '11px' }}>
                  <i className="bi bi-shield-check text-success me-1" aria-hidden="true" />
                  256-Bit SSL Bank-Grade Encryption
                </span>
              </div>
            </div>

            <div className="d-flex align-items-center gap-2">
              <span
                className="badge bg-light text-secondary border px-2 py-1 small fw-normal"
                style={{ fontSize: '11px' }}
              >
                Sandbox Gateway
              </span>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                disabled={processing}
                aria-label="Close"
              />
            </div>
          </div>

          {/* Modal Body */}
          <div className="modal-body p-0" style={{ overflowY: 'auto' }}>
            {processing ? (
              /* Processing Animation Screen */
              <div className="py-5 px-4 text-center my-4">
                <div
                  className="spinner-border text-primary mb-4"
                  role="status"
                  style={{ width: '3.5rem', height: '3.5rem' }}
                >
                  <span className="visually-hidden">Authorizing transaction...</span>
                </div>
                <h4 className="fw-bold text-dark mb-2">Authorizing Payment...</h4>
                <p className="text-secondary small mb-4" style={{ maxWidth: '420px', margin: '0 auto' }}>
                  Please do not refresh the page or press the back button while we establish a secure connection with the payment network.
                </p>

                <div
                  className="p-3 mx-auto text-start rounded small card-tactile"
                  style={{ maxWidth: '380px', backgroundColor: 'var(--bg-surface-subtle)' }}
                >
                  <div className={`d-flex align-items-center gap-2 py-1 ${processingStep >= 1 ? 'text-success fw-semibold' : 'text-muted'}`}>
                    <i className={`bi ${processingStep >= 1 ? 'bi-check-circle-fill' : 'bi-circle'}`} />
                    <span>Initiating secure banking handshake...</span>
                  </div>
                  <div className={`d-flex align-items-center gap-2 py-1 ${processingStep >= 2 ? 'text-success fw-semibold' : 'text-muted'}`}>
                    <i className={`bi ${processingStep >= 2 ? 'bi-check-circle-fill' : 'bi-circle'}`} />
                    <span>Verifying authentication & limits...</span>
                  </div>
                  <div className={`d-flex align-items-center gap-2 py-1 ${processingStep >= 3 ? 'text-success fw-semibold' : 'text-muted'}`}>
                    <i className={`bi ${processingStep >= 3 ? 'bi-check-circle-fill' : 'bi-circle'}`} />
                    <span>Generating verified booking voucher...</span>
                  </div>
                </div>
              </div>
            ) : (
              /* Two-Column Checkout View */
              <div className="row g-0">
                {/* Left Column: Order & Pricing Summary */}
                <div
                  className="col-12 col-lg-5 p-4 border-end"
                  style={{ backgroundColor: '#fafafa' }}
                >
                  <div className="mb-4">
                    <span
                      className="text-uppercase small fw-bold text-muted mb-1 d-block"
                      style={{ letterSpacing: '0.06em', fontSize: '11px' }}
                    >
                      Reservation Summary
                    </span>
                    <h6 className="fw-bold text-dark mb-1">
                      {packageName || `${eventType?.toUpperCase()} Package`}
                    </h6>
                    <div className="text-secondary small">
                      {new Date(eventDate).toLocaleDateString('en-IN', {
                        weekday: 'short',
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}{' '}
                      • {guestCount} Guests
                    </div>
                  </div>

                  {/* Customer Info Card */}
                  <div
                    className="p-3 mb-3 rounded small bg-white border"
                    style={{ fontSize: '12px' }}
                  >
                    <div className="d-flex justify-content-between mb-1">
                      <span className="text-muted">Client:</span>
                      <span className="fw-semibold text-dark">{name}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-1">
                      <span className="text-muted">Contact:</span>
                      <span className="text-dark">{phone}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Email:</span>
                      <span className="text-dark">{email}</span>
                    </div>
                  </div>

                  {/* Coupon Code Input */}
                  <div className="mb-4">
                    <label className="form-label small fw-semibold text-dark mb-1">
                      Promotional Coupon
                    </label>
                    {appliedCoupon ? (
                      <div className="d-flex align-items-center justify-content-between p-2 px-3 bg-white border border-success rounded">
                        <div>
                          <span className="badge bg-success me-2">{appliedCoupon.code}</span>
                          <span className="small text-success fw-semibold">
                            -₹{appliedCoupon.discountAmount.toLocaleString('en-IN')} off
                          </span>
                        </div>
                        <button
                          type="button"
                          className="btn btn-sm btn-link text-danger text-decoration-none p-0"
                          onClick={handleRemoveCoupon}
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control form-control-sm text-uppercase"
                          placeholder="e.g. WELCOME10"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        />
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary btn-tactile"
                          onClick={handleApplyCoupon}
                          disabled={couponLoading || !couponCode.trim()}
                        >
                          {couponLoading ? 'Checking…' : 'Apply'}
                        </button>
                      </div>
                    )}
                    {couponError && (
                      <div className="text-danger small mt-1" style={{ fontSize: '11px' }}>
                        {couponError}
                      </div>
                    )}
                    <div className="form-text small" style={{ fontSize: '11px' }}>
                      Try <code>WELCOME10</code> or <code>FESTIVE5000</code>
                    </div>
                  </div>

                  {/* Payment Type: Full vs 25% Advance Token */}
                  <div className="mb-4">
                    <label className="form-label small fw-semibold text-dark mb-2">
                      Select Payment Structure
                    </label>
                    <div className="d-flex flex-column gap-2">
                      <label
                        className={`d-flex align-items-center justify-content-between p-3 rounded border cursor-pointer ${
                          paymentType === 'full' ? 'border-primary bg-white' : 'bg-white'
                        }`}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="d-flex align-items-center gap-2">
                          <input
                            type="radio"
                            name="paymentType"
                            checked={paymentType === 'full'}
                            onChange={() => setPaymentType('full')}
                            className="form-check-input mt-0"
                          />
                          <div>
                            <div className="fw-semibold text-dark small">Full Payment</div>
                            <div className="text-muted" style={{ fontSize: '11px' }}>
                              Instant final confirmation & invoice
                            </div>
                          </div>
                        </div>
                        <span className="fw-bold text-dark">
                          ₹{subtotal.toLocaleString('en-IN')}
                        </span>
                      </label>

                      <label
                        className={`d-flex align-items-center justify-content-between p-3 rounded border cursor-pointer ${
                          paymentType === 'advance' ? 'border-primary bg-white' : 'bg-white'
                        }`}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="d-flex align-items-center gap-2">
                          <input
                            type="radio"
                            name="paymentType"
                            checked={paymentType === 'advance'}
                            onChange={() => setPaymentType('advance')}
                            className="form-check-input mt-0"
                          />
                          <div>
                            <div className="fw-semibold text-dark small">
                              25% Booking Advance Token
                            </div>
                            <div className="text-muted" style={{ fontSize: '11px' }}>
                              Locks your slot; balance due on event date
                            </div>
                          </div>
                        </div>
                        <span className="fw-bold text-dark">
                          ₹{Math.round(subtotal * 0.25).toLocaleString('en-IN')}
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Breakdown Table */}
                  <div className="border-top pt-3 small">
                    <div className="d-flex justify-content-between mb-1 text-muted">
                      <span>Package Value</span>
                      <span>₹{basePrice.toLocaleString('en-IN')}</span>
                    </div>

                    {discountAmount > 0 && (
                      <div className="d-flex justify-content-between mb-1 text-success">
                        <span>Discount ({appliedCoupon?.code})</span>
                        <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                      </div>
                    )}

                    <div className="d-flex justify-content-between mb-1 text-muted">
                      <span>Convenience & Payment Gateway Fee</span>
                      <span className="text-success fw-semibold">FREE (Waived)</span>
                    </div>

                    <div className="d-flex justify-content-between border-top pt-2 mt-2 fw-bold text-dark fs-6">
                      <span>Total Payable Now</span>
                      <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                {/* Right Column: Payment Methods & Inputs */}
                <div className="col-12 col-lg-7 p-4 bg-white d-flex flex-column justify-content-between">
                  <div>
                    {/* Method Selector Tabs */}
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <span className="fw-bold text-dark small text-uppercase" style={{ letterSpacing: '0.04em' }}>
                        Select Payment Method
                      </span>
                      <button
                        type="button"
                        className="btn btn-sm btn-link p-0 text-decoration-none small text-muted"
                        style={{ fontSize: '11px' }}
                        onClick={handleAutofillDemo}
                        title="Fill sample card/UPI details for testing"
                      >
                        <i className="bi bi-magic me-1 text-primary" />
                        Autofill Demo Details
                      </button>
                    </div>

                    <div className="d-flex gap-2 mb-4 border-bottom pb-2">
                      <button
                        type="button"
                        className={`btn btn-sm btn-tactile ${
                          activeTab === 'upi' ? 'btn-primary' : 'btn-outline-secondary'
                        }`}
                        onClick={() => setActiveTab('upi')}
                      >
                        <i className="bi bi-qr-code-scan me-1" />
                        UPI / QR Code
                      </button>
                      <button
                        type="button"
                        className={`btn btn-sm btn-tactile ${
                          activeTab === 'card' ? 'btn-primary' : 'btn-outline-secondary'
                        }`}
                        onClick={() => setActiveTab('card')}
                      >
                        <i className="bi bi-credit-card me-1" />
                        Credit / Debit Card
                      </button>
                      <button
                        type="button"
                        className={`btn btn-sm btn-tactile ${
                          activeTab === 'netbanking' ? 'btn-primary' : 'btn-outline-secondary'
                        }`}
                        onClick={() => setActiveTab('netbanking')}
                      >
                        <i className="bi bi-bank me-1" />
                        Net Banking
                      </button>
                    </div>

                    {/* Tab 1: UPI */}
                    {activeTab === 'upi' && (
                      <div>
                        <div className="row g-3 align-items-center mb-4">
                          {/* QR Code Simulation */}
                          <div className="col-12 col-sm-5 text-center">
                            <div
                              className="p-3 border rounded bg-white d-inline-block shadow-sm"
                              style={{ width: '150px', height: '150px' }}
                            >
                              <div
                                className="w-100 h-100 d-flex flex-column align-items-center justify-content-center border border-2 border-dashed rounded"
                                style={{ backgroundColor: '#fcfcfc' }}
                              >
                                <i className="bi bi-qr-code fs-1 text-dark mb-1" />
                                <span style={{ fontSize: '9px', fontWeight: 600 }}>
                                  SCAN WITH UPI
                                </span>
                              </div>
                            </div>
                            <div className="small text-muted mt-2" style={{ fontSize: '11px' }}>
                              Point camera / any UPI scanner
                            </div>
                          </div>

                          {/* UPI ID Form */}
                          <div className="col-12 col-sm-7">
                            <label className="form-label small fw-semibold text-dark mb-1">
                              Pay via Virtual Payment Address (VPA)
                            </label>
                            <div className="input-group mb-2">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="e.g. mobile@upi or name@okaxis"
                                value={upiId}
                                onChange={(e) => setUpiId(e.target.value)}
                              />
                            </div>

                            <div className="d-flex gap-2 mb-3">
                              {['gpay', 'phonepe', 'paytm', 'bhim'].map((app) => (
                                <button
                                  key={app}
                                  type="button"
                                  className={`btn btn-sm text-uppercase fw-semibold py-1 px-2 border ${
                                    selectedUpiApp === app ? 'btn-dark text-white' : 'btn-light text-secondary'
                                  }`}
                                  style={{ fontSize: '10px' }}
                                  onClick={() => setSelectedUpiApp(app)}
                                >
                                  {app}
                                </button>
                              ))}
                            </div>

                            <div className="text-muted small" style={{ fontSize: '11px' }}>
                              We will send a payment authorization request directly to your UPI mobile app.
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Tab 2: Credit / Debit Card */}
                    {activeTab === 'card' && (
                      <div>
                        <div className="row g-3">
                          <div className="col-12">
                            <label className="form-label small fw-semibold text-dark mb-1">
                              Card Number
                            </label>
                            <div className="input-group">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="4532 0000 0000 0000"
                                value={cardNumber}
                                onChange={handleCardNumberChange}
                                maxLength={19}
                              />
                              <span className="input-group-text bg-white text-muted">
                                <i className="bi bi-credit-card-2-front" />
                              </span>
                            </div>
                          </div>

                          <div className="col-6">
                            <label className="form-label small fw-semibold text-dark mb-1">
                              Expiry Date
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="MM/YY"
                              value={cardExpiry}
                              onChange={handleExpiryChange}
                              maxLength={5}
                            />
                          </div>

                          <div className="col-6">
                            <label className="form-label small fw-semibold text-dark mb-1">
                              CVV / CVC
                            </label>
                            <input
                              type="password"
                              className="form-control"
                              placeholder="•••"
                              value={cardCvv}
                              onChange={(e) => setCardCvv(e.target.value.slice(0, 4))}
                              maxLength={4}
                            />
                          </div>

                          <div className="col-12">
                            <label className="form-label small fw-semibold text-dark mb-1">
                              Cardholder Name
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Name as printed on card"
                              value={cardName}
                              onChange={(e) => setCardName(e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="d-flex align-items-center gap-2 mt-3 pt-2 text-muted small" style={{ fontSize: '11px' }}>
                          <i className="bi bi-shield-lock text-success" />
                          <span>Cards are encrypted and tokenized per RBI guidelines.</span>
                        </div>
                      </div>
                    )}

                    {/* Tab 3: Net Banking */}
                    {activeTab === 'netbanking' && (
                      <div>
                        <label className="form-label small fw-semibold text-dark mb-2">
                          Popular Indian Banks
                        </label>
                        <div className="row g-2 mb-3">
                          {TOP_BANKS.map((b) => (
                            <div key={b.id} className="col-6 col-sm-4">
                              <button
                                type="button"
                                className={`btn btn-sm w-100 p-2 text-start d-flex align-items-center gap-2 border ${
                                  selectedBank === b.id ? 'btn-dark text-white' : 'btn-light text-dark'
                                }`}
                                onClick={() => setSelectedBank(b.id)}
                                style={{ fontSize: '12px' }}
                              >
                                <i className={`bi ${b.icon}`} />
                                <span className="text-truncate">{b.name}</span>
                              </button>
                            </div>
                          ))}
                        </div>

                        <label className="form-label small fw-semibold text-dark mb-1">
                          All Other Banks
                        </label>
                        <select
                          className="form-select form-select-sm"
                          value={selectedBank}
                          onChange={(e) => setSelectedBank(e.target.value)}
                        >
                          <option value="HDFC">HDFC Bank</option>
                          <option value="SBI">State Bank of India</option>
                          <option value="ICICI">ICICI Bank</option>
                          <option value="AXIS">Axis Bank</option>
                          <option value="KOTAK">Kotak Mahindra Bank</option>
                          <option value="YES">Yes Bank</option>
                          <option value="IDBI">IDBI Bank</option>
                          <option value="BOB">Bank of Baroda</option>
                          <option value="CANARA">Canara Bank</option>
                          <option value="INDUSIND">IndusInd Bank</option>
                        </select>
                      </div>
                    )}
                  </div>

                  {/* Actions & Secure Payment Button */}
                  <div className="pt-4 border-top mt-4">
                    <div className="d-flex align-items-center justify-content-between mb-3 text-muted small" style={{ fontSize: '12px' }}>
                      <div className="d-flex align-items-center gap-1">
                        <i className="bi bi-lock-fill text-dark" />
                        <span>Instant Booking Confirmation</span>
                      </div>
                      <span className="fw-semibold text-dark">
                        Amount: ₹{totalAmount.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="d-flex gap-2">
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-tactile flex-grow-1"
                        onClick={onClose}
                        disabled={processing}
                      >
                        Back to Form
                      </button>

                      <button
                        type="button"
                        className="btn btn-primary btn-tactile flex-grow-1 py-2 fw-semibold"
                        onClick={handlePay}
                        disabled={processing}
                      >
                        Pay ₹{totalAmount.toLocaleString('en-IN')} & Confirm
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
