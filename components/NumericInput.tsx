import React from 'react';

interface NumericInputProps {
    label: string;
    value: number;
    min?: number;
    max?: number;
    step?: number;
    onChange: (value: number) => void;
    unitLabel?: string;
    placeholder?: string;
    disabled?: boolean;
}

const NumericInput: React.FC<NumericInputProps> = ({
    label,
    value,
    min = 0,
    max = 1000000,
    step = 1,
    onChange,
    unitLabel = '',
    placeholder = '0.00',
    disabled = false
}) => {
    const handleIncrement = () => {
        if (disabled) return;
        if (value + step <= max) {
            onChange(Number((value + step).toFixed(4)));
        }
    };

    const handleDecrement = () => {
        if (disabled) return;
        if (value - step >= min) {
            onChange(Number((value - step).toFixed(4)));
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (disabled) return;
        const newVal = parseFloat(e.target.value) || 0;
        onChange(newVal);
    };

    return (
        <div className="space-y-4">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">{label}</label>
            <div className="relative flex items-center bg-slate-50 rounded-3xl p-1 border-2 border-transparent focus-within:border-indigo-100 transition-all shadow-inner">
                <button
                    type="button"
                    onClick={handleDecrement}
                    disabled={disabled}
                    className={`w-12 h-14 bg-white text-slate-400 rounded-2xl flex items-center justify-center transition-all shadow-sm active:scale-90 ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:text-indigo-600'}`}
                >
                    <i className="fa-solid fa-chevron-down text-xs"></i>
                </button>

                <input
                    type="number"
                    min={min}
                    max={max}
                    value={value}
                    onChange={handleInputChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={`flex-1 bg-transparent border-none text-center font-black text-slate-800 text-lg outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${disabled ? 'cursor-not-allowed' : ''}`}
                />

                {unitLabel && (
                    <span className="absolute right-16 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-300 uppercase tracking-widest pointer-events-none hidden sm:block">
                        {unitLabel}
                    </span>
                )}

                <button
                    type="button"
                    onClick={handleIncrement}
                    disabled={disabled}
                    className={`w-12 h-14 bg-white text-slate-400 rounded-2xl flex items-center justify-center transition-all shadow-sm active:scale-90 ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:text-indigo-600'}`}
                >
                    <i className="fa-solid fa-chevron-up text-xs"></i>
                </button>
            </div>
        </div>
    );
};

export default NumericInput;
