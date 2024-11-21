import React, { useState, useEffect } from "react";
import Nav from "../Nav";
import './Chatwithus.css';

const Chatwithus = () => {
  const [csrfToken, setCsrfToken] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    height: '',
    weight: '',
    age: '',
    gender: '',
    goal_weight: '',
    time: '',
    veg_nonveg:''
  });
  const [dietPlan, setDietPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getCsrfToken = async () => {
      const response = await fetch('/get-csrf-token/');
      const data = await response.json();
      setCsrfToken(data.csrfToken);
    };
    getCsrfToken();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/diet-plan/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setDietPlan(data);
      } else {
        console.error("Failed to fetch diet plan");
      }
    } catch (error) {
      console.error("Error:", error);
    }

    setLoading(false);
  };

  const closeDietPlan = () => {
    setShowForm(false)
    setDietPlan(null);
  };

  return (
    <>
      <Nav />
      <div className="centered-container" style={{marginTop:'200px'}}>
        <button onClick={() => setShowForm(true)} className="button123">Get Diet Plan</button>

        {showForm && (
          <form className="diet-form" onSubmit={handleFormSubmit}>
            <label>Height:</label>
            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={handleInputChange}
              required
            />

            <label>Weight:</label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleInputChange}
              required
            />

            <label>Age:</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              required
            />

            <label>Gender:</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              required
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>

            <label>Veg or Nonveg:</label>
            <select
              name="veg_nonveg"
              value={formData.veg_nonveg}
              onChange={handleInputChange}
              required
            >
              <option value="">Select</option>
              <option value="Veg">Veg</option>
              <option value="Nonveg">Nonveg</option>
            </select>

            <label>Goal Weight:</label>
            <input
              type="number"
              name="goal_weight"
              value={formData.goal_weight}
              onChange={handleInputChange}
              required
            />

            <label>Time (in weeks):</label>
            <input
              type="number"
              name="time"
              value={formData.time}
              onChange={handleInputChange}
              required
            />

            <input type="submit" value={loading ? "Loading..." : "Submit"} />
          </form>
        )}

        {dietPlan && (
          <div className="diet-plan">
            <h3>Your Weekly Diet Plan</h3>
            <table style={{marginTop:'50px'}}>
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Breakfast</th>
                  <th>Lunch</th>
                  <th>Dinner</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(dietPlan).map((day, index) => (
                  <tr key={index}>
                    <td>{day.charAt(0).toUpperCase() + day.slice(1)}</td>
                    <td>{dietPlan[day][0].breakfast}</td>
                    <td>{dietPlan[day][0].lunch}</td>
                    <td>{dietPlan[day][0].dinner}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="close-btn" onClick={closeDietPlan}>Close</button>
          </div>
        )}
      </div>

      <footer className="footer" style={{marginTop:'200px'}}>
      <div className="footer-container">
        <div className="footer-column">
          <h3>About Us</h3>
          <p>
            Heaven diet doesn't over lesser days appear creeping seasons so behold bearing days open.
          </p>
          <div className="logo">
            <h2>Swasthy Prad</h2>
            <p>HOME SOLUTION</p>
          </div>
        </div>

        <div className="footer-column">
          <h3>Contact Info</h3>
          <p>Savvy Starata,Ahmedabad,Gujarat</p>
          <p>Phone: +8880 44338899</p>
          <p>Email: Swasthy@gmail.com</p>
        </div>

        <div className="footer-column">
          <h3>Important Link</h3>
          <ul>
            <li><a href="#whmcs">Sign in</a></li>
            <li><a href="#domain">Search Domain</a></li>
            <li><a href="#account">My Account</a></li>
            <li><a href="#cart">View Cart</a></li>
            <li><a href="#shop">Our Shop</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>Newsletter</h3>
          <p>
            Heaven diet doesn't over lesser in days. Appear creeping seasons deve behold bearing days open.
          </p>
          <form>
            <input type="email" placeholder="Email Address" />
            <button type="submit" style={{width:'100px'}}>Send</button>
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        <p>Copyright ©2022 All rights reserved </p>
        <div className="social-icons">
          <a href="#facebook"><i className="fab fa-facebook-f"></i></a>
          <a href="#twitter"><i className="fab fa-twitter"></i></a>
          <a href="#globe"><i className="fas fa-globe"></i></a>
          <a href="#behance"><i className="fab fa-behance"></i></a>
        </div>
      </div>
    </footer>
    </>
  );
};

export default Chatwithus;
