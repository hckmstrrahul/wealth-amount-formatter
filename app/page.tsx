"use client"

import React from "react"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function Page() {
  const [input, setInput] = useState("")
  const [formatted, setFormatted] = useState("")
  const [error, setError] = useState("")

  const formatNumber = (value: string) => {
    // Clear previous error
    setError("")

    // Remove any non-digit characters except decimal point and negative sign
    const cleanValue = value.replace(/[^\d.\-]/g, "")
    const num = Number.parseFloat(cleanValue)

    if (isNaN(num)) {
      setError("Please enter a valid number")
      setFormatted("")
      return
    }

    try {
      // Get the sign for formatting
      const sign = num < 0 ? "-" : ""
      // Use absolute value for formatting
      const absNum = Math.abs(num)

      if (absNum >= 10000000) { // 1,00,00,000 and above
        // Format in Crores
        const inCrores = absNum / 10000000
        setFormatted(`${sign}${inCrores.toFixed(2)}Cr`)
      } else if (absNum >= 1000000) { // 10,00,000 to 99,99,999.99
        // Format in Lakhs
        const inLakhs = absNum / 100000
        setFormatted(`${sign}${inLakhs.toFixed(2)}L`)
      } else if (absNum >= 100000) { // 1,00,000 to 9,99,999.99
        // Format with Indian numbering system (no decimals)
        const formatted = absNum.toFixed(0).replace(/(\d)(?=(\d\d)+\d$)/g, "$1,")
        setFormatted(`${sign}${formatted}`)
      } else { // 0 to 99,999.99
        // Show decimals only when they exist (up to 2 decimal places)
        const hasDecimal = absNum % 1 !== 0
        const decimalPlaces = hasDecimal ? 2 : 0
        const formatted = absNum.toFixed(decimalPlaces).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
        setFormatted(`${sign}${formatted}`)
      }
    } catch (err) {
      setError("Error formatting number")
      setFormatted("")
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-6 space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Wealth Amount Formatter</h2>
          <p className="text-sm text-muted-foreground">Format numbers according to the following rules:</p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• 0 to 99,999.99: Now only shows decimals when they exist (up to 2 decimal places)</li>
            <li>• 1,00,000 to 9,99,999.99: Shows without decimal points</li>
            <li>• 10,00,000 to 99,99,999.99: Added new tier that compresses to Lakhs with "L" suffix</li>
            <li>• 1,00,00,000 onwards: Keeps the Crores format with "Cr" suffix</li>
          </ul>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="number">Enter a number</Label>
            <Input
              id="number"
              type="text"
              placeholder="Enter a number (e.g. 45000.34)"
              value={input}
              onChange={(e) => {
                setInput(e.target.value)
                formatNumber(e.target.value)
              }}
            />
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <div className="text-sm font-medium">Formatted Result:</div>
            {error ? (
              <div className="text-destructive mt-1">{error}</div>
            ) : (
              <div className="text-2xl font-bold mt-1">{formatted || "—"}</div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}

