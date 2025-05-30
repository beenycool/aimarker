"use client"

import { useState, useEffect, useCallback } from 'react'

// Define the Konami code sequence
const KONAMI_CODE = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'b', 'a'
]

export function useKonamiCode() {
  const [keys, setKeys] = useState([])
  const [success, setSuccess] = useState(false)

  const keydownHandler = useCallback(({ key }) => {
    // Map arrow keys to their full name
    const mappedKey = key === 'ArrowUp' ? 'ArrowUp'
      : key === 'ArrowDown' ? 'ArrowDown'
      : key === 'ArrowLeft' ? 'ArrowLeft'
      : key === 'ArrowRight' ? 'ArrowRight'
      : key.toLowerCase()

    setKeys(previousKeys => {
      const updatedKeys = [...previousKeys, mappedKey]
      
      // Keep only up to the length of the Konami code 
      const trimmedKeys = updatedKeys.slice(-KONAMI_CODE.length)
      
      // Check if the keys match the Konami code
      const success = 
        KONAMI_CODE.length === trimmedKeys.length && 
        KONAMI_CODE.every((k, i) => k === trimmedKeys[i])
      
      if (success) {
        setSuccess(true)
        
        // Reset after a short delay
        setTimeout(() => {
          setSuccess(false)
          setKeys([])
        }, 2000)
      }
      
      return trimmedKeys
    })
  }, [])

  useEffect(() => {
    document.addEventListener('keydown', keydownHandler)
    return () => {
      document.removeEventListener('keydown', keydownHandler)
    }
  }, [keydownHandler])

  return { success, progress: keys.length / KONAMI_CODE.length }
}