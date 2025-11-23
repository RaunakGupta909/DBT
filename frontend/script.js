// Frontend interactions: carousel, language switcher, dark mode, accessibility
// Sample campaigns data (in real app this would be fetched)
// const campaigns = [
//   {
//     title: '',
//     desc: '',
//     status: '',
//     image: 'images/image copy 2.png'
//   },
//   {
//     title: '',
//     desc: '',
//     status: '',
//     image: 'images/image copy 3.png'
//   },
//   {
//     title: '',
//     desc: '',
//     status: '',
//     image: 'images/image copy 4.png'
//   }
// ];

// // Carousel
const sliderLine = document.querySelector(".carousel-track");
const slides = document.querySelectorAll(".carousel-track a");

let index = 1;
let width = slides[0].offsetWidth;

// Clone first + last slide for infinite loop
const firstClone = slides[0].cloneNode(true);
const lastClone = slides[slides.length - 1].cloneNode(true);

sliderLine.appendChild(firstClone);
sliderLine.insertBefore(lastClone, slides[0]);

// Set initial position
sliderLine.style.transform = `translateX(${-width * index}px)`;

// Resize update
window.addEventListener("resize", () => {
  width = slides[0].clientWidth;
  sliderLine.style.transform = `translateX(${-width * index}px)`;
});

// Next slide
document.querySelector(".next").addEventListener("click", () => {
  if (index >= slides.length + 1) return;
  index++;
  sliderLine.style.transition = "0.5s ease";
  sliderLine.style.transform = `translateX(${-width * index}px)`;
});

// Previous slide
document.querySelector(".prev").addEventListener("click", () => {
  if (index <= 0) return;
  index--;
  sliderLine.style.transition = "0.5s ease";
  sliderLine.style.transform = `translateX(${-width * index}px)`;
});

// Infinite Loop Fix
sliderLine.addEventListener("transitionend", () => {
  if (index === slides.length + 1) {
    sliderLine.style.transition = "none";
    index = 1;
    sliderLine.style.transform = `translateX(${-width * index}px)`;
  }

  if (index === 0) {
    sliderLine.style.transition = "none";
    index = slides.length;
    sliderLine.style.transform = `translateX(${-width * index}px)`;
  }
});

// Auto Slide
setInterval(() => {
  document.querySelector(".next").click();
}, 3000);

// Swipe / Drag Support
let startX = 0;

sliderLine.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
});

sliderLine.addEventListener("touchend", (e) => {
  let endX = e.changedTouches[0].clientX;

  if (startX > endX + 50) document.querySelector(".next").click();
  if (startX < endX - 50) document.querySelector(".prev").click();
});


const hamburger = document.querySelector('.hamburger');
const nav = document.getElementById('primary-navigation');
const mobileMenu = document.getElementById('mobile-menu');


function toggleMenu(){
const expanded = hamburger.getAttribute('aria-expanded') === 'true';
hamburger.setAttribute('aria-expanded', String(!expanded));
if(!expanded){
mobileMenu.style.display = 'block';
mobileMenu.setAttribute('aria-hidden','false');
} else {
mobileMenu.style.display = 'none';
mobileMenu.setAttribute('aria-hidden','true');
}
}


hamburger.addEventListener('click', toggleMenu);


// close mobile menu on outside click or escape key
document.addEventListener('click', (e)=>{
if(window.innerWidth <= 880){
if(!e.composedPath().includes(mobileMenu) && !e.composedPath().includes(hamburger)){
mobileMenu.style.display = 'none';
mobileMenu.setAttribute('aria-hidden','true');
hamburger.setAttribute('aria-expanded','false');
}
}
});
document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape'){ mobileMenu.style.display='none'; mobileMenu.setAttribute('aria-hidden','true'); hamburger.setAttribute('aria-expanded','false'); } })
// // Inject carousel slides with images
// const carousel = document.getElementById('campaign-carousel');
// campaigns.forEach(c => {
//   const slide = document.createElement('div');
//   slide.className = 'slide';
//   slide.style.backgroundImage = `url('${c.image}')`;
//   slide.innerHTML = `
//     <div class="campaign-overlay">
//       <h3>${c.title}</h3>
//       <p>${c.desc}</p>
//     </div>
//   `;
//   carousel.appendChild(slide);
// });

// // Auto-scroll carousel every 3 seconds
// let currentIndex = 0;
// function showSlide(i){
//   const slides = document.querySelectorAll('#campaign-carousel .slide');
//   if(!slides.length) return;
//   const width = slides[0].clientWidth + 12; // gap
//   carousel.scrollTo({left: i * width, behavior: 'smooth'});
// }
// setInterval(()=>{
//   const slides = document.querySelectorAll('#campaign-carousel .slide');
//   if(!slides.length) return;
//   currentIndex = (currentIndex + 1) % slides.length;
//   showSlide(currentIndex);
// },3000);

// Dark mode toggle with localStorage persistence
const darkToggle = document.getElementById('dark-toggle');

// Check localStorage and apply dark mode on page load
function initDarkMode() {
  const isDarkMode = localStorage.getItem('darkMode') === 'true';
  if (isDarkMode) {
    document.body.classList.add('dark');
    updateDarkModeIcon(true);
  } else {
    updateDarkModeIcon(false);
  }
}

// Update toggle button icon
function updateDarkModeIcon(isDark) {
  if (darkToggle) {
    darkToggle.textContent = isDark ? '☀️' : '🌙';
    darkToggle.title = isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode';
  }
}

// Toggle dark mode
darkToggle.addEventListener('click', ()=>{
  const isDarkMode = document.body.classList.toggle('dark');
  localStorage.setItem('darkMode', isDarkMode);
  updateDarkModeIcon(isDarkMode);
});

// Initialize dark mode on page load
initDarkMode();

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
        // Open Google Maps search for nearby banks in the same tab
        window.location.href = `https://www.google.com/maps/search/banks+near+me/@${latitude},${longitude},15z`;
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

// Sample function to update counters from backend (enhanced with realistic DBT data)
const statsData = {
  'fy25-26': {
    totalStudents: '2,930,375',
    dbtEnabled: '2,176,324',
    volunteers: '52,530',
    annualAmount: '₹1,434.6Cr',
    schoolsConnected: '1,675,307',
    transactionsProcessed: '102.6M',
    beneficiariesServed: '52.4M',
    fraudPrevented: '₹3,273Cr',
    changeTotalStudents: '+15.2% this year',
    changeDbtEnabled: '74.1% coverage',
    changeVolunteers: '+15.4% growth',
    changeAnnualAmount: '+15.3% increase',
    changeSchoolsConnected: '+15.1% this year',
    changeTransactionsProcessed: '+15.0% growth',
    changeBeneficiariesServed: '+15.5% increase',
    changeFraudPrevented: '₹426Cr saved'
  },
  'fy24-25': {
    totalStudents: '2,547,892',
    dbtEnabled: '1,892,456',
    volunteers: '45,678',
    annualAmount: '₹1,247.5Cr',
    schoolsConnected: '1,456,789',
    transactionsProcessed: '89.2M',
    beneficiariesServed: '45.6M',
    fraudPrevented: '₹2,847Cr',
    changeTotalStudents: '+12.5% this year',
    changeDbtEnabled: '74.2% coverage',
    changeVolunteers: '+8.3% growth',
    changeAnnualAmount: '+15.2% increase',
    changeSchoolsConnected: '+23.1% this year',
    changeTransactionsProcessed: '+31.7% growth',
    changeBeneficiariesServed: '+18.9% increase',
    changeFraudPrevented: '₹847Cr saved'
  },
  'fy23-24': {
    totalStudents: '2,123,456',
    dbtEnabled: '1,567,890',
    volunteers: '38,912',
    annualAmount: '₹987.3Cr',
    schoolsConnected: '1,234,567',
    transactionsProcessed: '67.8M',
    beneficiariesServed: '38.9M',
    fraudPrevented: '₹1,956Cr',
    changeTotalStudents: '+10.0% this year',
    changeDbtEnabled: '74.5% coverage',
    changeVolunteers: '+5.0% growth',
    changeAnnualAmount: '+12.0% increase',
    changeSchoolsConnected: '+20.0% this year',
    changeTransactionsProcessed: '+25.0% growth',
    changeBeneficiariesServed: '+15.0% increase',
    changeFraudPrevented: '₹500Cr saved'
  }
};

async function updateCounters(year = 'fy25-26'){
  try{
    // Example fetch - replace URL with actual backend endpoint
    // const res = await fetch('/api/stats');
    // const stats = await res.json();
    const stats = statsData[year];
    document.getElementById('total-students').textContent = stats.totalStudents;
    document.getElementById('dbt-enabled').textContent = stats.dbtEnabled;
    document.getElementById('total-volunteers').textContent = stats.volunteers;
    document.getElementById('annual-amount').textContent = stats.annualAmount;
    document.getElementById('schools-connected').textContent = stats.schoolsConnected;
    document.getElementById('transactions-processed').textContent = stats.transactionsProcessed;
    document.getElementById('beneficiaries-served').textContent = stats.beneficiariesServed;
    document.getElementById('fraud-prevented').textContent = stats.fraudPrevented;

    // Update change spans
    document.getElementById('change-total-students').textContent = stats.changeTotalStudents;
    document.getElementById('change-dbt-enabled').textContent = stats.changeDbtEnabled;
    document.getElementById('change-total-volunteers').textContent = stats.changeVolunteers;
    document.getElementById('change-annual-amount').textContent = stats.changeAnnualAmount;
    document.getElementById('change-schools-connected').textContent = stats.changeSchoolsConnected;
    document.getElementById('change-transactions-processed').textContent = stats.changeTransactionsProcessed;
    document.getElementById('change-beneficiaries-served').textContent = stats.changeBeneficiariesServed;
    document.getElementById('change-fraud-prevented').textContent = stats.changeFraudPrevented;

    // Update hero stats if elements exist
    const heroStudents = document.getElementById('hero-students');
    const heroAmount = document.getElementById('hero-amount');
    const heroStates = document.getElementById('hero-states');

    if(heroStudents) heroStudents.textContent = stats.heroStudents;
    if(heroAmount) heroAmount.textContent = stats.heroAmount;
    if(heroStates) heroStates.textContent = stats.heroStates;
  }catch(e){console.warn('Failed to load counters',e)}
}

// Initialize with default year
updateCounters();

// Add event listener for year select
document.getElementById('year-select').addEventListener('change', function() {
  const selectedYear = this.value;
  updateCounters(selectedYear);
});

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

// Visitor count fetch and display
async function updateVisitorCount() {
  try {
    const response = await fetch('/api/visitor-count');
    const data = await response.json();
    document.getElementById('visitor-count').textContent = data.count;
  } catch (error) {
    console.error('Error fetching visitor count:', error);
    document.getElementById('visitor-count').textContent = 'Error';
  }
}

// Call on page load
document.addEventListener('DOMContentLoaded', () => {
  updateVisitorCount();
});

// End of frontend script

// -------------------------
// Testimonials sliding carousel (auto-advance left every 3s)
// -------------------------
const testimonials = [
  {
    text: 'This portal made it easy to check our DBT status. Very helpful!',
    author: 'S. Kumar, Pune',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face'
  },
  {
    text: 'Quick and informative — the staff at the school helped me register.',
    author: 'R. Desai, Mumbai',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face'
  },
  {
    text: 'Volunteer support was excellent and the process is transparent.',
    author: 'A. Singh, Delhi',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face'
  },
  {
    text: 'I could see the DBT enablement for my child within minutes.',
    author: 'M. Patil, Nashik',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face'
  }
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
    item.innerHTML = `
      <div class="testimonial-content">
        <img src="${t.image}" alt="${t.author}" class="testimonial-avatar">
        <div class="testimonial-text">
          <p>"${t.text}"</p>
          <div class="author">— ${t.author}</div>
        </div>
      </div>
    `;
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
  // Set active navigation link based on current page
  (function setActiveNav(){
    try{
      const links = Array.from(document.querySelectorAll('nav a, .mobile-menu a'));
      const path = window.location.pathname.split('/').pop() || 'index.html';
      links.forEach(a => {
        const href = a.getAttribute('href') || '';
        // handle hash links: mark Home active when on index
        if(href.startsWith('#')){
          if((href === '#home' || href === '#') && (path === '' || path === 'index.html')){
            a.classList.add('active');
          } else {
            a.classList.remove('active');
          }
          return;
        }
        const hrefFile = href.split('/').pop();
        if(hrefFile === path){
          a.classList.add('active');
        } else {
          a.classList.remove('active');
        }
      });
    }catch(e){/* fail silently */}
  })();
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

  // Chatbot functionality
  const chatbotIcon = document.getElementById('chatbot-icon');
  const chatbotModal = document.getElementById('chatbot-modal');
  const chatbotClose = document.getElementById('chatbot-close');
  const chatbotInput = document.getElementById('chatbot-input');
  const chatbotSend = document.getElementById('chatbot-send');
  const chatbotBody = document.getElementById('chatbot-body');

  // Open modal
  chatbotIcon.addEventListener('click', () => {
    chatbotModal.style.display = 'flex';
  });

  // Close modal
  chatbotClose.addEventListener('click', () => {
    chatbotModal.style.display = 'none';
  });

  // Close modal on outside click
  window.addEventListener('click', (e) => {
    if (e.target === chatbotModal) {
      chatbotModal.style.display = 'none';
    }
  });

  // Send message
  chatbotSend.addEventListener('click', sendMessage);
  chatbotInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });

  async function sendMessage() {
    const question = chatbotInput.value.trim();
    if (!question) return;

    // Add user message
    const userMsg = document.createElement('p');
    userMsg.innerHTML = `<strong>You:</strong> ${question}`;
    chatbotBody.appendChild(userMsg);

    // Clear input
    chatbotInput.value = '';

    // Scroll to bottom
    chatbotBody.scrollTop = chatbotBody.scrollHeight;

    // Show loading
    const loadingMsg = document.createElement('p');
    loadingMsg.textContent = 'Searching...';
    chatbotBody.appendChild(loadingMsg);
    chatbotBody.scrollTop = chatbotBody.scrollHeight;

    try {
      // Google Custom Search API
      const apiKey = 'AIzaSyBeKZn0eOHn4-qar3fc_L8K9daPLxczFGM';
      const cx = 'b4da9edec49f045b8';
      const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(question)}&num=5`;

      const response = await fetch(url);
      const data = await response.json();

      // Remove loading
      chatbotBody.removeChild(loadingMsg);

      if (data.items && data.items.length > 0) {
        // Add AI response header
        const aiHeader = document.createElement('p');
        aiHeader.innerHTML = `<strong>Search Results:</strong>`;
        chatbotBody.appendChild(aiHeader);

        // Display top 5 results
        data.items.slice(0, 5).forEach(item => {
          const resultMsg = document.createElement('div');
          resultMsg.style.marginBottom = '10px';
          resultMsg.innerHTML = `
            <strong><a href="${item.link}" target="_blank">${item.title}</a></strong><br>
            ${item.snippet}<br>
            <small>${item.displayLink}</small>
          `;
          chatbotBody.appendChild(resultMsg);
        });
      } else {
        // No results
        const noResultsMsg = document.createElement('p');
        noResultsMsg.innerHTML = `<strong>No results found.</strong>`;
        chatbotBody.appendChild(noResultsMsg);
      }

      // Scroll to bottom
      chatbotBody.scrollTop = chatbotBody.scrollHeight;
    } catch (error) {
      // Remove loading
      chatbotBody.removeChild(loadingMsg);

      // Add error message
      const errorMsg = document.createElement('p');
      errorMsg.innerHTML = `<strong>Error:</strong> Unable to perform search. Please try again.`;
      chatbotBody.appendChild(errorMsg);

      // Scroll to bottom
      chatbotBody.scrollTop = chatbotBody.scrollHeight;
    }
  }
});
