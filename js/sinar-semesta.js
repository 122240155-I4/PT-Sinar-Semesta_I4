document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.navlinks');

  if (toggle && nav) {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.setAttribute('aria-label', isOpen ? 'Tutup navigasi' : 'Buka navigasi');
    });
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navlinks a').forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });

  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  // ===== Email: formulir kontak dan tautan email di header/footer =====
  // Semua pesan diarahkan ke alamat ini. Ubah di sini jika penerima berganti.
  const contactRecipient = 'aji.ayyashi.dn@gmail.com';
  const mailSubject = 'Permintaan informasi website PT Sinar Semesta';
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  const clean = value => String(value || '').trim();

  function buildMessage(data) {
    return [
      'Nama: ' + clean(data.get('nama')),
      'Email: ' + clean(data.get('email')),
      'Perusahaan: ' + (clean(data.get('perusahaan')) || '-'),
      '',
      'Pesan:',
      clean(data.get('pesan')),
      '',
      '— Dikirim melalui formulir website PT Sinar Semesta'
    ].join('\r\n');
  }

  const mailtoUrl = body =>
    'mailto:' + contactRecipient +
    '?subject=' + encodeURIComponent(mailSubject) +
    '&body=' + encodeURIComponent(body || '');

  const gmailUrl = body =>
    'https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(contactRecipient) +
    '&su=' + encodeURIComponent(mailSubject) +
    '&body=' + encodeURIComponent(body || '');

  // Ponsel: buka aplikasi email bawaan. Desktop: buka Gmail web di tab baru.
  function composeEmail(body) {
    if (isMobile) {
      window.location.href = mailtoUrl(body);
      return;
    }
    const win = window.open(gmailUrl(body), '_blank');
    if (win) {
      win.opener = null;
    } else {
      // Pop-up diblokir: gunakan aplikasi email bawaan.
      window.location.href = mailtoUrl(body);
    }
  }

  // Tautan email di header/footer: teks tetap marketing.ptss@gmail.com,
  // tetapi saat diklik membuka email baru ke alamat penerima di atas.
  document.querySelectorAll('a[data-email-link]').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      composeEmail('');
    });
  });

  document.querySelectorAll('form[data-mail]').forEach(form => {
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      composeEmail(buildMessage(new FormData(form)));
    });
  });
});
