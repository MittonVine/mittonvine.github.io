var skrollrInstance = skrollr.init();

$(".progress-indicator__bullet").click(function (e) {
  skrollrInstance.setScrollTop(0);
  var target = e.target.attributes["data-target"].nodeValue;
  var element = $(target);
  var sections = $(".section-canvas");
  sections.hide();
  element.show();
  var progressIndicators = $(".progress-indicator__bullet");
  progressIndicators.removeClass("progress-indicator__bullet--active");
  $(e.target).addClass("progress-indicator__bullet--active");

  console.log(target);
});

$(".section-canvas").hide();
$($(".section-canvas").get(1)).show();
