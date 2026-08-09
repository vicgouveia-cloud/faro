// Faro App - Single Page Application Engine

let state = {
    pets: [],
    ongs: [],
    guides: [],
    currentView: 'home',
    map: null,
    mapMarkers: [],
    mapFilterStatus: 'all',
    mapFilterSpecies: 'all',
    mapSearchQuery: '',
    wizardStep: 1,
    selectedPetId: null
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initData();
    initRouter();
    renderHomeView();
    renderFeedGrid();
    renderOngsGrid();
    renderGuidesAccordion();

    // Check hash on start
    const hash = window.location.hash.substring(1);
    if (hash) {
        navigateTo(hash);
    }
});

// Load & Merge Local Storage with Mock Data
function initData() {
    state.ongs = MOCK_ONGS;
    state.guides = MOCK_GUIDES;

    const localPets = localStorage.getItem('faro_pets');
    if (localPets) {
        try {
            state.pets = JSON.parse(localPets);
        } catch (e) {
            state.pets = MOCK_PETS;
        }
    } else {
        state.pets = MOCK_PETS;
        localStorage.setItem('faro_pets', JSON.stringify(MOCK_PETS));
    }
}

// Router & View Management
function navigateTo(viewId, params = {}) {
    const validViews = ['home', 'map', 'feed', 'register', 'ongs', 'guides', 'contact'];
    if (!validViews.includes(viewId)) viewId = 'home';

    state.currentView = viewId;
    window.location.hash = viewId;

    // Toggle View Panels
    document.querySelectorAll('.view-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    const activePanel = document.getElementById(`view-${viewId}`);
    if (activePanel) activePanel.classList.add('active');

    // Update Nav Active State
    document.querySelectorAll('nav a').forEach(link => {
        link.classList.remove('text-primary', 'border-b-2', 'border-primary');
    });
    const activeNav = document.getElementById(`nav-${viewId}`);
    if (activeNav) activeNav.classList.add('text-primary');

    // Handle view-specific initializations
    if (viewId === 'map') {
        setTimeout(() => {
            initMap();
        }, 100);
    }

    if (viewId === 'register' && params.type) {
        const typeRadio = document.querySelector(`input[name="form_type"][value="${params.type}"]`);
        if (typeRadio) {
            typeRadio.checked = true;
            updateFormTypeUI();
        }
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ROUTE: HOME VIEW
function renderHomeView() {
    const recentFeed = document.getElementById('home-recent-feed');
    const urgentGrid = document.getElementById('home-urgent-grid');
    if (!recentFeed || !urgentGrid) return;

    // Render Recent Feed items
    const recentPets = state.pets.slice(0, 3);
    recentFeed.innerHTML = recentPets.map(pet => `
        <div onclick="openPetModal('${pet.id}')" class="bg-surface-container-high hover:bg-surface-variant p-3 rounded-2xl flex items-center gap-3 cursor-pointer transition-colors border border-outline-variant/30">
            <img src="${pet.images[0]}" alt="${pet.name}" class="w-12 h-12 rounded-xl object-cover flex-none"/>
            <div class="flex-grow min-w-0">
                <div class="flex justify-between items-center gap-2">
                    <h4 class="font-bold text-sm text-on-surface truncate">${pet.name}</h4>
                    <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${pet.type === 'lost' ? 'bg-tertiary-container/30 text-tertiary' : 'bg-primary-container/30 text-primary-container'}">${pet.type === 'lost' ? 'Perdido' : 'Encontrado'}</span>
                </div>
                <p class="text-xs text-on-surface-variant truncate">${pet.neighborhood}, ${pet.city}</p>
            </div>
        </div>
    `).join('');

    // Render Urgent Grid (First 4 pets)
    const urgentPets = state.pets.slice(0, 4);
    urgentGrid.innerHTML = urgentPets.map(pet => renderPetCardHTML(pet)).join('');
}

// PET CARD TEMPLATE HELPER
function renderPetCardHTML(pet) {
    const isLost = pet.type === 'lost';
    const badgeBg = isLost ? 'bg-tertiary text-on-tertiary' : 'bg-primary-container text-on-primary-container';
    const badgeText = isLost ? 'Perdido' : 'Encontrado';

    return `
        <div onclick="openPetModal('${pet.id}')" class="bg-surface-container rounded-2xl overflow-hidden border border-outline-variant/30 ambient-shadow hover:border-primary transition-all duration-300 group cursor-pointer flex flex-col">
            <div class="relative h-48 w-full bg-surface-variant overflow-hidden">
                <span class="absolute top-3 left-3 z-10 font-bold text-xs px-3 py-1 rounded-full shadow-md ${badgeBg}">
                    ${badgeText}
                </span>
                ${pet.reward ? `<span class="absolute top-3 right-3 z-10 font-bold text-xs px-2.5 py-1 rounded-full bg-amber-500 text-black shadow-md">Recompensa: ${pet.reward}</span>` : ''}
                <img src="${pet.images[0]}" alt="${pet.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
            </div>
            <div class="p-4 flex flex-col flex-grow justify-between gap-3">
                <div>
                    <div class="flex justify-between items-start mb-1">
                        <h3 class="font-bold text-lg text-on-surface group-hover:text-primary transition-colors">${pet.name}</h3>
                        <span class="text-xs text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded-md font-medium">${pet.breed}</span>
                    </div>
                    <p class="text-xs text-on-surface-variant flex items-center gap-1">
                        <span class="material-symbols-outlined text-sm text-primary">location_on</span>
                        ${pet.neighborhood}, ${pet.city} - ${pet.uf}
                    </p>
                    <p class="text-xs text-on-surface-variant mt-2 line-clamp-2">${pet.description}</p>
                </div>
                <button class="w-full mt-1 bg-surface-container-high group-hover:bg-primary-container group-hover:text-on-primary-container text-on-surface font-semibold text-xs py-2.5 rounded-xl transition-colors">
                    Ver Detalhes & Contato
                </button>
            </div>
        </div>
    `;
}

// ROUTE: MAP VIEW (Leaflet Integration)
function initMap() {
    const mapEl = document.getElementById('map-container');
    if (!mapEl) return;

    if (state.map) {
        state.map.invalidateSize();
        updateMapMarkers();
        return;
    }

    // Default center: São Paulo
    state.map = L.map('map-container', {
        zoomControl: true
    }).setView([-23.5505, -46.6333], 12);

    // Dark Map Tiles (CartoDB Dark Matter)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(state.map);

    updateMapMarkers();
}

function setMapFilter(status) {
    state.mapFilterStatus = status;
    ['all', 'lost', 'found'].forEach(s => {
        const btn = document.getElementById(`map-filter-${s}`);
        if (btn) {
            btn.className = (s === status) 
                ? 'px-3.5 py-1.5 rounded-full text-xs font-bold bg-primary-container text-on-primary-container' 
                : 'px-3.5 py-1.5 rounded-full text-xs font-semibold bg-surface-variant text-on-surface-variant border border-outline-variant';
        }
    });
    updateMapMarkers();
}

function setMapSpecies(species) {
    state.mapFilterSpecies = species;
    ['all', 'dog', 'cat', 'bird'].forEach(s => {
        const btn = document.getElementById(`species-${s}`);
        if (btn) {
            btn.className = (s === species)
                ? 'px-3 py-1 rounded-full text-xs bg-primary text-on-primary font-bold'
                : 'px-3 py-1 rounded-full text-xs bg-surface-variant text-on-surface-variant';
        }
    });
    updateMapMarkers();
}

function handleMapSearch(val) {
    state.mapSearchQuery = val.toLowerCase();
    updateMapMarkers();
}

function updateMapMarkers() {
    if (!state.map) return;

    // Clear existing markers
    state.mapMarkers.forEach(m => state.map.removeLayer(m));
    state.mapMarkers = [];

    // Filter pets
    const filteredPets = state.pets.filter(pet => {
        const matchStatus = (state.mapFilterStatus === 'all') || (pet.type === state.mapFilterStatus);
        const matchSpecies = (state.mapFilterSpecies === 'all') || (pet.species === state.mapFilterSpecies);
        const matchQuery = !state.mapSearchQuery || 
            pet.name.toLowerCase().includes(state.mapSearchQuery) || 
            pet.neighborhood.toLowerCase().includes(state.mapSearchQuery) || 
            pet.city.toLowerCase().includes(state.mapSearchQuery) ||
            pet.breed.toLowerCase().includes(state.mapSearchQuery);

        return matchStatus && matchSpecies && matchQuery;
    });

    // Update Sidebar List
    const sidebarList = document.getElementById('map-pet-list');
    const badgeCount = document.getElementById('map-count-badge');
    if (badgeCount) badgeCount.textContent = `${filteredPets.length} pets`;

    if (sidebarList) {
        if (filteredPets.length === 0) {
            sidebarList.innerHTML = `<div class="text-center py-8 text-xs text-on-surface-variant">Nenhum pet localizado com esses filtros.</div>`;
        } else {
            sidebarList.innerHTML = filteredPets.map(pet => `
                <div onclick="focusPetOnMap('${pet.id}')" class="bg-surface rounded-xl p-3 flex gap-3 border border-outline-variant/40 hover:border-primary cursor-pointer transition-colors group">
                    <img src="${pet.images[0]}" alt="${pet.name}" class="w-16 h-16 rounded-lg object-cover flex-none"/>
                    <div class="flex-grow min-w-0 flex flex-col justify-between">
                        <div>
                            <div class="flex justify-between items-center">
                                <h4 class="font-bold text-sm text-on-surface truncate group-hover:text-primary transition-colors">${pet.name}</h4>
                                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${pet.type === 'lost' ? 'bg-tertiary-container/30 text-tertiary' : 'bg-primary-container/30 text-primary-container'}">${pet.type === 'lost' ? 'Perdido' : 'Encontrado'}</span>
                            </div>
                            <p class="text-xs text-on-surface-variant truncate">${pet.breed} • ${pet.neighborhood}</p>
                        </div>
                        <span class="text-[10px] text-primary flex items-center gap-1 mt-1 font-semibold">
                            <span class="material-symbols-outlined text-xs">near_me</span> Ver no mapa
                        </span>
                    </div>
                </div>
            `).join('');
        }
    }

    // Add Markers to Leaflet
    filteredPets.forEach(pet => {
        if (pet.lat && pet.lng) {
            const iconHtml = `<div class="custom-pin ${pet.type}">
                <span class="material-symbols-outlined text-lg">${pet.species === 'cat' ? 'pets' : 'sound_detection_dog_barking'}</span>
            </div>`;

            const customIcon = L.divIcon({
                html: iconHtml,
                className: '',
                iconSize: [38, 38],
                iconAnchor: [19, 38],
                popupAnchor: [0, -36]
            });

            const marker = L.marker([pet.lat, pet.lng], { icon: customIcon }).addTo(state.map);

            const popupContent = `
                <div class="p-1 max-w-[200px] text-center">
                    <img src="${pet.images[0]}" class="w-full h-24 object-cover rounded-lg mb-2"/>
                    <h4 class="font-bold text-sm text-on-surface">${pet.name}</h4>
                    <p class="text-xs text-on-surface-variant mb-2">${pet.neighborhood}, ${pet.city}</p>
                    <button onclick="openPetModal('${pet.id}')" class="w-full bg-primary-container text-on-primary-container font-bold text-xs py-1.5 rounded-md">
                        Ver Detalhes
                    </button>
                </div>
            `;

            marker.bindPopup(popupContent);
            marker.petId = pet.id;
            state.mapMarkers.push(marker);
        }
    });

    if (filteredPets.length > 0 && filteredPets[0].lat) {
        state.map.panTo([filteredPets[0].lat, filteredPets[0].lng]);
    }
}

function focusPetOnMap(petId) {
    const pet = state.pets.find(p => p.id === petId);
    if (pet && state.map && pet.lat) {
        state.map.setView([pet.lat, pet.lng], 15, { animate: true });
        const marker = state.mapMarkers.find(m => m.petId === petId);
        if (marker) marker.openPopup();
    }
}

// ROUTE: REGISTER FORM WIZARD LOGIC
function updateFormTypeUI() {
    const typeRadio = document.querySelector('input[name="form_type"]:checked');
    if (!typeRadio) return;
    const isLost = typeRadio.value === 'lost';
    const formTitle = document.getElementById('form-step-title');
    if (formTitle) {
        formTitle.textContent = isLost ? 'Cadastrar Pet Perdido' : 'Cadastrar Pet Encontrado';
    }
}

function wizardStep(delta) {
    const newStep = state.wizardStep + delta;
    if (newStep < 1 || newStep > 4) return;

    // Simple step validation
    if (delta > 0) {
        if (state.wizardStep === 1) {
            const name = document.getElementById('form_name').value;
            if (!name) return showToast('Preencha o nome do pet antes de prosseguir.');
        }
        if (state.wizardStep === 2) {
            const addr = document.getElementById('form_address').value;
            const city = document.getElementById('form_city').value;
            if (!addr || !city) return showToast('Preencha o endereço e cidade antes de prosseguir.');
        }
    }

    state.wizardStep = newStep;

    // Toggle panels
    for (let i = 1; i <= 4; i++) {
        const stepEl = document.getElementById(`step-${i}`);
        if (stepEl) stepEl.classList.toggle('hidden', i !== state.wizardStep);
    }

    // Update Progress UI
    document.getElementById('step-indicator').textContent = `Passo ${state.wizardStep} de 4`;
    document.getElementById('form-progress-bar').style.width = `${(state.wizardStep / 4) * 100}%`;

    // Button States
    document.getElementById('btn-wizard-prev').classList.toggle('hidden', state.wizardStep === 1);
    document.getElementById('btn-wizard-next').classList.toggle('hidden', state.wizardStep === 4);
    document.getElementById('btn-wizard-submit').classList.toggle('hidden', state.wizardStep !== 4);
}

function handleFormSubmit(e) {
    e.preventDefault();

    const type = document.querySelector('input[name="form_type"]:checked').value;
    const name = document.getElementById('form_name').value;
    const species = document.getElementById('form_species').value;
    const breed = document.getElementById('form_breed').value || 'SRD';
    const gender = document.getElementById('form_gender').value;
    const size = document.getElementById('form_size').value;
    const date = document.getElementById('form_date').value || new Date().toISOString().split('T')[0];
    const time = document.getElementById('form_time').value || '12:00';
    const address = document.getElementById('form_address').value;
    const neighborhood = document.getElementById('form_neighborhood').value;
    const city = document.getElementById('form_city').value;
    const uf = (document.getElementById('form_uf').value || 'SP').toUpperCase();
    const description = document.getElementById('form_description').value;
    const reward = document.getElementById('form_reward').value;
    const microchip = document.getElementById('form_microchip').value;
    const imageUrl = document.getElementById('form_imageUrl').value || (species === 'cat' ? 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80' : 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80');
    const contactName = document.getElementById('form_contactName').value;
    const contactPhone = document.getElementById('form_contactPhone').value;
    const contactEmail = document.getElementById('form_contactEmail').value;

    // Slight random offset around SP center for demo geolocation
    const lat = -23.5505 + (Math.random() - 0.5) * 0.08;
    const lng = -46.6333 + (Math.random() - 0.5) * 0.08;

    const newPet = {
        id: `pet-${Date.now()}`,
        type,
        name,
        species,
        breed,
        gender,
        size,
        color: 'Não informado',
        age: 'Não informada',
        microchip,
        reward,
        date,
        time,
        address,
        neighborhood,
        city,
        uf,
        lat,
        lng,
        description,
        images: [imageUrl],
        contactName,
        contactPhone,
        contactEmail,
        status: 'active',
        createdAt: new Date().toISOString()
    };

    state.pets.unshift(newPet);
    localStorage.setItem('faro_pets', JSON.stringify(state.pets));

    showToast('Alerta cadastrado com sucesso! Já está visível no mapa e feed.');
    
    // Reset form & Wizard
    document.getElementById('pet-register-form').reset();
    state.wizardStep = 1;
    wizardStep(0);

    // Refresh UI & Navigate
    renderHomeView();
    renderFeedGrid();
    navigateTo('map');
    setTimeout(() => {
        focusPetOnMap(newPet.id);
    }, 500);
}

// ROUTE: PET FEED GRID
function renderFeedGrid() {
    const grid = document.getElementById('feed-pets-grid');
    if (!grid) return;

    const query = (document.getElementById('feed-search-input')?.value || '').toLowerCase();
    const status = document.getElementById('feed-filter-type')?.value || 'all';

    const filtered = state.pets.filter(pet => {
        const matchStatus = status === 'all' || pet.type === status;
        const matchQuery = !query || 
            pet.name.toLowerCase().includes(query) || 
            pet.breed.toLowerCase().includes(query) || 
            pet.neighborhood.toLowerCase().includes(query) ||
            pet.city.toLowerCase().includes(query);
        return matchStatus && matchQuery;
    });

    if (filtered.length === 0) {
        grid.innerHTML = `<div class="col-span-full text-center py-12 text-on-surface-variant">Nenhum registro encontrado.</div>`;
        return;
    }

    grid.innerHTML = filtered.map(pet => renderPetCardHTML(pet)).join('');
}

// ROUTE: ONGS DIRECTORY
function renderOngsGrid() {
    const grid = document.getElementById('ongs-grid');
    if (!grid) return;

    const query = (document.getElementById('ong-search-input')?.value || '').toLowerCase();
    const uf = document.getElementById('ong-filter-uf')?.value || 'all';

    const filtered = state.ongs.filter(ong => {
        const matchUf = uf === 'all' || ong.uf === uf;
        const matchQuery = !query || 
            ong.name.toLowerCase().includes(query) || 
            ong.city.toLowerCase().includes(query) ||
            ong.focus.toLowerCase().includes(query);
        return matchUf && matchQuery;
    });

    grid.innerHTML = filtered.map(ong => `
        <div class="bg-surface-container rounded-2xl p-6 border border-outline-variant/30 ambient-shadow hover:border-primary transition-all flex flex-col justify-between gap-4">
            <div>
                <div class="flex justify-between items-start mb-2">
                    <span class="text-xs font-bold text-primary bg-primary-container/20 px-2.5 py-1 rounded-full uppercase">${ong.uf} • ${ong.city}</span>
                    <span class="text-xs text-on-surface-variant">${ong.neighborhood}</span>
                </div>
                <h3 class="font-bold text-lg text-on-surface mb-1">${ong.name}</h3>
                <p class="text-xs text-on-surface-variant mb-3 font-medium">${ong.focus}</p>
                <p class="text-xs text-on-surface-variant line-clamp-3">${ong.description}</p>
            </div>

            <div class="pt-4 border-t border-outline-variant/20 flex items-center justify-between gap-2">
                <a href="https://wa.me/55${ong.whatsapp}" target="_blank" class="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors">
                    <span class="material-symbols-outlined text-sm">chat</span> WhatsApp
                </a>
                <a href="${ong.website}" target="_blank" class="flex-1 bg-surface-container-high hover:bg-surface-variant text-on-surface font-semibold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors border border-outline-variant">
                    <span class="material-symbols-outlined text-sm">language</span> Website
                </a>
            </div>
        </div>
    `).join('');
}

// ROUTE: GUIDES & ARTICLES
function renderGuidesAccordion() {
    const container = document.getElementById('guides-accordion');
    if (!container) return;

    container.innerHTML = state.guides.map((guide, idx) => `
        <div class="bg-surface-container rounded-2xl border border-outline-variant/30 overflow-hidden ambient-shadow">
            <div onclick="toggleGuideCollapse('${guide.id}')" class="p-6 cursor-pointer flex justify-between items-center bg-surface-container-high/50 hover:bg-surface-container-high transition-colors">
                <div class="flex items-center gap-4">
                    <div class="w-12 h-12 rounded-xl bg-primary-container/20 text-primary-container flex items-center justify-center">
                        <span class="material-symbols-outlined text-2xl">${guide.icon}</span>
                    </div>
                    <div>
                        <span class="text-xs font-bold text-primary uppercase">${guide.category} • ${guide.readTime}</span>
                        <h3 class="font-bold text-lg text-on-surface">${guide.title}</h3>
                    </div>
                </div>
                <span class="material-symbols-outlined text-on-surface-variant transition-transform" id="guide-arrow-${guide.id}">expand_more</span>
            </div>

            <div id="guide-content-${guide.id}" class="${idx === 0 ? 'block' : 'hidden'} p-6 border-t border-outline-variant/20 space-y-4">
                <p class="text-sm text-on-surface-variant mb-4">${guide.summary}</p>

                <div class="space-y-3">
                    ${guide.steps.map(s => `
                        <div class="bg-surface-container-high p-4 rounded-xl border border-outline-variant/20">
                            <h4 class="font-bold text-sm text-on-surface mb-1">${s.step}</h4>
                            <p class="text-xs text-on-surface-variant">${s.detail}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `).join('');
}

function toggleGuideCollapse(guideId) {
    const content = document.getElementById(`guide-content-${guideId}`);
    const arrow = document.getElementById(`guide-arrow-${guideId}`);
    if (content) {
        const isHidden = content.classList.contains('hidden');
        content.classList.toggle('hidden', !isHidden);
        if (arrow) arrow.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
    }
}

// MODAL: PET DETAIL
function openPetModal(petId) {
    const pet = state.pets.find(p => p.id === petId);
    if (!pet) return;

    state.selectedPetId = petId;
    const modal = document.getElementById('modal-pet-detail');
    const content = document.getElementById('pet-modal-content');

    const isLost = pet.type === 'lost';
    const statusBadgeBg = isLost ? 'bg-tertiary text-on-tertiary' : 'bg-primary-container text-on-primary-container';

    content.innerHTML = `
        <div class="flex flex-col sm:flex-row gap-6">
            <div class="w-full sm:w-1/2">
                <img src="${pet.images[0]}" alt="${pet.name}" class="w-full h-64 sm:h-72 object-cover rounded-2xl border border-outline-variant/30 mb-3"/>
                <div class="flex gap-2">
                    <span class="font-bold text-xs px-3 py-1 rounded-full ${statusBadgeBg}">${isLost ? 'PERDIDO' : 'ENCONTRADO'}</span>
                    <span class="text-xs font-semibold px-3 py-1 rounded-full bg-surface-container-high text-on-surface">${pet.species === 'cat' ? 'Gato' : 'Cão'} • ${pet.gender}</span>
                </div>
            </div>

            <div class="w-full sm:w-1/2 flex flex-col justify-between space-y-4">
                <div>
                    <h2 class="text-2xl font-extrabold text-on-surface mb-1">${pet.name}</h2>
                    <p class="text-sm font-semibold text-primary mb-3">${pet.breed} • ${pet.size}</p>

                    <div class="space-y-2 text-xs text-on-surface-variant">
                        <p class="flex items-center gap-1.5"><span class="material-symbols-outlined text-sm text-primary">location_on</span> <strong>Local:</strong> ${pet.address}</p>
                        <p class="flex items-center gap-1.5"><span class="material-symbols-outlined text-sm text-primary">calendar_today</span> <strong>Data:</strong> ${pet.date} às ${pet.time}</p>
                        ${pet.reward ? `<p class="flex items-center gap-1.5 text-amber-400 font-bold"><span class="material-symbols-outlined text-sm">payments</span> <strong>Recompensa:</strong> ${pet.reward}</p>` : ''}
                        ${pet.microchip ? `<p class="flex items-center gap-1.5"><span class="material-symbols-outlined text-sm">qr_code</span> <strong>Identificação:</strong> ${pet.microchip}</p>` : ''}
                    </div>

                    <div class="mt-4 p-3 bg-surface-container-high rounded-xl border border-outline-variant/30 text-xs text-on-surface-variant">
                        <strong class="text-on-surface block mb-1">Descrição:</strong>
                        ${pet.description}
                    </div>
                </div>

                <div class="space-y-2 pt-2 border-t border-outline-variant/30">
                    <div class="text-xs font-bold text-on-surface">Contato do Tutor: ${pet.contactName}</div>
                    <div class="flex gap-2">
                        <a href="https://wa.me/55${pet.contactPhone.replace(/\D/g,'')}" target="_blank" class="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors">
                            <span class="material-symbols-outlined text-sm">chat</span> WhatsApp
                        </a>
                        <button onclick="openPosterModal('${pet.id}')" class="flex-1 bg-primary-container hover:bg-primary-container/90 text-on-primary-container font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors">
                            <span class="material-symbols-outlined text-sm">print</span> Cartaz de Busca
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    modal.classList.remove('hidden');
}

function closePetModal() {
    document.getElementById('modal-pet-detail').classList.add('hidden');
}

// MODAL: POSTER GENERATOR
function openPosterModal(petId) {
    closePetModal();
    const pet = state.pets.find(p => p.id === petId);
    if (!pet) return;

    document.getElementById('poster-title').textContent = pet.type === 'lost' ? 'PROCURA-SE' : 'ENCONTRADO';
    document.getElementById('poster-img').src = pet.images[0];
    document.getElementById('poster-name').textContent = pet.name;
    document.getElementById('poster-breed').textContent = `${pet.breed} (${pet.size})`;
    document.getElementById('poster-location').textContent = `${pet.neighborhood}, ${pet.city} - ${pet.uf}`;
    document.getElementById('poster-desc').textContent = pet.description;
    document.getElementById('poster-reward').textContent = pet.reward || 'Sem recompensa especificada';
    document.getElementById('poster-phone').textContent = pet.contactPhone;

    document.getElementById('modal-poster').classList.remove('hidden');
}

function closePosterModal() {
    document.getElementById('modal-poster').classList.add('hidden');
}

// UTILS: TOAST NOTIFICATION
function showToast(msg) {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-20 right-4 z-50 bg-primary-container text-on-primary-container font-bold text-xs px-4 py-3 rounded-2xl shadow-xl border border-primary/30 flex items-center gap-2 animate-fade-in-up';
    toast.innerHTML = `<span class="material-symbols-outlined text-lg">info</span> ${msg}`;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 4000);
}

function toggleEmergencyModal() {
    alert("⚠️ ATENÇÃO EMERGÊNCIA ⚠️\n\nCaso tenha avistado um animal ferido ou em risco iminente de atropelamento, entre em contato imediatamente com o Zoonoses ou com a ONG mais próxima disponível no menu ONGs!");
}

function toggleNotifications() {
    showToast("Nenhuma notificação nova no seu raio de localização.");
}

function handleContactSubmit(e) {
    e.preventDefault();
    showToast("Sua mensagem foi enviada com sucesso! Responderemos em breve.");
    e.target.reset();
}
