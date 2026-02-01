
  const track = document.querySelector('.carousel-track');
  const slide = document.querySelectorAll('.carousel-slide');
  const prevBtn = document.querySelector('.carousel-btn.prev');
  const nextBtn = document.querySelector('.carousel-btn.next');

  let index = 0;

  function updateCarousel() {
    track.style.transform = `translateX(-${index * 100}%)`;
  }

  nextBtn.addEventListener('click', () => {
    index = (index + 1) % slide.length;
    updateCarousel();
  });

  prevBtn.addEventListener('click', () => {
    index = (index - 1 + slide.length) % slide.length;
    updateCarousel();
  });


let currentservices = '';

document.addEventListener('DOMContentLoaded', () => {

  document.querySelectorAll('.order-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentservices = btn.dataset.services;

      document.getElementById('selectedservices').innerText =
        'services: ' + currentservices;

      document.getElementById('orderModal').style.display = 'block';
    });
  });

});

function closeOrderModal() {
  document.getElementById('orderModal').style.display = 'none';
}

function placeOrder() {
  const name = document.getElementById('custName').value.trim();
  const phone = document.getElementById('custPhone').value.trim();
  const address = document.getElementById('custAddress').value.trim();

  if (!name || !phone) {
    alert('Please enter name and phone');
    return;
  }

//

const el = document.querySelector('.whatsapp-contact span');
const adminPhone = el?.innerText.replace(/\D/g, '');

console.log(adminPhone); // 919890298802 

  const message = `
🛒 *New Order*

📦 services: ${currentservices}
👤 Name: ${name}
📞 Phone: ${phone}
📍 Address: ${address}
`;

  window.open(
    'https://wa.me/' +
      adminPhone +
      '?text=' +
      encodeURIComponent(message),
    '_blank'
  );

  closeOrderModal();
}
