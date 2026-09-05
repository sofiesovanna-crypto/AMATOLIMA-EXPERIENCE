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
            <img class="amato-footer__mark" src="assets/images/monograma.png" alt="" />
            <span class="amato-footer__brand-copy"><strong>Amato Lima</strong><span>Ativos Imobiliários</span></span>
          </a>
          <p class="amato-footer__intro">Arquitetura, matéria e precisão aplicadas a ativos residenciais de alto padrão em São Paulo.</p>
          <div class="amato-footer__social" aria-label="Redes sociais">
            <a href="#" aria-label="Instagram">Instagram</a>
            <a href="#" aria-label="LinkedIn">LinkedIn</a>
          </div>
        </div>

        <div class="amato-footer__column">
          <h3>Ativos</h3>
          <nav class="amato-footer__links" aria-label="Ativos">
            <a href="ativos.html">Imóveis</a>
            <a href="reformas.html">Reformas</a>
            <a href="projetos.html">Projetos</a>
            <a href="contato.html">Contato</a>
          </nav>
        </div>

        <div class="amato-footer__column">
          <h3>Amato Lima</h3>
          <nav class="amato-footer__links" aria-label="Amato Lima">
            <a href="sobre.html">Sobre</a>
            <a href="index.html#fundamentos">Fundamentos</a>
            <a href="index.html#transformacao">Processo</a>
            <a href="contato.html">Conversar</a>
          </nav>
        </div>

        <div class="amato-footer__column">
          <h3>Contato</h3>
          <nav class="amato-footer__links" aria-label="Contato">
            <a href="contato.html">Fale conosco</a>
            <a href="projetos.html">Portfólio</a>
            <a href="ativos.html">Ativos disponíveis</a>
            <a href="sobre.html">São Paulo, SP</a>
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
