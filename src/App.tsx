import { useEffect, useRef, useState } from 'react'
import './styles/landing.css'
import './styles/success.css'
import Footer from './components/Footer'
import SuccessScreen from './components/SuccessScreen'
import Logo from './assets/images/pequeno-principe/pp-logo.png'
import CastleImage from './assets/images/pequeno-principe/castle.png'


const apiUrl = import.meta.env.VITE_API_URL as string | undefined

const webhookUrl = import.meta.env.VITE_WEBHOOK_URL

const whatsappLink = 'https://wa.me/5511925316357'

const formatWhatsApp = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 11)

  if (digits.length <= 2) return digits
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

const normalizeWhatsapp = (value: string) => value.replace(/\D/g, '').slice(0, 11)

const getUtmData = () => {
  if (typeof window === 'undefined') {
    return {}
  }

  const currentUrl = new URL(window.location.href)
  const currentPage = currentUrl.origin
  const params = new URLSearchParams(currentUrl.search)
  const fields = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_term',
    'utm_content',
    'utm_id',
    'utm_name',
    'utm_placement',
    'gclid',
  ] as const

  const utmData: Record<string, string> = {}

  for (const field of fields) {
    const value = params.get(field)

    if (value && value.trim()) {
      utmData[field] = value.trim()
    }
  }

  if (document.referrer) {
    try {
      const referrerUrl = new URL(document.referrer)
      utmData.referrer = referrerUrl.origin
    } catch {
      utmData.referrer = document.referrer
    }
  }

  utmData.landing_page = currentPage

  return utmData
}

function ArrowIcon({ direction = 'right' }: { direction?: 'left' | 'right' }) {
  return direction === 'left' ? (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </svg>
  ) : (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

function WhatsAppIcon({ size = 20 }: { size?: number }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l2.1-5.4A8.4 8.4 0 1 1 21 11.5z" />
    </svg>
  )
}

function scrollCardToCenter(track: HTMLElement, card: HTMLElement, smooth: boolean) {
  const cardRect = card.getBoundingClientRect()
  const trackRect = track.getBoundingClientRect()
  const left = track.scrollLeft + cardRect.left + cardRect.width / 2 - (trackRect.left + track.clientWidth / 2)

  if (smooth) {
    track.scrollTo({ left, behavior: 'smooth' })
  } else {
    track.scrollLeft = left
  }
}

function App() {
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname)
  const [formData, setFormData] = useState({
    responsibleName: '',
    whatsapp: '',
    interestSeries: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')
  const trackRef = useRef<HTMLDivElement>(null)
  const carouselScrollTimeoutRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    const handleLocationChange = () => setCurrentPath(window.location.pathname)

    window.addEventListener('popstate', handleLocationChange)

    return () => {
      window.removeEventListener('popstate', handleLocationChange)
    }
  }, [])

  useEffect(() => {
    const track = trackRef.current
    const firstCard = track?.querySelectorAll<HTMLElement>('.experience-card')[1]

    if (!track || !firstCard) {
      return
    }

    scrollCardToCenter(track, firstCard, false)
  }, [])

  useEffect(() => () => {
    window.clearTimeout(carouselScrollTimeoutRef.current)
  }, [])

  if (currentPath === '/sucesso') {
    return <SuccessScreen />
  }

  const fields = [
    {
      key: 'responsibleName',
      label: 'Nome do responsável',
      placeholder: 'Como podemos te chamar...',
      type: 'text',
      value: formData.responsibleName,
      maxLength: undefined,
    },
    {
      key: 'whatsapp',
      label: 'WhatsApp',
      placeholder: '(11) 99999-9999',
      type: 'tel',
      value: formData.whatsapp,
      maxLength: 15,
    },
    {
      key: 'interestSeries',
      label: 'Série de interesse',
      placeholder: 'Ex.: 1º ano do ensino fundamental',
      type: 'text',
      value: formData.interestSeries,
      maxLength: undefined,
    },
  ] as const

  const isFormValid = () => (
    formData.responsibleName.trim().length >= 2
    && normalizeWhatsapp(formData.whatsapp).length >= 10
    && formData.interestSeries.trim().length >= 2
  )

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setSubmitMessage('')
    setFormData((prev) => ({
      ...prev,
      [field]: field === 'whatsapp' ? formatWhatsApp(value) : value,
    }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!isFormValid()) {
      setSubmitMessage('Confira o nome, o WhatsApp e a série de interesse antes de enviar.')
      return
    }

    if (!apiUrl) {
      return
    }

    const payload = {
      responsible_name: formData.responsibleName.trim(),
      mobile_phone: normalizeWhatsapp(formData.whatsapp),
      interest: formData.interestSeries.trim(),
      ...getUtmData(),
    }

    setIsSubmitting(true)
    setSubmitMessage('')

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      })

      await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: formData.responsibleName.trim(),
          phone: normalizeWhatsapp(formData.whatsapp),
          tags: ['landing-page'],
        }),
      })

      const result = await response.json().catch(() => null) as {
        success?: boolean
        message?: string
        lead?: unknown
        data?: unknown
        errors?: Record<string, string[]>
      } | null

      if (!response.ok || result?.success === false) {
        const fieldErrors = result?.errors
        const errorMessage = fieldErrors
          ? Object.values(fieldErrors)
              .flat()
              .join(' ')
          : result?.message || 'Não foi possível enviar os dados neste momento.'

        throw new Error(errorMessage)
      }

      const successMessage = typeof result?.message === 'string' && result.message.trim()
        ? result.message
        : 'Dados enviados com sucesso!'

      setSubmitMessage(successMessage)
      setFormData({
        responsibleName: '',
        whatsapp: '',
        interestSeries: '',
      })
      window.history.pushState({}, '', '/sucesso')
      setCurrentPath('/sucesso')
    } catch (error) {
      console.error('Erro ao enviar lead:', error)
      setSubmitMessage(error instanceof Error ? error.message : 'Não foi possível enviar os dados neste momento. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="site-shell" id="inicio">
      <section className="hero-section">
        <div className="hero-stars" aria-hidden="true" />
        <div className="hero-container">
          <header className="hero-header">
            <a className="hero-brand" href="#inicio" aria-label="Colégio Pequeno Príncipe — início">
              <img src={Logo} alt="Colégio Pequeno Príncipe" />
            </a>
            <div className="enrollment-badge" aria-label="Matrículas abertas para 2027">
              <span className="enrollment-year">2027</span>
              <span className="enrollment-copy">
                <span>MATRÍCULAS</span>
                <strong>ABERTAS</strong>
              </span>
            </div>
          </header>

          <div className="hero-row">
            <div className="hero-copy">
              <p className="hero-eyebrow">A ESCOLA QUE É UM CASTELO</p>
              <h1 className="hero-title">
                <span className="gold-text">A escola certa</span>
                <br />
                para sua família.
              </h1>

              <div className="lead-card" id="agendar">
                <h2>Preencha e <strong>agende uma visita</strong></h2>
                <form className="lead-form" onSubmit={handleSubmit}>
                  {fields.map((field) => (
                    <div className="form-field" key={field.key}>
                      <label htmlFor={field.key}>{field.label}</label>
                      <input
                        id={field.key}
                        type={field.type}
                        value={field.value}
                        maxLength={field.maxLength}
                        placeholder={field.placeholder}
                        required
                        onChange={(event) => handleInputChange(field.key, event.target.value)}
                      />
                    </div>
                  ))}
                  <div className="form-actions">
                    <button className="button button-yellow form-next" type="submit" disabled={isSubmitting || !isFormValid()}>
                      {isSubmitting ? 'Enviando...' : 'Quero agendar minha visita'}
                      <ArrowIcon />
                    </button>
                  </div>
                  {submitMessage && <p className="form-message" role="alert">{submitMessage}</p>}
                </form>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-art" aria-label="Fachada do castelo do Colégio Pequeno Príncipe">
          <div className="hero-halo" aria-hidden="true" />
          <img className="hero-castle" src={CastleImage} alt="Fachada em formato de castelo do Colégio Pequeno Príncipe" />
        </div>
      </section>

      <Footer />

      <a className="whatsapp-float" href={whatsappLink} aria-label="Falar no WhatsApp" target="_blank" rel="noreferrer">
        <WhatsAppIcon size={28} />
      </a>
    </main>
  )
}

export default App
