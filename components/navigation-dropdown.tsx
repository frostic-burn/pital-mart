"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import Link from "next/link"

interface DropdownItem {
  category: string
  items: string[]
}

interface NavigationDropdownProps {
  title: string
  items: DropdownItem[]
}

export function NavigationDropdown({ title, items }: NavigationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
      <button className="flex items-center space-x-1 px-4 py-3 text-white hover:text-red-200 transition-colors">
        <span>{title}</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 bg-white shadow-xl rounded-lg mt-2 p-6 min-w-96 z-[100] border border-gray-200">
          <div className="grid grid-cols-2 gap-8">
            {items.map((item, index) => (
              <div key={index}>
                <h3 className="font-semibold text-gray-800 mb-3 text-red-700">{item.category}</h3>
                <ul className="space-y-2">
                  {item.items.map((subItem, subIndex) => (
                    <li key={subIndex}>
                      <Link
                        href={`/category/${subItem.toLowerCase().replace(" ", "-")}`}
                        className="text-gray-600 hover:text-red-700 cursor-pointer text-sm block py-1 hover:bg-red-50 px-2 rounded transition-colors"
                      >
                        {subItem}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
