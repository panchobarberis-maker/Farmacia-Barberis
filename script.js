/* Farmacia Barberis — interacciones de la landing */

(function () {
  "use strict";

  /* Horarios de atención. 0 = domingo … 6 = sábado. Editá acá para cambiar la web. */
  var HORARIOS = {
    0: { abre: "10:00", cierra: "13:00" },
    1: { abre: "09:00", cierra: "20:00" },
    2: { abre: "09:00", cierra: "20:00" },
    3: { abre: "09:00", cierra: "20:00" },
    4: { abre: "09:00", cierra: "20:00" },
    5: { abre: "09:00", cierra: "20:00" },
    6: { abre: "09:00", cierra: "20:00" }
  };

  var DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
  var TZ = "America/Argentina/Buenos_Aires";

  /* ---------- Hora local de Bariloche, sin importar dónde esté el visitante ---------- */

  function ahoraEnBariloche() {
    var partes;
    try {
      partes = new Intl.DateTimeFormat("en-US", {
        timeZone: TZ,
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      }).formatToParts(new Date());
    } catch (e) {
      var d = new Date();
      return { dia: d.getDay(), minutos: d.getHours() * 60 + d.getMinutes() };
    }

    var mapa = {};
    partes.forEach(function (p) { mapa[p.type] = p.value; });

    var dias = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    var hora = parseInt(mapa.hour, 10) % 24;
    var min = parseInt(mapa.minute, 10);

    return { dia: dias[mapa.weekday], minutos: hora * 60 + min };
  }

  function aMinutos(hhmm) {
    var p = hhmm.split(":");
    return parseInt(p[0], 10) * 60 + parseInt(p[1], 10);
  }

  /* ---------- Estado abierto / cerrado ---------- */

  function estado() {
    var t = ahoraEnBariloche();
    var hoy = HORARIOS[t.dia];

    if (hoy) {
      var abre = aMinutos(hoy.abre);
      var cierra = aMinutos(hoy.cierra);

      if (t.minutos >= abre && t.minutos < cierra) {
        var faltan = cierra - t.minutos;
        return {
          abierto: true,
          texto: faltan <= 60
            ? "Abierto · cierra a las " + hoy.cierra
            : "Abierto ahora · hasta las " + hoy.cierra
        };
      }
      if (t.minutos < abre) {
        return { abierto: false, texto: "Cerrado · abre hoy a las " + hoy.abre };
      }
    }

    /* Buscamos el próximo día con atención */
    for (var i = 1; i <= 7; i++) {
      var d = (t.dia + i) % 7;
      if (HORARIOS[d]) {
        var cuando = i === 1 ? "mañana" : "el " + DIAS[d];
        return { abierto: false, texto: "Cerrado · abre " + cuando + " a las " + HORARIOS[d].abre };
      }
    }
    return { abierto: false, texto: "Consultá nuestros horarios" };
  }

  function pintarEstado() {
    var dot = document.getElementById("statusDot");
    var txt = document.getElementById("statusText");
    var hoyEl = document.getElementById("todayHours");
    var t = ahoraEnBariloche();
    var e = estado();

    if (dot) dot.className = "dot " + (e.abierto ? "open" : "closed");
    if (txt) txt.textContent = e.texto;

    if (hoyEl) {
      var hoy = HORARIOS[t.dia];
      hoyEl.textContent = hoy ? hoy.abre + " – " + hoy.cierra : "Cerrado";
    }

    var fila = document.querySelector('#hoursTable tr[data-day="' + t.dia + '"]');
    if (fila) fila.classList.add("today");
  }

  /* ---------- Menú móvil ---------- */

  function menuMovil() {
    var burger = document.getElementById("burger");
    var menu = document.getElementById("mobile");
    if (!burger || !menu) return;

    function cerrar() {
      burger.setAttribute("aria-expanded", "false");
      burger.setAttribute("aria-label", "Abrir menú");
      menu.dataset.open = "false";
      menu.hidden = true;
    }

    burger.addEventListener("click", function () {
      var abierto = burger.getAttribute("aria-expanded") === "true";
      if (abierto) {
        cerrar();
      } else {
        burger.setAttribute("aria-expanded", "true");
        burger.setAttribute("aria-label", "Cerrar menú");
        menu.hidden = false;
        menu.dataset.open = "true";
      }
    });

    menu.addEventListener("click", function (ev) {
      if (ev.target.tagName === "A") cerrar();
    });

    document.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape") cerrar();
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 900) cerrar();
    });
  }

  /* ---------- Sombra del header al hacer scroll ---------- */

  function navScroll() {
    var nav = document.getElementById("nav");
    if (!nav) return;
    var ticking = false;

    function actualizar() {
      nav.classList.toggle("scrolled", window.scrollY > 8);
      ticking = false;
    }

    window.addEventListener("scroll", function () {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(actualizar);
      }
    }, { passive: true });

    actualizar();
  }

  /* ---------- Init ---------- */

  function init() {
    pintarEstado();
    menuMovil();
    navScroll();

    var year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();

    /* Refrescamos el estado cada minuto por si cambia mientras la pestaña está abierta */
    setInterval(pintarEstado, 60000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
