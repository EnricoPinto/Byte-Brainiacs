import { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useToast } from '../context/ToastContext';
import './Register.css';

const STEPS = ['Personal Info', 'Registration Type', 'Review & Pay'];

const indianStates = ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Puducherry'];

const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const YEAR_OPTIONS = ['1st Year', '2nd Year', '3rd Year', 'Final Year', 'Postgraduate'];

const MemberFields = ({ prefix, label, register, errors }) => (
  <div className="member-section">
    <h4 className="member-label">{label}</h4>
    <div className="form-grid-2">
      {[
        { name: 'fullName', label: 'Full Name', type: 'text', required: true },
        { name: 'email', label: 'Email', type: 'email', required: true },
        { name: 'mobile', label: 'Mobile', type: 'tel', required: true },
        { name: 'college', label: 'College/University', type: 'text', required: true },
        { name: 'degree', label: 'Degree/Course', type: 'text', required: true },
      ].map(f => (
        <div key={f.name} className="form-group">
          <label className="form-label">{f.label} {f.required && <span style={{ color: 'var(--red)' }}>*</span>}</label>
          <input
            type={f.type}
            className="form-input"
            {...register(`${prefix}.${f.name}`, { required: f.required ? `${f.label} is required` : false })}
          />
          {errors?.[prefix]?.[f.name] && <span className="form-error">{errors[prefix][f.name].message}</span>}
        </div>
      ))}

      {/* Year of Study — dropdown to match backend enum */}
      <div className="form-group">
        <label className="form-label">Year of Study <span style={{ color: 'var(--red)' }}>*</span></label>
        <select
          className="form-input"
          {...register(`${prefix}.yearOfStudy`, { required: 'Year of Study is required' })}
        >
          <option value="">Select Year</option>
          {YEAR_OPTIONS.map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
        {errors?.[prefix]?.yearOfStudy && <span className="form-error">⚠ {errors[prefix].yearOfStudy.message}</span>}
      </div>
    </div>
  </div>
);


export default function Register() {
  const [step, setStep] = useState(0);
  const [regType, setRegType] = useState('');
  const [teamSize, setTeamSize] = useState(3); // 2 or 3
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  const { register, handleSubmit, watch, formState: { errors }, trigger, getValues, setValue } = useForm();

  const getMemberCount = () => {
    if (regType === 'individual') return 1;
    return teamSize; // team: 2 or 3
  };

  const getTotalAmount = () => getMemberCount() * 25;

  const nextStep = async () => {
    const fields = step === 0
      ? ['fullName', 'email', 'mobile', 'college', 'degree', 'yearOfStudy', 'city', 'state', 'collegeId']
      : step === 1 ? ['registrationType', ...(regType === 'team' ? ['teamName'] : [])] : [];
    const valid = await trigger(fields);
    if (valid) setStep(s => s + 1);
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.keys(data).forEach(k => {
        if (k === 'collegeId') {
          if (data[k]?.[0]) fd.append(k, data[k][0]);
        } else if (k === 'teamMembers') {
          // Only include the members we need based on teamSize
          const members = data.teamMembers;
          if (regType === 'team' && members) {
            const count = teamSize - 1; // subtract 1 for the leader
            const trimmedMembers = Array.isArray(members) ? members.slice(0, count) : members;
            fd.append('teamMembers', JSON.stringify(trimmedMembers));
          }
        } else if (data[k] !== undefined && data[k] !== '') {
          fd.append(k, data[k]);
        }
      });

      const response = await axios.post('/api/participants/register', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Handle Razorpay Checkout
      if (response.data.orderId) {
        const { orderId, amount, key_id, participant } = response.data;
        const res = await loadRazorpay();
        
        if (!res) {
          toast.error('Payment Gateway Failed', 'Could not load Razorpay. Check your connection.');
          setSubmitting(false);
          return;
        }

        const options = {
          key: key_id,
          amount: amount,
          currency: 'INR',
          name: 'ByteBrainiacs Hackathon',
          description: 'Registration Fee',
          order_id: orderId,
          handler: async function (response) {
            try {
              const verifyRes = await axios.post('/api/payments/verify', {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                participant_id: participant._id,
              });
              
              if (verifyRes.data.success) {
                window.location.href = `/payment-success?participant_id=${participant._id}`;
              }
            } catch (err) {
              window.location.href = `/payment-cancel?participant_id=${participant._id}`;
            }
          },
          prefill: {
            name: participant.fullName,
            email: participant.email,
            contact: participant.mobile,
          },
          theme: {
            color: '#00e5ff',
          },
          modal: {
            ondismiss: function () {
              setSubmitting(false);
              window.location.href = `/payment-cancel?participant_id=${participant._id}`;
            }
          }
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      } else {
        toast.success('Registration Successful!', 'Redirecting...');
      }
    } catch (err) {
      toast.error('Registration Failed', err.response?.data?.message || 'Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-hero">
        <div className="hero-orb hero-orb-1" style={{ width: '300px', height: '300px' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center', paddingTop: '60px' }}>
          <p className="section-tag">// join the hackathon</p>
          <h1 className="section-title">Register for <span className="gradient-text">ByteBrainiacs</span></h1>
        </div>
      </div>

      <div className="container" style={{ maxWidth: '800px', padding: '40px 24px 80px' }}>
        {/* Step Indicator */}
        <div className="step-indicator">
          {STEPS.map((s, i) => (
            <div key={s} className={`step ${i === step ? 'active' : i < step ? 'done' : ''}`}>
              <div className="step-num">{i < step ? '✓' : i + 1}</div>
              <span className="step-label">{s}</span>
              {i < STEPS.length - 1 && <div className="step-line" />}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* ── Step 0: Personal Info ── */}
          {step === 0 && (
            <div className="form-card animate-fade-up">
              <h2 className="form-section-title">Personal Information</h2>
              <div className="form-grid-2">
                {[
                  { name: 'fullName', label: 'Full Name', type: 'text', required: true },
                  { name: 'email', label: 'Email Address', type: 'email', required: true },
                  { name: 'mobile', label: 'Mobile Number', type: 'tel', required: true, pattern: /^[6-9]\d{9}$/ },
                  { name: 'college', label: 'College / University', type: 'text', required: true },
                  { name: 'degree', label: 'Degree / Course', type: 'text', required: true },
                ].map(f => (
                  <div key={f.name} className="form-group">
                    <label className="form-label">{f.label} <span style={{ color: 'var(--red)' }}>*</span></label>
                    <input type={f.type} className="form-input"
                      {...register(f.name, {
                        required: `${f.label} is required`,
                        ...(f.pattern ? { pattern: { value: f.pattern, message: 'Invalid number' } } : {}),
                        ...(f.type === 'email' ? { pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } } : {}),
                      })}
                    />
                    {errors[f.name] && <span className="form-error">⚠ {errors[f.name].message}</span>}
                  </div>
                ))}

                <div className="form-group">
                  <label className="form-label">Year of Study <span style={{ color: 'var(--red)' }}>*</span></label>
                  <select className="form-input" {...register('yearOfStudy', { required: 'Year is required' })}>
                    <option value="">Select Year</option>
                    {['1st Year', '2nd Year', '3rd Year', 'Final Year', 'Postgraduate'].map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                  {errors.yearOfStudy && <span className="form-error">⚠ {errors.yearOfStudy.message}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">City <span style={{ color: 'var(--red)' }}>*</span></label>
                  <input type="text" className="form-input" {...register('city', { required: 'City is required' })} />
                  {errors.city && <span className="form-error">⚠ {errors.city.message}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">State <span style={{ color: 'var(--red)' }}>*</span></label>
                  <select className="form-input" {...register('state', { required: 'State is required' })}>
                    <option value="">Select State</option>
                    {indianStates.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errors.state && <span className="form-error">⚠ {errors.state.message}</span>}
                </div>

                <div className="form-group form-full">
                  <label className="form-label">College ID Card (JPG, PNG or PDF — max 2MB) <span style={{ color: 'var(--red)' }}>*</span></label>
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="form-input" style={{ padding: '10px' }}
                    {...register('collegeId', {
                      required: 'College ID is required for verification',
                      validate: {
                        maxSize: (files) => {
                          if (!files?.[0]) return true;
                          return files[0].size <= 2 * 1024 * 1024 || 'File must be 2MB or smaller';
                        },
                      },
                    })}
                  />
                  {errors.collegeId && <span className="form-error">⚠ {errors.collegeId.message}</span>}
                </div>
              </div>
            </div>
          )}

          {/* ── Step 1: Registration Type ── */}
          {step === 1 && (
            <div className="form-card animate-fade-up">
              <h2 className="form-section-title">Registration Type</h2>
              <div className="reg-type-grid">
                {[
                  { value: 'individual', icon: '👤', title: 'Individual — ₹25', desc: 'Register alone. Admin will allocate you into a team.' },
                  { value: 'team', icon: '👥', title: 'Team (2-3 Members)', desc: 'Register with your team. Choose 2 or 3 members.' },
                ].map(opt => (
                  <label key={opt.value} className={`reg-type-card ${regType === opt.value ? 'selected' : ''}`}>
                    <input type="radio" value={opt.value} {...register('registrationType', { required: 'Select a type' })}
                      onChange={(e) => { setValue('registrationType', opt.value, { shouldValidate: true }); setRegType(opt.value); }} />
                    <div className="reg-type-icon">{opt.icon}</div>
                    <div className="reg-type-title">{opt.title}</div>
                    <div className="reg-type-desc">{opt.desc}</div>
                  </label>
                ))}
              </div>
              {errors.registrationType && <span className="form-error" style={{ marginTop: '12px', display: 'block' }}>⚠ {errors.registrationType.message}</span>}

              {regType === 'team' && (
                <div style={{ marginTop: '32px' }}>
                  <div className="form-group" style={{ marginBottom: '24px' }}>
                    <label className="form-label">Team Name <span style={{ color: 'var(--red)' }}>*</span></label>
                    <input type="text" className="form-input" {...register('teamName', { required: 'Team name is required' })} />
                    {errors.teamName && <span className="form-error">⚠ {errors.teamName.message}</span>}
                  </div>

                  {/* Team Size Selector */}
                  <div style={{ marginBottom: '24px' }}>
                    <label className="form-label" style={{ marginBottom: '12px', display: 'block' }}>Team Size <span style={{ color: 'var(--red)' }}>*</span></label>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      {[2, 3].map(size => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setTeamSize(size)}
                          style={{
                            flex: 1, padding: '16px', borderRadius: '12px', cursor: 'pointer',
                            border: `2px solid ${teamSize === size ? 'var(--violet)' : 'var(--border)'}`,
                            background: teamSize === size ? 'rgba(99,102,241,0.1)' : 'var(--bg-card)',
                            color: 'var(--text-primary)', fontWeight: 600, fontSize: '15px',
                            transition: 'var(--transition)',
                          }}
                        >
                          {size} Members — ₹{size * 25}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ background: 'rgba(0,229,255,0.05)', border: '1px solid rgba(0,229,255,0.15)', borderRadius: '12px', padding: '16px', marginBottom: '24px' }}>
                    <p style={{ color: 'var(--cyan)', fontSize: '14px' }}>
                      ℹ️ The personal info you filled in Step 1 is for the <strong>Team Leader</strong>. Fill in details for additional member{teamSize === 3 ? 's' : ''} below.
                    </p>
                  </div>
                  <MemberFields prefix="teamMembers[0]" label="👤 Member 2" register={register} errors={errors} />
                  {teamSize === 3 && (
                    <MemberFields prefix="teamMembers[1]" label="👤 Member 3" register={register} errors={errors} />
                  )}
                </div>
              )}

              {/* Live Pricing Display */}
              {regType && (
                <div style={{
                  marginTop: '28px', padding: '20px', borderRadius: '12px',
                  background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)',
                  textAlign: 'center',
                }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '8px' }}>Registration Fee</p>
                  <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--cyan)' }}>
                    ₹{getTotalAmount()}
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '6px' }}>
                    ₹25 × {getMemberCount()} participant{getMemberCount() > 1 ? 's' : ''}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ── Step 2: Review & Pay ── */}
          {step === 2 && (
            <div className="form-card animate-fade-up">
              <h2 className="form-section-title">Review & Pay</h2>
              {(() => {
                const v = getValues();
                const count = getMemberCount();
                const total = getTotalAmount();
                return (
                  <div>
                    {/* Registration Summary */}
                    <div style={{ marginBottom: '28px' }}>
                      <h3 style={{ fontSize: '16px', marginBottom: '16px', color: 'var(--violet-light)' }}>📋 Registration Summary</h3>
                      <div style={{ background: 'var(--bg-secondary)', borderRadius: '12px', padding: '20px', border: '1px solid var(--border)' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '14px' }}>
                          <div><span style={{ color: 'var(--text-muted)' }}>Name:</span> <strong>{v.fullName}</strong></div>
                          <div><span style={{ color: 'var(--text-muted)' }}>Email:</span> <strong>{v.email}</strong></div>
                          <div><span style={{ color: 'var(--text-muted)' }}>College:</span> <strong>{v.college}</strong></div>
                          <div><span style={{ color: 'var(--text-muted)' }}>Type:</span> <strong style={{ textTransform: 'capitalize' }}>{v.registrationType}{regType === 'team' ? ` (${count} members)` : ''}</strong></div>
                          {v.teamName && <div style={{ gridColumn: '1/-1' }}><span style={{ color: 'var(--text-muted)' }}>Team:</span> <strong>{v.teamName}</strong></div>}
                        </div>
                      </div>
                    </div>

                    {/* Team Members List */}
                    {regType === 'team' && v.teamMembers && (
                      <div style={{ marginBottom: '28px' }}>
                        <h3 style={{ fontSize: '16px', marginBottom: '12px', color: 'var(--violet-light)' }}>👥 Team Members</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <div style={{ padding: '12px 16px', background: 'rgba(99,102,241,0.08)', borderRadius: '8px', border: '1px solid rgba(99,102,241,0.2)', fontSize: '14px' }}>
                            <strong>1. {v.fullName}</strong> <span style={{ color: 'var(--cyan)' }}>(Leader)</span> — {v.email}
                          </div>
                          {v.teamMembers.slice(0, teamSize - 1).map((m, i) => (
                            <div key={i} style={{ padding: '12px 16px', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '14px' }}>
                              <strong>{i + 2}. {m?.fullName || '—'}</strong> — {m?.email || '—'}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Payment Amount */}
                    <div style={{
                      background: 'rgba(0,229,255,0.05)', padding: '28px', borderRadius: '12px',
                      border: '1px solid rgba(0,229,255,0.2)', textAlign: 'center', marginBottom: '24px',
                    }}>
                      <h3 style={{ fontSize: '16px', marginBottom: '8px', color: 'var(--text-secondary)' }}>Total Registration Fee</h3>
                      <div style={{ fontSize: '48px', fontWeight: 'bold', color: 'var(--cyan)' }}>
                        ₹{total}
                      </div>
                      <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '8px' }}>
                        ₹25 × {count} participant{count > 1 ? 's' : ''} • Powered by Razorpay
                      </p>
                    </div>

                    <div style={{ padding: '14px', background: 'rgba(34,197,94,0.08)', borderRadius: '12px', border: '1px solid rgba(34,197,94,0.2)' }}>
                      <p style={{ color: '#4ade80', fontSize: '14px' }}>
                        🔒 You'll be securely prompted by Razorpay to complete your payment. By proceeding, you agree to the Rules & Guidelines of ByteBrainiacs.
                      </p>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Navigation */}
          <div className="form-nav">
            {step > 0 && (
              <button type="button" className="btn btn-ghost" onClick={() => setStep(s => s - 1)}>← Back</button>
            )}
            {step < STEPS.length - 1 ? (
              <button type="button" className="btn btn-primary" onClick={nextStep} style={{ marginLeft: 'auto' }}>
                Next Step →
              </button>
            ) : (
              <button type="submit" className="btn btn-primary" disabled={submitting} style={{ marginLeft: 'auto' }}>
                {submitting ? '⏳ Processing...' : '💳 Proceed to Payment →'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
