let currentIndex = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;

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

document.querySelector('.next')?.addEventListener('click', nextSlide);
document.querySelector('.prev')?.addEventListener('click', prevSlide);

// Auto-slide every 5 seconds
setInterval(() => {
  if (totalSlides > 1) nextSlide();
}, 5000);
