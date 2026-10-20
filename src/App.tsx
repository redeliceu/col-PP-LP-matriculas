import { useEffect, useRef, useState } from 'react'
import './styles/landing.css'
import './styles/success.css'
import Footer from './components/Footer'
import SuccessScreen from './components/SuccessScreen'
import Logo from './assets/images/pequeno-principe/pp-logo.png'
import LiceuLogo from './assets/images/pequeno-principe/liceu-logo.png'
import CastleImage from './assets/images/pequeno-principe/pp-castle.png'
import ChildImage from './assets/images/pequeno-principe/pp-hero-child.png'
import PsychologistImage from './assets/images/pequeno-principe/pp-psychologist.jpg'
import PsychologistImage2 from './assets/images/pequeno-principe/pp-psychologist2.png'
import FinancialEducationImage from './assets/images/pequeno-principe/pp-financial-education.jpg'
import FinancialEducationImage2 from './assets/images/pequeno-principe/pp-financial-education2.png'
import PaintingImage from './assets/images/pequeno-principe/pp-painting.jpg'
import LiceuFacadeImage from './assets/images/pequeno-principe/liceu-suzano-facade.png'
import ClassSelfie from './assets/images/pequeno-principe/class-selfie.png'
import FoodImage from './assets/images/pequeno-principe/pp-food.png'
import EnglishImage from './assets/images/pequeno-principe/pp-english.jpg'
import BalletImage from './assets/images/ballet.jpg'
import JudoImage from './assets/images/judo.jpg'
import RobotImage from './assets/images/pequeno-principe/pp-robot.jpg'
import SecurityImage from './assets/images/pequeno-principe/pp-security.jpeg'
import MusicalizationImage from './assets/images/pequeno-principe/pp-music.jpg'

const features = [
  {
    title: 'Uma escola que é um castelo',
    description: 'Um espaço que encanta e faz a criança querer chegar.',
    img: CastleImage,
  },
  {
    title: 'Turmas reduzidas',
    description: 'Cada criança acompanhada de perto pela equipe.',
    img: ClassSelfie,
  },
  {
    title: 'Período integral',
    description: 'Do berçário (a partir de 4 meses) ao Fundamental I.',
    img: FoodImage,
  },
  {
    title: 'Ensino bilíngue',
    description: 'O inglês presente no dia a dia das crianças.',
    img: EnglishImage,
  },
]

const slides = [
  { title: 'Ballet', alt: 'Aula de ballet', img: BalletImage },
  { title: 'Judô', alt: 'Aula de judô', img: JudoImage },
  { title: 'Musicalização', alt: 'Aula de musicalização', img: MusicalizationImage },
  { title: 'Tecnologia e Robótica', alt: 'Aluno montando um robô', img: RobotImage },
  { title: 'Educação Financeira', alt: 'Educação financeira', img: FinancialEducationImage2 },
  { title: 'Psicóloga Escolar', alt: 'Psicóloga escolar', img: PsychologistImage2 },
  { title: 'Segurança: ronda e totem', alt: 'Ronda de segurança', img: SecurityImage },
]

const carouselSlides = [
  { ...slides[slides.length - 1], isClone: true },
  ...slides.map((slide) => ({ ...slide, isClone: false })),
  { ...slides[0], isClone: true },
]

const faqItems = [
  {
    question: 'Quais séries o colégio atende?',
    answer: 'Do berçário (a partir de 4 meses) ao Fundamental I. O Fundamental II e o Ensino Médio ficam na Rede Liceu – Unidade Suzano, que faz parte da mesma rede e fica a poucos metros do Pequeno Príncipe. Ideal para famílias com filhos em ciclos diferentes que buscam praticidade, sem abrir mão da qualidade.',
  },
  {
    question: 'Qual o período? Tem integral?',
    answer: 'Sim. Oferecemos turnos e opções de integral para atender as necessidades da sua família, com acompanhamento pedagógico e atividades complementares.',
  },
  {
    question: 'Como funcionam a mensalidade e as condições pra 2027?',
    answer: 'As condições e valores são divulgados conforme o ciclo letivo e podem ser conversados diretamente com nossa equipe durante a visita.',
  },
  {
    question: 'Meu filho está em outra escola. Dá pra trocar agora?',
    answer: 'Sim. O processo de transferência é bem simples e nosso time pode orientar você passo a passo sobre matrícula, documentação e adaptação.',
  },
  {
    question: 'Onde fica e tem transporte?',
    answer: 'Estamos na R. Dona Augusta Aparecida de Carvalho Moraes, 421 – Jd. Santa Helena, Suzano, ao lado do D’avó e do Suzano Shopping. Fale com a nossa equipe para mais detalhes sobre acesso e transporte escolar.',
  },
]

const apiUrl = import.meta.env.VITE_API_URL as string | undefined

const webhookUrl = import.meta.env.VITE_WEBHOOK_URL

const whatsappLink = 'https://wa.me/5511963709401'
const mapsLink = 'https://www.google.com/maps/search/?api=1&query=R.+Dona+Augusta+Aparecida+de+Carvalho+Moraes,+421,+Suzano'
const mapsEmbedUrl = 'https://www.google.com/maps?q=R.+Dona+Augusta+Aparecida+de+Carvalho+Moraes,+421,+Jardim+Santa+Helena,+Suzano+-+SP&z=15&output=embed'

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
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname)
  const [formData, setFormData] = useState({
    responsibleName: '',
    whatsapp: '',
    interestSeries: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')
  const trackRef = useRef<HTMLDivElement>(null)
  const carouselIndexRef = useRef(0)
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

  const steps = [
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

  const isStepValid = (stepIndex: number) => {
    const currentField = steps[stepIndex].key

    if (currentField === 'responsibleName') {
      return formData.responsibleName.trim().length >= 2
    }

    if (currentField === 'whatsapp') {
      return normalizeWhatsapp(formData.whatsapp).length >= 10
    }

    return formData.interestSeries.trim().length >= 2
  }

  const isCurrentStepValid = () => isStepValid(currentStep)

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setSubmitMessage('')
    setFormData((prev) => ({
      ...prev,
      [field]: field === 'whatsapp' ? formatWhatsApp(value) : value,
    }))
  }

  const handleNextStep = () => {
    if (!isCurrentStepValid()) {
      return
    }

    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
  }

  const handlePreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const firstInvalidStep = steps.findIndex((_, index) => !isStepValid(index))

    if (firstInvalidStep !== -1) {
      setCurrentStep(firstInvalidStep)
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
      setCurrentStep(0)
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

  const scrollSlides = (direction: -1 | 1) => {
    const track = trackRef.current

    if (!track) {
      return
    }

    const currentIndex = carouselIndexRef.current
    const nextIndex = (currentIndex + direction + slides.length) % slides.length
    const renderedIndex = direction === 1 && currentIndex === slides.length - 1
      ? slides.length + 1
      : direction === -1 && currentIndex === 0
        ? 0
        : nextIndex + 1
    const nextCard = track.querySelectorAll<HTMLElement>('.experience-card')[renderedIndex]

    if (!nextCard) {
      return
    }

    carouselIndexRef.current = nextIndex
    scrollCardToCenter(track, nextCard, true)
  }

  const handleCarouselScroll = () => {
    const track = trackRef.current

    if (!track) {
      return
    }

    window.clearTimeout(carouselScrollTimeoutRef.current)
    carouselScrollTimeoutRef.current = window.setTimeout(() => {
      const cards = track.querySelectorAll<HTMLElement>('.experience-card')
      const trackCenter = track.getBoundingClientRect().left + track.clientWidth / 2
      let nearestIndex = 0
      let nearestDistance = Number.POSITIVE_INFINITY

      cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect()
        const distance = Math.abs(rect.left + rect.width / 2 - trackCenter)

        if (distance < nearestDistance) {
          nearestDistance = distance
          nearestIndex = index
        }
      })

      if (nearestIndex === 0) {
        carouselIndexRef.current = slides.length - 1
        scrollCardToCenter(track, cards[slides.length], false)
      } else if (nearestIndex === slides.length + 1) {
        carouselIndexRef.current = 0
        scrollCardToCenter(track, cards[1], false)
      } else {
        carouselIndexRef.current = nearestIndex - 1
      }
    }, 120)
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
              <p className="hero-description">
                Do berçário ao Fundamental I, com <strong>ensino bilíngue</strong>, <strong>período integral</strong> e <strong>turmas reduzidas</strong> em um castelo onde cada criança é vista de perto.
              </p>

              <div className="lead-card" id="agendar">
                <h2>Preencha e <strong>agende uma visita</strong></h2>
                <form className="lead-form" onSubmit={handleSubmit}>
                  <label htmlFor={steps[currentStep].key}>{steps[currentStep].label}</label>
                  <input
                    id={steps[currentStep].key}
                    type={steps[currentStep].type}
                    value={steps[currentStep].value}
                    maxLength={steps[currentStep].maxLength}
                    placeholder={steps[currentStep].placeholder}
                    onChange={(event) => handleInputChange(steps[currentStep].key, event.target.value)}
                  />
                  <div className="form-actions">
                    {currentStep > 0 && (
                      <button className="form-back" type="button" onClick={handlePreviousStep}>
                        Voltar
                      </button>
                    )}
                    {currentStep < steps.length - 1 ? (
                      <button className="button button-yellow form-next" type="button" onClick={handleNextStep} disabled={!isCurrentStepValid()}>
                        {currentStep === 0 ? 'Avançar' : 'Continuar'}
                        <ArrowIcon />
                      </button>
                    ) : (
                      <button className="button button-yellow form-next" type="submit" disabled={isSubmitting || !isCurrentStepValid()}>
                        {isSubmitting ? 'Enviando...' : 'Quero agendar minha visita'}
                        <ArrowIcon />
                      </button>
                    )}
                  </div>
                  {submitMessage && <p className="form-message" role="alert">{submitMessage}</p>}
                </form>
              </div>
            </div>

            <div className="hero-art" aria-label="Fachada do castelo do Colégio Pequeno Príncipe">
              <div className="hero-halo" aria-hidden="true" />
              <img className="hero-castle" src={CastleImage} alt="Fachada em formato de castelo do Colégio Pequeno Príncipe" />
              <img className="hero-child" src={ChildImage} alt="Menina encantada com as mãos no rosto" />
            </div>
          </div>
        </div>
      </section>

      <div className="school-strip" aria-label="Etapas atendidas">
        <div className="school-strip-inner">
          <div className="strip-item">BERÇÁRIO</div>
          <div className="strip-item">INFANTIL</div>
          <div className="strip-item">FUNDAMENTAL I</div>
          <div className="strip-item">PERÍODO INTEGRAL</div>
        </div>
      </div>

      <section className="features-section grid-background" id="diferenciais">
        <div className="section-container features-container">
          <div className="section-heading">
            <span className="section-kicker">DIFERENCIAIS</span>
            <h2>Tudo o que seu filho precisa para crescer.</h2>
          </div>
          <div className="feature-grid">
            {features.map((feature) => (
              <article className="feature-card" key={feature.title}>
                <div className="feature-image-placeholder" aria-hidden="true">
                  <img src={feature.img} alt="" />
                </div>
                <div className="feature-card-copy">
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              </article>
            ))}
          </div>
          <a className="button button-navy" href="#agendar">
            Quero agendar uma visita <ArrowIcon />
          </a>
        </div>
      </section>

      <section className="proposal-section">
        <div className="section-container proposal-layout">
          <div className="proposal-copy">
            <span className="section-kicker">PROPOSTA</span>
            <h2>Cuidado para acolher. <span>Princípios para crescer.</span></h2>
            <p className="proposal-lead">Aqui seu filho aprende com princípios e valores, do jeito que cada fase pede.</p>
            <p>No Colégio Pequeno Príncipe, as turmas são reduzidas e a equipe conhece cada criança pelo nome. O dia é completo: aprendizado bilíngue, arte, esporte e brincadeira, com acompanhamento próximo de professores e da psicóloga escolar.</p>
            <p>Tudo isso em um castelo de verdade, pensado para que a criança se sinta segura, acolhida e encantada desde o primeiro dia.</p>
            <a className="button button-yellow" href="#agendar">
              Quero conhecer a escola <ArrowIcon />
            </a>
          </div>
          <div className="proposal-collage" aria-label="Atividades e acolhimento no Colégio Pequeno Príncipe">
            <img className="collage-main" src={PsychologistImage} alt="Psicóloga conversando com uma aluna" />
            <img className="collage-top" src={FinancialEducationImage} alt="Crianças guardando moedas em um cofrinho" />
            <img className="collage-bottom" src={PaintingImage} alt="Menino mostrando pintura feita em atividade" />
          </div>
        </div>
      </section>

      <section className="experiences-section" id="estrutura">
        <div className="section-container experiences-container">
          <div className="section-heading">
            <span className="section-kicker">ESTRUTURA &amp; EXPERIÊNCIAS</span>
            <h2>Muito além da <span>sala de aula.</span></h2>
            <p>Atividades que desenvolvem corpo, mente e convivência.</p>
          </div>

          <div className="experience-carousel">
            <div className="experience-track" ref={trackRef} onScroll={handleCarouselScroll}>
              {carouselSlides.map((slide, index) => (
                <article
                  className="experience-card"
                  key={`${slide.title}-${index}`}
                  aria-label={slide.alt}
                  aria-hidden={slide.isClone || undefined}
                >
                  <div className="experience-image-placeholder" aria-hidden="true">
                    <img src={slide.img} alt="" />
                  </div>
                  <div className="experience-shade" aria-hidden="true" />
                  <h3>{slide.title}</h3>
                </article>
              ))}
            </div>
            <button className="carousel-button carousel-previous" type="button" aria-label="Anterior" onClick={() => scrollSlides(-1)}>
              <ArrowIcon direction="left" />
            </button>
            <button className="carousel-button carousel-next" type="button" aria-label="Próximo" onClick={() => scrollSlides(1)}>
              <ArrowIcon />
            </button>
          </div>

          <a className="button button-navy" href="#agendar">
            Quero agendar uma visita <ArrowIcon />
          </a>
        </div>
      </section>

      <section className="continuity-section">
        <div className="continuity-card">
          <div className="continuity-image-wrap">
            <div className="continuity-halo" aria-hidden="true" />
            <img src={LiceuFacadeImage} alt="Fachada do prédio da Rede Liceu – Unidade Suzano" />
          </div>
          <div className="continuity-copy">
            <img className="liceu-logo" src={LiceuLogo} alt="Rede Liceu – Unidade Suzano" />
            <h2>A continuidade da jornada do seu filho.</h2>
            <p>Depois do Fundamental I, a caminhada segue na <strong>Rede Liceu – Unidade Suzano</strong>, com a mesma proximidade e cuidado.</p>
            <div className="continuity-levels">
              <span>FUNDAMENTAL II</span>
              <span>ENSINO MÉDIO</span>
            </div>
          </div>
        </div>
      </section>

      <section className="location-section" id="localizacao">
        <div className="section-container location-container">
          <div className="section-heading">
            <span className="section-kicker">LOCALIZAÇÃO</span>
            <h2><span>A escola certa</span> também precisa ser fácil de chegar.</h2>
            <p>Ao lado do D’avó e do Suzano Shopping. Venha conhecer o castelo e conversar com a nossa equipe.</p>
          </div>
          <div className="location-map">
            <iframe
              className="location-map-iframe"
              title="Mapa do Colégio Pequeno Príncipe — R. Dona Augusta Aparecida de Carvalho Moraes, 421, Suzano"
              src={mapsEmbedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <a className="button button-yellow" href={mapsLink} target="_blank" rel="noreferrer">
            Ver rota no mapa <ArrowIcon />
          </a>
        </div>
      </section>

      <section className="visit-banner">
        <div className="hero-stars" aria-hidden="true" />
        <div className="visit-banner-content">
          <p>VENHA CONHECER DE PERTO</p>
          <h2>A escola que é um <span className="gold-text">castelo.</span></h2>
          <a className="button button-yellow" href={`${whatsappLink}?text=Ol%C3%A1!%20Quero%20agendar%20uma%20visita%20ao%20Col%C3%A9gio%20Pequeno%20Pr%C3%ADncipe`} target="_blank" rel="noreferrer">
            <WhatsAppIcon />
            Agendar pelo WhatsApp · 11 96370-9401
          </a>
          <div className="banner-halo" aria-hidden="true" />
          <img className="banner-castle" src={CastleImage} alt="Fachada do castelo do Colégio Pequeno Príncipe" />
        </div>
      </section>

      <section className="faq-section" id="faq">
        <div className="section-container faq-layout">
          <div className="faq-intro">
            <span className="section-kicker">FAQ</span>
            <h2>Perguntas que toda mãe e pai faz</h2>
            <a className="button button-navy" href="#agendar">
              Agendar uma visita <ArrowIcon />
            </a>
          </div>
          <div className="faq-list">
            {faqItems.map((item, index) => {
              const isOpen = openFaq === index

              return (
                <article className="faq-item" key={item.question}>
                  <button
                    type="button"
                    className="faq-question"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    aria-expanded={isOpen}
                  >
                    <span>{item.question}</span>
                    <span className="faq-icon" aria-hidden="true">{isOpen ? '−' : '+'}</span>
                  </button>
                  {isOpen && <p className="faq-answer">{item.answer}</p>}
                </article>
              )
            })}
          </div>
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
