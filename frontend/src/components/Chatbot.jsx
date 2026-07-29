import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Globe, Minimize2, Maximize2 } from 'lucide-react'

// Language translations
const translations = {
  en: {
    title: 'NovaBank Assistant',
    placeholder: 'Type your message...',
    send: 'Send',
    welcome: 'Hello! I\'m your NovaBank assistant. How can I help you today?',
    languages: {
      en: 'English',
      si: 'සිංහල',
      ta: 'தமிழ்'
    },
    quickActions: {
      loan: 'Apply for a loan',
      account: 'Open an account',
      support: 'Contact support',
      rates: 'View interest rates'
    },
    responses: {
      loan: 'To apply for a loan, please visit our loan application page. We offer personal loans, housing loans, auto loans, and business loans with competitive rates.',
      account: 'You can open an account by clicking the "Open Account" button in your dashboard. We offer savings accounts, current accounts, and fixed deposits.',
      support: 'For immediate assistance, please call our hotline at +94 11 234 5678 or email support@novabank.lk',
      rates: 'Our current interest rates are: Personal Loan - 11.0% p.a., Housing Loan - 9.5% p.a., Auto Loan - 12.0% p.a.',
      default: 'Thank you for your message. Our team will assist you shortly. For urgent matters, please call our hotline at +94 11 234 5678.'
    }
  },
  si: {
    title: 'නෝවා බැංකු සහයෝගකරු',
    placeholder: 'ඔබේ පණිවිඩය ලියන්න...',
    send: 'යවන්න',
    welcome: 'ආයුබෝවන්! මම ඔබගේ නෝවා බැංකු සහයෝගකරු. අද මට ඔබට කෙසේ උදව් කළ හැක?',
    languages: {
      en: 'English',
      si: 'සිංහල',
      ta: 'தமிழ்'
    },
    quickActions: {
      loan: 'ණයක් ඉල්ලා සිටින්න',
      account: 'ගිණුමක් විවෘත කරන්න',
      support: 'ආධාරය සඳහා සම්බන්ධ වන්න',
      rates: 'පොලී අනුපාත බලන්න'
    },
    responses: {
      loan: 'ණයක් ඉල්ලා සිටීමට, කරුණාකර අපගේ ණය අයදුම්පත් පිටුවට පිවිසෙන්න. අපි තරඟකාරී අනුපාත සහිතව පුද්ගලික ණය, නිවාස ණය, වාහන ණය සහ ව්‍යාපාර ණය පිරිනමමු.',
      account: 'ඔබගේ ඩෑෂ්බෝඩ් හි "ගිණුමක් විවෘත කරන්න" බොත්තම ක්ලික් කිරීමෙන් ඔබට ගිණුමක් විවෘත කළ හැක. අපි ඉතිරි මුදල් ගිණුම්, ධාවන ගිණුම් සහ ස්ථිර තැන්පතු පිරිනමමු.',
      support: 'ඉක්මන් උපකාරයක් සඳහා, කරුණාකර අපගේ හොට්ලයින් අංකය +94 11 234 5678 ට ඇමතුමක් ගන්න හෝ support@novabank.lk වෙත විද්‍යුත් තැපැල් කරන්න',
      rates: 'අපගේ වර්තමාන පොලී අනුපාත: පුද්ගලික ණය - වාර්ෂික 11.0%, නිවාස ණය - වාර්ෂික 9.5%, වාහන ණය - වාර්ෂික 12.0%',
      default: 'ඔබේ පණිවිඩයට ස්තූතියි. අපගේ කණ්ඩායම ඉක්මනින් ඔබට උපකාර කරනු ඇත. ගැටලු සඳහා, කරුණාකර +94 11 234 5678 හොට්ලයින් අංකයට ඇමතුමක් ගන්න.'
    }
  },
  ta: {
    title: 'நோவாவங்கி உதவியாளர்',
    placeholder: 'உங்கள் செய்தியை தட்டச்சு செய்யவும்...',
    send: 'அனுப்பு',
    welcome: 'வணக்கம்! நான் உங்கள் நோவாவங்கி உதவியாளர். இன்று நான் எப்படி உங்களுக்கு உதவ முடியும்?',
    languages: {
      en: 'English',
      si: 'සිංහල',
      ta: 'தமிழ்'
    },
    quickActions: {
      loan: 'கடன் விண்ணப்பிக்கவும்',
      account: 'கணக்கு திறக்கவும்',
      support: 'ஆதரவுக்கு தொடர்பு கொள்ளவும்',
      rates: 'வட்டி விகிதங்களை பார்க்கவும்'
    },
    responses: {
      loan: 'கடன் விண்ணப்பிக்க, தயவு செய்து எங்கள் கடன் விண்ணப்பப் பக்கத்திற்குச் செல்லவும். நாங்கள் போட்டியின் விகிதங்களுடன் தனிப்பட்ட கடன்கள், வீட்டுக் கடன்கள், வாகனக் கடன்கள் மற்றும் வணிகக் கடன்களை வழங்குகிறோம்.',
      account: 'உங்கள் டாஷ்போர்டில் "கணக்கு திறக்கவும்" பொத்தானைக் கிளிக் செய்வதன் மூலம் நீங்கள் ஒரு கணக்கைத் திறக்கலாம். நாங்கள் சேமிப்புக் கணக்குகள், ஓட்டுக் கணக்குகள் மற்றும் நிலையான வைப்புகளை வழங்குகிறோம்.',
      support: 'உடனடி உதவிக்கு, தயவு செய்து எங்கள் ஹாட்லைன் +94 11 234 5678 க்கு அழைக்கவும் அல்லது support@novabank.lk க்கு மின்னஞ்சல் செய்யவும்',
      rates: 'எங்கள் தற்போதைய வட்டி விகிதங்கள்: தனிப்பட்ட கடன் - ஆண்டுக்கு 11.0%, வீட்டுக் கடன் - ஆண்டுக்கு 9.5%, வாகனக் கடன் - ஆண்டுக்கு 12.0%',
      default: 'உங்கள் செய்திக்கு நன்றி. எங்கள் குழு விரைவில் உங்களுக்கு உதவும். அவசரகால விஷயங்களுக்கு, தயவு செய்து +94 11 234 5678 ஹாட்லைன் எண்ணிற்கு அழைக்கவும்.'
    }
  }
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [language, setLanguage] = useState('en')
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef(null)

  const t = translations[language]

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{ role: 'bot', text: t.welcome }])
    }
  }, [language, t.welcome])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSend = () => {
    if (!inputValue.trim()) return

    const userMessage = { role: 'user', text: inputValue }
    setMessages([...messages, userMessage])
    setInputValue('')

    // Simulate bot response
    setTimeout(() => {
      let botResponse = t.responses.default
      const lowerInput = inputValue.toLowerCase()

      if (lowerInput.includes('loan') || lowerInput.includes('ණය') || lowerInput.includes('கடன்')) {
        botResponse = t.responses.loan
      } else if (lowerInput.includes('account') || lowerInput.includes('ගිණුම') || lowerInput.includes('கணக்கு')) {
        botResponse = t.responses.account
      } else if (lowerInput.includes('support') || lowerInput.includes('help') || lowerInput.includes('උදව්') || lowerInput.includes('உதவி')) {
        botResponse = t.responses.support
      } else if (lowerInput.includes('rate') || lowerInput.includes('interest') || lowerInput.includes('පොලී') || lowerInput.includes('வட்டி')) {
        botResponse = t.responses.rates
      }

      setMessages(prev => [...prev, { role: 'bot', text: botResponse }])
    }, 1000)
  }

  const handleQuickAction = (action) => {
    const responses = {
      loan: t.responses.loan,
      account: t.responses.account,
      support: t.responses.support,
      rates: t.responses.rates
    }
    setMessages([...messages, { role: 'user', text: t.quickActions[action] }])
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'bot', text: responses[action] }])
    }, 500)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full ios-liquid-btn-primary shadow-lg transition-transform hover:scale-110"
        title="Chat with us"
      >
        <MessageCircle className="h-6 w-6 text-white" />
      </button>
    )
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 w-full max-w-sm transition-all ${isMinimized ? 'h-14' : 'h-[500px]'}`}>
      <div className="flex h-full flex-col rounded-2xl ios-liquid-modal overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/20 bg-navy-700/50 px-4 py-3 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-500">
              <MessageCircle className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">{t.title}</h3>
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-green-400" />
                <span className="text-[11px] text-navy-200">Online</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="rounded-lg p-1.5 text-white/80 hover:bg-white/10 hover:text-white transition-colors"
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1.5 text-white/80 hover:bg-white/10 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Language Selector */}
            <div className="flex gap-2 border-b border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm">
              {Object.entries(t.languages).map(([code, name]) => (
                <button
                  key={code}
                  onClick={() => setLanguage(code)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                    language === code
                      ? 'bg-accent-500 text-white'
                      : 'text-navy-600 hover:bg-white/20'
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto bg-white/30 p-4 backdrop-blur-sm">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-3 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                      msg.role === 'user'
                        ? 'bg-accent-500 text-white'
                        : 'ios-liquid-card text-navy-800'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2 border-t border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm overflow-x-auto">
              {Object.entries(t.quickActions).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => handleQuickAction(key)}
                  className="whitespace-nowrap rounded-lg ios-liquid-dropdown-item px-3 py-1.5 text-xs font-medium text-navy-700 hover:bg-accent-500/20 transition-colors"
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="flex gap-2 border-t border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t.placeholder}
                className="flex-1 rounded-lg ios-liquid-input px-4 py-2 text-sm text-navy-800 placeholder-navy-400 focus:outline-none"
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className="rounded-lg ios-liquid-btn-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
