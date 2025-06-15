# GDPR Compliance Components

A comprehensive suite of GDPR-compliant components for the GCSE AI Marker application, providing complete privacy protection and legal compliance.

## 🛡️ Components Overview

### 1. Cookie Consent Banner (`CookieConsent`)
**Location**: `components/gdpr/cookie-consent.tsx`

A fully GDPR-compliant cookie consent banner with granular controls:
- ✅ Accept all, reject all, or customize cookie preferences
- ✅ Four cookie categories: Essential, Analytics, Functional, Marketing
- ✅ Persistent consent storage (1-year expiration)
- ✅ Mobile-responsive design
- ✅ Automatic consent renewal prompts

**Usage**:
```tsx
import { CookieConsent } from '@/components/gdpr/cookie-consent'

// In your layout or main app component
<CookieConsent onConsentChange={(consent) => console.log(consent)} />
```

### 2. GDPR Compliance Badge (`GDPRBadge`)
**Location**: `components/gdpr/gdpr-badge.tsx`

Visual certification badge with detailed compliance information:
- ✅ Multiple display variants (minimal, standard, full)
- ✅ Interactive dialog with compliance details
- ✅ User rights information
- ✅ Contact information for DPO

**Usage**:
```tsx
import { GDPRBadge } from '@/components/gdpr/gdpr-badge'

// Different variants
<GDPRBadge variant="minimal" />
<GDPRBadge variant="badge" />
<GDPRBadge variant="full" />
```

### 3. Privacy Policy Page
**Location**: `app/privacy-policy/page.tsx`

Comprehensive privacy policy covering:
- ✅ Data collection and usage transparency
- ✅ Third-party AI service disclosures
- ✅ User rights under GDPR
- ✅ Data retention and security measures
- ✅ International data transfer safeguards
- ✅ Contact information and DPO details

**Accessible at**: `/privacy-policy`

### 4. Terms & Conditions Page
**Location**: `app/terms-conditions/page.tsx`

Complete terms of service including:
- ✅ Service usage agreements
- ✅ User responsibilities and prohibited activities
- ✅ Payment terms and refund policies
- ✅ Intellectual property rights
- ✅ Liability limitations and disclaimers
- ✅ Termination and dispute resolution

**Accessible at**: `/terms-conditions`

### 5. GDPR Footer (`GDPRFooter`)
**Location**: `components/gdpr/gdpr-footer.tsx`

Footer components with legal links and compliance information:
- ✅ Full footer with comprehensive legal information
- ✅ Compact footer for smaller spaces
- ✅ Quick links component for inline use
- ✅ Integrated cookie preferences trigger

**Usage**:
```tsx
import { GDPRFooter, GDPRQuickLinks } from '@/components/gdpr/gdpr-footer'

// Full footer
<GDPRFooter />

// Compact version
<GDPRFooter compact />

// Quick links only
<GDPRQuickLinks />
```

## 🔧 Installation & Setup

1. **Add to Layout**: The cookie consent banner is already integrated in `app/layout.tsx`

2. **Import Components**: Use the centralized export from `components/gdpr/index.ts`:
```tsx
import { 
  CookieConsent, 
  GDPRBadge, 
  GDPRFooter, 
  useCookieConsent 
} from '@/components/gdpr'
```

3. **Check Cookie Consent**: Use the provided hook:
```tsx
const { consent, hasConsent, isLoaded } = useCookieConsent()

// Check if user has consented to analytics cookies
if (hasConsent('analytics')) {
  // Initialize analytics
}
```

## 📱 Demo Page

Visit `/gdpr-demo` to see all components in action and test the functionality.

## 🎛️ Configuration

### Cookie Categories
The system supports four cookie categories defined in `cookie-consent.tsx`:

1. **Essential** - Always enabled, required for site functionality
2. **Analytics** - Usage statistics and performance monitoring
3. **Functional** - Enhanced features and personalization
4. **Marketing** - Advertising and tracking for marketing purposes

### Consent Storage
- **LocalStorage**: User preferences stored locally
- **HTTP Cookies**: Server-side detection with `gdpr-{category}` cookies
- **Expiration**: 1-year consent duration with automatic renewal prompts

## 🔗 Legal Integration

### Backend Integration
The backend API (`backend/src/routes/api.js`) should check for GDPR consent cookies:

```javascript
// Check for analytics consent
const analyticsConsent = req.cookies['gdpr-analytics'] === 'true'
if (analyticsConsent) {
  // Log analytics data
}
```

### Email Contacts
- **General Privacy**: `privacy@aimarker.tech`
- **Data Protection Officer**: `dpo@aimarker.tech`
- **Legal**: `legal@aimarker.tech`
- **Support**: `support@aimarker.tech`

## ⚖️ Legal Compliance

### GDPR Requirements Met
- ✅ **Lawful Basis**: Clear legal basis for each type of processing
- ✅ **Transparency**: Detailed privacy policy and clear consent mechanisms
- ✅ **User Rights**: Full support for access, rectification, erasure, portability
- ✅ **Consent**: Granular, informed, and withdrawable consent system
- ✅ **Data Minimization**: Only necessary data collection
- ✅ **Security**: Encrypted storage and secure data handling

### Next Steps for Full Compliance
1. **ICO Registration**: Obtain ICO registration number
2. **Company Registration**: Complete legal entity registration
3. **DPO Setup**: Establish Data Protection Officer processes
4. **Staff Training**: Train team on GDPR procedures
5. **Regular Audits**: Conduct periodic compliance reviews

## 🌍 International Considerations

### Data Transfers
- Standard Contractual Clauses (SCCs) for non-EEA transfers
- Adequacy decisions for appropriate countries
- Additional safeguards for AI service providers

### Multi-jurisdictional Compliance
- **UK GDPR**: Post-Brexit UK compliance
- **EU GDPR**: European Union compliance
- **Local Laws**: Additional regional privacy laws as applicable

## 🚀 Customization

### Styling
All components use Tailwind CSS and are fully customizable:
- Dark/light mode support
- Responsive design
- Accessible markup
- Consistent with existing design system

### Content Updates
Legal pages are easily editable:
- Update contact information in components
- Modify legal text as needed
- Add new cookie categories
- Customize consent flow

---

**Last Updated**: December 2024  
**Compliance Status**: ✅ GDPR Ready  
**Legal Review**: Required before production use 