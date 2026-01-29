/**
 * Storage Module
 * Handles all localStorage operations for the Credit Card Rewards Tracker
 */

const Storage = (function () {
    const STORAGE_KEY = 'cc_rewards_tracker';

    /**
     * Generate a UUID v4
     * @returns {string} UUID
     */
    function generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    /**
     * Get user data from localStorage
     * @returns {Object} User data object with rewards array
     */
    function getUserData() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            if (data) {
                return JSON.parse(data);
            }
        } catch (error) {
            console.error('Error reading from localStorage:', error);
        }

        // Return default user data structure
        return {
            userId: 'local-user',
            rewards: []
        };
    }

    /**
     * Save user data to localStorage
     * @param {Object} userData - User data object to save
     * @returns {boolean} Success status
     */
    function saveUserData(userData) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    }

    /**
     * Get all rewards
     * @returns {Array} Array of reward objects
     */
    function getRewards() {
        const userData = getUserData();
        return userData.rewards || [];
    }

    /**
     * Save all rewards
     * @param {Array} rewards - Array of reward objects
     * @returns {boolean} Success status
     */
    function saveRewards(rewards) {
        const userData = getUserData();
        userData.rewards = rewards;
        return saveUserData(userData);
    }

    /**
     * Add a new reward
     * @param {Object} rewardData - Reward data without id and timestamps
     * @returns {Object} The created reward with id and timestamps
     */
    function addReward(rewardData) {
        const rewards = getRewards();
        const now = new Date().toISOString().split('T')[0];

        const newReward = {
            id: generateUUID(),
            title: rewardData.title,
            description: rewardData.description || '',
            cardName: rewardData.cardName || '',
            amount: rewardData.amount || 0,
            recurrence: rewardData.recurrence,
            lastResetDate: now,
            claimed: false,
            createdAt: now
        };

        rewards.push(newReward);
        saveRewards(rewards);

        return newReward;
    }

    /**
     * Update an existing reward
     * @param {string} id - Reward ID
     * @param {Object} updates - Fields to update
     * @returns {Object|null} Updated reward or null if not found
     */
    function updateReward(id, updates) {
        const rewards = getRewards();
        const index = rewards.findIndex(r => r.id === id);

        if (index === -1) {
            return null;
        }

        // Merge updates with existing reward
        rewards[index] = {
            ...rewards[index],
            ...updates
        };

        saveRewards(rewards);
        return rewards[index];
    }

    /**
     * Delete a reward
     * @param {string} id - Reward ID
     * @returns {boolean} Success status
     */
    function deleteReward(id) {
        const rewards = getRewards();
        const filteredRewards = rewards.filter(r => r.id !== id);

        if (filteredRewards.length === rewards.length) {
            return false; // Reward not found
        }

        return saveRewards(filteredRewards);
    }

    /**
     * Get a single reward by ID
     * @param {string} id - Reward ID
     * @returns {Object|null} Reward object or null
     */
    function getRewardById(id) {
        const rewards = getRewards();
        return rewards.find(r => r.id === id) || null;
    }

    /**
     * Toggle the claimed status of a reward
     * @param {string} id - Reward ID
     * @returns {Object|null} Updated reward or null
     */
    function toggleClaimed(id) {
        const reward = getRewardById(id);
        if (!reward) {
            return null;
        }

        return updateReward(id, { claimed: !reward.claimed });
    }

    /**
     * Clear all data
     * @returns {boolean} Success status
     */
    function clearAll() {
        try {
            localStorage.removeItem(STORAGE_KEY);
            return true;
        } catch (error) {
            console.error('Error clearing localStorage:', error);
            return false;
        }
    }

    // Public API
    return {
        generateUUID,
        getUserData,
        saveUserData,
        getRewards,
        saveRewards,
        addReward,
        updateReward,
        deleteReward,
        getRewardById,
        toggleClaimed,
        clearAll
    };
})();
