import React, { useEffect, useRef } from "react";
import anime from "animejs";
import "./Spinner.css";

const Spinner = () => {
  const spinnerRef = useRef(null);

  useEffect(() => {
    anime({
      targets: spinnerRef.current,
      rotate: "1turn",
      duration: 1000,
      easing: "linear",
      loop: true,
    });
  }, []);

  return (
    <div className="anime-spinner-container">
      <div className="anime-spinner" ref={spinnerRef}></div>
    </div>
  );
};

export default Spinner; 