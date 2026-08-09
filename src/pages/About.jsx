import React from 'react';
import kamalImg from '../assets/kamal.jpg';

export default function About() {
  return (
    <section className="main">
      <div className="hero-welcome">
        <hr className="accent-hr" />
        <h1>ABOUT ME</h1>
        <hr className="accent-hr" />
      </div>
      <div className="default-about">
        <div className="about1">
          <img src={kamalImg} alt="Kamal Bohara Portrait" />
        </div>
        <div className="about2">
          <p>
            I’m <b>Kamal Bohara</b>, a passionate and forward-thinking Computer Engineering student from Nepal.
            I’m driven by curiosity and a strong desire to understand how technology can solve real-world
            problems and make life easier. <br /><br />

            I enjoy exploring areas such as software development, research, and emerging technologies that
            shape the future of innovation. My journey in computer science started
            from curiosity and has
            evolved into a commitment to build meaningful, creative, and efficient solutions. <br /><br />

            Currently, I’m involved in projects that blend engineering, creativity, and problem-solving, from
            designing simple web applications to experimenting with futuristic concepts. I love learning new
            tools, collaborating with like-minded people, and constantly improving my technical and creative
            skills. <br /><br />

            Beyond coding, I enjoy reading, discovering new ideas, and brainstorming innovative ways to
            contribute to the digital world. <br /><br />

            <b>Kamal Bohara</b><br />
            Email: <a href="mailto:boharakamal857@gmail.com">boharakamal857@gmail.com</a>
          </p>
        </div>
      </div>
    </section>
  );
}
