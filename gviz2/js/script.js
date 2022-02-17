$(function () {
    prevIndex = 0;
    $.scrollify({
        updateHash: false,
        section: ".scroll-container",
        scrollSpeed: 500,
        before: function (index, sections) {
            direction = index < prevIndex ? "up" : "down";
            console.log(index, prevIndex, direction);
            prevSceneName = sections[prevIndex].attr("data-scene");
            curSceneName = sections[index].attr("data-scene");
            prevCutName = sections[prevIndex].attr("data-cut");
            curCutName = sections[index].attr("data-cut");
            previousCopy = $(".current-copy");
            copyToShow = $(curSceneName + " .copy[data-cut='" + curCutName + "']");
            copyToShow.addClass("current-copy");
            copyToShow.removeClass("previous-copy");
            previousCopy.removeClass("current-copy");
            if (direction == "up") {
                $(prevSceneName).removeClass("cut-" + prevCutName);
            } else {
                previousCopy.addClass("previous-copy");
                $(curSceneName).addClass("cut-" + curCutName);
            }
            if (prevSceneName != curSceneName) {
                if (direction == "up") {
                    $(prevSceneName).addClass("scene-below");
                    $(curSceneName).removeClass("scene-above");
                } else {
                    $(curSceneName).removeClass("scene-below");
                    $(prevSceneName).addClass("scene-above");
                }
            }
        },
        after: function (index, sections) {
            prevIndex = index;
        }
    });

    $("document").ready(function () {
        //$('head link[rel="stylesheet"], style').remove();
    })
});