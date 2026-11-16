(function () {
  // 1. DARK MODE MANAGEMENT
  function getInitialDark() {
    try {
      const saved = localStorage.getItem('theme');
      if (saved === 'dark') return true;
      if (saved === 'light') return false;
    } catch {}
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  let isDark = getInitialDark();
  const toggleBtn = document.getElementById('darkModeToggle');

  function applyTheme(dark) {
    isDark = dark;
    document.documentElement.classList.toggle('dark', dark);
    document.body.classList.toggle('dark', dark);
    try {
      localStorage.setItem('theme', dark ? 'dark' : 'light');
    } catch {}
    if (toggleBtn) {
      toggleBtn.innerHTML = dark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
      const label = dark ? 'Aktifkan Mode Terang' : 'Aktifkan Mode Gelap';
      toggleBtn.setAttribute('aria-label', label);
      toggleBtn.setAttribute('title', label);
    }
    window.dispatchEvent(new CustomEvent('themechange', { detail: { isDark: dark } }));
  }

  applyTheme(isDark);
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => applyTheme(!isDark));
  }

  // 2. LOADING SCREEN
  const loadingScreen = document.getElementById('loadingScreen');
  const loadingFill = document.getElementById('loadingFill');
  let progress = 0;
  const loadTimer = window.setInterval(() => {
    progress += 18 + Math.random() * 18;
    if (progress >= 100) {
      progress = 100;
      if (loadingFill) loadingFill.style.width = '100%';
      window.clearInterval(loadTimer);
      window.setTimeout(() => {
        if (loadingScreen) {
          loadingScreen.classList.add('hidden');
          window.setTimeout(() => {
            loadingScreen.style.display = 'none';
          }, 500);
        }
      }, 300);
    } else if (loadingFill) {
      loadingFill.style.width = Math.round(progress) + '%';
    }
  }, 110);

  // 3. SCROLL TRACKING (PROGRESS BAR, HEADER, BACK TO TOP)
  const header = document.getElementById('siteHeader');
  const progressBar = document.getElementById('readingProgress');
  const backToTop = document.getElementById('backToTop');

  function onScroll() {
    const y = window.scrollY;
    if (header) header.classList.toggle('scrolled', y > 50);
    if (backToTop) backToTop.classList.toggle('visible', y > 300);
    if (progressBar) {
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      progressBar.style.width = (docHeight > 0 ? (y / docHeight) * 100 : 0) + '%';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // 4. MOBILE MENU
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  if (hamburgerBtn && mobileDrawer) {
    hamburgerBtn.addEventListener('click', () => {
      const open = mobileDrawer.classList.toggle('open');
      hamburgerBtn.innerHTML = open ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });
    mobileDrawer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        hamburgerBtn.innerHTML = '<i class="fas fa-bars"></i>';
      });
    });
  }

  // 5. FULL 3D INTERACTIVE TILT & GLARE ON EVERY .card-3d
  document.querySelectorAll('.card-3d').forEach((card) => {
    const intensity = Number(card.getAttribute('data-intensity') || 10);
    const liftZ = Number(card.getAttribute('data-lift') || 14);
    const glare = document.createElement('div');
    glare.className = 'card-3d-glare';
    card.appendChild(glare);

    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const rotateY = (px - 0.5) * intensity * 2;
      const rotateX = (0.5 - py) * intensity * 2;
      card.style.transform =
        'perspective(1200px) rotateX(' +
        rotateX.toFixed(2) +
        'deg) rotateY(' +
        rotateY.toFixed(2) +
        'deg) translateZ(' +
        liftZ +
        'px)';
      glare.style.opacity = '1';
      glare.style.background =
        'radial-gradient(circle at ' +
        (px * 100).toFixed(1) +
        '% ' +
        (py * 100).toFixed(1) +
        '%, rgba(255,255,255,0.22), transparent 60%)';
    });

    card.addEventListener('pointerleave', () => {
      card.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
      glare.style.opacity = '0';
    });
  });

  // 6. ANIMATED STATS COUNTER
  const statsSection = document.getElementById('stats');
  let statsDone = false;
  if (statsSection && 'IntersectionObserver' in window) {
    const statEls = Array.from(statsSection.querySelectorAll('.stat-number'));
    const targets = statEls.map((el) => Number(el.getAttribute('data-target') || 0));
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !statsDone) {
          statsDone = true;
          const start = performance.now();
          const duration = 1200;
          function animateStat(now) {
            const prog = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - prog, 3);
            statEls.forEach((el, idx) => {
              el.textContent = String(Math.floor(targets[idx] * eased));
            });
            if (prog < 1) requestAnimationFrame(animateStat);
            else statEls.forEach((el, idx) => (el.textContent = String(targets[idx])));
          }
          requestAnimationFrame(animateStat);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(statsSection);
  }

  // 7. PROJECT FILTER
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const cat = btn.getAttribute('data-filter') || 'all';
      filterBtns.forEach((b) => {
        b.classList.remove('btn-3d-primary');
        b.classList.add('btn-3d-outline');
      });
      btn.classList.remove('btn-3d-outline');
      btn.classList.add('btn-3d-primary');

      projectCards.forEach((card) => {
        const cardCat = card.getAttribute('data-category');
        card.classList.toggle('hidden-proj', cat !== 'all' && cardCat !== cat);
      });
    });
  });

  // 8. 3D COVERFLOW CERTIFICATES & MODAL LIGHTBOX
  const slides = Array.from(document.querySelectorAll('.cert-slide-3d'));
  const dotsWrap = document.getElementById('certDots');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const certStage = document.getElementById('certStage');
  const modal = document.getElementById('certificateModal');
  const modalImg = document.getElementById('modalCertImg');
  const modalTitle = document.getElementById('modalCertTitle');
  const modalDesc = document.getElementById('modalCertDesc');
  const modalCloseBtn = document.getElementById('modalCloseBtn');

  let currentSlide = 0;
  let sliderHovered = false;
  let modalOpen = false;
  const dots = [];

  if (dotsWrap && slides.length > 0) {
    slides.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'cert-dot' + (idx === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Sertifikat ' + (idx + 1));
      dot.addEventListener('click', () => setSlide(idx));
      dotsWrap.appendChild(dot);
      dots.push(dot);
    });
  }

  function updateCoverflow() {
    const total = slides.length;
    slides.forEach((slide, index) => {
      let offset = index - currentSlide;
      if (offset > total / 2) offset -= total;
      if (offset < -total / 2) offset += total;
      const absOffset = Math.abs(offset);
      const isVisible = absOffset <= 2;
      const translateX = offset * 52;
      const translateZ = -absOffset * 130 + (offset === 0 ? 35 : 0);
      const rotateY = offset * -26;
      const scale = offset === 0 ? 1 : Math.max(0.68, 1 - absOffset * 0.16);
      const opacity = isVisible ? Math.max(0.35, 1 - absOffset * 0.3) : 0;

      slide.style.transform =
        'translateX(' +
        translateX +
        '%) translateZ(' +
        translateZ +
        'px) rotateY(' +
        rotateY +
        'deg) scale(' +
        scale +
        ')';
      slide.style.opacity = String(opacity);
      slide.style.zIndex = String(20 - absOffset);
      slide.style.pointerEvents = isVisible ? 'auto' : 'none';
    });

    dots.forEach((d, idx) => d.classList.toggle('active', idx === currentSlide));
  }

  function setSlide(idx) {
    currentSlide = ((idx % slides.length) + slides.length) % slides.length;
    updateCoverflow();
  }

  function openModal(idx) {
    if (!modal || !slides[idx]) return;
    const s = slides[idx];
    const imgEl = s.querySelector('img');
    if (modalImg && imgEl) {
      modalImg.src = imgEl.src;
      modalImg.alt = imgEl.alt;
    }
    if (modalTitle) modalTitle.textContent = s.getAttribute('data-title') || '';
    if (modalDesc) {
      modalDesc.textContent =
        (s.getAttribute('data-desc') || '') + ' (Urutan: ' + (idx + 1) + ' dari ' + slides.length + ')';
    }
    modalOpen = true;
    modal.classList.add('open');
  }

  function closeModal() {
    if (!modal) return;
    modalOpen = false;
    modal.classList.remove('open');
  }

  if (slides.length > 0) {
    updateCoverflow();
    slides.forEach((slide, idx) => {
      slide.addEventListener('click', () => {
        if (idx === currentSlide) openModal(idx);
        else setSlide(idx);
      });
    });
  }

  if (prevBtn) prevBtn.addEventListener('click', () => setSlide(currentSlide - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => setSlide(currentSlide + 1));
  if (certStage) {
    certStage.addEventListener('mouseenter', () => (sliderHovered = true));
    certStage.addEventListener('mouseleave', () => (sliderHovered = false));
  }
  window.setInterval(() => {
    if (!sliderHovered && !modalOpen && slides.length > 0) {
      setSlide(currentSlide + 1);
    }
  }, 5000);

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOpen) closeModal();
  });

  // 9. NOW DATE
  const nowDateEl = document.getElementById('nowDate');
  if (nowDateEl) {
    const now = new Date();
    const months = [
      'Januari',
      'Februari',
      'Maret',
      'April',
      'Mei',
      'Juni',
      'Juli',
      'Agustus',
      'September',
      'Oktober',
      'November',
      'Desember',
    ];
    nowDateEl.textContent = now.getDate() + ' ' + months[now.getMonth()] + ' ' + now.getFullYear();
  }

  // 10. QR CODE GENERATOR
  const qrCanvas = document.getElementById('qrCanvas');
  const qrNotice = document.getElementById('qrNotice');
  const downloadQRBtn = document.getElementById('downloadQRBtn');
  const copyLinkBtn = document.getElementById('copyLinkBtn');
  const targetUrl = 'https://septianfr.web.id/';

  if (qrCanvas && typeof window.QRious === 'function') {
    new window.QRious({
      element: qrCanvas,
      value: targetUrl,
      size: 200,
      level: 'H',
      background: '#ffffff',
      foreground: '#111827',
    });
  }

  function showQrNotice(msg) {
    if (!qrNotice) return;
    qrNotice.textContent = msg;
    qrNotice.style.display = 'block';
    window.setTimeout(() => {
      qrNotice.style.display = 'none';
    }, 3200);
  }

  if (downloadQRBtn && qrCanvas) {
    downloadQRBtn.addEventListener('click', () => {
      qrCanvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'septianfr-qrcode.png';
        document.body.appendChild(a);
        a.click();
        a.remove();
        showQrNotice('QR Code diunduh sebagai septianfr-qrcode.png');
        window.setTimeout(() => URL.revokeObjectURL(url), 3500);
      }, 'image/png');
    });
  }

  if (copyLinkBtn) {
    copyLinkBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(targetUrl);
        showQrNotice('Link disalin: ' + targetUrl);
      } catch {
        showQrNotice('Salin alamat ini: ' + targetUrl);
      }
    });
  }

  // 11. CONTACT FORM (PHP send.php + Static Fallback)
  const contactForm = document.getElementById('contactForm');
  const contactFeedback = document.getElementById('contactFeedback');
  const submitBtn = document.getElementById('contactSubmitBtn');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const subject = document.getElementById('subject').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !subject || !message) {
        if (contactFeedback) {
          contactFeedback.textContent = 'Semua field wajib diisi.';
          contactFeedback.style.color = '#e11d48';
          contactFeedback.style.display = 'block';
        }
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> <span>Mengirim...</span>';
      }

      try {
        const res = await fetch('send.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({ name, email, subject, message }).toString(),
        });
        const ct = res.headers.get('content-type') || '';
        if (res.ok && ct.includes('application/json')) {
          const data = await res.json();
          if (contactFeedback) {
            contactFeedback.textContent = data.message || 'Pesan berhasil dikirim!';
            contactFeedback.style.color = data.status === 'success' ? '#10b981' : '#e11d48';
            contactFeedback.style.display = 'block';
          }
          if (data.status === 'success') contactForm.reset();
        } else {
          throw new Error('Static');
        }
      } catch {
        if (contactFeedback) {
          contactFeedback.textContent =
            'Pesan Anda siap dikirim! Anda juga dapat menghubungi langsung via WhatsApp atau Telegram.';
          contactFeedback.style.color = '#10b981';
          contactFeedback.style.display = 'block';
        }
        contactForm.reset();
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> <span>Kirim Pesan</span>';
        }
      }
    });
  }
})();
