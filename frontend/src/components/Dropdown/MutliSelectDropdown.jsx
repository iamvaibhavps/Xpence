import { useState, useRef, useEffect } from "react"
import { ChevronDown, X } from "lucide-react"

const MultiSelect = ({ options, placeholder = "Select...", isMulti = false, onChange, value, className = "" }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedOptions, setSelectedOptions] = useState(isMulti ? [] : null)
    const selectRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (selectRef.current && !selectRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    useEffect(() => {
        if (value) {
            setSelectedOptions(isMulti ? value : options.find((option) => option.value === value.value))
        }
    }, [value, isMulti, options])

    const toggleOption = (option) => {
        if (isMulti) {
            const updatedSelection = selectedOptions.some((item) => item.value === option.value)
                ? selectedOptions.filter((item) => item.value !== option.value)
                : [...selectedOptions, option]
            setSelectedOptions(updatedSelection)
            onChange(updatedSelection)
        } else {
            setSelectedOptions(option)
            onChange(option)
            setIsOpen(false)
        }
    }

    const removeOption = (option) => {
        const updatedSelection = selectedOptions.filter((item) => item.value !== option.value)
        setSelectedOptions(updatedSelection)
        onChange(updatedSelection)
    }

    const handleKeyDown = (event) => {
        if (event.key === "Enter" || event.key === " ") {
            setIsOpen(!isOpen)
        } else if (event.key === "Escape") {
            setIsOpen(false)
        }
    }

    return (
        <div className={`relative w-full ${className}`} ref={selectRef}>
            <div className={`flex items-center justify-between  p-2 cursor-pointer 
        text-[15px] md:text-[13px] lg:text-[13px] bg-transparent  placeholder:text-gray-400 text-slate-700 text-md border border-gray-600 rounded-xl px-3 py-2 pr-10 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow ${className}`}
                onClick={() => setIsOpen(!isOpen)}
                onKeyDown={handleKeyDown}
                tabIndex={0}
                role="button"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <div className="flex flex-wrap gap-1">
                    {isMulti ? (
                        selectedOptions.length === 0 ? (
                            <span className="text-gray-400">{placeholder}</span>
                        ) : (
                            selectedOptions.map((option) => (
                                <span key={option.value} className="px-2 py-1 text-sm hover:border-red-600 bg-gray-200 rounded-md flex items-center">
                                    {option.label}
                                    <X
                                        className="ml-1 w-4 h-4 cursor-pointer text-red-600 "
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            removeOption(option)
                                        }}
                                    />
                                </span>
                            ))
                        )
                    ) : selectedOptions ? (
                        <span>{selectedOptions.label}</span>
                    ) : (
                        <span className="text-gray-400">{placeholder}</span>
                    )}
                </div>
                <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </div>
            {isOpen && (
                <ul
                    className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto"
                    role="listbox"
                >
                    {options.map((option) => (
                        <li
                            key={option.value}

                            className={`px-3 py-2 cursor-pointer hover:bg-blue-100 ${isMulti
                                ? selectedOptions.some((item) => item.value === option.value)
                                    ? "bg-blue-300"
                                    : ""
                                : selectedOptions && selectedOptions.value === option.value
                                    ? "bg-gray-100"
                                    : ""
                                }`}
                            onClick={() => toggleOption(option)}
                            role="option"
                            aria-selected={
                                isMulti
                                    ? selectedOptions.some((item) => item.value === option.value)
                                    : selectedOptions && selectedOptions.value === option.value
                            }
                        >
                            {option.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default MultiSelect;