(function() {
  var Lax = function(selectorMap, options) {
    var els = [],
        elsPos = [];

    var lax = {
      enabled: true,

      enable: function() {
        this.boundOnScroll = this.onScroll.bind(this);
        options.$target.on('scroll', this.boundOnScroll);

        if (options.watchResize) {
          this.boundOnResize = this.onResize.bind(this);
          $(window).on('resize', this.boundOnResize);
        }
        this.update();
      },

      disable: function() {
        options.$target.off('scroll', this.boundOnScroll);

        if (options.watchResize) {
          $(window).off('resize', this.boundOnResize);
        }
      },

      destroy: function() {
        this.disable();
      },

      update: function() {
        var $el,
            offsetTop;

        els = [];
        elsPos = [];
        this.containerHeight = options.$target.height();
        $.each(selectorMap, function(selector, fn) {
          $(selector).each(function() {
            $el = $(this);
            offsetTop = $el.offset().top;
            elsPos.push({top: offsetTop, bottom: offsetTop + $el.height()});
            if (els[offsetTop]) {
              els[offsetTop].push({$el: $el, fn: fn})
            } else {
              els[offsetTop] = [{$el: $el, fn: fn}];
            }
          });
        });
        elsPos.sort(function(a,b) {
          return a.top - b.top;
        });
      },

      onResize: (function() {
        var resizeTimeout;

        return function(e) {
          clearTimeout(resizeTimeout);
          resizeTimeout = setTimeout(this.update.bind(this), options.resizeDelay);
        };
      }()),

      onScroll: function(e) {
        var scrollTop = options.$target.scrollTop(),
            scrollBottom = scrollTop + this.containerHeight,
            notInView = true,
            elPos,
            startIndex,
            endIndex,
            elTop,
            i;

        // Find first el from top
        for (i = 0; i < elsPos.length; i++) {
          elPos = elsPos[i];
          elTop = elPos.top;
          if ((elTop >= scrollTop || elPos.bottom > scrollTop) && (elTop <= scrollBottom)) {
            startIndex = i;
            notInView = false;
            break;
          }
        }

        // No els were found in the viewport. Bail.
        if (notInView) {
          return;
        }

        // // Find first el from bottom
        for (i = elsPos.length - 1; i >= 0; i--) {
          elPos = elsPos[i];
          if (elPos.top <= scrollBottom) {
            endIndex = i;
            break;
          }
        }

        for (i = startIndex; i <= endIndex; i++) {
          elTop = elsPos[i].top;
          if (elTop < this.containerHeight) {
            diff = scrollTop / elsPos[i].bottom;
          } else {
            diff = (scrollBottom / elTop) - 1;
          }
          $.each(els[elTop], function(index, elMap) {
            elMap.fn(diff, elMap.$el, e);
          });
        }
      }
    };

    options = $.extend({
      $target: $(window),
      watchResize: true,
      resizeDelay: 100
    }, options);
    lax.enable();

    return lax;
  };

  if ( typeof define === "function" && define.amd ) {
    define( "lax", [], function() {
      return Lax;
    });
  }
  window.Lax = Lax;
}( ));
