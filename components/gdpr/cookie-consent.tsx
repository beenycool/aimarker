'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { Shield, Settings, Cookie, X } from 'lucide-react'

interface CookieCategory {
  id: string
  name: string
  description: string
  essential: boolean
  enabled: boolean
}

interface CookieConsentProps {
  onConsentChange?: (consent: Record<string, boolean>) => void
}

const COOKIE_CATEGORIES: CookieCategory[] = [
  {
    id: 'essential',
    name: 'Essential Cookies',
    description: 'These cookies are necessary for the website to function and cannot be switched off. They are usually only set in response to actions made by you which amount to a request for services.',
    essential: true,
    enabled: true
  },
  {
    id: 'analytics',
    name: 'Analytics Cookies',
    description: 'These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us know which pages are the most and least popular.',
    essential: false,
    enabled: false
  },
  {
    id: 'functional',
    name: 'Functional Cookies',
    description: 'These cookies enable enhanced functionality and personalization. They may be set by us or by third party providers whose services we have added to our pages.',
    essential: false,
    enabled: false
  },
  {
    id: 'marketing',
    name: 'Marketing Cookies',
    description: 'These cookies may be set through our site by advertising partners. They may be used to build a profile of your interests and show you relevant adverts on other sites.',
    essential: false,
    enabled: false
  }
]

const STORAGE_KEY = 'gdpr-cookie-consent'
const STORAGE_TIMESTAMP_KEY = 'gdpr-cookie-consent-timestamp'
const CONSENT_DURATION = 365 * 24 * 60 * 60 * 1000 // 1 year in milliseconds

export function CookieConsent({ onConsentChange }: CookieConsentProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)
  const [categories, setCategories] = useState<CookieCategory[]>(COOKIE_CATEGORIES)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkConsentStatus()

    // Listen for custom event to open preferences
    const handleOpenPreferences = () => {
      setShowPreferences(true)
    }

    window.addEventListener('openCookiePreferences', handleOpenPreferences)
    
    return () => {
      window.removeEventListener('openCookiePreferences', handleOpenPreferences)
    }
  }, [])

  const checkConsentStatus = () => {
    const consent = localStorage.getItem(STORAGE_KEY)
    const timestamp = localStorage.getItem(STORAGE_TIMESTAMP_KEY)
    
    if (!consent || !timestamp) {
      setIsVisible(true)
      setIsLoading(false)
      return
    }

    const consentTime = parseInt(timestamp)
    const now = Date.now()
    
    // Check if consent has expired (1 year)
    if (now - consentTime > CONSENT_DURATION) {
      setIsVisible(true)
      setIsLoading(false)
      return
    }

    // Load existing preferences
    try {
      const savedConsent = JSON.parse(consent)
      const updatedCategories = categories.map(category => ({
        ...category,
        enabled: category.essential || savedConsent[category.id] === true
      }))
      setCategories(updatedCategories)
      
      // Notify parent component
      const consentMap = Object.fromEntries(
        updatedCategories.map(cat => [cat.id, cat.enabled])
      )
      onConsentChange?.(consentMap)
    } catch (error) {
      console.error('Error parsing saved consent:', error)
      setIsVisible(true)
    }
    
    setIsLoading(false)
  }

  const saveConsent = (consent: Record<string, boolean>) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consent))
    localStorage.setItem(STORAGE_TIMESTAMP_KEY, Date.now().toString())
    
    // Set consent cookies for server-side detection
    Object.entries(consent).forEach(([category, allowed]) => {
      document.cookie = `gdpr-${category}=${allowed ? 'true' : 'false'}; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Lax`
    })
    
    onConsentChange?.(consent)
  }

  const handleAcceptAll = () => {
    const consent = Object.fromEntries(
      categories.map(category => [category.id, true])
    )
    saveConsent(consent)
    setIsVisible(false)
  }

  const handleRejectAll = () => {
    const consent = Object.fromEntries(
      categories.map(category => [category.id, category.essential])
    )
    saveConsent(consent)
    setIsVisible(false)
  }

  const handleSavePreferences = () => {
    const consent = Object.fromEntries(
      categories.map(category => [category.id, category.enabled])
    )
    saveConsent(consent)
    setIsVisible(false)
    setShowPreferences(false)
  }

  const handleCategoryToggle = (categoryId: string, enabled: boolean) => {
    setCategories(prev => 
      prev.map(category => 
        category.id === categoryId 
          ? { ...category, enabled }
          : category
      )
    )
  }

  if (isLoading || !isVisible) {
    return null
  }

  return (
    <>
      {/* Cookie Consent Banner */}
      <div className="fixed bottom-4 right-4 z-50 max-w-sm bg-background/95 backdrop-blur-sm border rounded-lg shadow-lg">
        <Card className="border-0">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Cookie className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <h3 className="font-semibold text-sm mb-1">We use cookies</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    We use cookies to enhance your browsing experience, serve personalized ads or content, 
                    and analyze our traffic.
                  </p>
                  <div className="flex gap-1 pt-1">
                    <Button 
                      size="sm" 
                      onClick={handleAcceptAll}
                      className="flex-1 text-xs h-6"
                    >
                      Accept All
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setShowPreferences(true)}
                      className="flex-1 text-xs h-6"
                    >
                      <Settings className="h-3 w-3 mr-1" />
                      Options
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleRejectAll}
                      className="flex-1 text-xs h-6 text-muted-foreground hover:text-foreground"
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cookie Preferences Modal */}
      <Dialog open={showPreferences} onOpenChange={setShowPreferences}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Cookie Preferences
            </DialogTitle>
            <DialogDescription>
              Manage your cookie preferences. You can enable or disable different categories of cookies below.
              Essential cookies cannot be disabled as they are necessary for the site to function.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-6">
            {categories.map((category) => (
              <div key={category.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label htmlFor={category.id} className="text-base font-medium">
                      {category.name}
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {category.description}
                    </p>
                  </div>
                  <Switch
                    id={category.id}
                    checked={category.enabled}
                    disabled={category.essential}
                    onCheckedChange={(checked) => handleCategoryToggle(category.id, checked)}
                  />
                </div>
                {category.id !== categories[categories.length - 1].id && (
                  <Separator />
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-2 mt-6">
            <Button 
              variant="outline" 
              onClick={handleRejectAll}
              className="flex-1"
            >
              Reject All
            </Button>
            <Button 
              onClick={handleSavePreferences}
              className="flex-1"
            >
              Save Preferences
            </Button>
          </div>

          <div className="text-xs text-muted-foreground mt-4 p-3 bg-muted rounded-lg">
            <p className="mb-2">
              <strong>Your privacy matters:</strong> We are committed to protecting your personal data 
              and respecting your privacy preferences.
            </p>
            <p>
              For more information about how we use cookies and process your data, please read our{' '}
              <a href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</a>.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

// Hook for accessing cookie consent status
export function useCookieConsent() {
  const [consent, setConsent] = useState<Record<string, boolean>>({})
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const savedConsent = localStorage.getItem(STORAGE_KEY)
    if (savedConsent) {
      try {
        setConsent(JSON.parse(savedConsent))
      } catch (error) {
        console.error('Error parsing cookie consent:', error)
      }
    }
    setIsLoaded(true)
  }, [])

  const updateConsent = (newConsent: Record<string, boolean>) => {
    setConsent(newConsent)
  }

  const hasConsent = (category: string): boolean => {
    return consent[category] === true
  }

  return {
    consent,
    isLoaded,
    hasConsent,
    updateConsent
  }
}