// ========== API CONFIGURATION ==========
const API_URL = 'http://localhost:3000';

// ========== GLOBAL STATE ==========
let currentEditId = null;
let currentEditType = null;

// ========== CHECK API CONNECTION ==========
async function checkConnection() {
    try {
        const response = await fetch(`${API_URL}/realms`);
        if (response.ok) {
            console.log('%c✅ Connected to JSON Server', 'color: green; font-size: 14px;');
            return true;
        }
    } catch (error) {
        console.error('%c❌ JSON Server not running! Run: npx json-server --watch db.json --port 3000', 'color: red; font-size: 14px;');
        alert('⚠️ JSON Server is not running! Please run: npx json-server --watch db.json --port 3000');
        return false;
    }
}

// ========== LOAD ALL DATA ==========
async function loadAllData() {
    if (!await checkConnection()) return;
    
    await Promise.all([
        loadRealms(),
        loadMissions(),
        loadAdminRealms(),
        loadAdminMissions(),
        updateGlobalStats()
    ]);
}

// ========== LOAD REALMS (READ) ==========
async function loadRealms() {
    try {
        const response = await fetch(`${API_URL}/realms`);
        const realms = await response.json();
        displayRealms(realms);
    } catch (error) {
        console.error('Error loading realms:', error);
    }
}

function displayRealms(realms) {
    const grid = document.getElementById('realmsGrid');
    grid.innerHTML = '';

    realms.forEach(realm => {
        const card = document.createElement('div');
        card.className = 'realm-card';
        card.style.borderColor = realm.color;

        card.innerHTML = `
            <div class="realm-symbol">${realm.symbol}</div>
            <h3 class="realm-name">${realm.name}</h3>
            <p class="realm-desc">${realm.description}</p>
            
            <div class="realm-stats">
                <div class="realm-stat">
                    <div class="stat-label">POWER</div>
                    <div class="stat-number">${realm.powerLevel}%</div>
                </div>
                <div class="realm-stat">
                    <div class="stat-label">MAGIC</div>
                    <div class="stat-number">${realm.magicLevel}%</div>
                </div>
                <div class="realm-stat">
                    <div class="stat-label">WISDOM</div>
                    <div class="stat-number">${realm.wisdomLevel}%</div>
                </div>
            </div>

            <div class="realm-features">
                ${realm.features.map(f => `<span class="feature-tag">✦ ${f}</span>`).join('')}
            </div>

            <div class="realm-actions">
                <button class="enter-btn" onclick="enterRealm(${realm.id})">ENTER</button>
                <button class="edit-btn" onclick="openEditModal('realm', ${realm.id})">EDIT</button>
            </div>
        `;

        grid.appendChild(card);
    });
}

// ========== LOAD MISSIONS (READ) ==========
async function loadMissions() {
    try {
        const response = await fetch(`${API_URL}/missions`);
        const missions = await response.json();
        const realms = await fetch(`${API_URL}/realms`).then(r => r.json());
        displayMissions(missions, realms);
    } catch (error) {
        console.error('Error loading missions:', error);
    }
}

function displayMissions(missions, realms) {
    const grid = document.getElementById('missionsGrid');
    grid.innerHTML = '';

    missions.forEach(mission => {
        const realm = realms.find(r => r.id === mission.realmId);
        
        const card = document.createElement('div');
        card.className = 'mission-card';

        card.innerHTML = `
            <h3 class="mission-name">⚡ ${mission.name}</h3>
            <div class="difficulty-badge difficulty-${mission.difficulty}">${mission.difficulty}</div>
            <p class="mission-desc">${mission.description}</p>
            <div class="mission-reward">
                🏆 Reward: ${mission.reward}
            </div>
            <div style="margin-top: 15px; color: ${realm?.color || '#ccc'};">
                Realm: ${realm?.name || 'Unknown'}
            </div>
            <div style="margin-top: 10px;">
                <button class="edit-btn" onclick="openEditModal('mission', ${mission.id})" style="width: 100%;">Edit Mission</button>
            </div>
        `;

        grid.appendChild(card);
    });
}

// ========== LOAD ADMIN REALMS ==========
async function loadAdminRealms() {
    try {
        const response = await fetch(`${API_URL}/realms`);
        const realms = await response.json();
        displayAdminRealms(realms);
    } catch (error) {
        console.error('Error loading admin realms:', error);
    }
}

function displayAdminRealms(realms) {
    const grid = document.getElementById('adminRealmsGrid');
    grid.innerHTML = '';

    realms.forEach(realm => {
        const item = document.createElement('div');
        item.className = 'admin-item';

        item.innerHTML = `
            <div>
                <span style="font-size: 2rem; margin-right: 10px;">${realm.symbol}</span>
                <strong>${realm.name}</strong>
                <div style="color: #aaa; font-size: 0.8rem;">Population: ${realm.population}</div>
            </div>
            <div class="admin-actions">
                <button onclick="openEditModal('realm', ${realm.id})"><i class="fas fa-edit"></i></button>
                <button onclick="deleteRealm(${realm.id})"><i class="fas fa-trash"></i></button>
            </div>
        `;

        grid.appendChild(item);
    });

    // Populate realm dropdown in mission form
    const select = document.getElementById('missionRealmId');
    if (select) {
        select.innerHTML = '<option value="">Select Realm</option>';
        realms.forEach(realm => {
            select.innerHTML += `<option value="${realm.id}">${realm.name}</option>`;
        });
    }
}

// ========== LOAD ADMIN MISSIONS ==========
async function loadAdminMissions() {
    try {
        const response = await fetch(`${API_URL}/missions`);
        const missions = await response.json();
        const realms = await fetch(`${API_URL}/realms`).then(r => r.json());
        displayAdminMissions(missions, realms);
    } catch (error) {
        console.error('Error loading admin missions:', error);
    }
}

function displayAdminMissions(missions, realms) {
    const grid = document.getElementById('adminMissionsGrid');
    grid.innerHTML = '';

    missions.forEach(mission => {
        const realm = realms.find(r => r.id === mission.realmId);
        
        const item = document.createElement('div');
        item.className = 'admin-item';

        item.innerHTML = `
            <div>
                <strong>${mission.name}</strong>
                <div style="color: #aaa; font-size: 0.8rem;">${realm?.name || 'Unknown'} • ${mission.difficulty}</div>
            </div>
            <div class="admin-actions">
                <button onclick="openEditModal('mission', ${mission.id})"><i class="fas fa-edit"></i></button>
                <button onclick="deleteMission(${mission.id})"><i class="fas fa-trash"></i></button>
            </div>
        `;

        grid.appendChild(item);
    });
}

// ========== UPDATE GLOBAL STATS ==========
async function updateGlobalStats() {
    try {
        const realms = await fetch(`${API_URL}/realms`).then(r => r.json());
        const missions = await fetch(`${API_URL}/missions`).then(r => r.json());
        
        document.getElementById('realmCount').textContent = realms.length;
        document.getElementById('missionCount').textContent = missions.length;
        document.getElementById('playerCount').textContent = '∞';
    } catch (error) {
        console.error('Error updating stats:', error);
    }
}

// ========== CREATE OPERATIONS ==========
async function addRealm(event) {
    event.preventDefault();

    const newRealm = {
        id: Date.now(),
        name: document.getElementById('realmName').value,
        type: document.getElementById('realmType').value,
        description: document.getElementById('realmDesc').value,
        color: document.getElementById('realmColor').value,
        symbol: getSymbolForType(document.getElementById('realmType').value),
        powerLevel: 50,
        magicLevel: 50,
        wisdomLevel: 50,
        population: 0,
        features: ["New Feature"],
        status: "active"
    };

    try {
        const response = await fetch(`${API_URL}/realms`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newRealm)
        });

        if (response.ok) {
            alert('✅ Realm created successfully!');
            document.getElementById('addRealmForm').reset();
            loadAllData();
        }
    } catch (error) {
        console.error('Error creating realm:', error);
        alert('❌ Error creating realm');
    }
}

async function addMission(event) {
    event.preventDefault();

    const newMission = {
        id: Date.now(),
        realmId: parseInt(document.getElementById('missionRealmId').value),
        name: document.getElementById('missionName').value,
        description: document.getElementById('missionDesc').value,
        reward: document.getElementById('missionReward').value,
        difficulty: document.getElementById('missionDifficulty').value,
        status: "available"
    };

    try {
        const response = await fetch(`${API_URL}/missions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newMission)
        });

        if (response.ok) {
            alert('✅ Mission created successfully!');
            document.getElementById('addMissionForm').reset();
            loadAllData();
        }
    } catch (error) {
        console.error('Error creating mission:', error);
        alert('❌ Error creating mission');
    }
}

// ========== UPDATE OPERATIONS ==========
async function openEditModal(type, id) {
    currentEditId = id;
    currentEditType = type;

    try {
        const response = await fetch(`${API_URL}/${type}s/${id}`);
        const item = await response.json();

        const modal = document.getElementById('editModal');
        const title = document.getElementById('modalTitle');
        const fields = document.getElementById('modalFields');

        title.textContent = `Edit ${type.charAt(0).toUpperCase() + type.slice(1)}`;
        
        // Generate form fields based on item properties
        fields.innerHTML = '';
        for (let [key, value] of Object.entries(item)) {
            if (key !== 'id' && key !== 'features' && key !== 'gallery') {
                fields.innerHTML += `
                    <div>
                        <label>${key.charAt(0).toUpperCase() + key.slice(1)}:</label>
                        <input type="text" name="${key}" value="${value}" ${key === 'type' ? 'readonly' : ''}>
                    </div>
                `;
            }
        }

        modal.classList.add('active');
    } catch (error) {
        console.error('Error loading item for edit:', error);
    }
}

async function saveEdit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const updatedItem = {};

    for (let [key, value] of formData.entries()) {
        updatedItem[key] = value;
    }
    
    updatedItem.id = currentEditId;

    try {
        const response = await fetch(`${API_URL}/${currentEditType}s/${currentEditId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedItem)
        });

        if (response.ok) {
            alert('✅ Changes saved!');
            closeModal();
            loadAllData();
        }
    } catch (error) {
        console.error('Error saving changes:', error);
        alert('❌ Error saving changes');
    }
}

// ========== DELETE OPERATIONS ==========
async function deleteRealm(id) {
    if (confirm('Are you sure you want to delete this realm? This will also delete all related missions!')) {
        try {
            // Delete realm
            await fetch(`${API_URL}/realms/${id}`, {
                method: 'DELETE'
            });

            // Delete related missions
            const missions = await fetch(`${API_URL}/missions?realmId=${id}`).then(r => r.json());
            for (const mission of missions) {
                await fetch(`${API_URL}/missions/${mission.id}`, {
                    method: 'DELETE'
                });
            }

            alert('✅ Realm deleted successfully!');
            loadAllData();
        } catch (error) {
            console.error('Error deleting realm:', error);
            alert('❌ Error deleting realm');
        }
    }
}

async function deleteMission(id) {
    if (confirm('Are you sure you want to delete this mission?')) {
        try {
            await fetch(`${API_URL}/missions/${id}`, {
                method: 'DELETE'
            });

            alert('✅ Mission deleted successfully!');
            loadAllData();
        } catch (error) {
            console.error('Error deleting mission:', error);
            alert('❌ Error deleting mission');
        }
    }
}

async function deleteItem() {
    if (currentEditType === 'realm') {
        await deleteRealm(currentEditId);
    } else if (currentEditType === 'mission') {
        await deleteMission(currentEditId);
    }
    closeModal();
}

// ========== UTILITY FUNCTIONS ==========
function getSymbolForType(type) {
    const symbols = {
        dragon: '🐉',
        fae: '🦄',
        kraken: '🐙'
    };
    return symbols[type] || '✨';
}

function closeModal() {
    document.getElementById('editModal').classList.remove('active');
    currentEditId = null;
    currentEditType = null;
}

function showTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    event.target.classList.add('active');
    
    if (tabName === 'realms') {
        document.getElementById('realmsTab').classList.add('active');
    } else if (tabName === 'missions') {
        document.getElementById('missionsTab').classList.add('active');
    } else if (tabName === 'add') {
        document.getElementById('addTab').classList.add('active');
    }
}

function enterRealm(realmId) {
    window.location.href = `realm.html?id=${realmId}`;
}

// ========== INITIALIZE ==========
document.addEventListener('DOMContentLoaded', () => {
    loadAllData();
    
    // Check connection every 30 seconds
    setInterval(checkConnection, 30000);
    
    console.log('%c✨ CELESTIAL REALMS - FULL CRUD ACTIVE ✨', 'color: gold; font-size: 16px;');
});