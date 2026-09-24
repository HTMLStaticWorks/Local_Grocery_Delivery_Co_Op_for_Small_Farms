document.addEventListener('DOMContentLoaded', () => {
  // Simple tab switching for dashboard content (if implemented as single page dashboard)
  // For this template, we'll assume a single page dashboard with sections that show/hide
  // or simply anchor links if scrolling. Let's do simple show/hide sections.
  
  const navLinks = document.querySelectorAll('.dashboard-sidebar a:not(.sidebar-logout)');
  const sections = document.querySelectorAll('.dashboard-section');

  if(navLinks.length > 0 && sections.length > 0) {
    // Show first section by default
    sections.forEach(s => s.style.display = 'none');
    sections[0].style.display = 'block';
    navLinks[0].classList.add('active');

    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        
        // Update active link
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        // Show target section
        sections.forEach(s => {
          if (s.id === targetId) {
            s.style.display = 'block';
          } else {
            s.style.display = 'none';
          }
        });
      });
    });
  }

  // Top bar: sidebar drawer (<=1024px)
  const menuToggle = document.querySelector('.dash-menu-toggle');
  const sidebar = document.querySelector('.dashboard-sidebar');
  const sidebarOverlay = document.querySelector('.dash-sidebar-overlay');

  function setSidebar(open) {
    if (!sidebar) return;
    sidebar.classList.toggle('open', open);
    sidebarOverlay.classList.toggle('open', open);
    menuToggle.setAttribute('aria-expanded', open);
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', () => setSidebar(!sidebar.classList.contains('open')));
    sidebarOverlay.addEventListener('click', () => setSidebar(false));
    navLinks.forEach(link => link.addEventListener('click', () => setSidebar(false)));
  }

  // Top bar: profile menu
  const avatar = document.querySelector('.dash-avatar');
  const profileMenu = document.querySelector('.dash-profile-menu');

  if (avatar) {
    avatar.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = profileMenu.classList.toggle('open');
      avatar.setAttribute('aria-expanded', open);
    });
    document.addEventListener('click', () => {
      profileMenu.classList.remove('open');
      avatar.setAttribute('aria-expanded', false);
    });
    const profileLink = document.querySelector('.dash-profile-link');
    const settingsNav = document.querySelector('.dashboard-sidebar a[href="#profile-settings"]');
    profileLink.addEventListener('click', (e) => {
      e.preventDefault();
      if (settingsNav) settingsNav.click();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      setSidebar(false);
      if (profileMenu) profileMenu.classList.remove('open');
    }
  });

  // Tables: copy header text onto each cell for the stacked mobile layout
  document.querySelectorAll('.table-responsive table').forEach(table => {
    const headers = [...table.querySelectorAll('thead th')].map(th => th.textContent.trim());
    table.querySelectorAll('tbody tr').forEach(row => {
      [...row.children].forEach((cell, i) => {
        if (headers[i]) cell.setAttribute('data-label', headers[i]);
      });
    });
  });

  // Sidebar logout: clear login state, then follow link to index.html
  const sidebarLogout = document.querySelector('.sidebar-logout');
  if (sidebarLogout) {
    sidebarLogout.addEventListener('click', () => localStorage.removeItem('isLoggedIn'));
  }

  // Box Customization logic (dummy UI)
  const swapBtns = document.querySelectorAll('.swap-btn');
  swapBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const card = this.closest('.card');
      const title = card.querySelector('h3').textContent;
      const isSwapped = this.classList.contains('btn-primary');
      
      if(isSwapped) {
        // Swap out
        this.classList.remove('btn-primary');
        this.classList.add('btn-secondary');
        this.textContent = 'Add to Box';
        card.style.opacity = '0.6';
        alert(`Removed ${title} from your box.`);
      } else {
        // Swap in
        this.classList.remove('btn-secondary');
        this.classList.add('btn-primary');
        this.textContent = 'Remove';
        card.style.opacity = '1';
        alert(`Added ${title} to your box!`);
      }
    });
  });

  // Pause Subscription logic
  const pauseBtn = document.getElementById('pauseBtn');
  if(pauseBtn) {
    pauseBtn.addEventListener('click', function() {
      const isPaused = this.dataset.paused === 'true';
      if(isPaused) {
        this.dataset.paused = 'false';
        this.textContent = 'Pause Subscription';
        this.classList.remove('btn-primary');
        this.classList.add('btn-secondary');
        document.getElementById('subStatus').textContent = 'Active';
        document.getElementById('subStatus').className = 'badge badge-primary';
      } else {
        this.dataset.paused = 'true';
        this.textContent = 'Resume Subscription';
        this.classList.remove('btn-secondary');
        this.classList.add('btn-primary');
        document.getElementById('subStatus').textContent = 'Paused';
        document.getElementById('subStatus').className = 'badge badge-secondary';
      }
    });
  }
});
