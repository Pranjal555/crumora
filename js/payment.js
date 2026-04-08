(function () {
  function rupee(n) {
    return "₹" + n.toLocaleString("en-IN");
  }

  function renderOrder() {
    var items = window.CrumoraCart.getItems();
    var listEl = document.querySelector("[data-order-lines]");
    var emptyEl = document.querySelector("[data-order-empty]");
    var formEl = document.querySelector("[data-checkout-form]");
    if (!listEl) return;

    if (!items.length) {
      listEl.innerHTML = "";
      if (emptyEl) emptyEl.hidden = false;
      if (formEl) formEl.hidden = true;
      return;
    }

    if (emptyEl) emptyEl.hidden = true;
    if (formEl) formEl.hidden = false;

    var sub = 0;
    listEl.innerHTML = items
      .map(function (line) {
        var lineTotal = line.price * line.qty;
        sub += lineTotal;
        return (
          '<div class="order-line"><span>' +
          escapeHtml(line.name) +
          " × " +
          line.qty +
          '</span><span>' +
          rupee(lineTotal) +
          "</span></div>"
        );
      })
      .join("");

    var totalEl = document.querySelector("[data-order-total]");
    if (totalEl) totalEl.textContent = rupee(sub);
  }

  function escapeHtml(s) {
    var d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  }

  function buildWhatsAppMessage() {
    var items = window.CrumoraCart.getItems();
    var name = (document.querySelector("#cust-name") || {}).value || "";
    var phone = (document.querySelector("#cust-phone") || {}).value || "";
    var addr = (document.querySelector("#cust-address") || {}).value || "";
    var lines = items.map(function (l) {
      return "• " + l.name + " × " + l.qty + " — " + rupee(l.price * l.qty);
    });
    var sub = window.CrumoraCart.subtotal();
    return (
      "Hi Crumora Patisserie! I'd like to order:\n\n" +
      lines.join("\n") +
      "\n\n*Total: " +
      rupee(sub) +
      "*\n\n" +
      "Name: " +
      name +
      "\nPhone: " +
      phone +
      "\nAddress / pickup notes: " +
      addr
    );
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderOrder();

    var waBtn = document.querySelector("[data-send-whatsapp]");
    if (waBtn) {
      waBtn.addEventListener("click", function (e) {
        e.preventDefault();
        if (!window.CrumoraCart.getItems().length) return;
        var name = document.querySelector("#cust-name");
        var phone = document.querySelector("#cust-phone");
        if (name && !name.value.trim()) {
          name.focus();
          return;
        }
        if (phone && !phone.value.trim()) {
          phone.focus();
          return;
        }
        var url =
          (window.CrumoraWaLink && window.CrumoraWaLink(buildWhatsAppMessage())) ||
          "#";
        window.open(url, "_blank", "noopener,noreferrer");
      });
    }

    var demoBtn = document.querySelector("[data-demo-pay]");
    if (demoBtn) {
      demoBtn.addEventListener("click", function () {
        alert(
          "This is a frontend demo. Connect a provider (e.g. Razorpay) with a small backend to accept real payments. For now, use “Send order on WhatsApp” to complete the order."
        );
      });
    }
  });

  window.addEventListener("crumora-cart-updated", renderOrder);
})();
