/**
 * Main Application Module
 * Handles UI interactions and orchestrates the app
 */

const App = (function () {
    // DOM Elements
    let elements = {};

    // State
    let deleteRewardId = null;
    let deleteCardId = null;
    let useCloudStorage = false;

    /**
     * Initialize DOM element references
     */
    function initElements() {
        elements = {
            // Navigation
            navTabs: document.querySelectorAll('.nav-tab'),
            pages: document.querySelectorAll('.page'),

            // Main UI - Rewards
            addRewardBtn: document.getElementById('addRewardBtn'),
            rewardsTable: document.getElementById('rewardsTable'),
            rewardsBody: document.getElementById('rewardsBody'),
            rewardsCards: document.getElementById('rewardsCards'),
            emptyState: document.getElementById('emptyState'),
            unclaimedCount: document.getElementById('unclaimedCount'),
            totalValue: document.getElementById('totalValue'),

            // Main UI - Cards
            addCardBtn: document.getElementById('addCardBtn'),
            cardsTable: document.getElementById('cardsTable'),
            cardsBody: document.getElementById('cardsBody'),
            cardsCards: document.getElementById('cardsCards'),
            emptyCardsState: document.getElementById('emptyCardsState'),
            cardCount: document.getElementById('cardCount'),
            totalFees: document.getElementById('totalFees'),

            // Auth UI
            signInBtn: document.getElementById('signInBtn'),
            signOutBtn: document.getElementById('signOutBtn'),
            signedOutUI: document.getElementById('signedOutUI'),
            signedInUI: document.getElementById('signedInUI'),
            userAvatar: document.getElementById('userAvatar'),
            userName: document.getElementById('userName'),
            syncStatus: document.getElementById('syncStatus'),
            syncHint: document.getElementById('syncHint'),

            // Add/Edit Reward Modal
            rewardModal: document.getElementById('rewardModal'),
            modalTitle: document.getElementById('modalTitle'),
            closeModal: document.getElementById('closeModal'),
            rewardForm: document.getElementById('rewardForm'),
            cancelBtn: document.getElementById('cancelBtn'),

            // Reward Form fields
            rewardId: document.getElementById('rewardId'),
            rewardName: document.getElementById('rewardName'),
            cardName: document.getElementById('cardName'),
            amount: document.getElementById('amount'),
            recurrenceType: document.getElementById('recurrenceType'),
            customRecurrence: document.getElementById('customRecurrence'),
            customInterval: document.getElementById('customInterval'),
            customUnit: document.getElementById('customUnit'),
            description: document.getElementById('description'),

            // Delete Reward Modal
            deleteModal: document.getElementById('deleteModal'),
            closeDeleteModal: document.getElementById('closeDeleteModal'),
            deleteRewardName: document.getElementById('deleteRewardName'),
            cancelDeleteBtn: document.getElementById('cancelDeleteBtn'),
            confirmDeleteBtn: document.getElementById('confirmDeleteBtn'),

            // Add/Edit Card Modal
            cardModal: document.getElementById('cardModal'),
            cardModalTitle: document.getElementById('cardModalTitle'),
            closeCardModal: document.getElementById('closeCardModal'),
            cardForm: document.getElementById('cardForm'),
            cancelCardBtn: document.getElementById('cancelCardBtn'),

            // Card Form fields
            formCardId: document.getElementById('formCardId'),
            formCardName: document.getElementById('formCardName'),
            formCardIssuer: document.getElementById('formCardIssuer'),
            formCardOpenDate: document.getElementById('formCardOpenDate'),
            formCardAnnualFee: document.getElementById('formCardAnnualFee'),
            formCardNotes: document.getElementById('formCardNotes'),

            // Delete Card Modal
            deleteCardModal: document.getElementById('deleteCardModal'),
            closeDeleteCardModal: document.getElementById('closeDeleteCardModal'),
            deleteCardName: document.getElementById('deleteCardName'),
            cancelDeleteCardBtn: document.getElementById('cancelDeleteCardBtn'),
            confirmDeleteCardBtn: document.getElementById('confirmDeleteCardBtn')
        };
    }

    /**
     * Initialize event listeners
     */
    function initEventListeners() {
        // Navigation tabs
        elements.navTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetPage = tab.dataset.page;
                switchToPage(targetPage);
            });
        });

        // Add reward button
        elements.addRewardBtn.addEventListener('click', openAddModal);

        // Add card button
        if (elements.addCardBtn) {
            elements.addCardBtn.addEventListener('click', openAddCardModal);
        }

        // Auth buttons
        if (elements.signInBtn) {
            elements.signInBtn.addEventListener('click', handleSignIn);
        }
        if (elements.signOutBtn) {
            elements.signOutBtn.addEventListener('click', handleSignOut);
        }

        // Reward Modal close buttons
        elements.closeModal.addEventListener('click', closeRewardModal);
        elements.cancelBtn.addEventListener('click', closeRewardModal);
        elements.closeDeleteModal.addEventListener('click', closeDeleteModal);
        elements.cancelDeleteBtn.addEventListener('click', closeDeleteModal);

        // Card Modal close buttons
        if (elements.closeCardModal) {
            elements.closeCardModal.addEventListener('click', closeCardModal);
        }
        if (elements.cancelCardBtn) {
            elements.cancelCardBtn.addEventListener('click', closeCardModal);
        }
        if (elements.closeDeleteCardModal) {
            elements.closeDeleteCardModal.addEventListener('click', closeDeleteCardModal);
        }
        if (elements.cancelDeleteCardBtn) {
            elements.cancelDeleteCardBtn.addEventListener('click', closeDeleteCardModal);
        }

        // Form submissions
        elements.rewardForm.addEventListener('submit', handleFormSubmit);
        if (elements.cardForm) {
            elements.cardForm.addEventListener('submit', handleCardFormSubmit);
        }

        // Recurrence type change
        elements.recurrenceType.addEventListener('change', handleRecurrenceTypeChange);

        // Delete confirmations
        elements.confirmDeleteBtn.addEventListener('click', handleDeleteConfirm);
        if (elements.confirmDeleteCardBtn) {
            elements.confirmDeleteCardBtn.addEventListener('click', handleDeleteCardConfirm);
        }

        // Close modals on overlay click
        elements.rewardModal.addEventListener('click', (e) => {
            if (e.target === elements.rewardModal) {
                closeRewardModal();
            }
        });

        elements.deleteModal.addEventListener('click', (e) => {
            if (e.target === elements.deleteModal) {
                closeDeleteModal();
            }
        });

        if (elements.cardModal) {
            elements.cardModal.addEventListener('click', (e) => {
                if (e.target === elements.cardModal) {
                    closeCardModal();
                }
            });
        }

        if (elements.deleteCardModal) {
            elements.deleteCardModal.addEventListener('click', (e) => {
                if (e.target === elements.deleteCardModal) {
                    closeDeleteCardModal();
                }
            });
        }

        // Close modals on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeRewardModal();
                closeDeleteModal();
                closeCardModal();
                closeDeleteCardModal();
            }
        });
    }

    /**
     * Switch to a specific page
     */
    function switchToPage(pageName) {
        // Update nav tabs
        elements.navTabs.forEach(tab => {
            if (tab.dataset.page === pageName) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });

        // Update pages
        elements.pages.forEach(page => {
            if (page.id === `page${capitalizeFirst(pageName)}`) {
                page.classList.add('active');
            } else {
                page.classList.remove('active');
            }
        });
    }

    /**
     * Capitalize first letter
     */
    function capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    /**
     * Open the add reward modal
     */
    function openAddModal() {
        elements.modalTitle.textContent = 'Add Reward';
        elements.rewardForm.reset();
        elements.rewardId.value = '';
        elements.customRecurrence.style.display = 'none';
        elements.rewardModal.classList.add('active');
        elements.rewardName.focus();
    }

    /**
     * Open the edit reward modal
     * @param {string} id - Reward ID to edit
     */
    function openEditModal(id) {
        const reward = Storage.getRewardById(id);
        if (!reward) {
            console.error('Reward not found:', id);
            return;
        }

        elements.modalTitle.textContent = 'Edit Reward';
        elements.rewardId.value = reward.id;
        elements.rewardName.value = reward.title;
        elements.cardName.value = reward.cardName || '';
        elements.amount.value = reward.amount || '';
        elements.description.value = reward.description || '';
        elements.recurrenceType.value = reward.recurrence.type;

        if (reward.recurrence.type === 'custom') {
            elements.customRecurrence.style.display = 'grid';
            elements.customInterval.value = reward.recurrence.interval || 1;
            elements.customUnit.value = reward.recurrence.unit || 'month';
        } else {
            elements.customRecurrence.style.display = 'none';
        }

        elements.rewardModal.classList.add('active');
        elements.rewardName.focus();
    }

    /**
     * Close the reward modal
     */
    function closeRewardModal() {
        elements.rewardModal.classList.remove('active');
        elements.rewardForm.reset();
    }

    /**
     * Open delete confirmation modal
     * @param {string} id - Reward ID to delete
     */
    function openDeleteModal(id) {
        const reward = Storage.getRewardById(id);
        if (!reward) {
            console.error('Reward not found:', id);
            return;
        }

        deleteRewardId = id;
        elements.deleteRewardName.textContent = reward.title;
        elements.deleteModal.classList.add('active');
    }

    /**
     * Close delete confirmation modal
     */
    function closeDeleteModal() {
        elements.deleteModal.classList.remove('active');
        deleteRewardId = null;
    }

    // =====================
    // Card Modal Functions
    // =====================

    /**
     * Open the add card modal
     */
    function openAddCardModal() {
        if (!elements.cardModal) return;
        elements.cardModalTitle.textContent = 'Add Card';
        elements.cardForm.reset();
        elements.formCardId.value = '';
        elements.cardModal.classList.add('active');
        elements.formCardName.focus();
    }

    /**
     * Open the edit card modal
     * @param {string} id - Card ID to edit
     */
    function openEditCardModal(id) {
        const card = Storage.getCardById(id);
        if (!card) {
            console.error('Card not found:', id);
            return;
        }

        elements.cardModalTitle.textContent = 'Edit Card';
        elements.formCardId.value = card.id;
        elements.formCardName.value = card.name || '';
        elements.formCardIssuer.value = card.issuer || '';
        elements.formCardOpenDate.value = card.openDate || '';
        elements.formCardAnnualFee.value = card.annualFee || '';
        elements.formCardNotes.value = card.notes || '';

        elements.cardModal.classList.add('active');
        elements.formCardName.focus();
    }

    /**
     * Close the card modal
     */
    function closeCardModal() {
        if (!elements.cardModal) return;
        elements.cardModal.classList.remove('active');
        elements.cardForm.reset();
    }

    /**
     * Open delete card confirmation modal
     * @param {string} id - Card ID to delete
     */
    function openDeleteCardModal(id) {
        const card = Storage.getCardById(id);
        if (!card) {
            console.error('Card not found:', id);
            return;
        }

        deleteCardId = id;
        elements.deleteCardName.textContent = card.name;
        elements.deleteCardModal.classList.add('active');
    }

    /**
     * Close delete card confirmation modal
     */
    function closeDeleteCardModal() {
        if (!elements.deleteCardModal) return;
        elements.deleteCardModal.classList.remove('active');
        deleteCardId = null;
    }

    /**
     * Handle card form submission
     */
    function handleCardFormSubmit(e) {
        e.preventDefault();

        const id = elements.formCardId.value;
        const cardData = {
            name: elements.formCardName.value.trim(),
            issuer: elements.formCardIssuer.value.trim(),
            openDate: elements.formCardOpenDate.value,
            annualFee: parseFloat(elements.formCardAnnualFee.value) || 0,
            notes: elements.formCardNotes.value.trim()
        };

        if (id) {
            Storage.updateCard(id, cardData);
        } else {
            Storage.addCard(cardData);
        }

        // Sync to cloud if signed in
        syncCardsToCloud();

        closeCardModal();
        renderCards();
    }

    /**
     * Handle delete card confirmation
     */
    function handleDeleteCardConfirm() {
        if (deleteCardId) {
            Storage.deleteCard(deleteCardId);
            syncCardsToCloud();
            closeDeleteCardModal();
            renderCards();
        }
    }

    /**
     * Handle recurrence type change
     */
    function handleRecurrenceTypeChange() {
        const type = elements.recurrenceType.value;
        elements.customRecurrence.style.display = type === 'custom' ? 'grid' : 'none';
    }

    /**
     * Handle form submission
     * @param {Event} e - Form submit event
     */
    function handleFormSubmit(e) {
        e.preventDefault();

        const id = elements.rewardId.value;
        const title = elements.rewardName.value.trim();
        const cardName = elements.cardName.value.trim();
        const amount = parseFloat(elements.amount.value) || 0;
        const description = elements.description.value.trim();
        const recurrenceType = elements.recurrenceType.value;

        // Build recurrence object
        const recurrence = {
            type: recurrenceType
        };

        if (recurrenceType === 'custom') {
            recurrence.interval = parseInt(elements.customInterval.value) || 1;
            recurrence.unit = elements.customUnit.value;
        }

        // Calculate the proper lastResetDate based on calendar rules
        const lastResetDate = Recurrence.formatDate(Recurrence.getLastResetDate(recurrence));

        const rewardData = {
            title,
            cardName,
            amount,
            description,
            recurrence,
            lastResetDate
        };

        if (id) {
            // Update existing reward (don't change lastResetDate unless recurrence type changed)
            const existingReward = Storage.getRewardById(id);
            if (existingReward && existingReward.recurrence.type === recurrenceType) {
                delete rewardData.lastResetDate; // Keep existing lastResetDate
            }
            Storage.updateReward(id, rewardData);
        } else {
            // Add new reward
            Storage.addReward(rewardData);
        }

        // Sync to cloud if signed in
        syncToCloud();

        closeRewardModal();
        renderRewards();
    }

    /**
     * Handle delete confirmation
     */
    function handleDeleteConfirm() {
        if (deleteRewardId) {
            Storage.deleteReward(deleteRewardId);
            syncToCloud();
            closeDeleteModal();
            renderRewards();
        }
    }

    /**
     * Handle claimed checkbox toggle
     * @param {string} id - Reward ID
     */
    function handleClaimedToggle(id) {
        Storage.toggleClaimed(id);
        syncToCloud();
        renderRewards();
    }

    /**
     * Sync rewards to cloud
     */
    async function syncToCloud() {
        if (useCloudStorage && Auth.isSignedIn()) {
            const rewards = Storage.getRewards();
            await Auth.saveRewardsToCloud(rewards);
        }
    }

    /**
     * Sync cards to cloud
     */
    async function syncCardsToCloud() {
        if (useCloudStorage && Auth.isSignedIn()) {
            const cards = Storage.getCards();
            await Auth.saveCardsToCloud(cards);
        }
    }

    /**
     * Render all rewards to the table
     */
    function renderRewards() {
        const rewards = Storage.getRewards();

        // Process resets first
        const { rewards: processedRewards, updated } = Recurrence.processResets(rewards);
        if (updated) {
            Storage.saveRewards(processedRewards);
        }

        // Update stats
        updateStats(processedRewards);

        // Show/hide empty state
        if (processedRewards.length === 0) {
            elements.rewardsTable.classList.add('hidden');
            elements.emptyState.classList.add('visible');
            return;
        }

        elements.rewardsTable.classList.remove('hidden');
        elements.emptyState.classList.remove('visible');

        // Sort rewards: unclaimed first, then by next reset date
        const sortedRewards = [...processedRewards].sort((a, b) => {
            // Claimed rewards go to the bottom
            if (a.claimed !== b.claimed) {
                return a.claimed ? 1 : -1;
            }
            // Then sort by next reset date (soonest first)
            const dateA = Recurrence.calculateNextResetDate(a);
            const dateB = Recurrence.calculateNextResetDate(b);
            return dateA - dateB;
        });

        // Render table rows (desktop)
        elements.rewardsBody.innerHTML = sortedRewards.map(reward => {
            const isOverdue = Recurrence.isOverdue(reward);
            const daysUntil = Recurrence.daysUntilReset(reward);

            let rowClass = '';
            if (reward.claimed) {
                rowClass = 'row-claimed';
            } else if (isOverdue) {
                rowClass = 'row-overdue';
            } else {
                rowClass = 'row-unclaimed';
            }

            const nextResetDisplay = Recurrence.formatNextResetDisplay(reward);
            const recurrenceDisplay = Recurrence.formatRecurrence(reward.recurrence);
            const amountDisplay = reward.amount ? `$${reward.amount.toFixed(2)}` : '-';

            return `
                <tr class="${rowClass}" data-id="${reward.id}">
                    <td class="col-claimed">
                        <div class="checkbox-container">
                            <input 
                                type="checkbox" 
                                class="checkbox" 
                                ${reward.claimed ? 'checked' : ''} 
                                onchange="App.handleClaimedToggle('${reward.id}')"
                                title="${reward.claimed ? 'Mark as unclaimed' : 'Mark as claimed'}"
                            >
                        </div>
                    </td>
                    <td class="col-name">
                        <div class="reward-name">${escapeHtml(reward.title)}</div>
                        ${reward.description ? `<div class="reward-description">${escapeHtml(reward.description)}</div>` : ''}
                    </td>
                    <td class="col-card">
                        <span class="reward-card">${escapeHtml(reward.cardName) || '-'}</span>
                    </td>
                    <td class="col-amount">
                        <span class="reward-amount">${amountDisplay}</span>
                    </td>
                    <td class="col-recurrence">
                        <span class="reward-recurrence">${recurrenceDisplay}</span>
                    </td>
                    <td class="col-reset">
                        <span class="reward-reset" title="Resets on ${nextResetDisplay}">
                            ${nextResetDisplay}
                            ${daysUntil <= 3 && !reward.claimed ? `<br><small>(${daysUntil} day${daysUntil !== 1 ? 's' : ''})</small>` : ''}
                        </span>
                    </td>
                    <td class="col-actions">
                        <div class="action-buttons">
                            <button 
                                class="btn-action edit" 
                                onclick="App.openEditModal('${reward.id}')"
                                title="Edit reward"
                            >✏️</button>
                            <button 
                                class="btn-action delete" 
                                onclick="App.openDeleteModal('${reward.id}')"
                                title="Delete reward"
                            >🗑️</button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        // Render cards (mobile)
        elements.rewardsCards.innerHTML = sortedRewards.map(reward => {
            const isOverdue = Recurrence.isOverdue(reward);
            const daysUntil = Recurrence.daysUntilReset(reward);

            let cardClass = 'reward-card-item';
            if (reward.claimed) {
                cardClass += ' card-claimed';
            } else if (isOverdue) {
                cardClass += ' card-overdue';
            } else {
                cardClass += ' card-unclaimed';
            }

            const nextResetDisplay = Recurrence.formatNextResetDisplay(reward);
            const recurrenceDisplay = Recurrence.formatRecurrence(reward.recurrence);
            const amountDisplay = reward.amount ? `$${reward.amount.toFixed(2)}` : '-';
            const daysText = daysUntil <= 3 && !reward.claimed ? ` (${daysUntil}d)` : '';

            return `
                <div class="${cardClass}" data-id="${reward.id}">
                    <div class="card-header">
                        <div class="card-title-section">
                            <input 
                                type="checkbox" 
                                class="card-checkbox" 
                                ${reward.claimed ? 'checked' : ''} 
                                onchange="App.handleClaimedToggle('${reward.id}')"
                            >
                            <div>
                                <div class="card-title">${escapeHtml(reward.title)}</div>
                                ${reward.cardName ? `<div class="card-card-name">${escapeHtml(reward.cardName)}</div>` : ''}
                            </div>
                        </div>
                        <div class="card-actions">
                            <button 
                                class="btn-action edit" 
                                onclick="App.openEditModal('${reward.id}')"
                                title="Edit"
                            >✏️</button>
                            <button 
                                class="btn-action delete" 
                                onclick="App.openDeleteModal('${reward.id}')"
                                title="Delete"
                            >🗑️</button>
                        </div>
                    </div>
                    <div class="card-details">
                        <div class="card-detail">
                            <div class="card-detail-label">Amount</div>
                            <div class="card-detail-value amount">${amountDisplay}</div>
                        </div>
                        <div class="card-detail">
                            <div class="card-detail-label">Recurrence</div>
                            <div class="card-detail-value">${recurrenceDisplay}</div>
                        </div>
                        <div class="card-detail">
                            <div class="card-detail-label">Resets</div>
                            <div class="card-detail-value">${nextResetDisplay}${daysText}</div>
                        </div>
                    </div>
                    ${reward.description ? `<div class="card-description">${escapeHtml(reward.description)}</div>` : ''}
                </div>
            `;
        }).join('');
    }

    /**
     * Update statistics display
     * @param {Array} rewards - Array of rewards
     */
    function updateStats(rewards) {
        const unclaimed = rewards.filter(r => !r.claimed);
        const unclaimedCount = unclaimed.length;
        const totalValue = unclaimed.reduce((sum, r) => sum + (r.amount || 0), 0);

        elements.unclaimedCount.textContent = unclaimedCount;
        elements.totalValue.textContent = `$${totalValue.toFixed(2)}`;
    }

    /**
     * Render all cards
     */
    function renderCards() {
        const cards = Storage.getCards();

        // Update card stats
        updateCardStats(cards);

        // Show/hide empty state
        if (cards.length === 0) {
            if (elements.cardsTable) elements.cardsTable.classList.add('hidden');
            if (elements.emptyCardsState) elements.emptyCardsState.classList.add('visible');
            return;
        }

        if (elements.cardsTable) elements.cardsTable.classList.remove('hidden');
        if (elements.emptyCardsState) elements.emptyCardsState.classList.remove('visible');

        // Sort cards by name
        const sortedCards = [...cards].sort((a, b) => a.name.localeCompare(b.name));

        // Render table rows (desktop)
        if (elements.cardsBody) {
            elements.cardsBody.innerHTML = sortedCards.map(card => {
                const feeDisplay = card.annualFee ? `$${card.annualFee.toFixed(2)}` : '$0.00';
                const openDateDisplay = card.openDate ? formatDisplayDate(card.openDate) : '-';

                return `
                    <tr data-id="${card.id}">
                        <td class="col-name">
                            <div class="card-name-main">${escapeHtml(card.name)}</div>
                            ${card.issuer ? `<div class="card-issuer">${escapeHtml(card.issuer)}</div>` : ''}
                        </td>
                        <td class="col-issuer">
                            <span>${escapeHtml(card.issuer) || '-'}</span>
                        </td>
                        <td class="col-open-date">
                            <span>${openDateDisplay}</span>
                        </td>
                        <td class="col-annual-fee">
                            <span>${feeDisplay}</span>
                        </td>
                        <td class="col-notes">
                            <span>${escapeHtml(card.notes) || '-'}</span>
                        </td>
                        <td class="col-actions">
                            <div class="action-buttons">
                                <button 
                                    class="btn-action edit" 
                                    onclick="App.openEditCardModal('${card.id}')"
                                    title="Edit card"
                                >✏️</button>
                                <button 
                                    class="btn-action delete" 
                                    onclick="App.openDeleteCardModal('${card.id}')"
                                    title="Delete card"
                                >🗑️</button>
                            </div>
                        </td>
                    </tr>
                `;
            }).join('');
        }

        // Render cards (mobile)
        if (elements.cardsCards) {
            elements.cardsCards.innerHTML = sortedCards.map(card => {
                const feeDisplay = card.annualFee ? `$${card.annualFee.toFixed(2)}` : '$0.00';
                const openDateDisplay = card.openDate ? formatDisplayDate(card.openDate) : '-';

                return `
                    <div class="card-card-item" data-id="${card.id}">
                        <div class="card-header">
                            <div class="card-title-section">
                                <div>
                                    <div class="card-title">${escapeHtml(card.name)}</div>
                                    ${card.issuer ? `<div class="card-card-issuer">${escapeHtml(card.issuer)}</div>` : ''}
                                </div>
                            </div>
                            <div class="card-actions">
                                <button 
                                    class="btn-action edit" 
                                    onclick="App.openEditCardModal('${card.id}')"
                                    title="Edit"
                                >✏️</button>
                                <button 
                                    class="btn-action delete" 
                                    onclick="App.openDeleteCardModal('${card.id}')"
                                    title="Delete"
                                >🗑️</button>
                            </div>
                        </div>
                        <div class="card-details">
                            <div class="card-detail">
                                <div class="card-detail-label">Opened</div>
                                <div class="card-detail-value">${openDateDisplay}</div>
                            </div>
                            <div class="card-detail">
                                <div class="card-detail-label">Annual Fee</div>
                                <div class="card-detail-value amount">${feeDisplay}</div>
                            </div>
                        </div>
                        ${card.notes ? `<div class="card-description">${escapeHtml(card.notes)}</div>` : ''}
                    </div>
                `;
            }).join('');
        }
    }

    /**
     * Update card statistics
     */
    function updateCardStats(cards) {
        const cardCount = cards.length;
        const totalFees = cards.reduce((sum, c) => sum + (c.annualFee || 0), 0);

        if (elements.cardCount) elements.cardCount.textContent = cardCount;
        if (elements.totalFees) elements.totalFees.textContent = `$${totalFees.toFixed(2)}`;
    }

    /**
     * Format date for display
     */
    function formatDisplayDate(dateStr) {
        if (!dateStr) return '-';
        const date = new Date(dateStr + 'T00:00:00');
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    /**
     * Escape HTML to prevent XSS
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Test function to verify reset logic
     * Call from console: App.testResetLogic()
     */
    function testResetLogic() {
        console.log('=== Testing Reset Logic ===');

        // Create a test reward with a past date
        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - 35); // 35 days ago
        const pastDateStr = Recurrence.formatDate(pastDate);

        const testReward = {
            id: 'test-reset-' + Date.now(),
            title: 'TEST: Monthly Reset Verification',
            description: 'This reward should auto-reset (created with past date)',
            cardName: 'Test Card',
            amount: 25,
            recurrence: { type: 'monthly' },
            lastResetDate: pastDateStr,
            claimed: true, // Mark as claimed to test reset
            createdAt: pastDateStr
        };

        console.log('Test reward created with lastResetDate:', pastDateStr);
        console.log('Claimed status before:', testReward.claimed);

        // Check if it needs reset
        const needsReset = Recurrence.needsReset(testReward);
        console.log('Needs reset:', needsReset);

        const nextResetDate = Recurrence.getNextResetDateString(testReward);
        console.log('Next reset date would be:', nextResetDate);

        // Add the test reward to storage
        const rewards = Storage.getRewards();
        rewards.push(testReward);
        Storage.saveRewards(rewards);

        // Re-render which will process resets
        renderRewards();

        // Check the result
        const updatedReward = Storage.getRewardById(testReward.id);
        console.log('After processing:');
        console.log('  - Claimed status:', updatedReward.claimed);
        console.log('  - Last reset date:', updatedReward.lastResetDate);
        console.log('  - Expected: claimed=false, lastResetDate=today');

        if (!updatedReward.claimed && updatedReward.lastResetDate === Recurrence.getToday()) {
            console.log('✅ PASS: Reset logic working correctly!');
        } else {
            console.log('❌ FAIL: Reset did not occur as expected');
        }

        console.log('=== Test Complete ===');
        console.log('You can delete the test reward from the UI.');

        return updatedReward;
    }

    /**
     * Handle sign in button click
     */
    async function handleSignIn() {
        try {
            elements.signInBtn.disabled = true;
            elements.signInBtn.textContent = 'Signing in...';

            await Auth.signInWithGoogle();
        } catch (error) {
            console.error('Sign in error:', error);
            alert('Sign in failed. Please try again.');
        } finally {
            elements.signInBtn.disabled = false;
            elements.signInBtn.innerHTML = `
                <svg class="google-icon" viewBox="0 0 24 24" width="18" height="18">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign in
            `;
        }
    }

    /**
     * Handle sign out button click
     */
    async function handleSignOut() {
        try {
            await Auth.signOut();
        } catch (error) {
            console.error('Sign out error:', error);
        }
    }

    /**
     * Handle auth state change
     */
    async function handleAuthStateChanged(user) {
        if (user) {
            // User signed in
            useCloudStorage = true;

            // Update UI
            elements.signedOutUI.classList.add('hidden');
            elements.signedInUI.classList.remove('hidden');
            elements.userAvatar.src = user.photoURL || '';
            elements.userName.textContent = user.displayName || user.email;
            elements.syncStatus.textContent = '☁️ Synced to cloud';
            elements.syncStatus.classList.add('sync-status-cloud');
            elements.syncHint.classList.add('hidden');

            // Check if we should migrate local data
            const localRewards = Storage.getRewards();
            const localCards = Storage.getCards();
            if (localRewards.length > 0 || localCards.length > 0) {
                const migrated = await Auth.migrateLocalToCloud(localRewards, localCards);
                if (migrated) {
                    console.log('Local data migrated to cloud');
                }
            }

            // Load rewards from cloud
            const cloudRewards = await Auth.loadRewardsFromCloud();
            if (cloudRewards) {
                Storage.saveRewards(cloudRewards);
                renderRewards();
            }

            // Load cards from cloud
            const cloudCards = await Auth.loadCardsFromCloud();
            if (cloudCards) {
                Storage.saveCards(cloudCards);
                renderCards();
            }
        } else {
            // User signed out
            useCloudStorage = false;

            // Update UI
            elements.signedOutUI.classList.remove('hidden');
            elements.signedInUI.classList.add('hidden');
            elements.userAvatar.src = '';
            elements.userName.textContent = '';
            elements.syncStatus.textContent = 'Data saved locally in your browser';
            elements.syncStatus.classList.remove('sync-status-cloud');

            if (Auth.isConfigured()) {
                elements.syncHint.classList.remove('hidden');
            }

            renderRewards();
            renderCards();
        }
    }

    /**
     * Handle rewards update from cloud
     */
    function handleCloudRewardsUpdate(rewards) {
        Storage.saveRewards(rewards);
        renderRewards();
    }

    /**
     * Handle cards update from cloud
     */
    function handleCloudCardsUpdate(cards) {
        Storage.saveCards(cards);
        renderCards();
    }

    /**
     * Save rewards (local + cloud if signed in)
     */
    async function saveRewards(rewards) {
        Storage.saveRewards(rewards);

        if (useCloudStorage && Auth.isSignedIn()) {
            await Auth.saveRewardsToCloud(rewards);
        }
    }

    /**
     * Initialize the application
     */
    function init() {
        initElements();
        initEventListeners();

        // Initialize Auth if available
        if (typeof Auth !== 'undefined') {
            const authInitialized = Auth.init();

            if (authInitialized) {
                Auth.setOnAuthStateChanged(handleAuthStateChanged);
                Auth.setOnRewardsUpdated(handleCloudRewardsUpdate);
                Auth.setOnCardsUpdated(handleCloudCardsUpdate);
            } else {
                // Firebase not configured, show hint
                if (elements.syncHint) {
                    elements.syncHint.textContent = 'Configure Firebase in auth.js to enable cloud sync';
                    elements.syncHint.classList.remove('hidden');
                }
            }
        }

        renderRewards();
        renderCards();

        // Set up daily check for resets (check every hour)
        setInterval(() => {
            renderRewards();
        }, 60 * 60 * 1000); // 1 hour

        console.log('Credit Card Rewards Tracker initialized');
        console.log('To test reset logic, run: App.testResetLogic()');
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Public API (exposed for onclick handlers)
    return {
        openEditModal,
        openDeleteModal,
        handleClaimedToggle,
        openEditCardModal,
        openDeleteCardModal,
        testResetLogic,
        renderRewards,
        renderCards
    };
})();
