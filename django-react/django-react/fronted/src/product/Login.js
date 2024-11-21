import React, { useState ,useEffect} from 'react';
import './Login.css';
import { useNavigate  } from 'react-router-dom';
const Login = () => {

  const navigate = useNavigate()

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const info={
    email:email,
    password:password
}

  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log(`Email: ${email}, Password: ${password}`);
    try {
        const response = await fetch('http://localhost:8000/api/login/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
          },
          body: JSON.stringify(info),
        });
        const data = await response.json();
        const data1 = JSON.parse(data);
        const u1=data1[0];
        if (u1.fields.email===info.email){
          navigate(`/home?username=${encodeURIComponent(u1.fields.name)}&email=${encodeURIComponent(u1.fields.email)}`)
        }
        } 
        catch (error) {
            console.error('Error:', error);
        }

  
  };

  const [csrfToken, setCsrfToken] = useState('');

        useEffect(() => {
            const getCsrfToken = async () => {
              const response = await fetch('/get-csrf-token/');
              const data = await response.json();
              setCsrfToken(data.csrfToken);
            };
            getCsrfToken();
          }, []);

  return (
    // <div className="login-container">
    //   <form className="login-form" onSubmit={handleSubmit}>
    //     <h2>Login</h2>
    //     <hr />
    //     <br />
    //     <div className="form-group1">
    //       <label htmlFor="email">Email Address *</label>
    //       <input
    //         type="email"
    //         id="email"
    //         value={email}
    //         onChange={(e) => setEmail(e.target.value)}
    //         required
    //       />
    //     </div>
    //     <div className="form-group1">
    //       <label htmlFor="password">Password *</label>
    //       <input
    //         type="password"
    //         id="password"
    //         value={password}
    //         onChange={(e) => setPassword(e.target.value)}
    //         required
    //       />
    //     </div>
    
    //     <button type="submit" className="login-button">Log In</button>
        
    //   </form>
    // </div>



<div className="auth-container">
  <form action="" onSubmit={handleSubmit}>
      <div className="auth-box">
        <div className="login-section">
          <h2>Sign In</h2>
          <div className="field-group">
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder='Email Address'
          />
          </div>
          <div className="field-group">
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder='Password'
          />
          </div>
          <div className="options-row">
            <input type="checkbox" id="remember" />
            <label htmlFor="remember">Remember Me</label>
            <a href="#" className="link-forgot">Forgot Password?</a>
          </div>
          <button className="btn-login">Sign In</button>
        </div>
        <div className="register-section">
          <h2>Welcome to login</h2>
          <p>Don't have an account?</p>
          <button className="btn-signup"  onClick={()=>{navigate('/signup')}}>Sign Up</button>
        </div>
      </div>
      </form>
    </div>
  );
};

export default Login;
