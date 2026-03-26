'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useCart } from '@/context/CartContext'

interface MenuCardProps {
  id: string
  name: string
  priceRange: string
  price: number
  imageSrc: string
  imageAlt: string
}

export default function MenuCard({ id, name, priceRange, price, imageSrc, imageAlt }: MenuCardProps) {
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const { addItem } = useCart()

  const handleAdd = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({ id, name, price, imageSrc })
    }
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
    setQuantity(1)
  }

  return (
    <div className="group bg-[#111111] rounded-2xl overflow-hidden border border-white/5 hover:border-[#D4AF37]/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-yellow-900/20">
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] to-transparent" />
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-xl font-black text-white uppercase tracking-wide mb-1">{name}</h3>
        <p className="text-[#D4AF37] font-bold text-lg mb-4">{priceRange}</p>

        {/* Quantity Selector */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-gray-500 text-xs uppercase tracking-wider">Qty</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              className="w-8 h-8 rounded-full bg-[#1a1a1a] hover:bg-[#D4AF37] hover:text-black text-white font-bold transition-colors flex items-center justify-center border border-white/10"
            >
              −
            </button>
            <span className="text-white font-black text-lg w-4 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(q => q + 1)}
              className="w-8 h-8 rounded-full bg-[#1a1a1a] hover:bg-[#D4AF37] hover:text-black text-white font-bold transition-colors flex items-center justify-center border border-white/10"
            >
              +
            </button>
          </div>
        </div>

        <button
          onClick={handleAdd}
          className={`w-full font-bold py-3 rounded-xl uppercase tracking-wider text-sm transition-all duration-200 active:scale-95 min-h-[48px] ${
            added
              ? 'bg-green-600 text-white'
              : 'bg-[#8B0000] hover:bg-red-800 text-white'
          }`}
        >
          {added ? '✓ Added!' : 'Add to Order'}
        </button>
      </div>
    </div>
  )
}
