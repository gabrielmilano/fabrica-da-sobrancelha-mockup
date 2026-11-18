(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const ZAP = "5548998222134";
  const reduzir = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- cardápio + sua seleção ---------- */
  const OPS = {
    design: { t: "Design", m: "design de sobrancelhas" },
    henna: { t: "Design com henna", m: "design com henna" },
    lamination: { t: "Brow lamination", m: "brow lamination" },
    micro: { t: "Microblading ou shadow", m: "avaliação para microblading ou shadow" },
    lash: { t: "Lash", m: "lash" },
    depil: { t: "Depilação facial", m: "depilação facial" },
    limpeza: { t: "Limpeza de pele", m: "limpeza de pele" },
  };
  const sel = []; let periodo = "o quanto antes";
  const msg = $("#msg"), lista = $("#escolhidos");

  function texto() {
    const nome = $("#f-nome").value.trim();
    const itens = sel.map((k) => OPS[k].m);
    const l = itens.length > 1 ? itens.slice(0, -1).join(", ") + " e " + itens.at(-1) : itens[0];
    return `Olá, Fábrica da Sobrancelha! ${nome ? "Sou " + nome + ". " : ""}Vim pelo site e quero agendar${l ? ": " + l : " um horário"}. Melhor período: ${periodo}.`;
  }
  function atualizar(animar) {
    $$("[data-op]").forEach((b) => {
      const on = sel.includes(b.dataset.op);
      b.setAttribute("aria-pressed", on);
      b.closest(".item")?.classList.toggle("on", on);
    });
    lista.replaceChildren();
    if (!sel.length) {
      const li = document.createElement("li"); li.className = "vazio"; li.textContent = "Nenhum serviço ainda. Toque no + ao lado.";
      if (matchMedia("(max-width: 1060px)").matches) li.textContent = "Nenhum serviço ainda. Toque no + nos serviços acima.";
      lista.append(li);
    } else sel.forEach((k) => {
      const li = document.createElement("li");
      const s = document.createElement("span"); s.textContent = OPS[k].t;
      const b = document.createElement("button"); b.type = "button"; b.textContent = "tirar"; b.setAttribute("aria-label", "Tirar " + OPS[k].t);
      b.addEventListener("click", () => alternar(k));
      li.append(s, b); lista.append(li);
    });
    const t = texto();
    msg.textContent = t;
    if (animar) { msg.classList.remove("mudou"); void msg.offsetWidth; msg.classList.add("mudou"); }
    $("#enviar").href = `https://wa.me/${ZAP}?text=${encodeURIComponent(t)}`;
    $("#barra-btn").textContent = sel.length ? `Enviar seleção (${sel.length})` : "Escolher meu serviço";
    $("#barra-btn").href = sel.length ? "#resumo" : "#servicos";
  }
  function alternar(k) {
    const i = sel.indexOf(k);
    if (i > -1) sel.splice(i, 1); else sel.push(k);
    atualizar(true);
  }
  $$("[data-op]").forEach((b) => b.addEventListener("click", () => {
    const novo = !sel.includes(b.dataset.op);
    alternar(b.dataset.op);
    if (novo && !matchMedia("(max-width: 1060px)").matches) { const r = $("#resumo"); r.classList.remove("pisca"); void r.offsetWidth; r.classList.add("pisca"); }
  }));
  $$("[data-per]").forEach((b) => b.addEventListener("click", () => {
    periodo = b.dataset.per;
    $$("[data-per]").forEach((x) => x.setAttribute("aria-pressed", x === b));
    atualizar(true);
  }));
  $("#f-nome").addEventListener("input", () => atualizar(false));
  atualizar(false);

  /* ---------- entrada ao rolar ---------- */
  const io = new IntersectionObserver((ent) => ent.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("vis"); io.unobserve(e.target); } }), { threshold: .1 });
  $$(".rev").forEach((el) => io.observe(el));

  /* ---------- mapa só perto da tela ---------- */
  const mapa = $(".onde-mapa iframe[data-src]");
  if (mapa) { const iom = new IntersectionObserver((e) => { if (e[0].isIntersecting) { mapa.src = mapa.dataset.src; iom.disconnect(); } }, { rootMargin: "400px 0px" }); iom.observe(mapa); }
})();
