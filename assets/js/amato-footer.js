"use strict";

(function initAmatoFooter(){
  const app=document.querySelector("[data-app]");
  if(!app||document.querySelector(".amato-footer"))return;

  const oldFooter=app.querySelector("footer");
  if(oldFooter)oldFooter.remove();

  const space=document.createElement("div");
  space.className="amato-footer-space";
  space.setAttribute("aria-hidden","true");

  const footer=document.createElement("footer");
  footer.className="amato-footer";
  footer.innerHTML=`
    <div class="amato-footer__card">
      <div class="amato-footer__top">
        <div class="amato-footer__identity">
          <a class="amato-footer__brand" href="index.html" aria-label="Amato Lima — página inicial">
            <img class="amato-footer__mark" src="assets/images/logo/9175.png" alt="" />
            <span class="amato-footer__brand-copy"><strong>Amato Lima</strong><span>Ativos Imobiliários</span></span>
          </a>
          <p class="amato-footer__intro">Arquitetura, matéria e precisão aplicadas a ativos residenciais de alto padrão em São Paulo.</p>
          <div class="amato-footer__social" aria-label="Redes sociais">
            <a href="#" aria-label="Instagram" title="Instagram"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"></rect><circle cx="12" cy="12" r="4.25"></circle><circle cx="17.4" cy="6.7" r="1"></circle></svg></a>
            <a href="#" aria-label="WhatsApp" title="WhatsApp"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 11.7a8.4 8.4 0 0 1-12.4 7.4L3.5 20.5l1.5-4.4a8.4 8.4 0 1 1 15.5-4.4Z"></path><path d="M8.3 7.8c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.8 1.9c.1.3.1.5-.1.7l-.6.7c-.2.2-.1.4 0 .6.6 1.1 1.5 2 2.6 2.6.2.1.4.2.6 0l.8-1c.2-.2.4-.3.7-.2l1.8.8c.3.1.5.3.5.5 0 .3-.1 1.4-.7 1.9-.5.5-1.3.8-2.2.6-1-.2-2.8-.9-4.7-2.6-1.5-1.4-2.6-3.1-2.9-4.1-.3-.9 0-1.8.4-2.3.4-.4.8-.6 1.3-.6Z"></path></svg></a>
          </div>
        </div>

        <div class="amato-footer__column">
          <h3>Institucional</h3>
          <nav class="amato-footer__links" aria-label="Institucional">
            <a href="sobre.html">Sobre</a>
          </nav>
        </div>

        <div class="amato-footer__column">
          <h3>Ativos</h3>
          <nav class="amato-footer__links" aria-label="Ativos">
            <a href="ativos.html">Ativos disponíveis</a>
            <a href="projetos.html">Portfólio</a>
          </nav>
        </div>

        <div class="amato-footer__column">
          <h3>Contato</h3>
          <nav class="amato-footer__links" aria-label="Contato">
            <a href="contato.html">Fale conosco</a>
          </nav>
        </div>
      </div>

      <div class="amato-footer__divider"></div>
      <div class="amato-footer__bottom">
        <span>© <span data-amato-footer-year></span> Amato Lima. Todos os direitos reservados.</span>
        <div class="amato-footer__legal"><a href="#">Termos e condições</a><a href="#">Política de privacidade</a></div>
      </div>
    </div>`;

  app.append(space,footer);
  const year=footer.querySelector("[data-amato-footer-year]");
  if(year)year.textContent=new Date().getFullYear();
})();
