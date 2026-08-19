document.querySelectorAll('.seat:not(.occupied)').forEach(seat => {
  seat.addEventListener('click', () => {
    seat.classList.toggle('selected');
  });
});