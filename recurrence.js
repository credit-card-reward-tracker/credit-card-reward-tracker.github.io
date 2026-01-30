/**
 * Recurrence Module
 * Handles recurrence calculations and automatic reset logic
 * 
 * Reset dates are calendar-based:
 * - Monthly: 1st of each month
 * - Half-yearly: Jan 1 and Jul 1
 * - Yearly: Jan 1
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
     * Calculate the next reset date based on calendar rules
     * @param {Object} reward - Reward object
     * @returns {Date} Next reset date
     */
    function calculateNextResetDate(reward) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const { type, interval = 1, unit = 'month' } = reward.recurrence;
        
        switch (type) {
            case 'monthly': {
                // Monthly resets on 1st of each month
                // If today is before the 1st (impossible) or on/after 1st, next reset is 1st of next month
                const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
                return nextMonth;
            }
            
            case 'half-yearly': {
                // Half-yearly resets on Jan 1 and Jul 1
                const year = today.getFullYear();
                const month = today.getMonth();
                
                if (month < 6) {
                    // Before July, next reset is Jul 1
                    return new Date(year, 6, 1); // July 1
                } else {
                    // July or later, next reset is Jan 1 next year
                    return new Date(year + 1, 0, 1); // Jan 1 next year
                }
            }
            
            case 'yearly': {
                // Yearly resets on Jan 1
                const year = today.getFullYear();
                return new Date(year + 1, 0, 1); // Jan 1 next year
            }
            
            case 'custom': {
                // Custom recurrence - add interval from last reset date
                const lastReset = parseDate(reward.lastResetDate);
                const result = new Date(lastReset);
                
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
                return result;
            }
            
            default:
                // Fallback: next month
                return new Date(today.getFullYear(), today.getMonth() + 1, 1);
        }
    }

    /**
     * Get the last reset date (start of current period) based on calendar rules
     * @param {Object} recurrence - Recurrence object
     * @returns {Date} Last reset date
     */
    function getLastResetDate(recurrence) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const { type } = recurrence;
        
        switch (type) {
            case 'monthly': {
                // Last reset was 1st of current month
                return new Date(today.getFullYear(), today.getMonth(), 1);
            }
            
            case 'half-yearly': {
                // Last reset was Jan 1 or Jul 1
                const year = today.getFullYear();
                const month = today.getMonth();
                
                if (month < 6) {
                    // Before July, last reset was Jan 1
                    return new Date(year, 0, 1);
                } else {
                    // July or later, last reset was Jul 1
                    return new Date(year, 6, 1);
                }
            }
            
            case 'yearly': {
                // Last reset was Jan 1 of current year
                return new Date(today.getFullYear(), 0, 1);
            }
            
            default:
                return today;
        }
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
     * Check if a reward needs to be reset (new period started since last reset)
     * @param {Object} reward - Reward object
     * @returns {boolean} True if reset is needed
     */
    function needsReset(reward) {
        const lastResetStored = parseDate(reward.lastResetDate);
        lastResetStored.setHours(0, 0, 0, 0);
        
        const currentPeriodStart = getLastResetDate(reward.recurrence);
        currentPeriodStart.setHours(0, 0, 0, 0);
        
        // If the stored last reset is before the current period start, we need to reset
        return lastResetStored < currentPeriodStart;
    }

    /**
     * Check if a reward is overdue (unclaimed and close to reset)
     * @param {Object} reward - Reward object
     * @returns {boolean} True if overdue
     */
    function isOverdue(reward) {
        if (reward.claimed) {
            return false;
        }

        const daysLeft = daysUntilReset(reward);
        
        // Consider overdue if within 3 days of reset
        return daysLeft <= 3;
    }

    /**
     * Process all rewards and reset those that need it
     * @param {Array} rewards - Array of reward objects
     * @returns {Object} Updated rewards array and update flag
     */
    function processResets(rewards) {
        let updated = false;

        const processedRewards = rewards.map(reward => {
            if (needsReset(reward)) {
                updated = true;
                // Reset the reward with current period start date
                const currentPeriodStart = getLastResetDate(reward.recurrence);
                return {
                    ...reward,
                    claimed: false,
                    lastResetDate: formatDate(currentPeriodStart)
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
            case 'half-yearly':
                return 'Half-Yearly';
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
     * @returns {number} Days until reset
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
        getLastResetDate,
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
