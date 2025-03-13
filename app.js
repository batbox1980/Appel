// Quand la page est chargée
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Gestion des onglets ---
    const tabs = document.querySelectorAll('.accompagnateur-tab');
    const tabContents = document.querySelectorAll('.tab-content');
  
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Retirer la classe 'active' de tous les onglets
        tabs.forEach(t => t.classList.remove('active'));
        // Ajouter la classe 'active' à l'onglet cliqué
        tab.classList.add('active');
  
        // Masquer toutes les sections
        tabContents.forEach(tc => tc.classList.remove('active'));
        // Afficher la section ciblée
        const targetId = tab.getAttribute('data-target');
        document.getElementById(targetId).classList.add('active');
      });
    });
  
    // --- 2. Mise à jour des compteurs ---
    const allCheckboxes = document.querySelectorAll('input[type="checkbox"]');
  
    allCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        updateCounts();
        saveState();
      });
    });
  
    function updateCounts() {
      // Pour chaque section (tab-content), on met à jour les compteurs
      tabContents.forEach(section => {
        // Dans chaque section, on cherche tous les <h2> qui ont un <span class="count">
        const headings = section.querySelectorAll('h2');
        headings.forEach(h2 => {
          const countSpan = h2.querySelector('.count');
          if (!countSpan) return;
  
          // Récupérer l'UL qui suit immédiatement le H2
          const ul = h2.nextElementSibling;
          if (!ul) return;
  
          // Dans ce UL, on compte combien de checkboxes sont cochées
          const checkboxesInUl = ul.querySelectorAll('input[type="checkbox"]');
          const checkedCount = [...checkboxesInUl].filter(c => c.checked).length;
          const total = checkboxesInUl.length;
  
          // Mise à jour du texte
          countSpan.textContent = `${checkedCount}/${total}`;
        });
      });
    }
  
    // --- 3. Recherche par nom ---
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', () => {
      const searchTerm = searchInput.value.toLowerCase();
  
      allCheckboxes.forEach(box => {
        const name = box.getAttribute('data-name').toLowerCase();
        const li = box.closest('li');
  
        if (name.includes(searchTerm)) {
          li.style.display = '';
        } else {
          li.style.display = 'none';
        }
      });
    });
  
    // --- 4. Sauvegarde et restauration ---
    function saveState() {
      let data = [];
      allCheckboxes.forEach(box => {
        data.push({
          name: box.getAttribute('data-name'),
          checked: box.checked
        });
      });
      localStorage.setItem('appelState', JSON.stringify(data));
    }
  
    function loadState() {
      const saved = localStorage.getItem('appelState');
      if (saved) {
        const data = JSON.parse(saved);
        data.forEach(item => {
          // Trouver la checkbox qui correspond
          const checkbox = [...allCheckboxes].find(c => c.getAttribute('data-name') === item.name);
          if (checkbox) {
            checkbox.checked = item.checked;
          }
        });
      }
    }
  
    // Charger l'état au démarrage
    loadState();
    // Mettre à jour les compteurs après avoir rechargé l'état
    updateCounts();
  
    // --- 5. Enregistrer le service worker ---
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js')
        .then(() => console.log('Service Worker enregistré avec succès'))
        .catch(err => console.error('Erreur en enregistrant le Service Worker :', err));
    }
  
  });
  