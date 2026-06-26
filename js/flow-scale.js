
(function () {
  var SELECTORS = '.qg-root, .im-process-wrapper';
  var MAX_SCALE = 1; // never scale UP past the original desktop size

  function wrap(el) {
    if (el.parentElement && el.parentElement.classList.contains('flow-scale')) {
      return el.parentElement; // already wrapped
    }
    var wrapper = document.createElement('div');
    wrapper.className = 'flow-scale';
    el.parentNode.insertBefore(wrapper, el);
    wrapper.appendChild(el);
    el.classList.add('flow-scale__inner');
    return wrapper;
  }

  function update(wrapper, inner) {
    // Reset transform before measuring so we get the element's
    // true natural size, not a previously-scaled one.
    inner.style.transform = 'none';

    var naturalWidth = inner.scrollWidth;
    var naturalHeight = inner.scrollHeight;
    var availableWidth = wrapper.clientWidth;

    if (!naturalWidth || !availableWidth) return;

    var scale = Math.min(MAX_SCALE, availableWidth / naturalWidth);
    scale = Math.max(scale, 0.01);

    inner.style.transform = 'scale(' + scale + ')';
    wrapper.style.height = Math.ceil(naturalHeight * scale) + 'px';
  }

  function debounce(fn, wait) {
    var t;
    return function () {
      clearTimeout(t);
      var args = arguments;
      t = setTimeout(function () { fn.apply(null, args); }, wait);
    };
  }

  function init() {
    var blocks = document.querySelectorAll(SELECTORS);
    blocks.forEach(function (el) {
      var wrapper = wrap(el);
      var inner = el;
      var run = debounce(function () { update(wrapper, inner); }, 60);

      // Recalculate whenever the wrapper's available width changes
      // (window resize, sidebar toggle, orientation change, etc.)
      if (typeof ResizeObserver !== 'undefined') {
        var ro = new ResizeObserver(run);
        ro.observe(wrapper.parentElement || wrapper);
      } else {
        window.addEventListener('resize', run);
      }

      // Initial measurement (after layout/fonts/icons settle)
      run();
      window.addEventListener('load', run);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();