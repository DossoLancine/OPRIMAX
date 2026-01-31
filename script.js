// ============================================
// CONFIGURATION EMAILJS
// ============================================
const EMAILJS_CONFIG = {
  PUBLIC_KEY: "BMtloRPd4OOqsSU3b",
  SERVICE_ID: "service_b6v8x5o",
  TEMPLATE_ID: "template_6ohsq8d"
};

// ============================================
// INITIALISATION
// ============================================
document.addEventListener('DOMContentLoaded', function () {
  // Initialiser EmailJS
  if (typeof emailjs !== 'undefined') {
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
    console.log("✅ EmailJS initialisé");
  }

  // Configuration de la navbar
  setupNavbar();

  // Configuration du menu mobile
  setupMobileMenu();

  // Configuration du slider
  setupSlider();

  // Configuration des notifications
  setupNotifications();

  // Configuration du modal portfolio
  setupPortfolioModal();

  // Configuration du formulaire de contact
  setupContactForm();

  // Configuration des animations au scroll
  setupScrollAnimations();

  // Configuration du smooth scroll
  setupSmoothScroll();

  console.log("✅ Site OPRIMAX UP initialisé avec succès");
});

// ============================================
// NAVBAR AVEC EFFET LUMIÈRE
// ============================================
function setupNavbar() {
  const navbar = document.querySelector('.navbar');
  let lightOn = true;
  let lastScrollTop = 0;

  window.addEventListener('scroll', function () {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Activer/désactiver la lumière selon la position de scroll
    const middleOfPage = document.documentElement.scrollHeight / 3;

    if (scrollTop > middleOfPage && scrollTop < middleOfPage * 1.5) {
      if (lightOn) {
        navbar.classList.remove('light-on');
        lightOn = false;
      }
    } else {
      if (!lightOn) {
        navbar.classList.add('light-on');
        lightOn = true;
      }
    }

    // Effet de diminution de la navbar au scroll
    if (scrollTop > 100) {
      navbar.style.padding = '1rem 5%';
      navbar.style.backdropFilter = 'blur(15px)';
    } else {
      navbar.style.padding = '1.5rem 5%';
      navbar.style.backdropFilter = 'blur(10px)';
    }

    lastScrollTop = scrollTop;
  });
}

// ============================================
// MENU MOBILE
// ============================================
function setupMobileMenu() {
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileNav = document.querySelector('.mobile-nav');
  const closeMobileMenu = document.querySelector('.close-mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav a');

  // Ouvrir le menu mobile
  mobileMenuBtn.addEventListener('click', function () {
    mobileNav.classList.add('active');
    document.body.style.overflow = 'hidden';
    mobileMenuBtn.style.visibility = 'hidden';
  });

  // Fermer le menu mobile
  closeMobileMenu.addEventListener('click', function () {
    mobileNav.classList.remove('active');
    document.body.style.overflow = 'auto';
    mobileMenuBtn.style.visibility = 'visible';
  });

  // Fermer le menu quand on clique sur un lien
  mobileLinks.forEach(link => {
    link.addEventListener('click', function () {
      mobileNav.classList.remove('active');
      document.body.style.overflow = 'auto';
    });
  });

  // Fermer le menu quand on clique en dehors
  mobileNav.addEventListener('click', function (e) {
    if (e.target === mobileNav) {
      mobileNav.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  });
}

// ============================================
// SLIDER AUTOMATIQUE
// ============================================
function setupSlider() {
  const slides = document.querySelectorAll('.slide');
  const indicators = document.querySelectorAll('.indicator');
  const prevBtn = document.querySelector('.prev-slide');
  const nextBtn = document.querySelector('.next-slide');
  let currentSlide = 0;
  let slideInterval;

  function showSlide(index) {
    // Retirer la classe active de toutes les slides et indicateurs
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));

    // Ajouter la classe active à la slide et indicateur correspondants
    slides[index].classList.add('active');
    indicators[index].classList.add('active');
    currentSlide = index;
  }

  function nextSlide() {
    let nextIndex = (currentSlide + 1) % slides.length;
    showSlide(nextIndex);
  }

  function prevSlide() {
    let prevIndex = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(prevIndex);
  }

  function startSlider() {
    slideInterval = setInterval(nextSlide, 6000);
  }

  function stopSlider() {
    clearInterval(slideInterval);
  }

  // Événements pour les boutons de navigation
  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      stopSlider();
      nextSlide();
      startSlider();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', function () {
      stopSlider();
      prevSlide();
      startSlider();
    });
  }

  // Événements pour les indicateurs
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', function () {
      stopSlider();
      showSlide(index);
      startSlider();
    });
  });

  // Démarrer le slider automatique
  startSlider();

  // Arrêter le slider au survol
  const sliderContainer = document.querySelector('.slider-container');
  if (sliderContainer) {
    sliderContainer.addEventListener('mouseenter', stopSlider);
    sliderContainer.addEventListener('mouseleave', startSlider);
    sliderContainer.addEventListener('touchstart', stopSlider);
    sliderContainer.addEventListener('touchend', startSlider);
  }
}

// ============================================
// NOTIFICATIONS INTELLIGENTES
// ============================================
function setupNotifications() {
  const notifications = [
    "OPRIMAX UP est en partenariat avec PlanB-Ivoire",
    "Nous avons des partenariats stratégiques avec plusieurs entreprises en Côte d'Ivoire",
    "Notre équipe a développé plusieurs applications web et mobiles",
    "Nous accompagnons des entreprises innovantes en Côte d'Ivoire",
    "OPRIMAX UP, Votre partenaire en transformation digitale"
  ];

  const notificationContainer = document.querySelector('.notification-container');

  function showRandomNotification() {
    if (!notificationContainer) return;

    // Créer une nouvelle notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
            <div class="notification-icon">
                <i class="fas fa-bell"></i>
            </div>
            <div class="notification-text">
                ${notifications[Math.floor(Math.random() * notifications.length)]}
            </div>
        `;

    notificationContainer.appendChild(notification);

    // Afficher la notification
    setTimeout(() => {
      notification.classList.add('show');
    }, 100);

    // Masquer la notification après 5 secondes
    setTimeout(() => {
      notification.classList.remove('show');

      // Supprimer la notification du DOM après l'animation
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 500);
    }, 5000);
  }

  // Afficher une notification toutes les 15 secondes
  setTimeout(showRandomNotification, 3000);
  setInterval(showRandomNotification, 15000);
}

// ============================================
// MODAL PORTFOLIO
// ============================================
function setupPortfolioModal() {
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  const detailButtons = document.querySelectorAll('.btn-details');
  const modal = document.getElementById('projectModal');
  const closeModal = document.querySelector('.close-modal');
  const modalImage = document.getElementById('modalImage');
  const modalTitle = document.getElementById('modalTitle');
  const modalDescription = document.getElementById('modalDescription');

  const projects = {
    1: {
      title: "Plateforme de gestion de pharmacie et recommandation de garde",
      image: "assets/images/pharmacie.png",
      description: `
                <p><strong>Projet :</strong> Oprimax Up</p>
                <p><strong>Durée :</strong> 3 mois</p>
                <p><strong>Description :</strong> Développement d'une plateforme e-commerce complète
                 avec système de paiement sécurisé, gestion d'inventaire en temps réel, et interface
                  d'administration avancée. Le projet a permis au client d'augmenter ses ventes en ligne
                   de 150% en 6 mois.</p>
                
            `,
      status: "Terminé",
      date: "Janvier 2024",
      url: "#"
    },
    
    2:{
      title: "Plateforme de mise en relation de professionnels",
      image: "assets/images/planb.png",
      description: `
                <p><strong>Client :</strong> L'entreprise PlanB</p>
                <p><strong>Durée :</strong> 2 mois</p>
                <p><strong>Technologies :</strong> Vue.js, D3.js, Python, PostgreSQL</p>
                <p><strong>Description :</strong> Plateforme de mise en relation de professionnels
                 dans plusieurs secteurs d'activité.</p>
            `,
      status: "En cours",
      date: "Novembre 2023",
      url: "#"
    },

3: {
      title: "Application de Livraison",
      image: "assets/images/appliv.png",
      description: `
                <p><strong>Client :</strong> Startup de logistique</p>
                <p><strong>Durée :</strong> 4 mois (en cours)</p>
                <p><strong>Technologies :</strong> Flutter, Firebase, Google Maps API</p>
                <p><strong>Description :</strong> Application mobile native pour iOS et Android permettant la gestion de livraisons en temps réel avec suivi GPS, notifications push, et système de paiement intégré.</p>
                <p><strong>Fonctionnalités :</strong></p>
                <ul>
                    <li>Suivi GPS en temps réel</li>
                    <li>Système de notation des livreurs</li>
                    <li>Paiement mobile intégré</li>
                    <li>Chat en temps réel</li>
                    <li>Gestion des tournées optimisée</li>
                </ul>
            `,
      status: "En cours",
      date: "Mars 2024 - Présent",
      url: "#"
    },


  4: {
      title: "logiciel de gestion de restaurant RestoSmart",
      image: "assets/images/resto.png",
      description: `
                <p><strong>Projet :</strong> Oprimax Up</p>
                <p><strong>Durée :</strong> 2 mois</p>
                <p><strong>Technologies :</strong> Inertia.js, laravel, MySQL</p>
                <p><strong>Description :</strong> Logiciel de gestion complet pour restaurants, incluant la gestion des commandes, des stocks, des employés et des rapports de performance.</p>
               
            `,
      status: "Terminé",
      date: "Novembre 2023",
      url: "#"
    },
  5: {
      title: "Aprofi-ci, la plateforme de vente et location de biens immobiliers",
      image: "assets/images/aprofici.png",
      description: `
                <p><strong>Client :</strong> Banque internationale</p>
                <p><strong>Durée :</strong> 2 mois</p>
                <p><strong>Technologies :</strong> Vue.js, D3.js, Python, PostgreSQL</p>
                <p><strong>Description :</strong> Tableau de bord analytique personnalisé avec visualisation de données en temps réel, rapports automatisés et prédictions basées sur l'IA.</p>
               
            `,
      status: "Terminé",
      date: "Novembre 2023",
      url: "#"
    },
  6: {
      title: "Application de gestion hôtelière HotelPro",
      image: "assets/images/hotel.png",
      description: `
                <p><strong>Projet :</strong> Aprofi-ci</p>
                <p><strong>Durée :</strong> 4 mois</p>
                <p><strong>Technologies :</strong> React.js, Laravel, PostgreSQL</p>
                <p><strong>Description :</strong> Application de gestion complète pour hôtels, incluant la réservation, la gestion des chambres, les services clients et les rapports de performance.</p>
               
            `,
      status: "Terminé",
      date: "Novembre 2023",
      url: "#"
    }
  };

  // Gestion des clics sur les items portfolio
  portfolioItems.forEach(item => {
    item.addEventListener('click', function (e) {
      // Ne pas ouvrir le modal si on clique sur le bouton "Visiter"
      if (e.target.closest('.btn-visit')) {
        return;
      }

      const projectId = this.getAttribute('data-project');
      const project = projects[projectId];

      if (project && modal) {
        showProjectModal(project);
      }
    });
  });

  // Gestion des clics sur les boutons "Détails"
  detailButtons.forEach(button => {
    button.addEventListener('click', function (e) {
      e.stopPropagation(); // Empêcher le déclenchement du click sur l'item parent
      const projectId = this.getAttribute('data-project');
      const project = projects[projectId];

      if (project && modal) {
        showProjectModal(project);
      }
    });
  });

  function showProjectModal(project) {
    if (!modal || !modalImage || !modalTitle || !modalDescription) return;

    modalImage.src = project.image;
    modalImage.alt = project.title;
    modalTitle.textContent = project.title;
    modalDescription.innerHTML = project.description;

    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  // Fermer le modal
  if (closeModal) {
    closeModal.addEventListener('click', function () {
      if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
      }
    });
  }

  if (modal) {
    modal.addEventListener('click', function (e) {
      if (e.target === modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
      }
    });
  }
}

// ============================================
// FORMULAIRE DE CONTACT
// ============================================
function setupContactForm() {
  const contactForm = document.getElementById('contactForm');
  const whatsappSubmitBtn = document.getElementById('whatsappSubmit');
  const formMessage = document.getElementById('formMessage');

  if (!contactForm || !whatsappSubmitBtn || !formMessage) return;

  // Mapping des services
  const serviceNames = {
    'web': 'Développement Web',
    'mobile': 'Développement Mobile',
    'ai': 'Intelligence Artificielle',
    'automation': 'Automatisation',
    'digital': 'Solutions Digitales',
    'media': 'Médias & Création Digitale'
  };

  // Fonction pour afficher les messages
  function showFormMessage(text, type) {
    formMessage.textContent = text;
    formMessage.className = `form-message ${type}`;
    formMessage.style.display = 'block';

    // Cacher le message après 8 secondes
    setTimeout(() => {
      formMessage.style.display = 'none';
    }, 8000);
  }

  // Envoi par email avec EmailJS
  contactForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Validation
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const service = document.getElementById('service').value;
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !service || !message) {
      showFormMessage("Veuillez remplir tous les champs obligatoires (*)", "error");
      return;
    }

    // Validation d'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showFormMessage("Veuillez entrer une adresse email valide", "error");
      return;
    }

    // Désactiver le bouton pendant l'envoi
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
    submitBtn.disabled = true;

    // Préparer les données
    const serviceName = serviceNames[service] || service;
    const phone = document.getElementById('phone').value.trim() || 'Non renseigné';

    const templateParams = {
      from_name: name,
      from_email: email,
      phone: phone,
      service: serviceName,
      message: message,
      reply_to: email,
      date: new Date().toLocaleString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    try {
      // Vérifier si EmailJS est disponible
      if (typeof emailjs === 'undefined') {
        throw new Error("EmailJS non chargé");
      }

      // Envoyer l'email via EmailJS
      const response = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams
      );

      // Succès
      showFormMessage("✅ Votre demande de devis a été envoyée avec succès ! Nous vous répondrons dans les 24h.", "success");
      contactForm.reset();

      // Animation de succès
      showSuccessAnimation();

    } catch (error) {
      console.error('❌ Erreur EmailJS :', error);

      // Fallback : utiliser mailto:
      const subject = encodeURIComponent(`Demande de devis OPRIMAX UP - ${serviceName}`);
      const body = encodeURIComponent(`
Nom: ${name}
Email: ${email}
Téléphone: ${phone}
Service: ${serviceName}

Message:
${message}

---
Envoyé depuis le site OPRIMAX UP
            `);
      const mailtoLink = `mailto:lancinedosso850@gmail.com?subject=${subject}&body=${body}`;

      showFormMessage(`
                ❌ Une erreur est survenue lors de l'envoi.<br>
                <a href="${mailtoLink}" style="color: #ff5e00; text-decoration: underline;">
                    Cliquez ici pour envoyer manuellement par email
                </a>
            `, "error");

    } finally {
      // Réactiver le bouton
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  });

  // Envoi par WhatsApp
  whatsappSubmitBtn.addEventListener('click', function () {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const service = document.getElementById('service').value;
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !service || !message) {
      showFormMessage("Veuillez remplir tous les champs obligatoires (*)", "error");
      return;
    }

    const serviceName = serviceNames[service] || service;
    const userPhone = phone || 'Non renseigné';

    const whatsappMessage = `Bonjour OPRIMAX UP,

Je souhaite demander un devis pour le service suivant : ${serviceName}

Informations personnelles :
• Nom : ${name}
• Email : ${email}
• Téléphone : ${userPhone}

Détails du projet :
${message}

Merci de me recontacter pour discuter de ce projet.`;

    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/2250103533685?text=${encodedMessage}`;

    // Ouvrir WhatsApp dans un nouvel onglet
    window.open(whatsappUrl, '_blank');

    // Message de confirmation
    showFormMessage("📱 Redirection vers WhatsApp... Si la fenêtre ne s'ouvre pas, cliquez sur le bouton WhatsApp en bas à droite.", "success");
  });
}

// ============================================
// ANIMATION DE SUCCÈS
// ============================================
function showSuccessAnimation() {
  const successIcon = document.createElement('div');
  successIcon.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 80px;
        height: 80px;
        background: #00ff9d;
        color: #000;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 40px;
        font-weight: bold;
        z-index: 9999;
        animation: popIn 0.5s ease;
    `;
  successIcon.innerHTML = '✓';

  document.body.appendChild(successIcon);

  setTimeout(() => {
    successIcon.style.animation = 'popOut 0.5s ease';
    setTimeout(() => {
      if (successIcon.parentNode) {
        document.body.removeChild(successIcon);
      }
    }, 500);
  }, 1500);

  // Ajouter l'animation CSS si elle n'existe pas déjà
  if (!document.querySelector('#success-animation-style')) {
    const style = document.createElement('style');
    style.id = 'success-animation-style';
    style.textContent = `
            @keyframes popIn {
                0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
                70% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
                100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
            }
            
            @keyframes popOut {
                0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
                100% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
            }
        `;
    document.head.appendChild(style);
  }
}

// ============================================
// ANIMATIONS AU SCROLL
// ============================================
function setupScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observer les éléments à animer
  const animatedElements = document.querySelectorAll(
    '.about-card, .service-card, .portfolio-item, .team-card, .contact-card, ' +
    '.cofondateur-container, .partner-logo, .stat'
  );

  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}

// ============================================
// SMOOTH SCROLL POUR LES LIENS D'ANCRAGE
// ============================================
function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });

        // Fermer le menu mobile si ouvert
        const mobileNav = document.querySelector('.mobile-nav');
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        if (mobileNav && mobileNav.classList.contains('active')) {
          mobileNav.classList.remove('active');
          mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
          document.body.style.overflow = 'auto';
        }
      }
    });
  });
}

// ============================================
// GESTION DES ERREURS
// ============================================
window.addEventListener('error', function (e) {
  console.error('Erreur JavaScript:', e.error);
});

// ============================================
// DÉTECTION DE LA CONNEXION INTERNET
// ============================================
window.addEventListener('online', function () {
  console.log("✅ Connecté à Internet");
  showToast("Connexion rétablie", "success");
});

window.addEventListener('offline', function () {
  console.warn("❌ Hors ligne");
  showToast("Vous êtes hors ligne", "warning");
});

function showToast(message, type) {
  const toast = document.createElement('div');
  toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 24px;
        background: ${type === 'success' ? '#00ff9d' : '#ff5e00'};
        color: ${type === 'success' ? '#000' : '#fff'};
        border-radius: 8px;
        z-index: 10000;
        font-weight: 600;
        animation: slideInRight 0.3s ease;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    `;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => {
      if (toast.parentNode) {
        document.body.removeChild(toast);
      }
    }, 300);
  }, 3000);

  // Ajouter les animations CSS si elles n'existent pas déjà
  if (!document.querySelector('#toast-animation-style')) {
    const style = document.createElement('style');
    style.id = 'toast-animation-style';
    style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
    document.head.appendChild(style);
  }
}