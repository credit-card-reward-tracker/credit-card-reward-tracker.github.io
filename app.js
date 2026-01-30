/**
 * Main Application Module
 * Handles UI interactions and orchestrates the app
 */

const App = (function () {
    // DOM Elements
    let elements = {};

    // State
    let deleteRewardId = null;

    /**
     * Initialize DOM element references
     */
    function initElements() {
        elements = {
            // Main UI
            addRewardBtn: document.getElementById('addRewardBtn'),
            rewardsTable: document.getElementById('rewardsTable'),
            rewardsBody: document.getElementById('rewardsBody'),
            rewardsCards: document.getElementById('rewardsCards'),
            emptyState: document.getElementById('emptyState'),
            unclaimedCount: document.getElementById('unclaimedCount'),
            totalValue: document.getElementById('totalValue'),

            // Add/Edit Modal
            rewardModal: document.getElementById('rewardModal'),
            modalTitle: document.getElementById('modalTitle'),
            closeModal: document.getElementById('closeModal'),
            rewardForm: document.getElementById('rewardForm'),
            cancelBtn: document.getElementById('cancelBtn'),

            // Form fields
            rewardId: document.getElementById('rewardId'),
            rewardName: document.getElementById('rewardName'),
            cardName: document.getElementById('cardName'),
            amount: document.getElementById('amount'),
            recurrenceType: document.getElementById('recurrenceType'),
            customRecurrence: document.getElementById('customRecurrence'),
            customInterval: document.getElementById('customInterval'),
            customUnit: document.getElementById('customUnit'),
            description: document.getElementById('description'),

            // Delete Modal
            deleteModal: document.getElementById('deleteModal'),
            closeDeleteModal: document.getElementById('closeDeleteModal'),
            deleteRewardName: document.getElementById('deleteRewardName'),
            cancelDeleteBtn: document.getElementById('cancelDeleteBtn'),
            confirmDeleteBtn: document.getElementById('confirmDeleteBtn')
        };
    }

    /**
     * Initialize event listeners
     */
    function initEventListeners() {
        // Add reward button
        elements.addRewardBtn.addEventListener('click', openAddModal);

        // Modal close buttons
        elements.closeModal.addEventListener('click', closeRewardModal);
        elements.cancelBtn.addEventListener('click', closeRewardModal);
        elements.closeDeleteModal.addEventListener('click', closeDeleteModal);
        elements.cancelDeleteBtn.addEventListener('click', closeDeleteModal);

        // Form submission
        elements.rewardForm.addEventListener('submit', handleFormSubmit);

        // Recurrence type change
        elements.recurrenceType.addEventListener('change', handleRecurrenceTypeChange);

        // Delete confirmation
        elements.confirmDeleteBtn.addEventListener('click', handleDeleteConfirm);

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

        // Close modals on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeRewardModal();
                closeDeleteModal();
            }
        });
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

        closeRewardModal();
        renderRewards();
    }

    /**
     * Handle delete confirmation
     */
    function handleDeleteConfirm() {
        if (deleteRewardId) {
            Storage.deleteReward(deleteRewardId);
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
        renderRewards();
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
     * Initialize the application
     */
    function init() {
        initElements();
        initEventListeners();
        renderRewards();

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
        testResetLogic,
        renderRewards
    };
})();
