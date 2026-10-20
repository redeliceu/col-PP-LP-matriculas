import Logo from '../assets/images/pequeno-principe/pp-logo.png'

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-top">
          <a className="footer-brand" href="#inicio" aria-label="Colégio Pequeno Príncipe — início">
            <img src={Logo} alt="Colégio Pequeno Príncipe" />
          </a>

          <nav className="footer-nav" aria-label="Rodapé">
            <a href="#diferenciais">A escola</a>
            <a href="#estrutura">Estrutura</a>
            <a href="#localizacao">Localização</a>
            <a href="#faq">Dúvidas</a>
            <a href="https://instagram.com/pprincipe_pprincesa" target="_blank" rel="noreferrer">
              @pprincipe_pprincesa
            </a>
          </nav>
        </div>

        <p className="footer-copy">
          © 2026 Colégio Pequeno Príncipe · Rede Liceu – Unidade Suzano. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  )
}

export default Footer
