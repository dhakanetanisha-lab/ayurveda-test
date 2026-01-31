function submitReview() {
  fetch('/api/reviews', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: document.getElementById('name').value,
      message: document.getElementById('message').value
    })
  })
  .then(() => {
    document.getElementById('reviewStatus').innerText =
      'Thank you! Review submitted for approval.';
    document.getElementById('reviewForm').reset();
  });
}


let testimonialIndex = 0;

function moveTestimonial(direction) {
  const track = document.getElementById('testimonialTrack');
  const cards = track.querySelectorAll('.testimonial-card');

  if (!cards.length) return;

  const visibleCards = window.innerWidth <= 768 ? 1 : 2;
  const maxIndex = cards.length - visibleCards;

  testimonialIndex += direction;

  if (testimonialIndex < 0) testimonialIndex = 0;
  if (testimonialIndex > maxIndex) testimonialIndex = maxIndex;

  const cardWidth = cards[0].offsetWidth + 20; // gap included
  track.style.transform =
    `translateX(-${testimonialIndex * cardWidth}px)`;
}
