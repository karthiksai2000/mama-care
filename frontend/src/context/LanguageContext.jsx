import React, { createContext, useContext, useState, useCallback } from 'react';

const translations = {
  en: {
    dashboard: 'Dashboard', chatbot: 'AI Chat Assistant', reports: 'Medical Reports', diet: 'Diet Plan',
    kickCounter: 'Kick Counter', contractionTimer: 'Contraction Timer', riskCalc: 'Risk Calculator',
    weightTracker: 'Weight Tracker', symptomChecker: 'Symptom Checker', babyGrowth: 'Baby Growth',
    appointments: 'Appointments', community: 'Community Forum', partner: 'Partner Portal',
    welcome: 'Welcome back', profile: 'Profile', logout: 'Logout', login: 'Login', signup: 'Sign Up',
    healthTools: 'Health Tools', babyNutrition: 'Baby & Nutrition', records: 'Records', social: 'Social',
    main: 'Main', week: 'Week', trimester: 'Trimester', dueDate: 'Due Date', reminders: 'Today\'s Reminders',
    settings: 'Settings', darkMode: 'Dark Mode', language: 'Language',
  },
  hi: {
    dashboard: 'डैशबोर्ड', chatbot: 'AI चैट सहायक', reports: 'मेडिकल रिपोर्ट', diet: 'डाइट प्लान',
    kickCounter: 'किक काउंटर', contractionTimer: 'संकुचन टाइमर', riskCalc: 'जोखिम कैलकुलेटर',
    weightTracker: 'वजन ट्रैकर', symptomChecker: 'लक्षण जाँच', babyGrowth: 'शिशु विकास',
    appointments: 'अपॉइंटमेंट', community: 'सामुदायिक फोरम', partner: 'पार्टनर पोर्टल',
    welcome: 'वापसी पर स्वागत है', profile: 'प्रोफ़ाइल', logout: 'लॉग आउट', login: 'लॉग इन', signup: 'साइन अप',
    healthTools: 'स्वास्थ्य उपकरण', babyNutrition: 'शिशु और पोषण', records: 'रिकॉर्ड', social: 'सामाजिक',
    main: 'मुख्य', week: 'सप्ताह', trimester: 'तिमाही', dueDate: 'नियत तारीख', reminders: 'आज के रिमाइंडर',
    settings: 'सेटिंग्स', darkMode: 'डार्क मोड', language: 'भाषा',
  },
  te: {
    dashboard: 'డ్యాష్‌బోర్డ్', chatbot: 'AI చాట్ సహాయకుడు', reports: 'వైద్య నివేదికలు', diet: 'ఆహార ప్రణాళిక',
    kickCounter: 'కిక్ కౌంటర్', contractionTimer: 'సంకోచ టైమర్', riskCalc: 'రిస్క్ కాలిక్యులేటర్',
    weightTracker: 'బరువు ట్రాకర్', symptomChecker: 'లక్షణ తనిఖీ', babyGrowth: 'బేబీ పెరుగుదల',
    appointments: 'అపాయింట్‌మెంట్లు', community: 'కమ్యూనిటీ ఫోరం', partner: 'భాగస్వామి పోర్టల్',
    welcome: 'తిరిగి స్వాగతం', profile: 'ప్రొఫైల్', logout: 'లాగ్ అవుట్', login: 'లాగిన్', signup: 'సైన్ అప్',
    healthTools: 'ఆరోగ్య సాధనాలు', babyNutrition: 'బేబీ & పోషణ', records: 'రికార్డులు', social: 'సామాజిక',
    main: 'ప్రధాన', week: 'వారం', trimester: 'త్రైమాసికం', dueDate: 'గడువు తేదీ', reminders: 'నేటి రిమైండర్లు',
    settings: 'సెట్టింగ్‌లు', darkMode: 'డార్క్ మోడ్', language: 'భాష',
  },
  ta: {
    dashboard: 'டாஷ்போர்டு', chatbot: 'AI அரட்டை உதவியாளர்', reports: 'மருத்துவ அறிக்கைகள்', diet: 'உணவுத் திட்டம்',
    kickCounter: 'கிக் கவுண்டர்', contractionTimer: 'சுருக்க டைமர்', riskCalc: 'ரிஸ்க் கால்குலேட்டர்',
    weightTracker: 'எடை டிராக்கர்', symptomChecker: 'அறிகுறி சரிபார்ப்பு', babyGrowth: 'குழந்தை வளர்ச்சி',
    appointments: 'சந்திப்புகள்', community: 'சமூக மன்றம்', partner: 'பார்ட்னர் போர்டல்',
    welcome: 'மீண்டும் வரவேற்கிறோம்', profile: 'சுயவிவரம்', logout: 'வெளியேறு', login: 'உள்நுழை', signup: 'பதிவு',
    healthTools: 'சுகாதார கருவிகள்', babyNutrition: 'குழந்தை & ஊட்டச்சத்து', records: 'பதிவுகள்', social: 'சமூகம்',
    main: 'முதன்மை', week: 'வாரம்', trimester: 'மூன்று மாதம்', dueDate: 'நிலுவை தேதி', reminders: 'இன்றைய நினைவூட்டல்கள்',
    settings: 'அமைப்புகள்', darkMode: 'டார்க் பயன்முறை', language: 'மொழி',
  },
};

const LANG_NAMES = { en: 'English', hi: 'हिन्दी', te: 'తెలుగు', ta: 'தமிழ்' };
const LANG_LIST = Object.entries(LANG_NAMES);

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => localStorage.getItem('mama_lang') || 'en');

  const t = useCallback((key) => translations[lang]?.[key] || translations.en[key] || key, [lang]);

  const changeLang = (l) => { setLang(l); localStorage.setItem('mama_lang', l); };

  return (
    <LanguageContext.Provider value={{ lang, t, changeLang, LANG_LIST }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};
