import React, { useEffect, useState } from "react";
import CurrencyRow from "./CurrencyRow";

const API_BASE =
  "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@2024-03-06/v1/currencies";

export default function App() {
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [fromCurrency, setFromCurrency] = useState("usd");
  const [toCurrency, setToCurrency] = useState("");
  const [amount, setAmount] = useState(0);
  const [amountInFromCurrency, setAmountInFromCurrency] = useState(true);
  const [exchangeRate, setExchangeRate] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // initial load: get list of currencies (use USD as starting base)
  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/usd.json`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch currencies list");
        return res.json();
      })
      .then((data) => {
        const keys = Object.keys(data.usd);
        setCurrencyOptions(keys);
        setFromCurrency("usd");
        // pick a different default target (first key that is not 'usd')
        setToCurrency(keys.find(( k) => k !== "usd") || keys[0]);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // fetch exchange rate whenever fromCurrency or toCurrency changes
  useEffect(() => {
    if (!fromCurrency || !toCurrency) return;
    setLoading(true);
    fetch(`${API_BASE}/${fromCurrency}.json`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch rates");
        return res.json();
      })
      .then((data) => {
        const rate = data?.[fromCurrency]?.[toCurrency];
        if (!rate) throw new Error("Rate not available");
        setExchangeRate(rate);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [fromCurrency, toCurrency]);

  // compute amounts to show in inputs
  let fromAmount, toAmount;
  if (amountInFromCurrency) {
    fromAmount = amount;
    toAmount = exchangeRate ? amount * exchangeRate : 0;
  } else {
    toAmount = amount;
    fromAmount = exchangeRate ? amount / exchangeRate : 0;
  }

  // handlers passed to CurrencyRow
  function handleFromAmountChange(e) {
    const val = Number(e.target.value) || 0;
    setAmount(val);
    setAmountInFromCurrency(true);
  }
  function handleToAmountChange(e) {
    const val = Number(e.target.value) || 0;
    setAmount(val);
    setAmountInFromCurrency(false);
  }

  function handleSwap() {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  }

  return (
    <div className="min-h-screen bg-darkgray-50 flex flex-col items-center py-8">
      <h1 className="text-4xl font-bold">Currency Converter</h1>

      <div className="mt-8 p-6 shadow rounded-lg bg-white w-full max-w-xl">
        {error && <div className="text-red-600 mb-4">Error: {error}</div>}

        <CurrencyRow
          amount={Number(fromAmount.toFixed(6))}
          onChangeAmount={handleFromAmountChange}
          options={currencyOptions}
          selectedCurrency={fromCurrency}
          onChangeCurrency={(e) => setFromCurrency(e.target.value)}
        />

        <div className="flex items-center justify-between my-4">
          <button
            onClick={handleSwap}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Swap
          </button>
          <div className="text-sm text-gray-600">
            {loading
              ? "Loading rate..."
              : `1 ${fromCurrency.toUpperCase()} = ${
                  exchangeRate ? Number(exchangeRate).toFixed(6) : "N/A"
                } ${toCurrency.toUpperCase()}`}
          </div>
        </div>

        <CurrencyRow
          amount={Number(toAmount.toFixed(6))}
          onChangeAmount={handleToAmountChange}
          options={currencyOptions}
          selectedCurrency={toCurrency}
          onChangeCurrency={(e) => setToCurrency(e.target.value)}
        />
      </div>
    </div>
  );
}
