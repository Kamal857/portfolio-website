 const sidebar = document.getElementById('sidebar');
  const menuIcon = document.getElementById('menu-icon');

  menuIcon.addEventListener('click', () => {
    sidebar.classList.toggle('active');
  });