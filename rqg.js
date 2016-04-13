var RQG = (function() {

  var API_URL = "http://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1",
    defaults = {
      container: "data-container",
      button: "data-generate-btn"
    },
    container,
    button,
    _getQuote,
    _addEventListener,
    _populateTemplate,
    _addContentToPage,
    _init,
    _destroy;

  _init = function(config) {
    // merge config with defaults
    for (var prop in config) {
      if (config.hasOwnProperty(prop)) {
        defaults[prop] = config[prop];
      }
    }

    container = document.querySelector("[" + defaults.container + "]");
    button = document.querySelector("[" + defaults.button + "]");
    console.log(button);

    _addEventListener();
    _getQuote();
  };
  
  _destroy = function() {
    button.removeEventListener("click", _getQuote);
    button.classList.add("disabled");
  };

  _addEventListener = function() {
    button.addEventListener("click", _getQuote);
  };

  _getQuote = function() {    
    container.innerHTML = "";
    container.classList.toggle("spinner");

    var xhr = $.ajax({
      url: API_URL,
      success: function(data) {
        if (data[0].hasOwnProperty("ID")) {
          _populateTemplate(data[0]);
        }
      },
      error: function() {
        _addContentToPage("<div class='alert alert-warning'><strong>Sorry:</strong> There has been an error generating a quote.  Please try again</div>");
      },
      complete: function() {
        container.classList.toggle("spinner");
      }
    });
  };

  _populateTemplate = function(data) {
    var template,
      templateScript,
      html;

    template = document.getElementById("template").innerHTML;
    templateScript = Handlebars.compile(template);
    html = templateScript(data);
    _addContentToPage(html);
    
  };

  _addContentToPage = function(html) {
    container.insertAdjacentHTML('beforeend', html);
  };

  return {
    init: _init,
    destroy: _destroy
  };

})();

RQG.init();
//window.setTimeout(RQG.destroy, 10000);