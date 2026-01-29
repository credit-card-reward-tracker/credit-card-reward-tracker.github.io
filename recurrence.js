/**
 * Recurrence Module
 * Handles recurrence calculations and automatic reset logic
 */

const Recurrence = (function () {
    /**
     * Parse a date string to a Date object (local time)
     * @param {string} dateStr - Date string in YYYY-MM-DD format
     * @returns {Date} Date object
     */
    function parseDate(dateStr) {
        const [year, month, day] = dateStr.split('-').map(Number);
        return new Date(year, month - 1, day);
    }

    /**
     * Format a Date object to YYYY-MM-DD string
     * @param {Date} date - Date object
     * @returns {string} Formatted date string
     */
    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    /**
     * Get today's date as YYYY-MM-DD string
     * @returns {string} Today's date
     */
    function getToday() {
        return formatDate(new Date());
    }

    /**
     * Add a duration to a date based on recurrence settings
     * @param {Date} date - Base date
     * @param {Object} recurrence - Recurrence object
     * @returns {Date} New date after adding duration
     */
    function addDuration(date, recurrence) {
        const result = new Date(date);
        const { type, interval = 1, unit = 'month' } = recurrence;

        switch (type) {
            case 'monthly':
                result.setMonth(result.getMonth() + 1);
                break;
            case 'quarterly':
                result.setMonth(result.getMonth() + 3);
                break;
            case 'yearly':
                result.setFullYear(result.getFullYear() + 1);
                break;
            case 'custom':
                switch (unit) {
                    case 'day':
                        result.setDate(result.getDate() + interval);
                        break;
                    case 'week':
                        result.setDate(result.getDate() + (interval * 7));
                        break;
                    case 'month':
                        result.setMonth(result.getMonth() + interval);
                        break;
                    case 'year':
                        result.setFullYear(result.getFullYear() + interval);
                        break;
                }
                break;
        }

        return result;
    }

    /**
     * Calculate the next reset date for a reward
     * @param {Object} reward - Reward object
     * @returns {Date} Next reset date
     */
    function calculateNextResetDate(reward) {
        const lastReset = parseDate(reward.lastResetDate);
        return addDuration(lastReset, reward.recurrence);
    }

    /**
     * Get the next reset date as a formatted string
     * @param {Object} reward - Reward object
     * @returns {string} Formatted next reset date
     */
    function getNextResetDateString(reward) {
        const nextReset = calculateNextResetDate(reward);
        return formatDate(nextReset);
    }

    /**
     * Format the next reset date for display
     * @param {Object} reward - Reward object
     * @returns {string} Human-readable date string
     */
    function formatNextResetDisplay(reward) {
        const nextReset = calculateNextResetDate(reward);
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        return nextReset.toLocaleDateString('en-US', options);
    }

    /**
     * Check if a reward needs to be reset
     * @param {Object} reward - Reward object
     * @returns {boolean} True if reset is needed
     */
    function needsReset(reward) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const nextReset = calculateNextResetDate(reward);
        nextReset.setHours(0, 0, 0, 0);

        return today >= nextReset;
    }

    /**
     * Check if a reward is overdue (unclaimed and past reset date)
     * @param {Object} reward - Reward object
     * @returns {boolean} True if overdue
     */
    function isOverdue(reward) {
        if (reward.claimed) {
            return false;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const nextReset = calculateNextResetDate(reward);
        nextReset.setHours(0, 0, 0, 0);

        // Consider overdue if we're within 3 days of reset and still unclaimed
        const warningDate = new Date(nextReset);
        warningDate.setDate(warningDate.getDate() - 3);

        return today >= warningDate;
    }

    /**
     * Process all rewards and reset those that need it
     * @param {Array} rewards - Array of reward objects
     * @returns {Array} Updated rewards array
     */
    function processResets(rewards) {
        const today = getToday();
        let updated = false;

        const processedRewards = rewards.map(reward => {
            if (needsReset(reward)) {
                updated = true;
                // Reset the reward
                return {
                    ...reward,
                    claimed: false,
                    lastResetDate: today
                };
            }
            return reward;
        });

        return {
            rewards: processedRewards,
            updated
        };
    }

    /**
     * Format recurrence for display
     * @param {Object} recurrence - Recurrence object
     * @returns {string} Human-readable recurrence string
     */
    function formatRecurrence(recurrence) {
        const { type, interval = 1, unit = 'month' } = recurrence;

        switch (type) {
            case 'monthly':
                return 'Monthly';
            case 'quarterly':
                return 'Quarterly';
            case 'yearly':
                return 'Yearly';
            case 'custom':
                const unitLabel = interval === 1 ? unit : unit + 's';
                return `Every ${interval} ${unitLabel}`;
            default:
                return 'Unknown';
        }
    }

    /**
     * Calculate days until next reset
     * @param {Object} reward - Reward object
     * @returns {number} Days until reset (negative if overdue)
     */
    function daysUntilReset(reward) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const nextReset = calculateNextResetDate(reward);
        nextReset.setHours(0, 0, 0, 0);

        const diffTime = nextReset - today;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    // Public API
    return {
        parseDate,
        formatDate,
        getToday,
        addDuration,
        calculateNextResetDate,
        getNextResetDateString,
        formatNextResetDisplay,
        needsReset,
        isOverdue,
        processResets,
        formatRecurrence,
        daysUntilReset
    };
})();
