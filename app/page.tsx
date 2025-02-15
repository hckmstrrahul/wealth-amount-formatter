"use client"

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

    // Remove any non-digit characters except decimal point
    const cleanValue = value.replace(/[^\d.]/g, "")
    const num = Number.parseFloat(cleanValue)

    if (isNaN(num)) {
      setError("Please enter a valid number")
      setFormatted("")
      return
    }

    try {
      if (num >= 10000000) {
        // 1,00,00,000 and above (1 Crore+)
        const inCrores = num / 10000000
        setFormatted(`${inCrores.toFixed(2)}Cr`)
      } else if (num >= 100000) {
        // 1,00,000 to 99,99,999.99
        // Format with Indian numbering system (no decimals)
        const formatted = num.toFixed(0).replace(/(\d)(?=(\d\d)+\d$)/g, "$1,")
        setFormatted(formatted)
      } else {
        // 0 to 99,999.99
        // Format with two decimal places
        const formatted = num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
        setFormatted(formatted)
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
            <li>• 0 to 99,999.99 - show two decimals, Eg. 45,000.34</li>
            <li>• 1,00,000 to 99,99,999.99 - no decimal point, Eg. 34,56,000</li>
            <li>• 1,00,00,000 onwards - compress into two decimal points, Eg. 2.34Cr</li>
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

