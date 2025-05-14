import { useRef } from 'react';
import './AuthForm.css';
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const navigate = useNavigate();
  const container = useRef<HTMLDivElement>(null);

  return (
    <div className="body">
      <div
        className="container"
        ref={container}>
        <div className="form-box login">
          <form action="">
            <h1 className="font-bold">Login</h1>
            <div className="input-box">
              <input
                type="text"
                placeholder="Username"
                required
              />
              <i className="fa-solid fa-user"></i>
            </div>
            <div className="input-box">
              <input
                type="password"
                placeholder="Enter Password"
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
              onClick={() => navigate('/')}>
              Login
            </button>
            <p>or login with social platforms</p>
            <div className="social-icons">
              <a href="#">
                <i className="fa-brands fa-google"></i>
              </a>
              <a href="#">
                <i className="fa-brands fa-facebook"></i>
              </a>
              <a href="#">
                <i className="fa-brands fa-github"></i>
              </a>
              <a href="#">
                <i className="fa-brands fa-linkedin"></i>
              </a>
            </div>
          </form>
        </div>
        <div className="form-box register">
          <form action="">
            <h1 className="font-bold">Registration</h1>
            <div className="input-box">
              <input
                type="text"
                placeholder="Username"
                required
              />
              <i className="fa-solid fa-user"></i>
            </div>
            <div className="input-box">
              <input
                type="email"
                placeholder="Email"
                required
              />
              <i className="fa-solid fa-envelope"></i>
            </div>
            <div className="input-box">
              <input
                type="password"
                placeholder="Enter Password"
                required
              />
              <i className="fa-solid fa-lock"></i>
            </div>
            <button
              type="submit"
              className="btn">
              Register
            </button>
            <p>or register with social platforms</p>
            <div className="social-icons">
              <a href="#">
                <i className="fa-brands fa-google"></i>
              </a>
              <a href="#">
                <i className="fa-brands fa-facebook"></i>
              </a>
              <a href="#">
                <i className="fa-brands fa-github"></i>
              </a>
              <a href="#">
                <i className="fa-brands fa-linkedin"></i>
              </a>
            </div>
          </form>
        </div>

        <div className="toggle-box">
          <div className="toggle-panel toggle-left">
            <h1 className="font-bold">Hello, Welcome!</h1>
            <p>Don't have an account?</p>
            <button
              className="btn register-btn"
              onClick={() => {
                container.current?.classList.add('active');
              }}>
              Register
            </button>
          </div>
          <div className="toggle-panel toggle-right">
            <h1 className="font-bold">Welcome Back!</h1>
            <p>Already have an account?</p>
            <button
              className="btn login-btn"
              onClick={() => {
                container.current?.classList.remove('active');
              }}>
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
