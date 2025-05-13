"use client"

import type React from "react"
import { Link } from "react-router-dom"
import { Music, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useRef } from "react"

interface AddSongButtonProps {
  className?: string
}

export function AddSongButton({ className = "" }: AddSongButtonProps) {
  const [isHovering, setIsHovering] = useState(false)
  const [isPressed, setIsPressed] = useState(false)
  const buttonRef = useRef<HTMLAnchorElement>(null)
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number; size: number; opacity: number }>>(
    [],
  )

  // Handle 3D tilt effect
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current || !isHovering) return

    const rect = buttonRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const tiltX = (y - centerY) / 10
    const tiltY = (centerX - x) / 10

    buttonRef.current.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(10px)`
  }

  const resetTilt = () => {
    if (!buttonRef.current) return
    buttonRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)`
  }

  // Create sparkle effect on hover
  const createSparkle = () => {
    if (!isHovering) return

    const newSparkle = {
      id: Date.now(),
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 3,
      opacity: 0.7 + Math.random() * 0.3,
    }

    setSparkles((prev) => [...prev, newSparkle])

    // Remove sparkle after animation
    setTimeout(() => {
      setSparkles((prev) => prev.filter((s) => s.id !== newSparkle.id))
    }, 1200)
  }

  return (
    <div className="relative inline-block" style={{ position: "fixed", right: "105px", top: "80px" }}>
      {/* Button shadow - only visible on hover */}
      <div
      className={cn(
        "absolute inset-0 rounded-full bg-indigo-900/50 blur-md transition-all duration-500",
        isPressed ? "translate-y-1 scale-95 opacity-40" : "translate-y-2 scale-100 opacity-60",
        isHovering ? "opacity-60 w-[175px]" : "opacity-0 w-[45px]",
        "h-[45px]",
      )}
      ></div>

      <Link
      ref={buttonRef}
      to="/add-song"
      className={cn(
        "relative flex items-center justify-center gap-2 rounded-full font-bold text-white",
        "bg-indigo-600 border border-indigo-400/30",
        "shadow-sm transition-all duration-500 ease",
        "overflow-hidden",
        isPressed ? "scale-95" : "scale-100",
        isHovering
        ? "w-[175px] px-6 justify-between" // Ellipse shape
        : "w-[45px] h-[45px] px-0", // Circle shape
        className,
      )}
      onMouseEnter={() => {
        setIsHovering(true)
        // Start creating sparkles
        const interval = setInterval(createSparkle, 400)
        buttonRef.current?.setAttribute("data-interval", interval.toString())
      }}
      onMouseLeave={() => {
        setIsHovering(false)
        resetTilt()
        // Stop creating sparkles
        const interval = buttonRef.current?.getAttribute("data-interval")
        if (interval) clearInterval(Number.parseInt(interval))
      }}
      onMouseMove={handleMouseMove}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onClick={() => {
        // Create click ripple effect
        const ripples = Array.from({ length: 8 }).map((_, i) => ({
        id: Date.now() + i,
        x: 50,
        y: 50,
        size: 2 + Math.random() * 4,
        opacity: 0.7 + Math.random() * 0.3,
        }))
        setSparkles((prev) => [...prev, ...ripples])
      }}
      >
      {/* Inner glow - only visible on hover */}
      <div
        className={cn(
        "absolute inset-0 bg-gradient-to-tr from-indigo-500/0 via-indigo-300/20 to-white/30",
        isHovering ? "opacity-100" : "opacity-0",
        "transition-opacity duration-500",
        )}
      ></div>

      {/* Sparkles */}
      {sparkles.map((sparkle) => (
        <div
        key={sparkle.id}
        className="absolute w-1 h-1 bg-white rounded-full pointer-events-none animate-sparkle-fly"
        style={{
          left: `${sparkle.x}%`,
          top: `${sparkle.y}%`,
          width: `${sparkle.size}px`,
          height: `${sparkle.size}px`,
          opacity: sparkle.opacity,
        }}
        ></div>
      ))}

      {/* Cute sparkle icon - only visible when not hovering */}
      <div
        className={cn(
        "absolute top-0 right-0 mt-1 mr-1 transition-all duration-500",
        isHovering ? "opacity-0 scale-0" : "opacity-100 scale-100",
        )}
      >
        <Sparkles className="h-3 w-3 text-indigo-200" />
      </div>

      {/* Button content */}
      <div
        className={cn(
        "flex items-center justify-center transition-all duration-500",
        isHovering ? "gap-2 w-full" : "gap-0",
        )}
      >
        <div
        className={cn(
          "transition-all duration-500 flex items-center justify-center",
          isHovering ? "h-9 w-9" : "h-full w-full",
        )}
        >
        <Music className={cn("transition-all duration-500", isHovering ? "h-4 w-4" : "h-5 w-5")} />
        </div>

        {/* Text that appears on hover */}
        <span
        className={cn(
          "transition-all duration-500 whitespace-nowrap overflow-hidden",
          isHovering ? "opacity-100 max-w-[95px]" : "opacity-0 max-w-0",
        )}
        >
        הוסף שיר
        </span>
      </div>
      </Link>
    </div>
  )
}
