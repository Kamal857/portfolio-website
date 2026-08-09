import React, { useState } from 'react';

export default function Contact() {
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '', active: false });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setStatus({ type: '', message: '', active: false });

    const formElement = event.target;
    const data = new FormData(formElement);

    try {
      const response = await fetch(formElement.action, {
        method: formElement.method,
        body: data,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setStatus({
          type: 'success',
          message: "✨ Message sent successfully! I'll get back to you soon.",
          active: true
        });
        formElement.reset();
      } else {
        const responseData = await response.json();
        let errorMsg = "❌ Oops! There was a problem submitting your form.";
        if (responseData && responseData.errors) {
          errorMsg = responseData.errors.map(error => error.message).join(", ");
        }
        setStatus({
          type: 'error',
          message: errorMsg,
          active: true
        });
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: "❌ Oops! Connection error. Please try again later.",
        active: true
      });
    } finally {
      setSubmitting(false);
      // Hide message after 5 seconds
      setTimeout(() => {
        setStatus(prev => ({ ...prev, active: false }));
      }, 5000);
    }
  };

  return (
    <section className="main contact-section">
      <div className="hero-welcome">
        <hr className="accent-hr" />
        <h1>GET IN TOUCH</h1>
        <hr className="accent-hr" />
      </div>

      <div className="contact-container">
        <div className="contact-info">
          <h3>Contact Information</h3>
          <p>Feel free to reach out for collaborations or just a friendly hello!</p>
          <div className="info-details">
            <div className="info-item">
              <i className="ri-mail-line"></i>
              <span>boharakamal857@gmail.com</span>
            </div>
            <div className="info-item">
              <i className="ri-map-pin-line"></i>
              <span>Nepal</span>
            </div>
          </div>
          <div className="social-links-panel">
            <a href="https://github.com/Kamal857" target="_blank" rel="noopener noreferrer">
              <i className="ri-github-fill"></i>
            </a>
            <a href="https://linkedin.com/in/kamal-bohara-a00629331" target="_blank" rel="noopener noreferrer">
              <i className="ri-linkedin-box-fill"></i>
            </a>
            <a href="https://www.facebook.com/kamal.bohara.573128" target="_blank" rel="noopener noreferrer">
              <i className="ri-facebook-circle-fill"></i>
            </a>
          </div>
        </div>

        <div className="contact-card">
          <form action="https://formspree.io/f/mreajqwl" method="POST" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input type="text" id="name" name="name" placeholder="Enter your name" required />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input type="email" id="email" name="email" placeholder="Enter your email" required />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input type="text" id="subject" name="subject" placeholder="What is this about?" />
            </div>
            <div className="form-group">
              <label htmlFor="message">Your Message</label>
              <textarea id="message" name="message" rows="5" placeholder="Write your message here..." required></textarea>
            </div>
            <button type="submit" className="submit-btn" disabled={submitting}>
              <span>{submitting ? 'Sending...' : 'Send Message'}</span>
              <i className={submitting ? "ri-loader-4-line ri-spin" : "ri-send-plane-fill"}></i>
            </button>
          </form>
          <div className={`form-status ${status.type} ${status.active ? 'active' : ''}`}>
            {status.message}
          </div>
        </div>
      </div>
    </section>
  );
}
