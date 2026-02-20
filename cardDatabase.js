/**
 * Credit Card Database
 * Comprehensive card data for autocomplete, auto-fill, and reward suggestions.
 *
 * Each card entry:
 *   name            - Full card product name
 *   issuer          - Issuer key (chase, amex, citi, capitalone, discover, wellsfargo, usbank, bofa, barclays, synchrony)
 *   network         - Card network (Visa, Mastercard, Amex)
 *   annualFee       - Current annual fee in dollars
 *   signupBonus     - Description of current sign-up bonus offer
 *   rewardsType     - "points" | "cashback" | "miles" (primary rewards currency)
 *   pointValue      - Estimated cents-per-point value for redemption (cash / travel)
 *   foreignTransactionFee - true if charges foreign transaction fee, false if none
 *   creditNeeded    - "excellent" | "good" | "fair" — general credit tier needed
 *   cardType        - "personal" | "business"
 *   cashbackByCategory - { dining, groceries, travel, gas, shopping, entertainment, utilities, other } in % / x
 *   transferPartners   - Array of partner keys
 *   notes           - Rich text summary of card benefits
 *   rewards         - Array of trackable rewards/credits:
 *       { name, amount, recurrence: { type, interval?, unit? }, description }
 *
 * Data current as of early 2026. Verify with issuer for latest terms.
 */

const CardDatabase = (function () {
    const cards = [
        // ==================== Chase ====================
        {
            name: "Chase Sapphire Preferred",
            issuer: "chase",
            network: "Visa",
            annualFee: 95,
            signupBonus: "60,000 Ultimate Rewards points after spending $4,000 in the first 3 months",
            rewardsType: "points",
            pointValue: 1.25,
            foreignTransactionFee: false,
            creditNeeded: "good",
            cardType: "personal",
            cashbackByCategory: { dining: 3, travel: 2, shopping: 1, groceries: 3, gas: 1, entertainment: 1, utilities: 1, other: 1 },
            transferPartners: ["united", "southwest", "british", "airfrance", "singapore", "virgin", "emirates", "marriott", "hyatt", "ihg"],
            notes: "3x dining, online groceries & streaming. 2x travel. 1x everything else. Points transfer 1:1 to 14+ travel partners. 25% bonus when redeeming via Chase Travel portal. No foreign transaction fees. $50 annual Chase Travel hotel credit. Includes trip cancellation/interruption insurance, primary rental car insurance, purchase protection.",
            rewards: [
                { name: "$50 Chase Travel Credit", amount: 50, recurrence: { type: "yearly" }, description: "$50 annual hotel credit when booking via Chase Ultimate Rewards travel portal" }
            ]
        },
        {
            name: "Chase Sapphire Reserve",
            issuer: "chase",
            network: "Visa",
            annualFee: 550,
            signupBonus: "60,000 Ultimate Rewards points after spending $4,000 in the first 3 months",
            rewardsType: "points",
            pointValue: 1.50,
            foreignTransactionFee: false,
            creditNeeded: "excellent",
            cardType: "personal",
            cashbackByCategory: { dining: 3, travel: 3, shopping: 1, groceries: 1, gas: 1, entertainment: 1, utilities: 1, other: 1 },
            transferPartners: ["united", "southwest", "british", "airfrance", "singapore", "virgin", "emirates", "marriott", "hyatt", "ihg"],
            notes: "3x dining & travel. 1x everything else. Points transfer 1:1 to 14+ travel partners. 50% bonus when redeeming via Chase Travel portal. $300 annual travel credit auto-applied. Priority Pass Select lounge access. No foreign transaction fees. DoorDash DashPass, Lyft Pink membership. Primary rental car insurance, trip cancellation, trip delay reimbursement up to $500, purchase protection, extended warranty.",
            rewards: [
                { name: "$300 Travel Credit", amount: 300, recurrence: { type: "yearly" }, description: "Annual travel credit applied automatically to travel purchases (airlines, hotels, rental cars, tolls, parking, etc.)" },
                { name: "DoorDash DashPass", amount: 0, recurrence: { type: "yearly" }, description: "Complimentary DashPass membership ($0 delivery fees on eligible DoorDash/Caviar orders)" },
                { name: "Lyft Pink Membership", amount: 0, recurrence: { type: "yearly" }, description: "Complimentary Lyft Pink All Access membership (ride discounts, priority airport pickups)" }
            ]
        },
        {
            name: "Chase Freedom Unlimited",
            issuer: "chase",
            network: "Visa",
            annualFee: 0,
            signupBonus: "Additional 1.5% cash back on all purchases (up to $20,000) in the first year",
            rewardsType: "cashback",
            pointValue: 1.0,
            foreignTransactionFee: true,
            creditNeeded: "good",
            cardType: "personal",
            cashbackByCategory: { dining: 3, groceries: 1.5, travel: 5, gas: 1.5, shopping: 1.5, entertainment: 1.5, utilities: 1.5, other: 1.5 },
            transferPartners: [],
            notes: "5% on travel via Chase portal. 3% dining & drugstores. 1.5% on everything else. No annual fee. Points pool with Sapphire cards for higher value & transfers. Purchase protection, extended warranty. $0 fraud liability. Charges 3% foreign transaction fee.",
            rewards: []
        },
        {
            name: "Chase Freedom Flex",
            issuer: "chase",
            network: "Mastercard",
            annualFee: 0,
            signupBonus: "Additional 5% cash back on grocery store purchases (up to $12,000) in the first year",
            rewardsType: "cashback",
            pointValue: 1.0,
            foreignTransactionFee: true,
            creditNeeded: "good",
            cardType: "personal",
            cashbackByCategory: { dining: 3, groceries: 1, travel: 5, gas: 1, shopping: 1, entertainment: 1, utilities: 1, other: 1 },
            transferPartners: [],
            notes: "5% on rotating quarterly categories (up to $1,500/qtr — must activate). 5% travel via Chase portal. 3% dining & drugstores. 1% everything else. No annual fee. Mastercard World Elite benefits including cell phone protection up to $800. Points pool with Sapphire cards. Charges 3% foreign transaction fee.",
            rewards: []
        },
        {
            name: "Chase Ink Business Preferred",
            issuer: "chase",
            network: "Visa",
            annualFee: 95,
            signupBonus: "100,000 Ultimate Rewards points after spending $8,000 in the first 3 months",
            rewardsType: "points",
            pointValue: 1.25,
            foreignTransactionFee: false,
            creditNeeded: "good",
            cardType: "business",
            cashbackByCategory: { travel: 3, dining: 1, groceries: 1, gas: 1, shopping: 1, entertainment: 1, utilities: 3, other: 1 },
            transferPartners: ["united", "southwest", "british", "airfrance", "singapore", "virgin", "emirates", "marriott", "hyatt", "ihg"],
            notes: "3x on first $150K/yr in combined spending on travel, shipping, internet/cable/phone, advertising on social media & search engines. 1x everything else. 1:1 transfer to travel partners. 25% portal bonus. No foreign transaction fees. Cell phone protection up to $600. Trip cancellation, primary rental car insurance, purchase protection.",
            rewards: []
        },
        {
            name: "Chase Ink Business Cash",
            issuer: "chase",
            network: "Visa",
            annualFee: 0,
            signupBonus: "$350 cash back after spending $3,000 in the first 3 months",
            rewardsType: "cashback",
            pointValue: 1.0,
            foreignTransactionFee: true,
            creditNeeded: "good",
            cardType: "business",
            cashbackByCategory: { dining: 2, groceries: 1, travel: 1, gas: 2, shopping: 1, entertainment: 1, utilities: 5, other: 1 },
            transferPartners: [],
            notes: "5% on first $25K/yr at office supply stores & internet/cable/phone. 2% on first $25K/yr at gas stations & dining. 1% everything else. No annual fee. Points pool with Sapphire/Ink Preferred. Purchase protection, extended warranty. Charges 3% foreign transaction fee.",
            rewards: []
        },
        {
            name: "Chase Ink Business Unlimited",
            issuer: "chase",
            network: "Visa",
            annualFee: 0,
            signupBonus: "$500 cash back after spending $3,000 in the first 3 months",
            rewardsType: "cashback",
            pointValue: 1.0,
            foreignTransactionFee: true,
            creditNeeded: "good",
            cardType: "business",
            cashbackByCategory: { dining: 1.5, groceries: 1.5, travel: 1.5, gas: 1.5, shopping: 1.5, entertainment: 1.5, utilities: 1.5, other: 1.5 },
            transferPartners: [],
            notes: "Flat 1.5% cash back on everything with no cap. No annual fee. Points pool with Sapphire/Ink Preferred for transfers. Purchase protection, extended warranty. 0% intro APR for 12 months on purchases. Charges 3% foreign transaction fee.",
            rewards: []
        },
        {
            name: "Chase United Explorer",
            issuer: "chase",
            network: "Visa",
            annualFee: 95,
            signupBonus: "50,000 United miles after spending $3,000 in the first 3 months",
            rewardsType: "miles",
            pointValue: 1.2,
            foreignTransactionFee: false,
            creditNeeded: "good",
            cardType: "personal",
            cashbackByCategory: { dining: 2, groceries: 1, travel: 2, gas: 1, shopping: 1, entertainment: 1, utilities: 1, other: 1 },
            transferPartners: ["united"],
            notes: "2x United purchases, dining, hotel stays booked directly. 1x everything else. First & second checked bag free (saves $70-$140/trip). Priority boarding on United. 25% back on United in-flight purchases. No foreign transaction fees. Two United Club passes per year. Trip cancellation/interruption insurance, primary rental car insurance.",
            rewards: [
                { name: "United Checked Bags Free", amount: 0, recurrence: { type: "yearly" }, description: "First & second checked bag free on United for cardholder and one companion on same reservation" },
                { name: "2 United Club Passes", amount: 0, recurrence: { type: "yearly" }, description: "Two one-time United Club passes per year" }
            ]
        },
        {
            name: "Chase United Quest",
            issuer: "chase",
            network: "Visa",
            annualFee: 250,
            signupBonus: "70,000 United miles after spending $4,000 in the first 3 months",
            rewardsType: "miles",
            pointValue: 1.2,
            foreignTransactionFee: false,
            creditNeeded: "good",
            cardType: "personal",
            cashbackByCategory: { dining: 3, groceries: 1, travel: 3, gas: 1, shopping: 1, entertainment: 1, utilities: 1, other: 1 },
            transferPartners: ["united"],
            notes: "3x United purchases & dining. 2x hotel stays booked directly. 1x everything else. Two free checked bags on United. $125 annual United purchase credit. 10,000 anniversary bonus miles. Priority boarding. 25% back on United in-flight purchases. No foreign transaction fees. Trip delay, cancellation insurance, primary rental car insurance.",
            rewards: [
                { name: "$125 United Credit", amount: 125, recurrence: { type: "yearly" }, description: "Annual $125 statement credit for United purchases" },
                { name: "United 2 Free Checked Bags", amount: 0, recurrence: { type: "yearly" }, description: "Two free checked bags on United flights for cardholder" },
                { name: "10,000 Anniversary Miles", amount: 0, recurrence: { type: "yearly" }, description: "10,000 bonus United miles on each card anniversary" }
            ]
        },
        {
            name: "Chase Southwest Rapid Rewards Plus",
            issuer: "chase",
            network: "Visa",
            annualFee: 69,
            signupBonus: "50,000 Rapid Rewards points after spending $1,000 in the first 3 months",
            rewardsType: "points",
            pointValue: 1.4,
            foreignTransactionFee: true,
            creditNeeded: "good",
            cardType: "personal",
            cashbackByCategory: { dining: 1, groceries: 1, travel: 2, gas: 1, shopping: 1, entertainment: 1, utilities: 1, other: 1 },
            transferPartners: ["southwest"],
            notes: "2x Southwest purchases, Rapid Rewards hotel & car rental partners. 1x everything else. 3,000 anniversary bonus points. Points count toward Companion Pass (need 135K/yr). No blackout dates on Southwest reward flights. Charges 3% foreign transaction fee.",
            rewards: [
                { name: "3,000 Anniversary Points", amount: 0, recurrence: { type: "yearly" }, description: "3,000 bonus Rapid Rewards points each card anniversary" }
            ]
        },
        {
            name: "Chase Southwest Rapid Rewards Priority",
            issuer: "chase",
            network: "Visa",
            annualFee: 149,
            signupBonus: "50,000 Rapid Rewards points after spending $1,000 in the first 3 months",
            rewardsType: "points",
            pointValue: 1.4,
            foreignTransactionFee: true,
            creditNeeded: "good",
            cardType: "personal",
            cashbackByCategory: { dining: 2, groceries: 1, travel: 3, gas: 1, shopping: 1, entertainment: 1, utilities: 1, other: 1 },
            transferPartners: ["southwest"],
            notes: "3x Southwest purchases. 2x dining & local transit/commuting. 1x everything else. 7,500 anniversary points. $75 annual Southwest travel credit. 4 upgraded boardings per year. 25% back on in-flight purchases. Points count toward Companion Pass. No blackout dates. Charges 3% foreign transaction fee.",
            rewards: [
                { name: "$75 Southwest Credit", amount: 75, recurrence: { type: "yearly" }, description: "Annual $75 Southwest travel credit (flights, in-flight, WiFi)" },
                { name: "7,500 Anniversary Points", amount: 0, recurrence: { type: "yearly" }, description: "7,500 bonus Rapid Rewards points each card anniversary" },
                { name: "4 Upgraded Boardings", amount: 0, recurrence: { type: "yearly" }, description: "4 upgraded boardings per year when available at the gate (A1-A15 position)" }
            ]
        },
        {
            name: "Chase IHG One Rewards Premier",
            issuer: "chase",
            network: "Mastercard",
            annualFee: 99,
            signupBonus: "140,000 IHG points after spending $3,000 in the first 3 months",
            rewardsType: "points",
            pointValue: 0.5,
            foreignTransactionFee: false,
            creditNeeded: "good",
            cardType: "personal",
            cashbackByCategory: { dining: 5, groceries: 1, travel: 10, gas: 2, shopping: 1, entertainment: 1, utilities: 1, other: 1 },
            transferPartners: ["ihg"],
            notes: "10x IHG hotels. 5x dining & gas. 2x everything else. IHG Platinum Elite status (room upgrades, late checkout, welcome amenity). Free night certificate (up to 40K points) each anniversary. Fourth reward night free on point stays. No foreign transaction fees. $100 statement credit when spending $20K+/yr.",
            rewards: [
                { name: "IHG Free Night (40K)", amount: 0, recurrence: { type: "yearly" }, description: "Free night certificate at any IHG property up to 40,000 points each card anniversary" },
                { name: "IHG Platinum Elite Status", amount: 0, recurrence: { type: "yearly" }, description: "Automatic IHG Platinum Elite status — room upgrades, late checkout, welcome amenity" },
                { name: "$100 IHG Statement Credit", amount: 100, recurrence: { type: "yearly" }, description: "$100 IHG credit when spending $20,000+ in a calendar year" }
            ]
        },
        {
            name: "Chase World of Hyatt",
            issuer: "chase",
            network: "Visa",
            annualFee: 95,
            signupBonus: "60,000 World of Hyatt points after spending $6,000 in the first 6 months",
            rewardsType: "points",
            pointValue: 1.7,
            foreignTransactionFee: false,
            creditNeeded: "good",
            cardType: "personal",
            cashbackByCategory: { dining: 2, groceries: 1, travel: 4, gas: 1, shopping: 1, entertainment: 1, utilities: 1, other: 1 },
            transferPartners: ["hyatt"],
            notes: "4x Hyatt purchases. 2x dining, fitness club/gym, local transit/commuting, airline tickets purchased directly. 1x everything else. Automatic Discoverist status (rate discounts, bottled water, in-room WiFi). Free night (Category 1-4) each anniversary. 2 qualifying night credits toward Hyatt elite status. Earn 5 qualifying nights when spending $15K. No foreign transaction fees. Trip cancellation, primary rental car insurance.",
            rewards: [
                { name: "Hyatt Free Night (Cat 1-4)", amount: 0, recurrence: { type: "yearly" }, description: "One free night certificate at any Category 1-4 World of Hyatt property each card anniversary" },
                { name: "Hyatt Discoverist Status", amount: 0, recurrence: { type: "yearly" }, description: "Automatic World of Hyatt Discoverist status — rate discounts, bottled water, premium WiFi" }
            ]
        },
        {
            name: "Chase Marriott Bonvoy Boundless",
            issuer: "chase",
            network: "Visa",
            annualFee: 95,
            signupBonus: "3 free night awards (each up to 50,000 points) after spending $3,000 in first 3 months",
            rewardsType: "points",
            pointValue: 0.7,
            foreignTransactionFee: false,
            creditNeeded: "good",
            cardType: "personal",
            cashbackByCategory: { dining: 1, groceries: 1, travel: 6, gas: 1, shopping: 1, entertainment: 1, utilities: 1, other: 1 },
            transferPartners: ["marriott"],
            notes: "6x Marriott Bonvoy properties. 2x everything else. Automatic Marriott Silver Elite (10% bonus points, priority late checkout). Free night certificate (up to 35,000 points) each anniversary. 15 elite night credits per year. Fifth night free on award stays of 5+ nights. No foreign transaction fees. Purchase protection, extended warranty.",
            rewards: [
                { name: "Marriott Free Night (35K)", amount: 0, recurrence: { type: "yearly" }, description: "Annual free night certificate usable at any Marriott property up to 35,000 points" },
                { name: "Marriott Silver Elite", amount: 0, recurrence: { type: "yearly" }, description: "Automatic Marriott Bonvoy Silver Elite status — 10% bonus points, priority late checkout" }
            ]
        },

        // ==================== American Express ====================
        {
            name: "Amex Platinum",
            issuer: "amex",
            network: "Amex",
            annualFee: 695,
            signupBonus: "80,000 Membership Rewards points after spending $8,000 in the first 6 months",
            rewardsType: "points",
            pointValue: 2.0,
            foreignTransactionFee: false,
            creditNeeded: "excellent",
            cardType: "personal",
            cashbackByCategory: { dining: 1, travel: 5, groceries: 1, gas: 1, shopping: 1, entertainment: 1, utilities: 1, other: 1 },
            transferPartners: ["delta", "british", "airfrance", "singapore", "ana", "cathay", "virgin", "qantas", "jetblue", "emirates", "hilton", "marriott"],
            notes: "5x flights booked directly with airlines or via Amex Travel. 1x everything else. Transfer 1:1 to 20+ airline & hotel partners. $200 airline fee credit (baggage, seat upgrades — select one airline/yr). $200 hotel credit (FHR/THC via Amex Travel). $15/mo Uber Cash ($35 in December = $200/yr). $100 Saks credit ($50 Jan-Jun, $50 Jul-Dec). $189 CLEAR Plus credit. $155 Walmart+ credit. $300 Equinox credit ($25/mo). Global Entry/TSA PreCheck every 4 years. Centurion Lounge access. Priority Pass Select. No foreign transaction fees. Comprehensive travel insurance, purchase protection ($10K), extended warranty, cell phone protection up to $800.",
            rewards: [
                { name: "Uber Cash Credits", amount: 15, recurrence: { type: "monthly" }, description: "$15/mo in Uber Cash ($35 in December = $200/yr total)" },
                { name: "Uber Cash December Bonus", amount: 20, recurrence: { type: "yearly" }, description: "Extra $20 Uber Cash in December (on top of monthly $15)" },
                { name: "$200 Hotel Credit", amount: 200, recurrence: { type: "yearly" }, description: "$200 annual credit for prepaid Fine Hotels+Resorts or The Hotel Collection bookings via Amex Travel" },
                { name: "$200 Airline Fee Credit", amount: 200, recurrence: { type: "yearly" }, description: "$200 airline incidental fee credit (bags, seat upgrades, lounge passes) for one selected airline per calendar year" },
                { name: "$189 CLEAR Plus Credit", amount: 189, recurrence: { type: "yearly" }, description: "Up to $189 statement credit for CLEAR Plus membership" },
                { name: "$155 Walmart+ Credit", amount: 155, recurrence: { type: "yearly" }, description: "Up to $155/yr ($12.95/mo) statement credit for Walmart+ membership" },
                { name: "Global Entry/TSA PreCheck", amount: 100, recurrence: { type: "custom", interval: 4, unit: "year" }, description: "Up to $100 credit for Global Entry ($100) or TSA PreCheck ($78) application fee every 4 years" },
                { name: "$100 Saks Credit", amount: 50, recurrence: { type: "half-yearly" }, description: "$50 Saks Fifth Avenue credit Jan-Jun and $50 Jul-Dec ($100/yr)" },
                { name: "Centurion Lounge Access", amount: 0, recurrence: { type: "yearly" }, description: "Complimentary access to American Express Centurion Lounges worldwide plus 2 guests" },
                { name: "$300 Equinox Credit", amount: 25, recurrence: { type: "monthly" }, description: "Up to $25/mo toward Equinox+ digital fitness or Equinox gym memberships ($300/yr)" }
            ]
        },
        {
            name: "Amex Gold",
            issuer: "amex",
            network: "Amex",
            annualFee: 325,
            signupBonus: "60,000 Membership Rewards points after spending $6,000 in the first 6 months",
            rewardsType: "points",
            pointValue: 2.0,
            foreignTransactionFee: false,
            creditNeeded: "good",
            cardType: "personal",
            cashbackByCategory: { dining: 4, groceries: 4, travel: 3, gas: 1, shopping: 1, entertainment: 1, utilities: 1, other: 1 },
            transferPartners: ["delta", "british", "airfrance", "singapore", "ana", "cathay", "virgin", "qantas", "jetblue", "emirates", "hilton", "marriott"],
            notes: "4x restaurants worldwide & US supermarkets (up to $25K/yr, then 1x). 3x flights booked directly with airlines or via Amex Travel. 1x everything else. Transfer 1:1 to 20+ partners. $10/mo Uber Cash ($120/yr). $10/mo dining credit at Grubhub, Seamless, The Cheesecake Factory, Goldbelly, Wine.com, Milk Bar + select Resy restaurants ($120/yr). $7/mo Dunkin' credit ($84/yr). $100 annual hotel credit for 2+ night stays booked via Amex Travel. No foreign transaction fees. Purchase protection, return protection, extended warranty.",
            rewards: [
                { name: "Uber Cash Credits", amount: 10, recurrence: { type: "monthly" }, description: "$10/mo Uber Cash for Uber Eats or Uber rides ($120/yr)" },
                { name: "Dining Credit", amount: 10, recurrence: { type: "monthly" }, description: "$10/mo at Grubhub, Seamless, Cheesecake Factory, Goldbelly, Wine.com, Milk Bar + select Resy restaurants ($120/yr)" },
                { name: "$100 Hotel Credit", amount: 100, recurrence: { type: "yearly" }, description: "$100 annual hotel credit for 2+ night prepaid stays booked through Amex Travel" },
                { name: "Dunkin' Credit", amount: 7, recurrence: { type: "monthly" }, description: "$7/mo Dunkin' statement credit ($84/yr)" }
            ]
        },
        {
            name: "Amex Green",
            issuer: "amex",
            network: "Amex",
            annualFee: 150,
            signupBonus: "40,000 Membership Rewards points after spending $3,000 in the first 6 months",
            rewardsType: "points",
            pointValue: 2.0,
            foreignTransactionFee: false,
            creditNeeded: "good",
            cardType: "personal",
            cashbackByCategory: { dining: 3, groceries: 1, travel: 3, gas: 1, shopping: 1, entertainment: 1, utilities: 1, other: 1 },
            transferPartners: ["delta", "british", "airfrance", "singapore", "ana", "cathay", "virgin", "qantas", "jetblue", "emirates", "hilton", "marriott"],
            notes: "3x travel (flights, hotels, transit, taxis, ride-hails, tolls, parking, cruises). 3x restaurants worldwide. 1x everything else. Transfer 1:1 to 20+ partners. $189 CLEAR Plus credit. Up to $100/yr in LoungeBuddy airport lounge access. No foreign transaction fees. Trip delay & cancellation insurance, baggage insurance, car rental loss & damage insurance. Purchase protection.",
            rewards: [
                { name: "$189 CLEAR Plus Credit", amount: 189, recurrence: { type: "yearly" }, description: "Up to $189 statement credit for CLEAR Plus membership" },
                { name: "$100 LoungeBuddy Credit", amount: 100, recurrence: { type: "yearly" }, description: "Up to $100/yr in LoungeBuddy airport lounge purchases" }
            ]
        },
        {
            name: "Amex Blue Cash Preferred",
            issuer: "amex",
            network: "Amex",
            annualFee: 95,
            signupBonus: "$250 statement credit after spending $3,000 in the first 6 months",
            rewardsType: "cashback",
            pointValue: 1.0,
            foreignTransactionFee: true,
            creditNeeded: "good",
            cardType: "personal",
            cashbackByCategory: { dining: 6, groceries: 6, travel: 3, gas: 3, shopping: 1, entertainment: 6, utilities: 1, other: 1 },
            transferPartners: [],
            notes: "6% at US supermarkets (up to $6K/yr, then 1%). 6% on select US streaming subscriptions (Disney+, Hulu, ESPN+, HBO Max, Peacock, Paramount+, etc.). 3% transit & US gas stations. 1% everything else. $84/yr Disney Bundle credit ($7/mo). 0% intro APR for 12 months on purchases and balance transfers. Plan It feature for large purchase payments. Return protection, purchase protection, extended warranty. Charges 2.7% foreign transaction fee.",
            rewards: [
                { name: "Disney Bundle Credit", amount: 7, recurrence: { type: "monthly" }, description: "Up to $7/mo statement credit for Disney Bundle (Disney+, Hulu, ESPN+) — $84/yr" }
            ]
        },
        {
            name: "Amex Blue Cash Everyday",
            issuer: "amex",
            network: "Amex",
            annualFee: 0,
            signupBonus: "$200 statement credit after spending $2,000 in the first 6 months",
            rewardsType: "cashback",
            pointValue: 1.0,
            foreignTransactionFee: true,
            creditNeeded: "good",
            cardType: "personal",
            cashbackByCategory: { dining: 3, groceries: 3, travel: 1, gas: 3, shopping: 1, entertainment: 1, utilities: 1, other: 1 },
            transferPartners: [],
            notes: "3% US supermarkets (up to $6K/yr, then 1%). 3% US gas stations. 3% US online retail purchases. 1% everything else. No annual fee. 0% intro APR for 15 months on purchases and balance transfers. Plan It feature. Return protection, purchase protection, extended warranty. Charges 2.7% foreign transaction fee.",
            rewards: []
        },
        {
            name: "Amex Delta SkyMiles Gold",
            issuer: "amex",
            network: "Amex",
            annualFee: 150,
            signupBonus: "40,000 Delta miles + $200 statement credit after spending $3,000 in first 6 months",
            rewardsType: "miles",
            pointValue: 1.2,
            foreignTransactionFee: false,
            creditNeeded: "good",
            cardType: "personal",
            cashbackByCategory: { dining: 2, groceries: 2, travel: 2, gas: 1, shopping: 1, entertainment: 1, utilities: 1, other: 1 },
            transferPartners: ["delta"],
            notes: "2x Delta purchases, restaurants, US supermarkets. 1x everything else. First checked bag free on Delta (saves $35+ each way) for you and up to 8 companions. 20% back on in-flight Delta purchases. Zone 1 priority boarding. $200 Delta flight credit after spending $10K+/yr. No foreign transaction fees.",
            rewards: [
                { name: "Delta First Checked Bag Free", amount: 0, recurrence: { type: "yearly" }, description: "First checked bag free on Delta for cardholder + up to 8 companions on same reservation" },
                { name: "$200 Delta Credit (spend $10K)", amount: 200, recurrence: { type: "yearly" }, description: "$200 Delta flight statement credit after spending $10,000+ in a calendar year" }
            ]
        },
        {
            name: "Amex Delta SkyMiles Platinum",
            issuer: "amex",
            network: "Amex",
            annualFee: 350,
            signupBonus: "50,000 Delta miles + $200 credit after spending $4,000 in the first 6 months",
            rewardsType: "miles",
            pointValue: 1.2,
            foreignTransactionFee: false,
            creditNeeded: "good",
            cardType: "personal",
            cashbackByCategory: { dining: 1, groceries: 1, travel: 3, gas: 1, shopping: 1, entertainment: 1, utilities: 1, other: 1 },
            transferPartners: ["delta"],
            notes: "3x Delta purchases & hotels. 1x everything else. Companion Certificate (main cabin round-trip domestic) after spending $25K+/yr. First checked bag free. Zone 1 priority boarding. 20% back on in-flight purchases. No foreign transaction fees. Global Entry/TSA PreCheck credit every 4.5 years. Delta SkyClub day passes at reduced price.",
            rewards: [
                { name: "Delta Companion Certificate", amount: 0, recurrence: { type: "yearly" }, description: "Round-trip domestic companion certificate (main cabin) after spending $25,000+ in a calendar year" },
                { name: "Delta First Checked Bag Free", amount: 0, recurrence: { type: "yearly" }, description: "First checked bag free on Delta for cardholder and companions" },
                { name: "Global Entry/TSA PreCheck", amount: 100, recurrence: { type: "custom", interval: 4, unit: "year" }, description: "Up to $100 credit for Global Entry or TSA PreCheck every 4 years" }
            ]
        },
        {
            name: "Amex Hilton Honors",
            issuer: "amex",
            network: "Amex",
            annualFee: 0,
            signupBonus: "80,000 Hilton points after spending $2,000 in the first 6 months",
            rewardsType: "points",
            pointValue: 0.5,
            foreignTransactionFee: false,
            creditNeeded: "good",
            cardType: "personal",
            cashbackByCategory: { dining: 5, groceries: 5, travel: 7, gas: 5, shopping: 3, entertainment: 3, utilities: 3, other: 3 },
            transferPartners: ["hilton"],
            notes: "7x Hilton hotels. 5x US restaurants, US supermarkets, US gas stations. 3x everything else. Points are Hilton Honors points. Automatic Hilton Silver status (5th night free on standard reward stays). No annual fee. No foreign transaction fees.",
            rewards: [
                { name: "Hilton Silver Status", amount: 0, recurrence: { type: "yearly" }, description: "Automatic Hilton Honors Silver status — 5th night free on standard reward stays" }
            ]
        },
        {
            name: "Amex Hilton Honors Surpass",
            issuer: "amex",
            network: "Amex",
            annualFee: 150,
            signupBonus: "130,000 Hilton points after spending $3,000 in the first 6 months",
            rewardsType: "points",
            pointValue: 0.5,
            foreignTransactionFee: false,
            creditNeeded: "good",
            cardType: "personal",
            cashbackByCategory: { dining: 6, groceries: 6, travel: 12, gas: 6, shopping: 3, entertainment: 3, utilities: 3, other: 3 },
            transferPartners: ["hilton"],
            notes: "12x Hilton hotels. 6x US restaurants, US supermarkets, US gas stations. 3x everything else. Hilton Gold status (room upgrades, 80% points bonus, free breakfast at select brands, 5th night free). Free Weekend Night Reward after spending $15K/yr. 10 Priority Pass lounge visits/yr. No foreign transaction fees.",
            rewards: [
                { name: "Hilton Gold Status", amount: 0, recurrence: { type: "yearly" }, description: "Automatic Hilton Gold status — room upgrades, 80% bonus points, free breakfast at select brands" },
                { name: "Hilton Free Night (spend $15K)", amount: 0, recurrence: { type: "yearly" }, description: "Free Weekend Night Reward certificate after spending $15,000 in a calendar year" },
                { name: "Priority Pass (10 visits)", amount: 0, recurrence: { type: "yearly" }, description: "10 complimentary Priority Pass Select lounge visits per year" }
            ]
        },
        {
            name: "Amex Hilton Honors Aspire",
            issuer: "amex",
            network: "Amex",
            annualFee: 550,
            signupBonus: "150,000 Hilton points after spending $6,000 in the first 6 months",
            rewardsType: "points",
            pointValue: 0.5,
            foreignTransactionFee: false,
            creditNeeded: "excellent",
            cardType: "personal",
            cashbackByCategory: { dining: 7, groceries: 7, travel: 14, gas: 7, shopping: 3, entertainment: 3, utilities: 3, other: 3 },
            transferPartners: ["hilton"],
            notes: "14x Hilton hotels. 7x US restaurants, US supermarkets, US gas stations. 3x everything else. Hilton Diamond status (top tier — suite upgrades, free breakfast, 100% bonus points, executive lounge). Free night at any Hilton each anniversary. $200 Hilton resort credit. $200 airline fee credit. Unlimited Priority Pass. $50 quarterly Hilton credit ($200/yr). No foreign transaction fees.",
            rewards: [
                { name: "Hilton Diamond Status", amount: 0, recurrence: { type: "yearly" }, description: "Automatic Hilton Diamond (top tier) — suite upgrades, free breakfast everywhere, executive lounge, 100% bonus points" },
                { name: "Hilton Free Night Award", amount: 0, recurrence: { type: "yearly" }, description: "One free night at any Hilton property worldwide each card anniversary (no point cap)" },
                { name: "$200 Hilton Resort Credit", amount: 200, recurrence: { type: "yearly" }, description: "$200 annual credit at Hilton resorts (spa, dining, activities)" },
                { name: "$200 Airline Fee Credit", amount: 200, recurrence: { type: "yearly" }, description: "$200 annual airline incidental fee credit for one selected airline" },
                { name: "Priority Pass Lounge Access", amount: 0, recurrence: { type: "yearly" }, description: "Unlimited Priority Pass Select lounge access" }
            ]
        },
        {
            name: "Amex Marriott Bonvoy Brilliant",
            issuer: "amex",
            network: "Amex",
            annualFee: 650,
            signupBonus: "185,000 Marriott points after spending $6,000 in the first 6 months",
            rewardsType: "points",
            pointValue: 0.7,
            foreignTransactionFee: false,
            creditNeeded: "excellent",
            cardType: "personal",
            cashbackByCategory: { dining: 3, groceries: 1, travel: 6, gas: 1, shopping: 1, entertainment: 1, utilities: 1, other: 1 },
            transferPartners: ["marriott"],
            notes: "6x Marriott hotels. 3x flights booked directly & US restaurants. 2x everything else. Marriott Platinum Elite status (lounge access, 50% bonus points, suite upgrades, 4pm late checkout). $25/mo Marriott dining credit ($300/yr). Free night certificate up to 85,000 points/yr. Unlimited Priority Pass. Global Entry/TSA PreCheck every 4 years. No foreign transaction fees. $100 Marriott property credit per stay (FHR-enrolled).",
            rewards: [
                { name: "Marriott Dining Credit", amount: 25, recurrence: { type: "monthly" }, description: "$25/mo credit at participating Marriott restaurants ($300/yr)" },
                { name: "Marriott Free Night (85K)", amount: 0, recurrence: { type: "yearly" }, description: "Annual free night certificate usable at properties up to 85,000 Marriott Bonvoy points" },
                { name: "Marriott Platinum Elite", amount: 0, recurrence: { type: "yearly" }, description: "Automatic Platinum Elite — lounge access, suite upgrades, 50% bonus points, 4pm late checkout" },
                { name: "Priority Pass Lounge Access", amount: 0, recurrence: { type: "yearly" }, description: "Unlimited Priority Pass Select lounge visits" },
                { name: "Global Entry/TSA PreCheck", amount: 100, recurrence: { type: "custom", interval: 4, unit: "year" }, description: "Up to $100 Global Entry or TSA PreCheck credit every 4 years" }
            ]
        },
        {
            name: "Amex Marriott Bonvoy Bevy",
            issuer: "amex",
            network: "Amex",
            annualFee: 250,
            signupBonus: "85,000 Marriott points after spending $4,000 in the first 6 months",
            rewardsType: "points",
            pointValue: 0.7,
            foreignTransactionFee: false,
            creditNeeded: "good",
            cardType: "personal",
            cashbackByCategory: { dining: 4, groceries: 1, travel: 6, gas: 1, shopping: 1, entertainment: 1, utilities: 1, other: 1 },
            transferPartners: ["marriott"],
            notes: "6x Marriott hotels. 4x US restaurants. 2x everything else. Marriott Gold Elite status (25% bonus points, 2pm late checkout, room upgrades). Free night certificate up to 50,000 points each anniversary. 15 elite night credits/yr. No foreign transaction fees.",
            rewards: [
                { name: "Marriott Free Night (50K)", amount: 0, recurrence: { type: "yearly" }, description: "Annual free night certificate up to 50,000 Marriott Bonvoy points" },
                { name: "Marriott Gold Elite", amount: 0, recurrence: { type: "yearly" }, description: "Automatic Gold Elite — 25% bonus points, 2pm late checkout, room upgrades when available" }
            ]
        },
        {
            name: "Amex Business Platinum",
            issuer: "amex",
            network: "Amex",
            annualFee: 695,
            signupBonus: "120,000 Membership Rewards points after spending $15,000 in the first 3 months",
            rewardsType: "points",
            pointValue: 2.0,
            foreignTransactionFee: false,
            creditNeeded: "excellent",
            cardType: "business",
            cashbackByCategory: { dining: 1, groceries: 1, travel: 5, gas: 1, shopping: 1.5, entertainment: 1, utilities: 1, other: 1 },
            transferPartners: ["delta", "british", "airfrance", "singapore", "ana", "cathay", "virgin", "qantas", "jetblue", "emirates", "hilton", "marriott"],
            notes: "5x flights & prepaid hotels booked on amextravel.com. 1.5x on purchases $5,000+ (up to 2M pts/yr). 1x everything else. $200 annual airline fee credit. $200 Dell Technologies credit ($100 semi-annually). $150 Adobe Creative Cloud credit/yr. $10/mo wireless telephone credit ($120/yr). Centurion Lounge access. 35% points rebate on Pay with Points for premium business/first class flights via Amex Travel. No foreign transaction fees.",
            rewards: [
                { name: "$200 Airline Fee Credit", amount: 200, recurrence: { type: "yearly" }, description: "Annual airline incidental fee credit for one selected airline" },
                { name: "$200 Dell Credit", amount: 100, recurrence: { type: "half-yearly" }, description: "$100 Dell credit Jan-Jun and $100 Jul-Dec ($200/yr)" },
                { name: "$150 Adobe Credit", amount: 150, recurrence: { type: "yearly" }, description: "Up to $150/yr statement credit for Adobe Creative Cloud" },
                { name: "Wireless Credit", amount: 10, recurrence: { type: "monthly" }, description: "$10/mo wireless telephone statement credit ($120/yr)" },
                { name: "Centurion Lounge Access", amount: 0, recurrence: { type: "yearly" }, description: "Complimentary Centurion Lounge access for cardholder + 2 guests" },
                { name: "Global Entry/TSA PreCheck", amount: 100, recurrence: { type: "custom", interval: 4, unit: "year" }, description: "Up to $100 Global Entry or TSA PreCheck credit every 4 years" }
            ]
        },
        {
            name: "Amex Business Gold",
            issuer: "amex",
            network: "Amex",
            annualFee: 375,
            signupBonus: "70,000 Membership Rewards points after spending $10,000 in the first 3 months",
            rewardsType: "points",
            pointValue: 2.0,
            foreignTransactionFee: false,
            creditNeeded: "good",
            cardType: "business",
            cashbackByCategory: { dining: 4, groceries: 4, travel: 4, gas: 4, shopping: 4, entertainment: 1, utilities: 1, other: 1 },
            transferPartners: ["delta", "british", "airfrance", "singapore", "ana", "cathay", "virgin", "qantas", "jetblue", "emirates", "hilton", "marriott"],
            notes: "4x on top 2 spending categories each billing cycle from: airfare, advertising, gas, shipping, computer hardware/software/cloud, dining (up to $150K/yr combined, then 1x). 1x everything else. $20/mo wireless telephone credit ($240/yr). Transfer 1:1 to partners. No foreign transaction fees. Purchase protection, extended warranty, car rental loss & damage.",
            rewards: [
                { name: "Wireless Credit", amount: 20, recurrence: { type: "monthly" }, description: "$20/mo wireless telephone statement credit ($240/yr)" }
            ]
        },

        // ==================== Capital One ====================
        {
            name: "Capital One Venture X",
            issuer: "capitalone",
            network: "Visa",
            annualFee: 395,
            signupBonus: "75,000 miles after spending $4,000 in the first 3 months",
            rewardsType: "miles",
            pointValue: 1.0,
            foreignTransactionFee: false,
            creditNeeded: "excellent",
            cardType: "personal",
            cashbackByCategory: { dining: 2, groceries: 2, travel: 10, gas: 2, shopping: 2, entertainment: 2, utilities: 2, other: 2 },
            transferPartners: ["united", "british", "airfrance", "singapore", "cathay", "virgin", "qantas", "ana", "emirates", "jetblue", "marriott", "hyatt", "wyndham", "choice"],
            notes: "10x hotels & rental cars booked via Capital One Travel. 5x flights booked via Capital One Travel. 2x everything else. $300 annual travel credit (auto-applied to Capital One Travel bookings). 10,000 bonus miles each anniversary ($100+ value). Transfer 1:1 to 15+ airline & hotel partners. Capital One Lounge & Plaza Premium access. Unlimited Priority Pass for cardholder + 2 guests. Global Entry/TSA PreCheck every 4 years. No foreign transaction fees. Primary rental car coverage, trip cancellation, trip delay, lost luggage. Visa Infinite benefits. Cell phone protection up to $800.",
            rewards: [
                { name: "$300 Travel Credit", amount: 300, recurrence: { type: "yearly" }, description: "$300 annual travel credit for Capital One Travel portal bookings (auto-applied)" },
                { name: "10,000 Anniversary Miles", amount: 0, recurrence: { type: "yearly" }, description: "10,000 bonus miles every card anniversary (worth $100+ via transfer)" },
                { name: "Priority Pass Lounge Access", amount: 0, recurrence: { type: "yearly" }, description: "Unlimited Priority Pass lounge access for cardholder and 2 guests" },
                { name: "Capital One Lounge Access", amount: 0, recurrence: { type: "yearly" }, description: "Complimentary Capital One Lounge + Plaza Premium lounge access" },
                { name: "Global Entry/TSA PreCheck", amount: 100, recurrence: { type: "custom", interval: 4, unit: "year" }, description: "Up to $100 Global Entry or TSA PreCheck credit every 4 years" }
            ]
        },
        {
            name: "Capital One Venture",
            issuer: "capitalone",
            network: "Visa",
            annualFee: 95,
            signupBonus: "75,000 miles after spending $4,000 in the first 3 months",
            rewardsType: "miles",
            pointValue: 1.0,
            foreignTransactionFee: false,
            creditNeeded: "good",
            cardType: "personal",
            cashbackByCategory: { dining: 2, groceries: 2, travel: 5, gas: 2, shopping: 2, entertainment: 2, utilities: 2, other: 2 },
            transferPartners: ["united", "british", "airfrance", "singapore", "cathay", "virgin", "qantas", "ana", "emirates", "jetblue", "marriott", "hyatt", "wyndham", "choice"],
            notes: "5x hotels & rental cars booked via Capital One Travel. 2x everything else. Transfer 1:1 to 15+ airline & hotel partners. Global Entry/TSA PreCheck credit. No foreign transaction fees. Travel accident insurance, auto rental collision damage waiver, travel assistance. Visa Signature benefits.",
            rewards: [
                { name: "Global Entry/TSA PreCheck", amount: 100, recurrence: { type: "custom", interval: 4, unit: "year" }, description: "Up to $100 Global Entry or TSA PreCheck credit every 4 years" }
            ]
        },
        {
            name: "Capital One VentureOne",
            issuer: "capitalone",
            network: "Visa",
            annualFee: 0,
            signupBonus: "20,000 miles after spending $500 in the first 3 months",
            rewardsType: "miles",
            pointValue: 1.0,
            foreignTransactionFee: false,
            creditNeeded: "good",
            cardType: "personal",
            cashbackByCategory: { dining: 1.25, groceries: 1.25, travel: 5, gas: 1.25, shopping: 1.25, entertainment: 1.25, utilities: 1.25, other: 1.25 },
            transferPartners: ["united", "british", "airfrance", "singapore", "cathay", "virgin", "qantas", "ana", "emirates", "jetblue", "marriott", "hyatt", "wyndham", "choice"],
            notes: "5x hotels & cars via Capital One Travel. 1.25x everything else. No annual fee. Transfer to 15+ partners. No foreign transaction fees. 0% intro APR for 15 months on purchases. Great entry card with partner access.",
            rewards: []
        },
        {
            name: "Capital One Savor",
            issuer: "capitalone",
            network: "Mastercard",
            annualFee: 95,
            signupBonus: "$300 cash bonus after spending $3,000 in the first 3 months",
            rewardsType: "cashback",
            pointValue: 1.0,
            foreignTransactionFee: false,
            creditNeeded: "good",
            cardType: "personal",
            cashbackByCategory: { dining: 4, groceries: 3, travel: 1, gas: 1, shopping: 1, entertainment: 4, utilities: 1, other: 1 },
            transferPartners: [],
            notes: "4% dining & entertainment. 3% groceries. 1% everything else. No foreign transaction fees. Mastercard World Elite benefits — cell phone protection, Lyft credits, ShopRunner membership. Extended warranty, purchase protection.",
            rewards: []
        },
        {
            name: "Capital One SavorOne",
            issuer: "capitalone",
            network: "Visa",
            annualFee: 0,
            signupBonus: "$200 cash bonus after spending $500 in the first 3 months",
            rewardsType: "cashback",
            pointValue: 1.0,
            foreignTransactionFee: false,
            creditNeeded: "good",
            cardType: "personal",
            cashbackByCategory: { dining: 3, groceries: 3, travel: 5, gas: 1, shopping: 1, entertainment: 3, utilities: 1, other: 1 },
            transferPartners: [],
            notes: "5% hotels & rental cars via Capital One Travel. 3% dining, entertainment, popular streaming, groceries. 1% everything else. No annual fee. No foreign transaction fees. 0% intro APR for 15 months on purchases and balance transfers.",
            rewards: []
        },
        {
            name: "Capital One Quicksilver",
            issuer: "capitalone",
            network: "Visa",
            annualFee: 0,
            signupBonus: "$200 cash bonus after spending $500 in the first 3 months",
            rewardsType: "cashback",
            pointValue: 1.0,
            foreignTransactionFee: false,
            creditNeeded: "good",
            cardType: "personal",
            cashbackByCategory: { dining: 1.5, groceries: 1.5, travel: 1.5, gas: 1.5, shopping: 1.5, entertainment: 1.5, utilities: 1.5, other: 1.5 },
            transferPartners: [],
            notes: "Flat 1.5% cash back on everything. No annual fee. No foreign transaction fees. 0% intro APR for 15 months on purchases and balance transfers. Simple, no-category-tracking rewards. Travel accident insurance.",
            rewards: []
        },
        {
            name: "Capital One Spark Cash Plus",
            issuer: "capitalone",
            network: "Mastercard",
            annualFee: 150,
            signupBonus: "$1,200 cash bonus — $500 after spending $5K in first 3 months + $500 after $50K in first 6 months",
            rewardsType: "cashback",
            pointValue: 1.0,
            foreignTransactionFee: false,
            creditNeeded: "excellent",
            cardType: "business",
            cashbackByCategory: { dining: 2, groceries: 2, travel: 2, gas: 2, shopping: 2, entertainment: 2, utilities: 2, other: 2 },
            transferPartners: [],
            notes: "Flat 2% cash back on everything with no cap. $200 annual cash bonus when spending $200,000+ in a year. Business charge card (must pay in full). No foreign transaction fees. No pre-set spending limit. Free employee cards. Rental car insurance, purchase protection.",
            rewards: [
                { name: "$200 Spend Bonus", amount: 200, recurrence: { type: "yearly" }, description: "$200 cash bonus when you spend $200,000+ in a calendar year" }
            ]
        },

        // ==================== Citi ====================
        {
            name: "Citi Strata Premier",
            issuer: "citi",
            network: "Mastercard",
            annualFee: 95,
            signupBonus: "75,000 ThankYou points after spending $4,000 in the first 3 months",
            rewardsType: "points",
            pointValue: 1.0,
            foreignTransactionFee: false,
            creditNeeded: "good",
            cardType: "personal",
            cashbackByCategory: { dining: 3, groceries: 3, travel: 3, gas: 3, shopping: 1, entertainment: 1, utilities: 1, other: 1 },
            transferPartners: ["singapore", "cathay", "virgin", "qantas", "jetblue", "airfrance", "emirates", "ana"],
            notes: "3x travel (air, hotels, cruise, car rental, travel agencies). 3x dining, supermarkets, gas, EV charging. 1x everything else. Transfer 1:1 to airline partners. $100 annual hotel savings benefit (hotels.com/citi bookings of $500+). No foreign transaction fees. Trip interruption, trip delay, baggage delay, rental car damage waiver. Mastercard World Elite benefits — cell phone protection up to $600.",
            rewards: [
                { name: "$100 Hotel Credit", amount: 100, recurrence: { type: "yearly" }, description: "$100 annual savings on hotel bookings of $500+ through thankyou.com or hotels.com/citi" }
            ]
        },
        {
            name: "Citi Double Cash",
            issuer: "citi",
            network: "Mastercard",
            annualFee: 0,
            signupBonus: "$200 cash back after spending $1,500 in the first 6 months",
            rewardsType: "cashback",
            pointValue: 1.0,
            foreignTransactionFee: true,
            creditNeeded: "good",
            cardType: "personal",
            cashbackByCategory: { dining: 2, groceries: 2, travel: 2, gas: 2, shopping: 2, entertainment: 2, utilities: 2, other: 2 },
            transferPartners: [],
            notes: "Flat 2% on everything — 1% when you buy + 1% when you pay. No annual fee. Can convert to ThankYou points if you also have a Citi Premier/Custom Cash. 0% intro APR for 18 months on balance transfers. Mastercard World Elite benefits. Citi Entertainment access. Charges 3% foreign transaction fee.",
            rewards: []
        },
        {
            name: "Citi Custom Cash",
            issuer: "citi",
            network: "Mastercard",
            annualFee: 0,
            signupBonus: "$200 cash back after spending $1,500 in the first 6 months",
            rewardsType: "cashback",
            pointValue: 1.0,
            foreignTransactionFee: true,
            creditNeeded: "good",
            cardType: "personal",
            cashbackByCategory: { dining: 5, groceries: 5, travel: 5, gas: 5, shopping: 5, entertainment: 5, utilities: 5, other: 1 },
            transferPartners: [],
            notes: "5% on your top eligible spend category each billing cycle (up to $500 in purchases, then 1%). Categories: restaurants, gas, groceries, select travel, transit, streaming, drugstores, fitness, live entertainment & home improvement. 1% everything else. No annual fee. Auto-detects top category. 0% intro APR for 15 months on purchases and balance transfers. Can convert to ThankYou points. Charges 3% foreign transaction fee.",
            rewards: []
        },
        {
            name: "Citi / AAdvantage Platinum Select",
            issuer: "citi",
            network: "Mastercard",
            annualFee: 99,
            signupBonus: "50,000 AAdvantage miles after spending $2,500 in the first 3 months",
            rewardsType: "miles",
            pointValue: 1.2,
            foreignTransactionFee: false,
            creditNeeded: "good",
            cardType: "personal",
            cashbackByCategory: { dining: 2, groceries: 1, travel: 2, gas: 2, shopping: 1, entertainment: 1, utilities: 1, other: 1 },
            transferPartners: ["american"],
            notes: "2x American Airlines purchases, restaurants, gas, cable/satellite/streaming. 1x everything else. First checked bag free on AA domestic (saves $35+). Preferred boarding Group 5. 25% savings on AA in-flight food/drinks. $125 AA flight discount on round-trips $250+ after spending $20K+/yr. No foreign transaction fees. Reduced companion domestic fare. Citi Entertainment access.",
            rewards: [
                { name: "AA First Checked Bag Free", amount: 0, recurrence: { type: "yearly" }, description: "First checked bag free on AA domestic for cardholder and up to 4 companions" },
                { name: "$125 AA Flight Discount", amount: 125, recurrence: { type: "yearly" }, description: "$125 off an AA round-trip flight of $250+ after spending $20,000+ in a year" }
            ]
        },

        // ==================== Discover ====================
        {
            name: "Discover it Cash Back",
            issuer: "discover",
            network: "Discover",
            annualFee: 0,
            signupBonus: "Cashback Match: all cash back earned in Year 1 automatically matched (effectively doubled)",
            rewardsType: "cashback",
            pointValue: 1.0,
            foreignTransactionFee: false,
            creditNeeded: "good",
            cardType: "personal",
            cashbackByCategory: { dining: 1, groceries: 1, travel: 1, gas: 1, shopping: 1, entertainment: 1, utilities: 1, other: 1 },
            transferPartners: [],
            notes: "5% rotating quarterly categories (up to $1,500/qtr — must activate each quarter; past categories include groceries, gas, Amazon, dining, PayPal, Target, Walmart). 1% everything else. No annual fee. No foreign transaction fees. Cashback Match automatically doubles ALL cash back in Year 1 — best first-year value of any no-fee card. Free FICO score. $0 fraud liability. No late fee on first late payment. Accepted at 99%+ of US merchants.",
            rewards: [
                { name: "Cashback Match (Year 1)", amount: 0, recurrence: { type: "yearly" }, description: "Discover automatically matches all cash back earned in first year — effectively 10%/2% earning" }
            ]
        },
        {
            name: "Discover it Miles",
            issuer: "discover",
            network: "Discover",
            annualFee: 0,
            signupBonus: "Miles Match: all miles earned in Year 1 automatically matched",
            rewardsType: "miles",
            pointValue: 1.0,
            foreignTransactionFee: false,
            creditNeeded: "good",
            cardType: "personal",
            cashbackByCategory: { dining: 1.5, groceries: 1.5, travel: 1.5, gas: 1.5, shopping: 1.5, entertainment: 1.5, utilities: 1.5, other: 1.5 },
            transferPartners: [],
            notes: "Flat 1.5x miles on everything (effectively 3x in Year 1 with Miles Match). No annual fee. No foreign transaction fees. Free FICO score. Miles = cash back (1 mile = 1 cent). Auto-redeem available. Good flat-rate card with no annual fee.",
            rewards: [
                { name: "Miles Match (Year 1)", amount: 0, recurrence: { type: "yearly" }, description: "Discover matches all miles earned in first year (effectively 3x on everything)" }
            ]
        },

        // ==================== Wells Fargo ====================
        {
            name: "Wells Fargo Active Cash",
            issuer: "wellsfargo",
            network: "Visa",
            annualFee: 0,
            signupBonus: "$200 cash rewards bonus after spending $500 in the first 3 months",
            rewardsType: "cashback",
            pointValue: 1.0,
            foreignTransactionFee: true,
            creditNeeded: "good",
            cardType: "personal",
            cashbackByCategory: { dining: 2, groceries: 2, travel: 2, gas: 2, shopping: 2, entertainment: 2, utilities: 2, other: 2 },
            transferPartners: [],
            notes: "Flat 2% cash rewards on all purchases with no caps. No annual fee. 0% intro APR for 15 months on purchases and qualifying balance transfers. Cell phone protection up to $600 (pay bill with card). Visa Signature benefits — rental car insurance, roadside dispatch, concierge. Charges 3% foreign transaction fee.",
            rewards: []
        },
        {
            name: "Wells Fargo Autograph",
            issuer: "wellsfargo",
            network: "Visa",
            annualFee: 0,
            signupBonus: "20,000 bonus points after spending $1,000 in the first 3 months",
            rewardsType: "points",
            pointValue: 1.0,
            foreignTransactionFee: true,
            creditNeeded: "good",
            cardType: "personal",
            cashbackByCategory: { dining: 3, groceries: 1, travel: 3, gas: 3, shopping: 1, entertainment: 1, utilities: 1, other: 1 },
            transferPartners: [],
            notes: "3x restaurants, travel, gas, transit, popular streaming, phone plans. 1x everything else. No annual fee. 0% intro APR for 12 months on purchases. Cell phone protection up to $600. Visa Signature benefits. Points worth more when paired with Autograph Journey. Charges 3% foreign transaction fee.",
            rewards: []
        },
        {
            name: "Wells Fargo Autograph Journey",
            issuer: "wellsfargo",
            network: "Visa",
            annualFee: 95,
            signupBonus: "60,000 bonus points after spending $4,000 in the first 3 months",
            rewardsType: "points",
            pointValue: 1.0,
            foreignTransactionFee: false,
            creditNeeded: "good",
            cardType: "personal",
            cashbackByCategory: { dining: 3, groceries: 1, travel: 5, gas: 1, shopping: 1, entertainment: 1, utilities: 1, other: 1 },
            transferPartners: ["united", "british", "airfrance", "virgin", "qantas", "ihg", "choice"],
            notes: "5x hotels & flights booked directly. 4x other travel & dining. 1x everything else. Transfer 1:1 to airline & hotel partners (United, British Airways, Air France/KLM, Virgin, Qantas, IHG, Choice). $50 annual airline credit. No foreign transaction fees. Cell phone protection up to $800. Trip cancellation, baggage delay, rental car insurance. Visa Infinite benefits.",
            rewards: [
                { name: "$50 Airline Credit", amount: 50, recurrence: { type: "yearly" }, description: "$50 annual airline purchasing credit (auto-applied to qualifying airline purchases)" }
            ]
        },

        // ==================== US Bank ====================
        {
            name: "US Bank Altitude Connect",
            issuer: "usbank",
            network: "Visa",
            annualFee: 95,
            signupBonus: "50,000 points after spending $2,000 in the first 120 days",
            rewardsType: "points",
            pointValue: 1.0,
            foreignTransactionFee: false,
            creditNeeded: "good",
            cardType: "personal",
            cashbackByCategory: { dining: 4, groceries: 2, travel: 4, gas: 2, shopping: 1, entertainment: 1, utilities: 1, other: 1 },
            transferPartners: [],
            notes: "4x dining & travel. 2x grocery stores, gas stations, EV charging. 1x everything else. No foreign transaction fees. Annual $30 streaming credit. Visa Signature benefits — rental car insurance, travel assistance. Purchase protection, extended warranty.",
            rewards: [
                { name: "$30 Streaming Credit", amount: 30, recurrence: { type: "yearly" }, description: "Annual $30 streaming service statement credit" }
            ]
        },
        {
            name: "US Bank Altitude Reserve",
            issuer: "usbank",
            network: "Visa",
            annualFee: 400,
            signupBonus: "50,000 points after spending $4,500 in the first 150 days",
            rewardsType: "points",
            pointValue: 1.5,
            foreignTransactionFee: false,
            creditNeeded: "excellent",
            cardType: "personal",
            cashbackByCategory: { dining: 3, groceries: 1, travel: 5, gas: 1, shopping: 1, entertainment: 1, utilities: 1, other: 1 },
            transferPartners: ["united", "british", "singapore", "ana", "airfrance", "virgin", "hyatt", "ihg"],
            notes: "5x travel and mobile wallet purchases (Apple Pay, Google Pay, Samsung Pay). 3x dining. 1x everything else. $325 annual travel & dining credit (auto-applied). Priority Pass Select lounge access. Transfer to airline & hotel partners. Global Entry/TSA PreCheck credit. No foreign transaction fees. 50% premium on points for travel via Real-Time Rewards. Visa Infinite benefits — primary rental car insurance, trip cancellation, Visa Infinite Concierge.",
            rewards: [
                { name: "$325 Travel & Dining Credit", amount: 325, recurrence: { type: "yearly" }, description: "$325 annual statement credit for eligible travel and dining purchases" },
                { name: "Priority Pass Lounge Access", amount: 0, recurrence: { type: "yearly" }, description: "Unlimited Priority Pass Select lounge access for cardholder" },
                { name: "Global Entry/TSA PreCheck", amount: 100, recurrence: { type: "custom", interval: 4, unit: "year" }, description: "Up to $100 Global Entry or TSA PreCheck credit every 4 years" }
            ]
        },
        {
            name: "US Bank Cash+",
            issuer: "usbank",
            network: "Visa",
            annualFee: 0,
            signupBonus: "$200 bonus after spending $1,000 in the first 120 days",
            rewardsType: "cashback",
            pointValue: 1.0,
            foreignTransactionFee: true,
            creditNeeded: "good",
            cardType: "personal",
            cashbackByCategory: { dining: 2, groceries: 2, travel: 1, gas: 2, shopping: 1, entertainment: 1, utilities: 5, other: 1 },
            transferPartners: [],
            notes: "5% on two categories you choose each quarter (up to $2,000 combined). Options include: home utilities, TV/internet/streaming, cell phone, gyms/fitness, gas, electric vehicle charging, ground transportation, department stores, furniture stores, fast food. 2% on one everyday category (groceries, gas, restaurants, or dining). 1% everything else. No annual fee. Charges 3% foreign transaction fee.",
            rewards: []
        },

        // ==================== Bank of America ====================
        {
            name: "Bank of America Customized Cash",
            issuer: "bofa",
            network: "Visa",
            annualFee: 0,
            signupBonus: "$200 online cash rewards bonus after spending $1,000 in the first 90 days",
            rewardsType: "cashback",
            pointValue: 1.0,
            foreignTransactionFee: true,
            creditNeeded: "good",
            cardType: "personal",
            cashbackByCategory: { dining: 3, groceries: 2, travel: 2, gas: 3, shopping: 2, entertainment: 2, utilities: 2, other: 1 },
            transferPartners: [],
            notes: "3% in a category of your choice (gas, online shopping, dining, travel, drug stores, home improvement/furnishings — up to $2,500/qtr combined, then 1%). 2% grocery stores & wholesale clubs (up to $2,500/qtr). 1% everything else. No annual fee. Can change choice category once per month. Preferred Rewards members earn 25-75% more. 0% intro APR for 15 billing cycles on purchases and balance transfers. Charges 3% foreign transaction fee.",
            rewards: []
        },
        {
            name: "Bank of America Unlimited Cash",
            issuer: "bofa",
            network: "Visa",
            annualFee: 0,
            signupBonus: "$200 online cash rewards bonus after spending $1,000 in the first 90 days",
            rewardsType: "cashback",
            pointValue: 1.0,
            foreignTransactionFee: true,
            creditNeeded: "good",
            cardType: "personal",
            cashbackByCategory: { dining: 1.5, groceries: 1.5, travel: 1.5, gas: 1.5, shopping: 1.5, entertainment: 1.5, utilities: 1.5, other: 1.5 },
            transferPartners: [],
            notes: "Flat 1.5% cash back on all purchases. No annual fee. Preferred Rewards members earn up to 2.625% on everything (75% boost). 0% intro APR for 15 billing cycles on purchases and balance transfers. Charges 3% foreign transaction fee.",
            rewards: []
        },
        {
            name: "Bank of America Premium Rewards",
            issuer: "bofa",
            network: "Visa",
            annualFee: 95,
            signupBonus: "60,000 points ($600 value) after spending $4,000 in the first 90 days",
            rewardsType: "points",
            pointValue: 1.0,
            foreignTransactionFee: false,
            creditNeeded: "excellent",
            cardType: "personal",
            cashbackByCategory: { dining: 3.5, groceries: 2, travel: 3.5, gas: 2, shopping: 2, entertainment: 2, utilities: 2, other: 2 },
            transferPartners: [],
            notes: "3.5x points on travel & dining (up to 2.62x with Preferred Rewards on non-bonus). 2x everything else. $100 annual airline incidentals credit (auto-applied). Global Entry/TSA PreCheck credit every 4 years. No foreign transaction fees. Preferred Rewards members earn up to 75% more on all points. Visa Infinite benefits — primary rental car insurance, trip cancellation, cell phone protection, Visa Infinite concierge.",
            rewards: [
                { name: "$100 Airline Incidentals Credit", amount: 100, recurrence: { type: "yearly" }, description: "$100 annual airline incidentals statement credit (auto-applied to baggage fees, seat upgrades, etc.)" },
                { name: "Global Entry/TSA PreCheck", amount: 100, recurrence: { type: "custom", interval: 4, unit: "year" }, description: "Up to $100 Global Entry or TSA PreCheck credit every 4 years" }
            ]
        },

        // ==================== Barclays ====================
        {
            name: "Barclays AAdvantage Aviator Red",
            issuer: "barclays",
            network: "Mastercard",
            annualFee: 99,
            signupBonus: "60,000 AAdvantage miles after first purchase and paying annual fee",
            rewardsType: "miles",
            pointValue: 1.2,
            foreignTransactionFee: false,
            creditNeeded: "good",
            cardType: "personal",
            cashbackByCategory: { dining: 2, groceries: 1, travel: 2, gas: 1, shopping: 1, entertainment: 1, utilities: 1, other: 1 },
            transferPartners: ["american"],
            notes: "2x American Airlines purchases. 1x everything else. Easiest airline signup bonus — only one purchase needed! First checked bag free on AA domestic for cardholder and up to 4 companions. Preferred boarding. 25% savings on AA in-flight food, drinks, WiFi. No foreign transaction fees. Mastercard World Elite benefits. Barclays travel insurance package.",
            rewards: [
                { name: "AA First Checked Bag Free", amount: 0, recurrence: { type: "yearly" }, description: "First checked bag free on AA domestic for cardholder and up to 4 companions on same reservation" }
            ]
        },
        {
            name: "Barclays JetBlue Plus",
            issuer: "barclays",
            network: "Mastercard",
            annualFee: 99,
            signupBonus: "80,000 TrueBlue points after spending $1,000 in the first 90 days",
            rewardsType: "points",
            pointValue: 1.3,
            foreignTransactionFee: false,
            creditNeeded: "good",
            cardType: "personal",
            cashbackByCategory: { dining: 2, groceries: 2, travel: 6, gas: 1, shopping: 1, entertainment: 1, utilities: 1, other: 1 },
            transferPartners: ["jetblue"],
            notes: "6x TrueBlue points on JetBlue purchases. 2x restaurants & grocery stores. 1x everything else. First checked bag free on JetBlue for cardholder and up to 3 companions. 50% off eligible JetBlue in-flight food, drinks, headsets. 10% of TrueBlue points back on JetBlue purchases. No foreign transaction fees. No blackout dates on JetBlue award flights. Mastercard World benefits.",
            rewards: [
                { name: "JetBlue First Checked Bag Free", amount: 0, recurrence: { type: "yearly" }, description: "First checked bag free on JetBlue for cardholder and up to 3 companions on same reservation" },
                { name: "50% JetBlue In-Flight Savings", amount: 0, recurrence: { type: "yearly" }, description: "50% off eligible JetBlue in-flight food, drinks, and headsets" }
            ]
        },
        {
            name: "Barclays Wyndham Rewards Earner Plus",
            issuer: "barclays",
            network: "Visa",
            annualFee: 75,
            signupBonus: "45,000 Wyndham points after spending $1,000 in the first 90 days",
            rewardsType: "points",
            pointValue: 1.1,
            foreignTransactionFee: false,
            creditNeeded: "good",
            cardType: "personal",
            cashbackByCategory: { dining: 2, groceries: 2, travel: 6, gas: 2, shopping: 1, entertainment: 1, utilities: 1, other: 1 },
            transferPartners: ["wyndham"],
            notes: "6x Wyndham properties. 2x dining, groceries, gas. 1x everything else. Automatic Wyndham Gold status (10% bonus points, early check-in, room upgrades when available). Points transfer 1:1 to Caesars Rewards. Free night certificates at 7,500-15,000 points. No foreign transaction fees.",
            rewards: [
                { name: "Wyndham Gold Status", amount: 0, recurrence: { type: "yearly" }, description: "Automatic Wyndham Rewards Gold status — 10% bonus points, early check-in, room upgrades when available" }
            ]
        },

        // ==================== Synchrony ====================
        {
            name: "Synchrony Cathay Pacific",
            issuer: "synchrony",
            network: "Visa",
            annualFee: 0,
            signupBonus: "20,000 Asia Miles after spending $1,000 in the first 3 months",
            rewardsType: "miles",
            pointValue: 1.0,
            foreignTransactionFee: true,
            creditNeeded: "good",
            cardType: "personal",
            cashbackByCategory: { dining: 2, groceries: 1, travel: 3, gas: 1, shopping: 1, entertainment: 1, utilities: 1, other: 1 },
            transferPartners: ["cathay"],
            notes: "3x Cathay Pacific & oneworld partner airlines. 2x dining. 1x everything else. Earn Asia Miles directly. No annual fee. Good for oneworld frequent flyers. Charges 3% foreign transaction fee.",
            rewards: []
        }
    ];

    /**
     * Search the database for cards matching a query string.
     * @param {string} query - The search string
     * @param {number} maxResults - Maximum number of results to return
     * @returns {Array} Matching card objects
     */
    function search(query, maxResults = 8) {
        if (!query || query.trim().length < 2) return [];

        const normalizedQuery = query.trim().toLowerCase();
        const words = normalizedQuery.split(/\s+/);

        const scored = cards.map(card => {
            const name = card.name.toLowerCase();
            const issuerName = (card.issuer || '').toLowerCase();
            const network = (card.network || '').toLowerCase();
            const cardType = (card.cardType || '').toLowerCase();
            let score = 0;

            if (name === normalizedQuery) {
                score = 100;
            } else if (name.startsWith(normalizedQuery)) {
                score = 80;
            } else if (words.every(w => name.includes(w))) {
                score = 60;
            } else {
                const searchText = `${name} ${issuerName} ${network} ${cardType}`;
                const matchedWords = words.filter(w => searchText.includes(w));
                if (matchedWords.length > 0) {
                    score = 20 + (matchedWords.length / words.length) * 30;
                }
            }

            return { card, score };
        });

        return scored
            .filter(s => s.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, maxResults)
            .map(s => s.card);
    }

    /**
     * Get a card by exact name
     * @param {string} name - Exact card name
     * @returns {Object|null} The card object or null
     */
    function getByName(name) {
        if (!name) return null;
        return cards.find(c => c.name.toLowerCase() === name.toLowerCase()) || null;
    }

    /**
     * Get all cards in the database
     * @returns {Array} All card objects
     */
    function getAll() {
        return [...cards];
    }

    return {
        search,
        getByName,
        getAll
    };
})();
