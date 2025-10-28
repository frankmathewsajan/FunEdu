import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './auth.css';

const LoginSuccess: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-redirect to login after 5 seconds
    const timer = setTimeout(() => {
      navigate('/login');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="login-container">
      {/* Floating celebratory icons */}
      <div className="student">🎉</div>
      <div className="student">✅</div>
      <div className="student">🎊</div>
      <div className="student">✨</div>
      <div className="student">🌟</div>
      <div className="student">🎈</div>

      <div className="login-card" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '80px', marginBottom: '20px' }}>✅</div>
        <h2 className="login-title" style={{ color: '#28a745' }}>Email Verified!</h2>
        <p className="login-subtitle" style={{ marginBottom: '30px' }}>
          Your account has been successfully confirmed!
        </p>
        
        <div style={{ marginBottom: '20px', color: '#666' }}>
          <p>You can now log in to your account and start learning.</p>
        </div>

        <button 
          onClick={() => navigate('/login')} 
          className="btn-login"
          style={{ marginTop: '20px' }}
        >
          Go to Login
        </button>

        <div style={{ marginTop: '20px', fontSize: '14px', color: '#999' }}>
          Redirecting to login in 5 seconds...
        </div>
      </div>
    </div>
  );
};

export default LoginSuccess;
