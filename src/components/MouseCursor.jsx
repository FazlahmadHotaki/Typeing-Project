import React, { useEffect, useRef } from "react";
 // We'll put the styles in a separate CSS file

function MouseCursor() {
  const cursorRef = useRef(null);
  const followerRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;

    if (!cursor || !follower) return;

    let mouseX = 0;
    let mouseY = 0;
    let followerX = 0;
    let followerY = 0;
    let animationFrame;

    // Mouse movement
    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Main cursor follows immediately
      cursor.style.left = `${mouseX}px`;
      cursor.style.top = `${mouseY}px`;

      // Create trail
      const trail = document.createElement("div");
      trail.className = "trail";
      trail.style.left = `${mouseX}px`;
      trail.style.top = `${mouseY}px`;
      document.body.appendChild(trail);

      setTimeout(() => {
        trail.remove();
      }, 300);
    };

    // Smooth follower animationi
    const animateFollower = () => {
      followerX += (mouseX - followerX) * 0.5;
      followerY += (mouseY - followerY) * 0.5;

      follower.style.left = `${followerX}px`;
      follower.style.top = `${followerY}px`;

      animationFrame = requestAnimationFrame(animateFollower);
    };

    // Click particles
    const handleClick = (e) => {
      const particleCount = 12;

      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement("div");
        particle.className = "particle";

        particle.style.left = `${e.clientX}px`;
        particle.style.top = `${e.clientY}px`;

        const angle = (Math.PI * 2 / particleCount) * i;
        const distance = 35 + Math.random() * 35;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;

        particle.style.setProperty("--x", `${x}px`);
        particle.style.setProperty("--y", `${y}px`);

        document.body.appendChild(particle);

        setTimeout(() => {
          particle.remove();
        }, 700);
      }
    };

    // Hover effects
    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        target.closest("button") ||
        target.closest("a") ||
        target.closest("input") ||
        target.closest("textarea") ||
        target.closest("select")
      ) {
        cursor.classList.add("hover");
        follower.classList.add("hover");
      }
    };

    const handleMouseOut = (e) => {
      const target = e.target;
      if (
        target.closest("button") ||
        target.closest("a") ||
        target.closest("input") ||
        target.closest("textarea") ||
        target.closest("select")
      ) {
        cursor.classList.remove("hover");
        follower.classList.remove("hover");
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("click", handleClick);
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);

    animateFollower();

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("click", handleClick);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="cursor" />
      <div ref={followerRef} className="cursor-follower" />
    </>
  );
}

export default MouseCursor;