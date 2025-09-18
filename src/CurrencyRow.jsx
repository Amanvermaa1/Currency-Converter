import React from "react";

export default function CurrencyRow({
  amount,
  onChangeAmount,
  options,
  selectedCurrency,
  onChangeCurrency,
}) {
  return (
    <div className="flex items-center gap-4">
      <input
        type="number"
        step="any"
        className="border p-2 rounded w-36 outline-none"
        value={amount}
        onChange={onChangeAmount}
      />

      <select
        className="border p-2 rounded"
        value={selectedCurrency}
        onChange={onChangeCurrency}
      >
        {options?.map((opt) => (
          <option key={opt} value={opt}>
            {opt.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  );
}
