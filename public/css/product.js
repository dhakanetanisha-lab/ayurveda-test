
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


let currentProduct = '';

document.addEventListener('DOMContentLoaded', () => {

  document.querySelectorAll('.order-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentProduct = btn.dataset.product;

      document.getElementById('selectedProduct').innerText =
        'Product: ' + currentProduct;

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

  const adminPhone = '918459855891';

  const message = `
🛒 *New Order*

📦 Product: ${currentProduct}
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
