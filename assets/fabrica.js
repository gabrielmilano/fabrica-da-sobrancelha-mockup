(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const ZAP = "5548998222134";
  const reduzir = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- agendamento (mesmo modelo da Podocri: monta e manda pronto) ---------- */
  const OPS = {
    design: { z: "sobrancelha", t: "Design de sobrancelhas", d: "Desenho e limpeza no formato do rosto, com resultado natural.", m: "design de sobrancelhas" },
    henna: { z: "sobrancelha", t: "Design com henna", d: "A henna colore fios e pele e marca o contorno por alguns dias.", m: "design com henna" },
    lamination: { z: "sobrancelha", t: "Brow lamination", d: "Alinha os fios e dá volume, com efeito penteado.", m: "brow lamination" },
    micro: { z: "sobrancelha", t: "Micro ou shadow", d: "Micropigmentação fio a fio (microblading) ou esfumada (shadow). Começa com uma avaliação.", m: "avaliação para micro ou shadow" },
    lash: { z: "olhar", t: "Lash", d: "Cílios desenhados para valorizar o olhar.", m: "lash" },
    depil: { z: "rosto", t: "Depilação facial", d: "Buço e rosto, com cera ou linha.", m: "depilação facial" },
    limpeza: { z: "pele", t: "Limpeza de pele", d: "Extração de cravos e cuidado com a pele do rosto.", m: "limpeza de pele" },
  };
  const ZONAS = {
    sobrancelha: { padrao: "design", t: "Sobrancelhas", d: "Design, henna, brow lamination ou micro. Escolha a técnica na lista ao lado." },
    olhar: { padrao: "lash" }, rosto: { padrao: "depil" }, pele: { padrao: "limpeza" },
  };
  const sel = new Set(); let ultimo = null, periodo = "o quanto antes";
  const info = $("#info"), msg = $("#msg"), rosto = $("#rosto");

  function texto() {
    const nome = $("#f-nome").value.trim();
    const itens = [...sel].map((k) => OPS[k].m);
    const lista = itens.length > 1 ? itens.slice(0, -1).join(", ") + " e " + itens.at(-1) : itens[0];
    return `Olá, Fábrica da Sobrancelha! ${nome ? "Sou " + nome + ". " : ""}Vim pelo site e quero agendar${lista ? ": " + lista : " um horário"}. Melhor período: ${periodo}.`;
  }
  function atualizar(animar) {
    $$("[data-op]").forEach((b) => b.setAttribute("aria-pressed", sel.has(b.dataset.op)));
    $$("[data-add]").forEach((b) => { const on = sel.has(b.dataset.add); b.setAttribute("aria-pressed", on); b.lastChild.textContent = on ? "Adicionado" : "Adicionar"; });
    const zonas = new Set([...sel].map((k) => OPS[k].z));
    $$("[data-zona]").forEach((b) => b.setAttribute("aria-pressed", zonas.has(b.dataset.zona)));
    rosto.classList.toggle("sobr-on", zonas.has("sobrancelha"));
    rosto.classList.toggle("olhar-on", zonas.has("olhar"));
    $(".z-rosto", rosto).classList.toggle("on", zonas.has("rosto"));
    $(".z-pele", rosto).classList.toggle("on", zonas.has("pele"));
    if (ultimo && sel.has(ultimo)) {
      const o = OPS[ultimo];
      info.innerHTML = `<div class="troca"><h3>${o.t}</h3><p>${o.d}</p></div>`;
    } else if (sel.size) {
      info.innerHTML = `<div class="troca"><p>${sel.size} ${sel.size > 1 ? "serviços escolhidos" : "serviço escolhido"}. Confira a mensagem e envie.</p></div>`;
    } else {
      info.innerHTML = `<p class="dica troca">Toque nos pontos do rosto para ver o que a Fábrica faz em cada lugar.</p>`;
    }
    const t = texto();
    msg.textContent = t;
    if (animar) { msg.classList.remove("mudou"); void msg.offsetWidth; msg.classList.add("mudou"); }
    $("#enviar").href = `https://wa.me/${ZAP}?text=${encodeURIComponent(t)}`;
  }
  function alternar(id, forcar) {
    if (sel.has(id) && !forcar) { sel.delete(id); ultimo = [...sel].at(-1) || null; }
    else { sel.add(id); ultimo = id; }
    atualizar(true);
  }

  $$("[data-per]").forEach((b) => b.addEventListener("click", () => {
    periodo = b.dataset.per;
    $$("[data-per]").forEach((x) => x.setAttribute("aria-pressed", x === b));
    atualizar(true);
  }));
  $("#f-nome").addEventListener("input", () => atualizar(false));
  document.addEventListener("click", (e) => {
    const op = e.target.closest("[data-op]");
    if (op) return alternar(op.dataset.op);
    const zona = e.target.closest("[data-zona]");
    if (zona) {
      const z = zona.dataset.zona, Z = ZONAS[z];
      const ja = [...sel].filter((k) => OPS[k].z === z);
      if (ja.length) { ja.forEach((k) => sel.delete(k)); ultimo = [...sel].at(-1) || null; atualizar(true); return; }
      alternar(Z.padrao, true);
      if (Z.t) info.innerHTML = `<div class="troca"><h3>${Z.t}</h3><p>${Z.d}</p></div>`;
      return;
    }
    const add = e.target.closest("[data-add]");
    if (add) {
      e.preventDefault();
      if (sel.has(add.dataset.add)) { alternar(add.dataset.add); return; }
      alternar(add.dataset.add, true);
      const r = $("#resumo");
      r.scrollIntoView({ behavior: reduzir ? "auto" : "smooth", block: "center" });
      r.classList.remove("pisca"); void r.offsetWidth; r.classList.add("pisca");
    }
  });
  atualizar(false);

  /* ---------- entrada ao rolar ---------- */
  const io = new IntersectionObserver((ent) => ent.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("vis"); io.unobserve(e.target); } }), { threshold: .12 });
  $$(".rev").forEach((el) => io.observe(el));

  /* ---------- contadores ---------- */
  const ioC = new IntersectionObserver((ent) => ent.forEach((e) => {
    if (!e.isIntersecting) return; ioC.unobserve(e.target);
    const alvo = +e.target.dataset.conta, t0 = performance.now();
    if (reduzir) return;
    const passo = (t) => { const p = Math.min((t - t0) / 1400, 1); e.target.textContent = Math.round(alvo * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(passo); };
    requestAnimationFrame(passo);
  }), { threshold: .6 });
  $$("[data-conta]").forEach((el) => ioC.observe(el));

  /* ---------- mapa só perto da tela ---------- */
  const mapa = $(".onde-mapa iframe[data-src]");
  if (mapa) { const iom = new IntersectionObserver((e) => { if (e[0].isIntersecting) { mapa.src = mapa.dataset.src; iom.disconnect(); } }, { rootMargin: "400px 0px" }); iom.observe(mapa); }
})();
