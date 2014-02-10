(function() {
  var Lax = function(selectorMap, options) {
    var els = [],
        elsPos = [];

    var lax = {
      enabled: true,

      enable: function() {
        this.enabled = true;
        this.boundOnScroll = this.onScroll.bind(this);
        options.$target.on('scroll', this.boundOnScroll);

        if (options.watchResize) {
          this.boundOnResize = this.onResize.bind(this);
          $(window).on('resize', this.boundOnResize);
        }
        this.update();
      },

      disable: function() {
        this.enabled = false;
        options.$target.off('scroll', this.boundOnScroll);

        if (options.watchResize) {
          $(window).off('resize', this.boundOnResize);
        }

      },

      add: function(name, fn) {

      },

      remove: function(name) {

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
        console.log('update', els, elsPos);
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

var lax = new Lax({
  '.left': function(diff, $target, e) {
    var translate = -(diff * $target.width());
    $target.css({
      transform: 'translate3d(' + translate+ 'px,0,0)'
    });
  },
  '.right': function(diff, $target, e) {
    var translate = (diff * $target.width());
    $target.css({
      transform: 'translate3d(' + translate + 'px,0,0)'
    });
  },
  '.up': function(diff, $target, e) {
    var translate = -(diff * $target.height());
    $target.css({
      transform: 'translate3d(0,' + translate + 'px,0)'
    });
  },
  '.down': function(diff, $target, e) {
    var translate = (diff * $target.height());
    $target.css({
      transform: 'translate3d(0,' + translate + 'px,0)'
    });
  },
  '.enlarge': function(diff, $target, e) {
    var scale = 1 + (2 * diff);
    $target.css({
      transform: 'scale(' + scale + ')',
      'border-radius': (diff * 100) + '%'
    });
  },
  '.shrink': function(diff, $target, e) {
    var scale = 1 - (2 * diff);
    $target.css({
      transform: 'scale(' + scale + ')',
      opacity: scale
    });
  },
});

// lax.add('.bar-foo', function() {

// });
// lax.add({
//   '.foo-bar': function() {

//   }
// });
// lax.remove('.bar-foo');
// lax.remove(['.bar-foo', 'foo-bar']);
