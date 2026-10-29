
const BASE_URL =
    "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

const form = document.getElementById("converter-form");
const amountInput = document.getElementById("amount");

const fromCurrency = document.getElementById("from-currency");
const toCurrency = document.getElementById("to-currency");

const fromFlag = document.getElementById("from-flag");
const toFlag = document.getElementById("to-flag");

const result = document.getElementById("result");
const rateInfo = document.getElementById("rate-info");
const errorMessage = document.getElementById("error-message");

const convertButton = document.getElementById("convert-button");
const swapButton = document.getElementById("swap-button");

const flags = {
    USD: "🇺🇸",
    INR: "🇮🇳",
    EUR: "🇪🇺",
    GBP: "🇬🇧",
    JPY: "🇯🇵",
    AUD: "🇦🇺",
    CAD: "🇨🇦",
    AED: "🇦🇪",
    SGD: "🇸🇬",
    CNY: "🇨🇳"
};

// Update flags
function updateFlags() {
    fromFlag.textContent = flags[fromCurrency.value] || "💱";
    toFlag.textContent = flags[toCurrency.value] || "💱";
}

// Convert currency
async function convertCurrency(event) {
    if (event) {
        event.preventDefault();
    }

    errorMessage.textContent = "";

    const amount = Number(amountInput.value);

    if (!Number.isFinite(amount) || amount <= 0) {
        errorMessage.textContent = "Please enter an amount greater than zero.";
        result.textContent = "Invalid amount";
        rateInfo.textContent = "";
        return;
    }

    const from = fromCurrency.value.toLowerCase();
    const to = toCurrency.value.toLowerCase();

    // Same currency
    if (from === to) {
        result.textContent =
            `${amount.toLocaleString()} ${fromCurrency.value}`;

        rateInfo.textContent = `1 ${fromCurrency.value} = 1 ${toCurrency.value}`;
        return;
    }

    convertButton.disabled = true;
    convertButton.textContent = "Converting...";
    result.textContent = "Please wait...";
    rateInfo.textContent = "";

    try {
        const response = await fetch(`${BASE_URL}/${from}.min.json`);

        if (!response.ok) {
            throw new Error("Exchange rate API request failed.");
        }

        const data = await response.json();

        const rate = data[from]?.[to];

        if (typeof rate !== "number" || !Number.isFinite(rate)) {
            throw new Error("Exchange rate not available.");
        }

        const convertedAmount = amount * rate;

        result.textContent =
            `${convertedAmount.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })} ${toCurrency.value}`;

        rateInfo.textContent =
            `1 ${fromCurrency.value} = ${rate.toFixed(4)} ${toCurrency.value}`;

    } catch (error) {
        console.error(error);

        result.textContent = "Conversion failed";
        rateInfo.textContent = "";
        errorMessage.textContent =
            "Unable to get exchange rate. Check your internet and try again.";

    } finally {
        convertButton.disabled = false;
        convertButton.textContent = "Get Exchange Rate";
    }
}

// Swap currencies
swapButton.addEventListener("click", () => {
    const previousFrom = fromCurrency.value;

    fromCurrency.value = toCurrency.value;
    toCurrency.value = previousFrom;

    updateFlags();
    convertCurrency();
});

// Update flags when selection changes
fromCurrency.addEventListener("change", updateFlags);
toCurrency.addEventListener("change", updateFlags);

// Form submission
form.addEventListener("submit", convertCurrency);

// Initial setup
updateFlags();
convertCurrency();