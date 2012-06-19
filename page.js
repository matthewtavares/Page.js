var Page = {
  
  observers: $H(),
  url: "http://localhost:8888/bbngstore/render.php?page=",
  private_url: "http://localhost:8888/bbngstore/private.php?page=",
  current: "",
  previous: "",
  loaded: $A(),
  effect: "blind",
  
  load: function(page_name, options) {
    url = this.url + page_name
    Page.previous = Page.current;
    if (!options.effect) {
      options.effect = this.effect;
    };
    window.history.pushState({page: Page.current}, Page.current, '');
    if (options.private == true) {
      user = User.current();
      if (!user) {
        return false;
      };
      url = this.private_url + page_name + "&user_name=" + user.name + "&user_pass_hash=" + user.pass_hash;
    };
    if (!this.isLoaded(page_name)) {
      if (!options.post) {
        new Ajax.Request(url, {
          method: 'get',
          onSuccess: function(transport) {
            if (transport.responseText != 'false') {
              if (options.effect == "fade") {
                Effect.Fade(Page.current + '_container', {afterFinish: function(obj) {
                }}, {queue: 'front'});
                Effect.Appear(page_name + '_container', {queue: 'end'});
              } else {
                Effect.BlindUp(Page.current + '_container', {afterFinish: function(obj) {
                }}, {queue: 'front'});
                Effect.BlindDown(page_name + '_container', {queue: 'end'});
              }
              $(page_name + '_content').update(transport.responseText);
              Page.current = page_name;
              Page.loaded.push(page_name);
              // Somtimes you want to load observers with the new page
              if (options.onSuccess) {
                options.onSuccess.call();
              };
              if ($A(options.observers).size() > 0) {
                $A(options.observers).each(function(ob) {
                  ob.call();
                });
              };
            };
          }
        });
      } else {
        post = options.post
        if (typeof(options.post) != 'string') {
          post = Object.toQueryString(options.post);
        }
        new Ajax.Request(url, {
          method: 'post',
          parameters: post,
          onSuccess: function(transport) {
            if (transport.responseText != 'false') {
              if (options.effect == "fade") {
                Effect.Fade(Page.current + '_container', {afterFinish: function(obj) {
                }}, {queue: 'front'});
                Effect.Appear(page_name + '_container', {queue: 'end'});
              } else {
                Effect.BlindUp(Page.current + '_container', {afterFinish: function(obj) {
                }}, {queue: 'front'});
                Effect.BlindDown(page_name + '_container', {queue: 'end'});
              }
              $(page_name + '_content').update(transport.responseText);
              Page.current = page_name;
              Page.loaded.push(page_name);
              // Somtimes you want to load observers with the new page
              if (options.onSuccess) {
                options.onSuccess.call();
              };
              if ($A(options.observers).size() > 0) {
                $A(options.observers).each(function(ob) {
                  ob.call();
                });
              };
            };
          }
        });
      }
    } else {
      // Page is already loaded, no need to send another request
      if (options.effect == "fade") {
        Effect.Fade(Page.current + '_container', {afterFinish: function(obj) {
        }}, {queue: 'front'});
        Effect.Appear(page_name + '_container', {queue: 'end'});
      } else {
        Effect.BlindUp(Page.current + '_container', {afterFinish: function(obj) {
        }}, {queue: 'front'});
        Effect.BlindDown(page_name + '_container', {queue: 'end'});
      }
      Page.current = page_name;
    }
  },
  
  isLoaded: function(page_name) {
    return $A(this.loaded).find(function(i) {
      if (i == page_name) {
        return true;
      };
    });
  },
  
  observe: function(element, page_name, options) {
    // This just makes loading basic pages way simpler and cleaner
    element = $(element);
    if (!element) {
      return false;
    };
    Event.observe(element, "mousedown", function(e) {
      Page.load(page_name, options);
    });
  }
};