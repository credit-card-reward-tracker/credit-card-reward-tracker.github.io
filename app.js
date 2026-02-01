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

    // Sort state
    let rewardsSortField = 'nextReset';
    let rewardsSortDir = 'asc';
    let cardsSortField = 'name';
    let cardsSortDir = 'asc';

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
            totalAnnualRewards: document.getElementById('totalAnnualRewards'),

            // Main UI - Cards
            addCardBtn: document.getElementById('addCardBtn'),
            cardsTable: document.getElementById('cardsTable'),
            cardsBody: document.getElementById('cardsBody'),
            cardsCards: document.getElementById('cardsCards'),
            emptyCardsState: document.getElementById('emptyCardsState'),
            cardCount: document.getElementById('totalCards'),
            totalFees: document.getElementById('totalAnnualFees'),

            // Card Filters
            filterIssuer: document.getElementById('filterIssuer'),
            filterPartner: document.getElementById('filterPartner'),
            filterDateFrom: document.getElementById('filterDateFrom'),
            filterDateTo: document.getElementById('filterDateTo'),
            clearFiltersBtn: document.getElementById('clearFiltersBtn'),

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
            rewardCardSelect: document.getElementById('rewardCardSelect'),
            addCardFromRewardBtn: document.getElementById('addCardFromRewardBtn'),
            amount: document.getElementById('amount'),
            recurrenceType: document.getElementById('recurrenceType'),
            customRecurrence: document.getElementById('customRecurrence'),
            customInterval: document.getElementById('customInterval'),
            customUnit: document.getElementById('customUnit'),
            description: document.getElementById('description'),

            // Delete Modal (unified for rewards and cards)
            deleteModal: document.getElementById('deleteModal'),
            closeDeleteModal: document.getElementById('closeDeleteModal'),
            deleteItemName: document.getElementById('deleteItemName'),
            cancelDeleteBtn: document.getElementById('cancelDeleteBtn'),
            confirmDeleteBtn: document.getElementById('confirmDeleteBtn'),

            // Add/Edit Card Modal
            cardModal: document.getElementById('cardModal'),
            cardModalTitle: document.getElementById('cardModalTitle'),
            closeCardModal: document.getElementById('closeCardModal'),
            cardForm: document.getElementById('cardForm'),
            cancelCardBtn: document.getElementById('cancelCardBtn'),

            // Card Form fields
            formCardId: document.getElementById('cardId'),
            formCardName: document.getElementById('cardNameInput'),
            formCardIssuer: document.getElementById('cardIssuer'),
            formCardOpenDate: document.getElementById('cardOpenDate'),
            formCardAnnualFee: document.getElementById('cardAnnualFee'),
            formCardNotes: document.getElementById('cardNotes'),

            // Best Card Page
            categorySelect: document.getElementById('categorySelect'),
            bestCardResults: document.getElementById('bestCardResults'),
            emptyBestCardState: document.getElementById('emptyBestCardState')
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

        // Form submissions
        elements.rewardForm.addEventListener('submit', handleFormSubmit);
        if (elements.cardForm) {
            elements.cardForm.addEventListener('submit', handleCardFormSubmit);
        }

        // Recurrence type change
        elements.recurrenceType.addEventListener('change', handleRecurrenceTypeChange);

        // Add card button from reward modal
        if (elements.addCardFromRewardBtn) {
            elements.addCardFromRewardBtn.addEventListener('click', handleAddCardFromReward);
        }

        // Category select for Best Card page
        if (elements.categorySelect) {
            elements.categorySelect.addEventListener('change', renderBestCardRecommendations);
        }

        // Card filter listeners
        if (elements.filterIssuer) {
            elements.filterIssuer.addEventListener('change', renderCards);
        }
        if (elements.filterPartner) {
            elements.filterPartner.addEventListener('change', renderCards);
        }
        if (elements.filterDateFrom) {
            elements.filterDateFrom.addEventListener('change', renderCards);
        }
        if (elements.filterDateTo) {
            elements.filterDateTo.addEventListener('change', renderCards);
        }
        if (elements.clearFiltersBtn) {
            elements.clearFiltersBtn.addEventListener('click', clearCardFilters);
        }

        // Issuer selection (click to select one)
        document.querySelectorAll('.issuer-option').forEach(option => {
            option.addEventListener('click', () => {
                // Remove selected from all
                document.querySelectorAll('.issuer-option').forEach(o => o.classList.remove('selected'));
                // Add selected to clicked
                option.classList.add('selected');
                // Update hidden input
                const issuerValue = option.dataset.issuer;
                if (elements.formCardIssuer) {
                    elements.formCardIssuer.value = issuerValue;
                }
            });
        });

        // Delete confirmation (unified for rewards and cards)
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

        if (elements.cardModal) {
            elements.cardModal.addEventListener('click', (e) => {
                if (e.target === elements.cardModal) {
                    closeCardModal();
                }
            });
        }

        // Close modals on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeRewardModal();
                closeDeleteModal();
                closeCardModal();
            }
        });

        // Sortable table headers - Rewards
        document.querySelectorAll('#rewardsTable th.sortable').forEach(th => {
            th.addEventListener('click', () => handleRewardsSort(th.dataset.sort));
        });

        // Sortable table headers - Cards
        document.querySelectorAll('#cardsTable th.sortable').forEach(th => {
            th.addEventListener('click', () => handleCardsSort(th.dataset.sort));
        });
    }

    /**
     * Handle rewards table sort
     */
    function handleRewardsSort(field) {
        if (rewardsSortField === field) {
            rewardsSortDir = rewardsSortDir === 'asc' ? 'desc' : 'asc';
        } else {
            rewardsSortField = field;
            rewardsSortDir = 'asc';
        }
        updateSortIndicators('rewardsTable', rewardsSortField, rewardsSortDir);
        renderRewards();
    }

    /**
     * Handle cards table sort
     */
    function handleCardsSort(field) {
        if (cardsSortField === field) {
            cardsSortDir = cardsSortDir === 'asc' ? 'desc' : 'asc';
        } else {
            cardsSortField = field;
            cardsSortDir = 'asc';
        }
        updateSortIndicators('cardsTable', cardsSortField, cardsSortDir);
        renderCards();
    }

    /**
     * Update sort indicators on table headers
     */
    function updateSortIndicators(tableId, field, dir) {
        const table = document.getElementById(tableId);
        if (!table) return;

        table.querySelectorAll('th.sortable').forEach(th => {
            th.classList.remove('sorted-asc', 'sorted-desc');
            const icon = th.querySelector('.sort-icon');
            if (icon) icon.textContent = '';

            if (th.dataset.sort === field) {
                th.classList.add(dir === 'asc' ? 'sorted-asc' : 'sorted-desc');
                if (icon) icon.textContent = dir === 'asc' ? '▲' : '▼';
            }
        });
    }

    /**
     * Sort rewards array by field and direction
     */
    function sortRewards(rewards, field, dir) {
        const multiplier = dir === 'asc' ? 1 : -1;

        return [...rewards].sort((a, b) => {
            let valA, valB;

            switch (field) {
                case 'claimed':
                    valA = a.claimed ? 1 : 0;
                    valB = b.claimed ? 1 : 0;
                    break;
                case 'title':
                    valA = (a.title || '').toLowerCase();
                    valB = (b.title || '').toLowerCase();
                    return multiplier * valA.localeCompare(valB);
                case 'cardName':
                    valA = (a.cardName || '').toLowerCase();
                    valB = (b.cardName || '').toLowerCase();
                    return multiplier * valA.localeCompare(valB);
                case 'amount':
                    valA = a.amount || 0;
                    valB = b.amount || 0;
                    break;
                case 'recurrence':
                    const order = { monthly: 1, 'half-yearly': 2, yearly: 3, custom: 4 };
                    valA = order[a.recurrence?.type] || 5;
                    valB = order[b.recurrence?.type] || 5;
                    break;
                case 'nextReset':
                default:
                    valA = Recurrence.calculateNextResetDate(a);
                    valB = Recurrence.calculateNextResetDate(b);
                    break;
            }

            if (valA < valB) return -1 * multiplier;
            if (valA > valB) return 1 * multiplier;
            return 0;
        });
    }

    /**
     * Sort cards array by field and direction
     */
    function sortCards(cards, field, dir) {
        const multiplier = dir === 'asc' ? 1 : -1;

        return [...cards].sort((a, b) => {
            let valA, valB;

            switch (field) {
                case 'name':
                    valA = (a.name || '').toLowerCase();
                    valB = (b.name || '').toLowerCase();
                    return multiplier * valA.localeCompare(valB);
                case 'issuer':
                    valA = (a.issuer || '').toLowerCase();
                    valB = (b.issuer || '').toLowerCase();
                    return multiplier * valA.localeCompare(valB);
                case 'openDate':
                    valA = a.openDate || '';
                    valB = b.openDate || '';
                    return multiplier * valA.localeCompare(valB);
                case 'annualFee':
                    valA = a.annualFee || 0;
                    valB = b.annualFee || 0;
                    break;
                case 'feeDate':
                    // Fee date is typically the same month as open date
                    valA = a.openDate ? a.openDate.substring(5, 7) : '13';
                    valB = b.openDate ? b.openDate.substring(5, 7) : '13';
                    break;
                default:
                    valA = (a.name || '').toLowerCase();
                    valB = (b.name || '').toLowerCase();
                    return multiplier * valA.localeCompare(valB);
            }

            if (valA < valB) return -1 * multiplier;
            if (valA > valB) return 1 * multiplier;
            return 0;
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

    // =====================
    // Card Issuers
    // =====================

    const CARD_ISSUERS = {
        'chase': { name: 'Chase', logo: 'https://www.google.com/s2/favicons?domain=chase.com&sz=64', color: '#117ACA', letter: 'C' },
        'amex': { name: 'American Express', logo: 'https://www.google.com/s2/favicons?domain=americanexpress.com&sz=64', color: '#006FCF', letter: 'A' },
        'citi': { name: 'Citi', logo: 'https://www.google.com/s2/favicons?domain=citi.com&sz=64', color: '#003B70', letter: 'C' },
        'capitalone': { name: 'Capital One', logo: 'https://www.google.com/s2/favicons?domain=capitalone.com&sz=64', color: '#D03027', letter: 'C' },
        'discover': { name: 'Discover', logo: 'https://www.google.com/s2/favicons?domain=discover.com&sz=64', color: '#FF6600', letter: 'D' },
        'wellsfargo': { name: 'Wells Fargo', logo: 'https://www.google.com/s2/favicons?domain=wellsfargo.com&sz=64', color: '#D71E28', letter: 'W' },
        'usbank': { name: 'US Bank', logo: 'https://www.google.com/s2/favicons?domain=usbank.com&sz=64', color: '#0C2074', letter: 'U' },
        'barclays': { name: 'Barclays', logo: 'https://www.google.com/s2/favicons?domain=barclays.com&sz=64', color: '#00AEEF', letter: 'B' },
        'bofa': { name: 'Bank of America', logo: 'https://www.google.com/s2/favicons?domain=bankofamerica.com&sz=64', color: '#012169', letter: 'B' },
        'synchrony': { name: 'Synchrony', logo: 'https://www.google.com/s2/favicons?domain=synchrony.com&sz=64', color: '#00263E', letter: 'S' }
    };

    /**
     * Get issuer info by key
     */
    function getIssuerInfo(issuerKey) {
        if (CARD_ISSUERS[issuerKey]) {
            return CARD_ISSUERS[issuerKey];
        }
        // Return the key as-is if not found (for custom issuers)
        return { name: issuerKey, color: '#6366f1', letter: issuerKey ? issuerKey.charAt(0).toUpperCase() : '?' };
    }

    // =====================
    // Cashback Category Helpers
    // =====================

    const CASHBACK_CATEGORIES = ['dining', 'groceries', 'travel', 'gas', 'shopping', 'entertainment', 'utilities', 'other'];

    // =====================
    // Transfer Partners
    // =====================

    const TRANSFER_PARTNERS = {
        // Airlines
        'united': { name: 'United Airlines', logo: 'https://www.google.com/s2/favicons?domain=united.com&sz=64', color: '#002244', letter: 'UA', type: 'airline' },
        'delta': { name: 'Delta Air Lines', logo: 'https://www.google.com/s2/favicons?domain=delta.com&sz=64', color: '#003366', letter: 'DL', type: 'airline' },
        'american': { name: 'American Airlines', logo: 'https://www.google.com/s2/favicons?domain=aa.com&sz=64', color: '#0078D2', letter: 'AA', type: 'airline' },
        'southwest': { name: 'Southwest Airlines', logo: 'https://www.google.com/s2/favicons?domain=southwest.com&sz=64', color: '#304CB2', letter: 'SW', type: 'airline' },
        'jetblue': { name: 'JetBlue', logo: 'https://www.google.com/s2/favicons?domain=jetblue.com&sz=64', color: '#003876', letter: 'B6', type: 'airline' },
        'alaska': { name: 'Alaska Airlines', logo: 'https://www.google.com/s2/favicons?domain=alaskaair.com&sz=64', color: '#01426A', letter: 'AS', type: 'airline' },
        'british': { name: 'British Airways', logo: 'https://www.google.com/s2/favicons?domain=britishairways.com&sz=64', color: '#075AAA', letter: 'BA', type: 'airline' },
        'airfrance': { name: 'Air France/KLM', logo: 'https://www.google.com/s2/favicons?domain=airfrance.com&sz=64', color: '#002157', letter: 'AF', type: 'airline' },
        'singapore': { name: 'Singapore Airlines', logo: 'https://www.google.com/s2/favicons?domain=singaporeair.com&sz=64', color: '#F0AB00', letter: 'SQ', type: 'airline' },
        'emirates': { name: 'Emirates', logo: 'https://www.google.com/s2/favicons?domain=emirates.com&sz=64', color: '#D71921', letter: 'EK', type: 'airline' },
        'ana': { name: 'ANA', logo: 'https://www.google.com/s2/favicons?domain=ana.co.jp&sz=64', color: '#13448F', letter: 'NH', type: 'airline' },
        'cathay': { name: 'Cathay Pacific', logo: 'https://www.google.com/s2/favicons?domain=cathaypacific.com&sz=64', color: '#006564', letter: 'CX', type: 'airline' },
        'virgin': { name: 'Virgin Atlantic', logo: 'https://www.google.com/s2/favicons?domain=virginatlantic.com&sz=64', color: '#E10A0A', letter: 'VS', type: 'airline' },
        'qantas': { name: 'Qantas', logo: 'https://www.google.com/s2/favicons?domain=qantas.com&sz=64', color: '#E0002A', letter: 'QF', type: 'airline' },
        // Hotels
        'marriott': { name: 'Marriott Bonvoy', logo: 'https://www.google.com/s2/favicons?domain=marriott.com&sz=64', color: '#1C1C1C', letter: 'MB', type: 'hotel' },
        'hilton': { name: 'Hilton Honors', logo: 'https://www.google.com/s2/favicons?domain=hilton.com&sz=64', color: '#104C97', letter: 'HH', type: 'hotel' },
        'hyatt': { name: 'World of Hyatt', logo: 'https://www.google.com/s2/favicons?domain=hyatt.com&sz=64', color: '#8B734B', letter: 'WH', type: 'hotel' },
        'ihg': { name: 'IHG Rewards', logo: 'https://www.google.com/s2/favicons?domain=ihg.com&sz=64', color: '#1D4F91', letter: 'IHG', type: 'hotel' },
        'choice': { name: 'Choice Privileges', logo: 'https://www.google.com/s2/favicons?domain=choicehotels.com&sz=64', color: '#00467F', letter: 'CP', type: 'hotel' },
        'wyndham': { name: 'Wyndham Rewards', logo: 'https://www.google.com/s2/favicons?domain=wyndhamhotels.com&sz=64', color: '#00457C', letter: 'WR', type: 'hotel' }
    };

    /**
     * Get selected transfer partners from checkboxes
     */
    function getTransferPartnersFromFields() {
        const partners = [];
        Object.keys(TRANSFER_PARTNERS).forEach(key => {
            const checkbox = document.getElementById(`partner_${key}`);
            if (checkbox && checkbox.checked) {
                partners.push(key);
            }
        });
        return partners;
    }

    /**
     * Populate transfer partner checkboxes
     */
    function populateTransferPartnerFields(transferPartners = []) {
        Object.keys(TRANSFER_PARTNERS).forEach(key => {
            const checkbox = document.getElementById(`partner_${key}`);
            if (checkbox) {
                checkbox.checked = transferPartners.includes(key);
            }
        });
    }

    /**
     * Clear all transfer partner checkboxes
     */
    function clearTransferPartnerFields() {
        Object.keys(TRANSFER_PARTNERS).forEach(key => {
            const checkbox = document.getElementById(`partner_${key}`);
            if (checkbox) {
                checkbox.checked = false;
            }
        });
    }

    /**
     * Get transfer partner display info
     */
    function getPartnerInfo(partnerKey) {
        const partner = TRANSFER_PARTNERS[partnerKey];
        return {
            name: partner ? partner.name : partnerKey,
            logo: partner ? partner.logo : null,
            color: partner ? partner.color : '#6366f1',
            letter: partner ? partner.letter : (partnerKey ? partnerKey.charAt(0).toUpperCase() : '?'),
            type: partner ? partner.type : 'other'
        };
    }

    /**
     * Generate HTML for transfer partners display
     */
    function renderTransferPartnersHtml(transferPartners) {
        if (!transferPartners || transferPartners.length === 0) return '';

        return `<div class="card-partners">
            ${transferPartners.map(p => {
            const info = getPartnerInfo(p);
            return `<span class="partner-chip" title="${escapeHtml(info.name)}"><img src="${info.logo}" alt="${escapeHtml(info.name)}" class="partner-logo-img" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><span class="partner-badge-fallback" style="background-color: ${info.color}; display: none;">${info.letter}</span></span>`;
        }).join('')}
        </div>`;
    }

    /**
     * Generate HTML for issuer display with logo
     */
    function renderIssuerHtml(issuerKey, className = 'card-issuer') {
        if (!issuerKey) return '';
        const info = getIssuerInfo(issuerKey);
        if (info.logo) {
            return `<div class="${className}"><img src="${info.logo}" alt="${escapeHtml(info.name)}" class="issuer-logo-img" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><span class="issuer-badge-fallback" style="background-color: ${info.color}; display: none;">${info.letter}</span><span>${escapeHtml(info.name)}</span></div>`;
        }
        return `<div class="${className}"><span class="issuer-badge" style="background-color: ${info.color}">${info.letter}</span><span>${escapeHtml(info.name)}</span></div>`;
    }

    /**
     * Generate HTML for cashback categories display
     */
    function renderCashbackHtml(cashbackByCategory, maxVisible = 3) {
        if (!cashbackByCategory) return '';

        const entries = Object.entries(cashbackByCategory).filter(([, val]) => val > 0);
        if (entries.length === 0) return '';

        const visibleEntries = entries.slice(0, maxVisible);
        const hiddenEntries = entries.slice(maxVisible);

        let html = '<div class="card-cashback-chips">';

        visibleEntries.forEach(([category, percent]) => {
            html += `<span class="cashback-chip" title="${capitalizeFirst(category)}">${percent}% ${capitalizeFirst(category)}</span>`;
        });

        if (hiddenEntries.length > 0) {
            const hiddenText = hiddenEntries.map(([cat, pct]) => `${pct}% ${capitalizeFirst(cat)}`).join(', ');
            html += `<span class="cashback-chip more" title="${hiddenText}">+${hiddenEntries.length} more</span>`;
        }

        html += '</div>';
        return html;
    }

    /**
     * Get cashback values from form fields
     */
    function getCashbackFromFields() {
        const cashback = {};
        CASHBACK_CATEGORIES.forEach(category => {
            const input = document.getElementById(`cashback_${category}`);
            if (input) {
                const value = parseFloat(input.value) || 0;
                if (value > 0) {
                    cashback[category] = value;
                }
            }
        });
        return cashback;
    }

    /**
     * Populate cashback form fields with values
     */
    function populateCashbackFields(cashbackByCategory) {
        CASHBACK_CATEGORIES.forEach(category => {
            const input = document.getElementById(`cashback_${category}`);
            if (input) {
                input.value = cashbackByCategory[category] || '';
            }
        });
    }

    /**
     * Clear all cashback form fields
     */
    function clearCashbackFields() {
        CASHBACK_CATEGORIES.forEach(category => {
            const input = document.getElementById(`cashback_${category}`);
            if (input) {
                input.value = '';
            }
        });
    }

    /**
     * Clear issuer selection UI
     */
    function clearIssuerSelection() {
        document.querySelectorAll('.issuer-option').forEach(o => o.classList.remove('selected'));
        if (elements.formCardIssuer) {
            elements.formCardIssuer.value = '';
        }
    }

    /**
     * Select an issuer in the UI
     */
    function selectIssuer(issuerKey) {
        document.querySelectorAll('.issuer-option').forEach(o => o.classList.remove('selected'));
        if (issuerKey) {
            const option = document.querySelector(`.issuer-option[data-issuer="${issuerKey}"]`);
            if (option) {
                option.classList.add('selected');
            }
        }
    }

    /**
     * Populate the card dropdown with available cards from storage
     */
    function populateCardDropdown(selectedCardName = '') {
        const cards = Storage.getCards();
        const select = elements.rewardCardSelect;
        if (!select) return;

        // Clear existing options and add default
        select.innerHTML = '<option value="">-- Select a card --</option>';

        // Add card options from storage
        cards.forEach(card => {
            const option = document.createElement('option');
            option.value = card.name;
            option.textContent = card.name;
            if (card.name === selectedCardName) {
                option.selected = true;
            }
            select.appendChild(option);
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
        populateCardDropdown();
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
        populateCardDropdown(reward.cardName || '');
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
        deleteCardId = null; // Clear card delete
        elements.deleteItemName.textContent = reward.title;
        elements.deleteModal.classList.add('active');
    }

    /**
     * Close delete confirmation modal
     */
    function closeDeleteModal() {
        elements.deleteModal.classList.remove('active');
        deleteRewardId = null;
        deleteCardId = null;
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
        clearCashbackFields();
        clearTransferPartnerFields();
        clearIssuerSelection();
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

        // Populate issuer selection
        selectIssuer(card.issuer || '');

        // Populate cashback categories
        populateCashbackFields(card.cashbackByCategory || {});

        // Populate transfer partners
        populateTransferPartnerFields(card.transferPartners || []);

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
        deleteRewardId = null; // Clear reward delete
        elements.deleteItemName.textContent = card.name;
        elements.deleteModal.classList.add('active');
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
            notes: elements.formCardNotes.value.trim(),
            cashbackByCategory: getCashbackFromFields(),
            transferPartners: getTransferPartnersFromFields()
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
     * Handle recurrence type change
     */
    function handleRecurrenceTypeChange() {
        const type = elements.recurrenceType.value;
        elements.customRecurrence.style.display = type === 'custom' ? 'grid' : 'none';
    }

    /**
     * Handle add card button click from reward modal
     * Opens Add Card modal
     */
    function handleAddCardFromReward() {
        // Close reward modal and open card modal
        closeRewardModal();
        openAddCardModal();
    }

    /**
     * Handle form submission
     * @param {Event} e - Form submit event
     */
    function handleFormSubmit(e) {
        e.preventDefault();

        const id = elements.rewardId.value;
        const title = elements.rewardName.value.trim();
        const cardName = elements.rewardCardSelect ? elements.rewardCardSelect.value.trim() : '';
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
     * Handle delete confirmation (unified for rewards and cards)
     */
    function handleDeleteConfirm() {
        if (deleteRewardId) {
            Storage.deleteReward(deleteRewardId);
            syncToCloud();
            closeDeleteModal();
            renderRewards();
        } else if (deleteCardId) {
            Storage.deleteCard(deleteCardId);
            syncCardsToCloud();
            closeDeleteModal();
            renderCards();
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

        // Sort rewards based on current sort state
        const sortedRewards = sortRewards(processedRewards, rewardsSortField, rewardsSortDir);

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

        // Calculate total annual value based on recurrence
        const totalAnnualValue = rewards.reduce((sum, reward) => {
            const amount = reward.amount || 0;
            const recurrence = reward.recurrence;

            if (!recurrence) return sum + amount;

            let multiplier = 1;
            if (recurrence.type === 'monthly') {
                multiplier = 12;
            } else if (recurrence.type === 'quarterly') {
                multiplier = 4;
            } else if (recurrence.type === 'half-yearly') {
                multiplier = 2;
            } else if (recurrence.type === 'yearly') {
                multiplier = 1;
            } else if (recurrence.type === 'custom') {
                // Calculate based on custom interval and unit
                const interval = recurrence.interval || 1;
                const unit = recurrence.unit || 'month';

                if (unit === 'day') {
                    multiplier = 365 / interval;
                } else if (unit === 'week') {
                    multiplier = 52 / interval;
                } else if (unit === 'month') {
                    multiplier = 12 / interval;
                } else if (unit === 'year') {
                    multiplier = 1 / interval;
                }
            }

            return sum + (amount * multiplier);
        }, 0);

        elements.unclaimedCount.textContent = unclaimedCount;
        elements.totalValue.textContent = `$${totalValue.toFixed(2)}`;
        if (elements.totalAnnualRewards) {
            elements.totalAnnualRewards.textContent = `$${totalAnnualValue.toFixed(2)}`;
        }
    }

    /**
     * Render all cards
     */
    function renderCards() {
        const allCards = Storage.getCards();

        // Populate filter dropdowns
        populateCardFilterDropdowns(allCards);

        // Apply filters
        const cards = applyCardFilters(allCards);

        // Update card stats (show stats for all cards, not filtered)
        updateCardStats(allCards);

        // Show/hide empty state
        if (allCards.length === 0) {
            if (elements.cardsTable) elements.cardsTable.classList.add('hidden');
            if (elements.emptyCardsState) elements.emptyCardsState.classList.add('visible');
            return;
        }

        if (elements.cardsTable) elements.cardsTable.classList.remove('hidden');
        if (elements.emptyCardsState) elements.emptyCardsState.classList.remove('visible');

        // Sort cards based on current sort state
        const sortedCards = sortCards(cards, cardsSortField, cardsSortDir);

        // Render table rows (desktop)
        if (elements.cardsBody) {
            elements.cardsBody.innerHTML = sortedCards.map(card => {
                const feeDisplay = card.annualFee ? `$${card.annualFee.toFixed(2)}` : '$0.00';
                const openDateDisplay = card.openDate ? formatDisplayDate(card.openDate) : '-';
                const partnersHtml = renderTransferPartnersHtml(card.transferPartners);
                const cashbackHtml = renderCashbackHtml(card.cashbackByCategory, 2);

                return `
                    <tr data-id="${card.id}">
                        <td class="col-name">
                            <div class="card-name-main">${escapeHtml(card.name)}</div>
                            ${renderIssuerHtml(card.issuer, 'card-issuer')}
                            ${partnersHtml}
                            ${cashbackHtml}
                        </td>
                        <td class="col-issuer">
                            ${renderIssuerHtml(card.issuer, 'card-issuer-cell') || '-'}
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
                const partnersHtml = renderTransferPartnersHtml(card.transferPartners);
                const cashbackHtml = renderCashbackHtml(card.cashbackByCategory, 3);

                return `
                    <div class="card-card-item" data-id="${card.id}">
                        <div class="card-header">
                            <div class="card-title-section">
                                <div>
                                    <div class="card-title">${escapeHtml(card.name)}</div>
                                    ${renderIssuerHtml(card.issuer, 'card-card-issuer')}
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
                        ${partnersHtml}
                        ${cashbackHtml}
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
     * Populate card filter dropdowns with unique values
     */
    function populateCardFilterDropdowns(cards) {
        // Populate issuer dropdown
        if (elements.filterIssuer) {
            const currentIssuer = elements.filterIssuer.value;
            const issuers = [...new Set(cards.map(c => c.issuer).filter(Boolean))].sort();

            elements.filterIssuer.innerHTML = '<option value="">All Issuers</option>';
            issuers.forEach(issuer => {
                const info = getIssuerInfo(issuer);
                const option = document.createElement('option');
                option.value = issuer;
                option.textContent = info.name;
                if (issuer === currentIssuer) option.selected = true;
                elements.filterIssuer.appendChild(option);
            });
        }

        // Populate transfer partner dropdown
        if (elements.filterPartner) {
            const currentPartner = elements.filterPartner.value;
            const allPartners = new Set();
            cards.forEach(card => {
                if (card.transferPartners) {
                    card.transferPartners.forEach(p => allPartners.add(p));
                }
            });
            const partners = [...allPartners].sort();

            elements.filterPartner.innerHTML = '<option value="">All Partners</option>';
            partners.forEach(partner => {
                const info = getPartnerInfo(partner);
                const option = document.createElement('option');
                option.value = partner;
                option.textContent = info.name;
                if (partner === currentPartner) option.selected = true;
                elements.filterPartner.appendChild(option);
            });
        }
    }

    /**
     * Apply card filters
     */
    function applyCardFilters(cards) {
        const issuerFilter = elements.filterIssuer ? elements.filterIssuer.value : '';
        const partnerFilter = elements.filterPartner ? elements.filterPartner.value : '';
        const dateFromFilter = elements.filterDateFrom ? elements.filterDateFrom.value : '';
        const dateToFilter = elements.filterDateTo ? elements.filterDateTo.value : '';

        return cards.filter(card => {
            // Filter by issuer
            if (issuerFilter && card.issuer !== issuerFilter) {
                return false;
            }

            // Filter by transfer partner
            if (partnerFilter) {
                if (!card.transferPartners || !card.transferPartners.includes(partnerFilter)) {
                    return false;
                }
            }

            // Filter by open date (from)
            if (dateFromFilter && card.openDate) {
                if (card.openDate < dateFromFilter) {
                    return false;
                }
            }

            // Filter by open date (to)
            if (dateToFilter && card.openDate) {
                if (card.openDate > dateToFilter) {
                    return false;
                }
            }

            return true;
        });
    }

    /**
     * Clear all card filters
     */
    function clearCardFilters() {
        if (elements.filterIssuer) elements.filterIssuer.value = '';
        if (elements.filterPartner) elements.filterPartner.value = '';
        if (elements.filterDateFrom) elements.filterDateFrom.value = '';
        if (elements.filterDateTo) elements.filterDateTo.value = '';
        renderCards();
    }

    // =====================
    // Best Card Page Functions
    // =====================

    /**
     * Render Best Card recommendations based on selected category
     */
    function renderBestCardRecommendations() {
        const category = elements.categorySelect ? elements.categorySelect.value : '';

        if (!category) {
            // Show empty state
            if (elements.bestCardResults) elements.bestCardResults.innerHTML = '';
            if (elements.emptyBestCardState) elements.emptyBestCardState.style.display = 'block';
            return;
        }

        const cards = Storage.getCards();

        if (cards.length === 0) {
            if (elements.bestCardResults) {
                elements.bestCardResults.innerHTML = `
                    <div class="no-results">
                        <div class="no-results-icon">💳</div>
                        <h3>No cards added yet</h3>
                        <p>Add cards in the Cards tab to see recommendations.</p>
                    </div>
                `;
            }
            if (elements.emptyBestCardState) elements.emptyBestCardState.style.display = 'none';
            return;
        }

        // Map all cards with cashback for selected category and sort highest to lowest
        const cardsWithCashback = cards
            .map(card => ({
                ...card,
                cashback: (card.cashbackByCategory && card.cashbackByCategory[category]) || 0
            }))
            .sort((a, b) => b.cashback - a.cashback);

        // Hide empty state
        if (elements.emptyBestCardState) elements.emptyBestCardState.style.display = 'none';

        // Find the best cashback value (could be 0 if no cards have cashback for this category)
        const bestCashback = cardsWithCashback[0].cashback;

        if (elements.bestCardResults) {
            elements.bestCardResults.innerHTML = `
                <div class="bestcard-list">
                    ${cardsWithCashback.map((card, index) => {
                const isBest = bestCashback > 0 && card.cashback === bestCashback;
                const hasNoCashback = card.cashback === 0;
                const partnersHtml = card.transferPartners && card.transferPartners.length > 0
                    ? `<div class="bestcard-partners">
                        ${card.transferPartners.map(p => {
                        const info = getPartnerInfo(p);
                        return `<span class="partner-chip" title="${escapeHtml(info.name)}"><img src="${info.logo}" alt="${escapeHtml(info.name)}" class="partner-logo-img" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><span class="partner-badge-fallback" style="background-color: ${info.color}; display: none;">${info.letter}</span></span>`;
                    }).join('')}
                       </div>`
                    : '';
                return `
                            <div class="bestcard-item ${isBest ? 'best' : ''} ${hasNoCashback ? 'no-cashback' : ''}">
                                <div class="bestcard-rank">${index + 1}</div>
                                <div class="bestcard-info">
                                    <div class="bestcard-name">
                                        ${escapeHtml(card.name)}
                                        ${isBest ? '<span class="best-badge">⭐ Best</span>' : ''}
                                    </div>
                                    ${renderIssuerHtml(card.issuer, 'bestcard-issuer')}
                                    ${partnersHtml}
                                </div>
                                <div class="bestcard-cashback">
                                    <span class="cashback-value ${hasNoCashback ? 'zero' : ''}">${card.cashback}%</span>
                                    <span class="cashback-label">${capitalizeFirst(category)}</span>
                                </div>
                            </div>
                        `;
            }).join('')}
                </div>
            `;
        }
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
                await Auth.migrateLocalToCloud(localRewards, localCards);
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
        initThemeSwitcher();

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
    }

    /**
     * Initialize theme switcher
     */
    function initThemeSwitcher() {
        const themeSelect = document.getElementById('themeSelect');
        if (!themeSelect) return;

        // Load saved theme or default to 'aurora'
        const savedTheme = localStorage.getItem('cc-tracker-theme') || 'aurora';
        document.documentElement.setAttribute('data-theme', savedTheme);
        themeSelect.value = savedTheme;

        // Listen for theme changes
        themeSelect.addEventListener('change', (e) => {
            const theme = e.target.value;
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('cc-tracker-theme', theme);
        });
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
        openAddCardModal,
        openEditCardModal,
        openDeleteCardModal,
        testResetLogic,
        renderRewards,
        renderCards
    };
})();
