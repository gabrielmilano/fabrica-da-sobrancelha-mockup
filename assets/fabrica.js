(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const ZAP = "5548998222134";
  const reduzir = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- senha ---------- */
  const est = { serv: "Design de sobrancelhas", quando: "o quanto antes" };
  const numero = () => { const a = new Date(); return "A" + String((a.getHours() * 60 + a.getMinutes()) % 1000).padStart(3, "0"); };
  function atualizar() {
    const nome = $("#nome").value.trim();
    $("#tk-serv").textContent = est.serv;
    $("#tk-quando").textContent = est.quando;
    $("#tk-nome").textContent = nome || "—";
    const msg = `Olá, Fábrica da Sobrancelha! Peguei a senha ${$("#tk-num").textContent} pelo site: ${est.serv}, ${est.quando}.` + (nome ? ` Meu nome é ${nome}.` : "") + " Pode confirmar um horário?";
    $("#tk-zap").href = `https://wa.me/${ZAP}?text=${encodeURIComponent(msg)}`;
  }
  $$("[data-grupo]").forEach((g) => g.addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    $$("button", g).forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    est[g.dataset.grupo] = b.dataset.v; atualizar();
  }));
  $("#nome").addEventListener("input", atualizar);

  function imprimir() {
    $("#tk-num").textContent = numero(); atualizar();
    if (!window.gsap) return;
    const t = $("#ticket");
    if (reduzir) gsap.fromTo(t, { opacity: 0 }, { opacity: 1, duration: .35 });
    else gsap.timeline()
      .fromTo(t, { y: -40, rotate: -9, opacity: 0 }, { y: 0, rotate: -2, opacity: 1, duration: .7, ease: "back.out(1.8)" })
      .fromTo("#tk-num", { scale: 1.4 }, { scale: 1, duration: .5, ease: "power3.out" }, "-=.35");
  }
  $("#imprimir").addEventListener("click", imprimir);
  $$(".story").forEach((s) => s.addEventListener("click", () => {
    const alvo = $$('[data-grupo="serv"] button').find((x) => x.dataset.v === s.dataset.serv);
    if (alvo) alvo.click();
    $("#senha").scrollIntoView({ behavior: reduzir ? "auto" : "smooth" });
    setTimeout(imprimir, reduzir ? 0 : 700);
  }));
  $("#tk-num").textContent = numero(); atualizar();

  /* ---------- movimento ---------- */
  window.addEventListener("load", () => {
    if (!window.gsap) return;
    gsap.registerPlugin(ScrollTrigger);
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
    if (reduzir) {
      tl.from([".heroi-topo", ".titulo", ".f", ".heroi-acoes"], { opacity: 0, duration: .6, stagger: .06 });
    } else {
      tl.from(".t-linha", { yPercent: 105, duration: 1.1, stagger: .12, clipPath: "inset(0 0 100% 0)" })
        .from(".heroi-topo > *", { y: 16, opacity: 0, duration: .6, stagger: .08 }, "-=.7")
        .from(".f", { yPercent: 18, opacity: 0, duration: 1, stagger: .1 }, "-=.6")
        .from(".selo-gira", { scale: 0, rotate: -120, duration: .9, ease: "back.out(1.7)" }, "-=.5")
        .from(".heroi-acoes > *", { y: 16, opacity: 0, duration: .5, stagger: .08 }, "-=.6");
      // fotos do feed andam em velocidades diferentes na rolagem
      [[".f1", -6], [".f2", 10], [".f3", -12]].forEach(([s, v]) => gsap.to(s, { yPercent: v, ease: "none", scrollTrigger: { trigger: ".feed", start: "top bottom", end: "bottom top", scrub: true } }));
      // os stories entram em leque
      gsap.fromTo(".story", { y: 60, rotate: (i) => (i % 2 ? 4 : -4), opacity: 0 }, { y: 0, rotate: 0, opacity: 1, duration: .8, stagger: .07, ease: "power3.out", clearProps: "transform,translate,rotate,scale,opacity", scrollTrigger: { trigger: "#stories", start: "top 85%", once: true } });
    }
    $$("[data-conta]").forEach((el) => {
      const fim = +el.dataset.conta, o = { v: 0 };
      gsap.to(o, { v: fim, duration: reduzir ? .01 : 1.6, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 92%", once: true }, onUpdate: () => { el.textContent = Math.round(o.v); } });
    });
    $$(".h2, .senha-lead, .grupo, .campo, .balcao, .numeros-grade > div, .onde-logo, .onde-txt > *, .faq details").forEach((el) => {
      gsap.from(el, { y: reduzir ? 0 : 30, opacity: 0, duration: .7, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 90%", once: true } });
    });
  });
})();
