// Frontend interactions: carousel, language switcher, dark mode, accessibility
// Sample campaigns data (in real app this would be fetched)
const campaigns = [
  {title: 'Free Health Camp - Current', desc: 'Join at local school', status: 'current'},
  {title: 'Scholarship Drive - Upcoming', desc: 'Apply before Dec 15', status: 'upcoming'},
  {title: 'Awareness Rally - Past', desc: 'Thank you for participating', status: 'past'}
];

// Inject carousel slides
const carousel = document.getElementById('campaign-carousel');
campaigns.forEach(c => {
  const slide = document.createElement('div');
  slide.className = 'slide card';
  slide.innerHTML = `<div><h3>${c.title}</h3><p>${c.desc}</p></div><div><strong>${c.status.toUpperCase()}</strong></div>`;
  carousel.appendChild(slide);
});

// Auto-scroll carousel every 3 seconds
let currentIndex = 0;
function showSlide(i){
  const slides = document.querySelectorAll('#campaign-carousel .slide');
  if(!slides.length) return;
  const width = slides[0].clientWidth + 12; // gap
  carousel.scrollTo({left: i * width, behavior: 'smooth'});
}
setInterval(()=>{
  const slides = document.querySelectorAll('#campaign-carousel .slide');
  if(!slides.length) return;
  currentIndex = (currentIndex + 1) % slides.length;
  showSlide(currentIndex);
},3000);

// Dark mode toggle
const darkToggle = document.getElementById('dark-toggle');
darkToggle.addEventListener('click', ()=>{
  document.body.classList.toggle('dark');
});

// Language switcher (floating)
const lang = document.getElementById('lang-switcher');
const languages = ['EN','HI','MR','GU'];
let langIndex = 0;
lang.addEventListener('click', ()=>{
  langIndex = (langIndex + 1) % languages.length;
  lang.textContent = languages[langIndex];
  // In real app: load translations and update text nodes
});

// Find Nearby Bank - fetch user location using Geolocation API
const findBankBtn = document.getElementById('find-bank-btn');
if(findBankBtn){
  findBankBtn.addEventListener('click', ()=>{
    if(!navigator.geolocation){
      alert('Geolocation is not supported by your browser.');
      return;
    }
    findBankBtn.disabled = true;
    findBankBtn.textContent = '📍 Getting location...';
    navigator.geolocation.getCurrentPosition(
      (position)=>{
        const {latitude, longitude} = position.coords;
        console.log(`User location: ${latitude}, ${longitude}`);
        alert(`Your location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}\n\nIn a real app, this would search for nearby banks.`);
        findBankBtn.disabled = false;
        findBankBtn.textContent = '📍 Find Nearby Bank';
      },
      (error)=>{
        console.error('Geolocation error:', error);
        alert('Unable to get your location. Please enable location access.');
        findBankBtn.disabled = false;
        findBankBtn.textContent = '📍 Find Nearby Bank';
      }
    );
  });
}

// Font increaser removed from navbar.

// Sample function to update counters from backend (dummy)
async function updateCounters(){
  try{
    // Example fetch - replace URL with actual backend endpoint
    // const res = await fetch('/api/stats');
    // const stats = await res.json();
    const stats = {totalStudents:1200, dbtEnabled:842, volunteers:56, annualAmount:'₹12,40,000'};
    document.getElementById('total-students').textContent = stats.totalStudents;
    document.getElementById('dbt-enabled').textContent = stats.dbtEnabled;
    document.getElementById('total-volunteers').textContent = stats.volunteers;
    document.getElementById('annual-amount').textContent = stats.annualAmount;
  }catch(e){console.warn('Failed to load counters',e)}
}

updateCounters();

// Start video autoplay if visible (muted required by some browsers)
const video = document.getElementById('howto-video');
if(video){
  video.play().catch(()=>{/* autoplay blocked */});
}

// Small helper: simulate login POST for demonstration
async function demoLogin(role, payload){
  // In a real app this calls backend endpoints
  // return await fetch(`/api/auth/login?role=${role}`, {method:'POST', body:JSON.stringify(payload)});
  return {ok:true, token:'demo-token'};
}

// End of frontend script

// -------------------------
// Testimonials sliding carousel (auto-advance left every 3s)
// -------------------------
const testimonials = [
  {text: 'This portal made it easy to check our DBT status. Very helpful!', author: 'S. Kumar, Pune'},
  {text: 'Quick and informative — the staff at the school helped me register.', author: 'R. Desai, Mumbai'},
  {text: 'Volunteer support was excellent and the process is transparent.', author: 'A. Singh, Delhi'},
  {text: 'I could see the DBT enablement for my child within minutes.', author: 'M. Patil, Nashik'}
];

let tIndex = 0;
let tInterval = null;
const track = document.getElementById('testimonial-track');

function buildTestimonialTrack(){
  if(!track) return;
  track.innerHTML = '';
  testimonials.forEach(t => {
    const item = document.createElement('div');
    item.className = 'testimonial';
    item.innerHTML = `<p>“${t.text}”</p><div class="author">— ${t.author}</div>`;
    track.appendChild(item);
  });
}

function updateTrackPosition(){
  if(!track) return;
  track.style.transform = `translateX(-${tIndex * 100}%)`;
}

function nextTestimonial(){
  tIndex = (tIndex + 1) % testimonials.length;
  updateTrackPosition();
}
function prevTestimonial(){
  tIndex = (tIndex - 1 + testimonials.length) % testimonials.length;
  updateTrackPosition();
}

function startTestimonialAuto(){
  stopTestimonialAuto();
  tInterval = setInterval(nextTestimonial, 3000);
}
function stopTestimonialAuto(){
  if(tInterval){ clearInterval(tInterval); tInterval = null; }
}

// Initialize
if(track){
  buildTestimonialTrack();
  updateTrackPosition();
  startTestimonialAuto();
  // Pause on hover of viewport
  const viewport = document.querySelector('.testimonial-viewport');
  if(viewport){
    viewport.addEventListener('mouseenter', stopTestimonialAuto);
    viewport.addEventListener('mouseleave', startTestimonialAuto);
  }
}

// No pause button: testimonials auto-scroll continuously every 3 seconds.

// -------------------------
// FAQ accordion behavior
// - Clicking a question opens its answer and closes others
// - Clicking anywhere else on the page closes open answers
// -------------------------
// Add event listeners after DOM content loaded (defensive)
document.addEventListener('DOMContentLoaded', ()=>{
  const faqItems = Array.from(document.querySelectorAll('.faq-item'));
  if(faqItems.length === 0) return;

  // For each item, wire up the question button to toggle its answer
  faqItems.forEach(item => {
    const q = item.querySelector('.faq-question');
    const a = item.querySelector('.faq-answer');
    if(!q || !a) return;

    // Stop clicks inside answer region from bubbling to document (so clicks on answer do not close it)
    a.addEventListener('click', (ev)=> ev.stopPropagation());

    q.addEventListener('click', (ev)=>{
      ev.stopPropagation(); // prevent document click handler from immediately closing it
      const isOpen = item.classList.contains('open');
      // Close all
      faqItems.forEach(i=>i.classList.remove('open'));
      // Toggle this one
      if(!isOpen) item.classList.add('open');
    });
  });

  // Click anywhere else closes open FAQ answers
  document.addEventListener('click', ()=>{
    faqItems.forEach(i=>i.classList.remove('open'));
  });
});
