(function () {
  var cfg = window.CRUMORA_CONFIG || {};

  function defaultWaText() {
    var who = cfg.whatsappContactName;
    if (who) return "Hi " + who + "! I'd like to place an order with Crumora Patisserie.";
    return "Hi Crumora! I'd like to place an order.";
  }

  function waLink(text) {
    var cc = String(cfg.whatsappCountryCode || "91").replace(/\D/g, "");
    var num = String(cfg.whatsappNumber || "").replace(/\D/g, "");
    var body = encodeURIComponent(text || defaultWaText());
    return "https://wa.me/" + cc + num + (body ? "?text=" + body : "");
  }

  function updateCartBadges() {
    var n = window.CrumoraCart ? window.CrumoraCart.count() : 0;
    document.querySelectorAll("[data-cart-count]").forEach(function (el) {
      el.textContent = n > 0 ? String(n) : "";
      el.setAttribute("data-count", String(n));
    });
  }

  function initNav() {
    var toggle = document.querySelector("[data-nav-toggle]");
    var nav = document.querySelector("[data-nav]");
    if (toggle && nav) {
      toggle.addEventListener("click", function () {
        var open = nav.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
      });
      nav.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", function () {
          nav.classList.remove("is-open");
          toggle.setAttribute("aria-expanded", "false");
        });
      });
    }
  }

  function initWaFloat() {
    var fab = document.querySelector("[data-wa-float]");
    if (!fab) return;
    fab.href = waLink();
    fab.setAttribute("aria-label", "Chat on WhatsApp");
  }

  function showToast(msg) {
    var t = document.querySelector("[data-toast]");
    if (!t) return;
    t.textContent = msg;
    t.classList.add("is-visible");
    clearTimeout(t._hide);
    t._hide = setTimeout(function () {
      t.classList.remove("is-visible");
    }, 2600);
  }

  function initAddToCart() {
    document.body.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-add-cart]");
      if (!btn) return;
      e.preventDefault();
      var id = btn.getAttribute("data-id");
      var name = btn.getAttribute("data-name");
      var price = parseInt(btn.getAttribute("data-price"), 10);
      if (!id || !name || isNaN(price)) return;
      window.CrumoraCart.add({ id: id, name: name, price: price, qty: 1 });
      updateCartBadges();
      showToast("Added to bag — view Checkout when ready.");
    });
  }

  window.CrumoraWaLink = waLink;

  document.addEventListener("DOMContentLoaded", function () {
    initNav();
    initWaFloat();
    updateCartBadges();
    initAddToCart();
  });

  window.addEventListener("crumora-cart-updated", updateCartBadges);
})();
