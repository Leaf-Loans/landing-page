const toggle = document.querySelector('.nav-burger');
const links = document.querySelector('.nav-links');

if (toggle && links) {
  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
  });
}

// CTA button click flash
document.querySelectorAll('.cta-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    this.classList.add('btn-clicked');
    setTimeout(() => this.classList.remove('btn-clicked'), 350);
  });
});

// Scroll-reveal: mark elements visible as they enter viewport
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
