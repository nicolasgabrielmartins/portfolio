document.addEventListener("DOMContentLoaded", function() {

  const sections = document.querySelectorAll(".section");
  const dots = document.querySelectorAll(".dot");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          let index = [...sections].indexOf(entry.target);
          updateActiveSection(index);
        }
      });
    },
    { threshold: 0.6 } 
  );

  sections.forEach((section) => observer.observe(section));

  
  function updateActiveSection(index) {
    sections.forEach((section, i) => {
      section.classList.toggle("active", i === index);
    });
    
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });
  }

});

gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis();
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) =>{
  lenis.raf(time*1000);
});
gsap.ticker.lagSmoothing(0);
