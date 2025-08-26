import { useRef, useState } from 'react';
import { useAuth } from '@/features/auth';
import { toast } from 'react-toastify';
import './AuthForm.css';

export function AuthForm() {
  const container = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { googleLogin, emailLogin, emailSignup } = useAuth();

  const handleLogin = async () => {
    setLoading(true);
    try {
      await emailLogin(email, password);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    setLoading(true);
    try {
      await emailSignup(email, password);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await googleLogin();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
    }
  };

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
                  placeholder="Enter Username or Email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <i className="fa-solid fa-user"></i>
              </div>
              <div className="input-box">
                <input
                  type="password"
                  placeholder="Enter Password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <i className="fa-solid fa-lock"></i>
              </div>
              <div className="forgot-link">
                <a href="#">Forgot Password</a>
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
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <i className="fa-solid fa-envelope"></i>
              </div>
              <div className="input-box">
                <input
                  type="password"
                  placeholder="Enter Password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <i className="fa-solid fa-lock"></i>
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
