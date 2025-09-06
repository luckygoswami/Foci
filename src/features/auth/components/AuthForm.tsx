import { useRef, useState } from 'react';
import { useAuth } from '@/features/auth';
import { feedback } from '@/lib/feedback';
import './AuthForm.css';

export function AuthForm() {
  const container = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { googleLogin, emailLogin, emailSignup, resetPassword } = useAuth();

  async function handleLogin() {
    setLoading(true);
    setPassword('');
    try {
      await emailLogin(email, password);
      feedback.success('Logged in successfully!');
    } catch (err: any) {
      feedback.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSignup() {
    setLoading(true);
    setPassword('');
    try {
      await emailSignup(email, password);
      feedback.success('Account created successfully!');
    } catch (err: any) {
      feedback.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    try {
      await googleLogin();
      feedback.success('Logged in with Google successfully!');
    } catch (err: any) {
      feedback.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword() {
    if (!email) {
      feedback.error('Enter the email first!');
      return;
    }
    try {
      await resetPassword(email);
      feedback.success('Password reset email sent. Check inbox or spam.');
    } catch (err: any) {
      feedback.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  function toggleShowPassword() {
    setShowPassword((prev) => !prev);
  }

  return (
    <main>
      <div
        role="region"
        aria-label="Auth Form"
        className="form-body">
        <div
          className="container"
          ref={container}>
          <div className="form-box login">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
              }}>
              <h1 className="font-bold">Login</h1>
              <div className="input-box">
                <input
                  type="text"
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <i className="fa-solid fa-envelope"></i>
              </div>
              <div className="input-box">
                <input
                  type={`${!showPassword ? 'password' : 'text'}`}
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <i
                  onClick={toggleShowPassword}
                  className={`fa-solid fa-${
                    showPassword ? 'unlock' : 'lock'
                  }`}></i>
              </div>
              <div className="forgot-link">
                <button
                  type="button"
                  onClick={handleForgotPassword}>
                  <a>Forgot Password?</a>
                </button>
              </div>
              <button
                type="submit"
                className="btn"
                disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
              <p>or</p>
              <div className="social-icons">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="flex-1">
                  <i className="fa-brands fa-google"></i>&nbsp; Login with
                  Google
                </button>
              </div>
            </form>
          </div>

          <div className="form-box register">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSignup();
              }}>
              <h1 className="font-bold">Sign Up</h1>
              <div className="input-box">
                <input
                  type="email"
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <i className="fa-solid fa-envelope"></i>
              </div>
              <div className="input-box">
                <input
                  type={`${!showPassword ? 'password' : 'text'}`}
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <i
                  onClick={toggleShowPassword}
                  className={`fa-solid fa-${
                    showPassword ? 'unlock' : 'lock'
                  }`}></i>
              </div>
              <button
                type="submit"
                className="btn"
                disabled={loading}>
                {loading ? 'Signing up...' : 'Sign up'}
              </button>
              <p>or</p>
              <div className="social-icons">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="flex-1">
                  <i className="fa-brands fa-google"></i>&nbsp; Signup with
                  Google
                </button>
              </div>
            </form>
          </div>

          <div className="toggle-box">
            <div className="toggle-panel toggle-left">
              <h1 className="font-bold">Hello, Welcome!</h1>
              <p>Don't have an account?</p>
              <button
                className="btn register-btn"
                onClick={() => container.current?.classList.add('active')}>
                Sign Up
              </button>
            </div>
            <div className="toggle-panel toggle-right">
              <h1 className="font-bold">Welcome Back!</h1>
              <p>Already have an account?</p>
              <button
                className="btn login-btn"
                onClick={() => container.current?.classList.remove('active')}>
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
