import React, { useState } from 'react';
import Nav from '../Nav';
import './chatbox.css'; // For chat styling

const Chatbox = () => {
  const [showForm, setShowForm] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [userInput, setUserInput] = useState('');

  // Function to start chat
  const handleStartChat = () => {
    setShowForm(true);
  };

  // Function to handle message submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const messageObj = {
      user: 'You',
      message: userInput,
      type: 'user',
    };
    setChatMessages([...chatMessages, messageObj]);

    // Send the user's message to the backend
    const response = await fetch('http://127.0.0.1:8000/api/chatbox/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ msg: userInput }),
    });

    const data = await response.json();

    // Update chat with AI's response
    const aiResponse = {
      user: 'our Dr.',
      message: data.message || 'No response from AI',
      type: 'ai',
    };
    setChatMessages([...chatMessages, messageObj, aiResponse]);
    setUserInput('');
  };

  // Function to close the chat
  const handleCloseChat = () => {
    setShowForm(false);
    setChatMessages([]);
  };

  return (
    <>
      <Nav />
      <div className="chat-container" >
        {!showForm ? (
          <button className="start-chat-btn" style={{marginTop:'130px'}} onClick={handleStartChat}>
            Start Chat
          </button>
        ) : (
          <>
            <div className="chat-box" style={{marginTop:'100px'}}>
              {chatMessages.map((msg, index) => (
                <div key={index} className={`chat-message ${msg.type}`}>
                  <strong>{msg.user}: </strong>
                  {msg.message}
                </div>
              ))}
            </div>
            <form onSubmit={handleSubmit} className="chat-form">
              <input
                type="text"
                placeholder="Enter your message"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
              />
              <button type="submit">Send</button>
              <button type="button" onClick={handleCloseChat}>
                Close
              </button>
            </form>
          </>
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

export default Chatbox;
