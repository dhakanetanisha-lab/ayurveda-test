let currentIndex = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;

let autoSlideInterval;

// Initialize first slide
if (totalSlides > 0) {
  slides[currentIndex].classList.add('active');
}

function showSlide(index) {
  slides.forEach(slide => slide.classList.remove('active'));
  slides[index].classList.add('active');
}

function nextSlide() {
  currentIndex = (currentIndex + 1) % totalSlides;
  showSlide(currentIndex);
}

function prevSlide() {
  currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
  showSlide(currentIndex);
}

// Start auto slide (3 seconds)
function startAutoSlide() {
  if (totalSlides > 1) {
	
	const autoSlideTime = window.autoSlideTime || 3000;

	// Auto-slide
	setInterval(() => {
	  if (totalSlides > 1) nextSlide();
	}, autoSlideTime);


   // autoSlideInterval = setInterval(nextSlide, 1000); // 3 seconds
	
  }
}

// Reset auto slide when manually clicked
function resetAutoSlide() {
  clearInterval(autoSlideInterval);
  startAutoSlide();
}

// Button events
document.querySelector('.next')?.addEventListener('click', () => {
  nextSlide();
  resetAutoSlide();
});

document.querySelector('.prev')?.addEventListener('click', () => {
  prevSlide();
  resetAutoSlide();
});

// Start on load
startAutoSlide();
