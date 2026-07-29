import { createContext, useContext, useState, useEffect } from 'react'

// ─── Translations ────────────────────────────────────────────────────────────
const translations = {
  en: {
    // Nav
    dashboard: 'Dashboard',
    profile: 'Profile',
    myApplications: 'My Applications',
    applyForLoan: 'Apply for Loan',
    notifications: 'Notifications',
    staffPortal: 'Staff Portal',
    signOut: 'Sign Out',
    // Hero / Landing
    welcomeTitle: 'Banking Made\nSimple & Smart',
    welcomeSubtitle: 'Open accounts, apply for loans and manage your finances entirely online — fast, secure and paperless.',
    getStarted: 'Get Started',
    learnMore: 'Learn More',
    // Auth
    login: 'Login',
    register: 'Register',
    email: 'Email',
    password: 'Password',
    fullName: 'Full Name',
    mobileNumber: 'Mobile Number',
    nicNumber: 'NIC Number',
    dateOfBirth: 'Date of Birth',
    alreadyHaveAccount: 'Already have an account?',
    dontHaveAccount: "Don't have an account?",
    forgotPassword: 'Forgot Password?',
    createAccount: 'Create Account',
    staffLogin: 'Staff Login',
    // Loan Application
    loanApplication: 'Loan Application',
    loanType: 'Loan Type',
    requestedAmount: 'Requested Amount',
    tenureMonths: 'Tenure (Months)',
    saveAsDraft: 'Save as Draft',
    submitApplication: 'Submit Application',
    emiCalculator: 'EMI Calculator',
    monthlyEmi: 'Monthly EMI',
    // Status
    submitted: 'Submitted',
    underReview: 'Under Review',
    approved: 'Approved',
    rejected: 'Rejected',
    disbursed: 'Disbursed',
    pendingDocs: 'Pending Documents',
    // Common
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    back: 'Back',
    continue: 'Continue',
    submit: 'Submit',
    search: 'Search',
    filter: 'Filter',
    noData: 'No data available.',
    success: 'Success!',
    error: 'An error occurred. Please try again.',
    // Account Opening
    openAccount: 'Open New Account',
    accountType: 'Account Type',
    personalDetails: 'Personal Details',
    addressEmployment: 'Address & Employment',
    reviewSubmit: 'Review & Submit',
    confirmation: 'Confirmation',
    eKycVerify: 'e-KYC Verify',
    scanNic: 'Scan NIC',
    scanning: 'Scanning...',
    identityVerified: 'Identity Verified',
    // Dark mode
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    language: 'Language',
  },
  si: {
    // Nav
    dashboard: 'උපකරණ පුවරුව',
    profile: 'පැතිකඩ',
    myApplications: 'මගේ අයදුම්පත්',
    applyForLoan: 'ණය සඳහා අයදුම් කරන්න',
    notifications: 'දැනුම්දීම්',
    staffPortal: 'කාර්ය මණ්ඩල ද්වාරය',
    signOut: 'ඉවත් වන්න',
    // Hero
    welcomeTitle: 'බැංකු කටයුතු\nසරල හා සූක්ෂ්ම ලෙස',
    welcomeSubtitle: 'ගිණුම් විවෘත කරන්න, ණය සඳහා අයදුම් කරන්න සහ ඔබේ මූල්‍ය කාරය සම්පූර්ණයෙන්ම මාර්ගගතව කළමනාකරණය කරන්න.',
    getStarted: 'ආරම්භ කරන්න',
    learnMore: 'තව දැනගන්න',
    // Auth
    login: 'පිවිසෙන්න',
    register: 'ලියාපදිංචි වන්න',
    email: 'විද්‍යුත් තැපෑල',
    password: 'මුරපදය',
    fullName: 'සම්පූර්ණ නම',
    mobileNumber: 'ජංගම දුරකථන අංකය',
    nicNumber: 'ජාතික හැඳුනුම්පත් අංකය',
    dateOfBirth: 'උපන් දිනය',
    alreadyHaveAccount: 'දැනටමත් ගිණුමක් තිබේද?',
    dontHaveAccount: 'ගිණුමක් නොමැතිද?',
    forgotPassword: 'මුරපදය අමතකද?',
    createAccount: 'ගිණුමක් සාදන්න',
    staffLogin: 'කාර්ය මණ්ඩල පිවිසීම',
    // Loan
    loanApplication: 'ණය අයදුම්පත',
    loanType: 'ණය වර්ගය',
    requestedAmount: 'ඉල්ලූ මුදල',
    tenureMonths: 'කාලය (මාස)',
    saveAsDraft: 'කෙටුම්පතක් ලෙස සුරකින්න',
    submitApplication: 'අයදුම්පත ඉදිරිපත් කරන්න',
    emiCalculator: 'EMI ගණකය',
    monthlyEmi: 'මාසික EMI',
    // Status
    submitted: 'ඉදිරිපත් කරන ලදී',
    underReview: 'සමාලෝචනයේ',
    approved: 'අනුමත',
    rejected: 'ප්‍රතික්ෂේප',
    disbursed: 'ගෙවා ඇත',
    pendingDocs: 'ලේඛන බලාපොරොත්තුවෙන්',
    // Common
    loading: 'පූරණය වෙමින්...',
    save: 'සුරකින්න',
    cancel: 'අවලංගු කරන්න',
    edit: 'සංස්කරණය',
    delete: 'මකන්න',
    back: 'ආපසු',
    continue: 'ඉදිරියට',
    submit: 'ඉදිරිපත් කරන්න',
    search: 'සොයන්න',
    filter: 'පෙරන්න',
    noData: 'දත්ත නොමැත.',
    success: 'සාර්ථකයි!',
    error: 'දෝෂයක් ඇතිවිය. කරුණාකර නැවත උත්සාහ කරන්න.',
    openAccount: 'නව ගිණුමක් විවෘත කරන්න',
    accountType: 'ගිණුම් වර්ගය',
    personalDetails: 'පෞද්ගලික තොරතුරු',
    addressEmployment: 'ලිපිනය සහ රැකියාව',
    reviewSubmit: 'සමාලෝචනය සහ ඉදිරිපත් කිරීම',
    confirmation: 'තහවුරු කිරීම',
    eKycVerify: 'e-KYC සත්‍යාපනය',
    scanNic: 'හැඳුනුම්පත ස්කෑන් කරන්න',
    scanning: 'ස්කෑන් කෙරේ...',
    identityVerified: 'අනන්‍යතාව තහවුරු කරන ලදී',
    darkMode: 'අඳුරු ප්‍රකාරය',
    lightMode: 'ආලෝකමත් ප්‍රකාරය',
    language: 'භාෂාව',
  },
  ta: {
    // Nav
    dashboard: 'டாஷ்போர்டு',
    profile: 'சுயவிவரம்',
    myApplications: 'என் விண்ணப்பங்கள்',
    applyForLoan: 'கடனுக்கு விண்ணப்பிக்கவும்',
    notifications: 'அறிவிப்புகள்',
    staffPortal: 'பணியாளர் போர்டல்',
    signOut: 'வெளியேறு',
    // Hero
    welcomeTitle: 'வங்கி சேவை\nஎளிமையாக & புத்திசாலியாக',
    welcomeSubtitle: 'கணக்குகளைத் திறக்கவும், கடன்களுக்கு விண்ணப்பிக்கவும் மற்றும் உங்கள் நிதிகளை முழுமையாக ஆன்லைனில் நிர்வகிக்கவும்.',
    getStarted: 'தொடங்குங்கள்',
    learnMore: 'மேலும் அறியுங்கள்',
    // Auth
    login: 'உள்நுழைக',
    register: 'பதிவு செய்யுங்கள்',
    email: 'மின்னஞ்சல்',
    password: 'கடவுச்சொல்',
    fullName: 'முழு பெயர்',
    mobileNumber: 'மொபைல் எண்',
    nicNumber: 'தேசிய அடையாள அட்டை எண்',
    dateOfBirth: 'பிறந்த தேதி',
    alreadyHaveAccount: 'ஏற்கனவே கணக்கு உள்ளதா?',
    dontHaveAccount: 'கணக்கு இல்லையா?',
    forgotPassword: 'கடவுச்சொல் மறந்துவிட்டதா?',
    createAccount: 'கணக்கு உருவாக்கு',
    staffLogin: 'பணியாளர் உள்நுழைவு',
    // Loan
    loanApplication: 'கடன் விண்ணப்பம்',
    loanType: 'கடன் வகை',
    requestedAmount: 'கோரிய தொகை',
    tenureMonths: 'காலம் (மாதங்கள்)',
    saveAsDraft: 'வரைவாக சேமிக்கவும்',
    submitApplication: 'விண்ணப்பத்தை சமர்ப்பிக்கவும்',
    emiCalculator: 'EMI கணக்கிடுவி',
    monthlyEmi: 'மாதாந்திர EMI',
    // Status
    submitted: 'சமர்ப்பிக்கப்பட்டது',
    underReview: 'மதிப்பாய்வில்',
    approved: 'அனுமதிக்கப்பட்டது',
    rejected: 'நிராகரிக்கப்பட்டது',
    disbursed: 'வழங்கப்பட்டது',
    pendingDocs: 'ஆவணங்கள் நிலுவையில்',
    // Common
    loading: 'ஏற்றுகிறது...',
    save: 'சேமிக்கவும்',
    cancel: 'ரத்து செய்யவும்',
    edit: 'திருத்தவும்',
    delete: 'நீக்கவும்',
    back: 'பின்னால்',
    continue: 'தொடரவும்',
    submit: 'சமர்ப்பிக்கவும்',
    search: 'தேடு',
    filter: 'வடிகட்டு',
    noData: 'தரவு இல்லை.',
    success: 'வெற்றி!',
    error: 'பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.',
    openAccount: 'புதிய கணக்கு திற',
    accountType: 'கணக்கு வகை',
    personalDetails: 'தனிப்பட்ட விவரங்கள்',
    addressEmployment: 'முகவரி மற்றும் வேலைவாய்ப்பு',
    reviewSubmit: 'மதிப்பாய்வு மற்றும் சமர்ப்பிக்கவும்',
    confirmation: 'உறுதிப்படுத்தல்',
    eKycVerify: 'e-KYC சரிபார்ப்பு',
    scanNic: 'அடையாள அட்டை ஸ்கேன் செய்யுங்கள்',
    scanning: 'ஸ்கேன் செய்கிறது...',
    identityVerified: 'அடையாளம் சரிபார்க்கப்பட்டது',
    darkMode: 'இருண்ட பயன்முறை',
    lightMode: 'ஒளி பயன்முறை',
    language: 'மொழி',
  },
}

// ─── Context ──────────────────────────────────────────────────────────────────
const LangContext = createContext()

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('nb_lang') || 'en')

  const changeLang = (l) => {
    setLang(l)
    localStorage.setItem('nb_lang', l)
  }

  const t = (key) => translations[lang]?.[key] ?? translations.en[key] ?? key

  return (
    <LangContext.Provider value={{ lang, changeLang, t }}>
      {children}
    </LangContext.Provider>
  )
}

export const useLang = () => useContext(LangContext)
export { translations }
