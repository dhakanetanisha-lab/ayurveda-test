const ADMIN_WHATSAPP = '919876543210'; // CHANGE THIS

function openAppointmentModal() {
  document.getElementById('appointmentModal').style.display = 'block';
}

function closeAppointmentModal() {
  document.getElementById('appointmentModal').style.display = 'none';
}

function sendAppointmentWhatsApp() {
  const name = document.getElementById('aptName').value.trim();
  const phone = document.getElementById('aptPhone').value.trim();
  const issue = document.getElementById('aptIssue').value.trim();

  if (!name || !phone) {
    alert('Please enter name and phone number');
    return;
  }

  const message = `
🌿 *Appointment Request*

👤 Name: ${name}
📞 Phone: ${phone}
🩺 Concern: ${issue || 'Not mentioned'}

Please let me know available slots.
`;

  const url =
    'https://wa.me/' +
    ADMIN_WHATSAPP +
    '?text=' +
    encodeURIComponent(message);

  window.open(url, '_blank');
  closeAppointmentModal();
}
