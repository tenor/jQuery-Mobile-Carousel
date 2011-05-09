/*!
 * jQuery Mobile Carousel
 * Source: https://github.com/blackdynamo/jQuery-Mobile-Carousel
 * Demo: http://jsfiddle.net/blackdynamo/yxhzU/
 * Blog: http://developingwithstyle.blogspot.com
 *
 * Copyright 2010, Donnovan Lewis
 * Edits: Benjamin Gleitzman (gleitz@mit.edu)
 * Licensed under the MIT
 */

(function($) {
    $.fn.carousel = function(options) {
        var settings = {
            duration: 300,
            direction: "horizontal",
            minimumDrag: 20,
            beforeStart: function(){},
            afterStart: function(){},
            beforeStop: function(){},
            afterStop: function(){},
            onShowPage: function(){}
        };

        $.extend(settings, options || {});

        this.getPageIndex = function () {
            if (this.length > 0) return this[0].getPageIndex();
            return null;
        }

        this.getPageCount = function () {
            if (this.length > 0) return this[0].getPageCount();
            return null;
        }

        this.flipForward = function () {
            if (this.length > 0) this[0].flipForward();
            return;
        }

        this.flipBackward = function () {
            if (this.length > 0) this[0].flipBackward();
            return;
        }


        return this.each(function () {
            if (this.tagName.toLowerCase() != "ul") return;

            var originalList = $(this);
            var pages = originalList.children();
            var width = originalList.parent().width();
            var height = originalList.parent().height();

            //Css
            var containerCss = {position: "relative", overflow: "hidden", width: width, height: height};
            var listCss = {position: "relative", padding: "0", margin: "0", listStyle: "none", width: pages.length * width};
            var listItemCss = {width: width, height: height};

            var container = $("<div>").css(containerCss);
            var list = $("<ul>").css(listCss);

            var currentPage = 1, start, stop;
            if (settings.direction.toLowerCase() === "horizontal") {
                list.css({float: "left"});
                $.each(pages, function(i) {
                    var li = $("<li>")
                            .css($.extend(listItemCss, {float: "left"}))
                            .html($(this).html());
                    list.append(li);
                });

                function scrollLeft() {
                    var new_width = -1 * width * currentPage;
                    list.animate({ left: new_width }, settings.duration);
                    currentPage++;
                    settings.onShowPage();
                }

                function scrollRight() {
                    var new_width = -1 * width * (currentPage - 1);
                    list.animate({ left: -1 * width * (currentPage - 2) }, settings.duration);
                    currentPage--;
                    settings.onShowPage();
                }

                list.draggable({
                    axis: "x",
                    start: function(event) {
                        settings.beforeStart.apply(list, arguments);

                        var data = event.originalEvent.touches ? event.originalEvent.touches[0] : event;
                        start = {
                            coords: [ data.pageX, data.pageY ]
                        };

                        settings.afterStart.apply(list, arguments);
                    },
                    stop: function(event) {
                        settings.beforeStop.apply(list, arguments);

                        var data = event.originalEvent.touches ? event.originalEvent.touches[0] : event;
                        stop = {
                            coords: [ data.pageX, data.pageY ]
                        };

                        start.coords[0] > stop.coords[0] ? moveLeft() : moveRight();

                        function moveLeft() {
                            if (currentPage === pages.length || dragDelta() < settings.minimumDrag) {
                                list.animate({ left: "+=" + dragDelta()}, settings.duration);
                                return;
                            }

                            scrollLeft();

                        }

                        function moveRight() {
                            if (currentPage === 1 || dragDelta() < settings.minimumDrag) {
                                list.animate({ left: "-=" + dragDelta()}, settings.duration);
                                return;
                            }

                            scrollRight();

                        }

                        function dragDelta() {
                            return Math.abs(start.coords[0] - stop.coords[0]);
                        }

                        function adjustment() {
                            return width - dragDelta();
                        }

                        settings.afterStop.apply(list, arguments);
                    }
                });
            } else if (settings.direction.toLowerCase() === "vertical") {
                $.each(pages, function(i) {
                    var li = $("<li>")
                            .css(listItemCss)
                            .html($(this).html());
                    list.append(li);
                });


                function scrollUp() {
                    var new_width = -1 * height * currentPage;
                    list.animate({ top: new_width }, settings.duration);
                    currentPage++;
                    settings.onShowPage();
                }

                function scrollDown() {
                    var new_width = -1 * height * (currentPage - 2);
                    list.animate({ top: new_width }, settings.duration);
                    currentPage--;
                    settings.onShowPage();
                }

                list.draggable({
                    axis: "y",
                    start: function(event) {
                        settings.beforeStart.apply(list, arguments);

                        var data = event.originalEvent.touches ? event.originalEvent.touches[0] : event;
                        start = {
                            coords: [ data.pageX, data.pageY ]
                        };

                        settings.afterStart.apply(list, arguments);
                    },
                    stop: function(event) {
                        settings.beforeStop.apply(list, arguments);

                        var data = event.originalEvent.touches ? event.originalEvent.touches[0] : event;
                        stop = {
                            coords: [ data.pageX, data.pageY ]
                        };

                        start.coords[1] > stop.coords[1] ? moveUp() : moveDown();

                        function moveUp() {
                            if (currentPage === pages.length || dragDelta() < settings.minimumDrag) {
                                list.animate({ top: "+=" + dragDelta()}, settings.duration);
                                return;
                            }

                            scrollUp();

                        }

                        function moveDown() {
                            if (currentPage === 1 || dragDelta() < settings.minimumDrag) {
                                list.animate({ top: "-=" + dragDelta()}, settings.duration);
                                return;
                            }

                            scrollDown();

                        }

                        function dragDelta() {
                            return Math.abs(start.coords[1] - stop.coords[1]);
                        }

                        function adjustment() {
                            return height - dragDelta();
                        }

                        settings.afterStop.apply(list, arguments);
                    }
                });
            }

            container.append(list);

            originalList.replaceWith(container);

            this.getPageIndex = function () {
                return currentPage - 1;
            }

            this.getPageCount = function () {
                return pages.length;
            }

            this.flipForward = function () {
                if (currentPage === pages.length) return;

                if (settings.direction.toLowerCase() === "horizontal") {
                    scrollLeft();
                } else if (settings.direction.toLowerCase() === "vertical") {
                    scrollUp();
                }

            }

            this.flipBackward = function () {
                if (currentPage === 1) return;

                if (settings.direction.toLowerCase() === "horizontal") {
                    scrollRight();
                } else if (settings.direction.toLowerCase() === "vertical") {
                    scrollDown();
                }

            }

        });
    };
})(jQuery);