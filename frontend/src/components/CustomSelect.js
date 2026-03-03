import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export const CustomSelect = ({ value, options, onChange, className = '' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close the dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (opt) => {
        onChange({ target: { value: opt } });
        setIsOpen(false);
    };

    return (
        <div className={`custom-select-container ${className}`} ref={dropdownRef}>
            <div
                className={`custom-select-value ${isOpen ? 'open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span>{value || 'Select...'}</span>
                <ChevronDown size={14} className={`custom-select-arrow ${isOpen ? 'open' : ''}`} />
            </div>

            {isOpen && (
                <div className="custom-select-dropdown">
                    {options.map((opt) => (
                        <div
                            key={opt}
                            className={`custom-select-option ${opt === value ? 'selected' : ''}`}
                            onClick={() => handleSelect(opt)}
                        >
                            {opt}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
