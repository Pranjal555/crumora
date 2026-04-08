(function () {
  var STORAGE_KEY = "crumora_cart";

  function read() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function write(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent("crumora-cart-updated"));
  }

  window.CrumoraCart = {
    getItems: read,

    count: function () {
      return read().reduce(function (sum, line) {
        return sum + (line.qty || 0);
      }, 0);
    },

    subtotal: function () {
      return read().reduce(function (sum, line) {
        return sum + (line.price || 0) * (line.qty || 0);
      }, 0);
    },

    add: function (item) {
      var items = read();
      var found = items.find(function (i) {
        return i.id === item.id;
      });
      if (found) {
        found.qty = (found.qty || 1) + (item.qty || 1);
      } else {
        items.push({
          id: item.id,
          name: item.name,
          price: item.price,
          qty: item.qty || 1,
        });
      }
      write(items);
    },

    setQty: function (id, qty) {
      var items = read();
      var i = items.findIndex(function (x) {
        return x.id === id;
      });
      if (i === -1) return;
      if (qty < 1) items.splice(i, 1);
      else items[i].qty = qty;
      write(items);
    },

    remove: function (id) {
      write(read().filter(function (x) {
        return x.id !== id;
      }));
    },

    clear: function () {
      write([]);
    },
  };
})();
