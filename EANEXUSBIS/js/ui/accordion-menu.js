// ui/accordion-menu.js

export function initAccordionMenu() {
  const burger = document.getElementById('burger');
  const accordionMenu = document.getElementById('accordionMenu');
  
  if (!burger || !accordionMenu) return;

  // Toggle accordion menu
  burger.addEventListener('click', () => {
    const isOpen = accordionMenu.classList.contains('open');
    
    if (isOpen) {
      // Close
      accordionMenu.classList.remove('open');
      burger.classList.remove('active');
      burger.setAttribute('aria-expanded', 'false');
    } else {
      // Open
      accordionMenu.classList.add('open');
      burger.classList.add('active');
      burger.setAttribute('aria-expanded', 'true');
    }
  });

  // Close when clicking on a menu item
  const menuItems = accordionMenu.querySelectorAll('.accordion-menu-item');
  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      accordionMenu.classList.remove('open');
      burger.classList.remove('active');
      burger.setAttribute('aria-expanded', 'false');
    });
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!burger.contains(e.target) && !accordionMenu.contains(e.target)) {
      if (accordionMenu.classList.contains('open')) {
        accordionMenu.classList.remove('open');
        burger.classList.remove('active');
        burger.setAttribute('aria-expanded', 'false');
      }
    }
  });

  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && accordionMenu.classList.contains('open')) {
      accordionMenu.classList.remove('open');
      burger.classList.remove('active');
      burger.setAttribute('aria-expanded', 'false');
    }
  });
}
