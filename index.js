/**
 * @module ScrollToItem
 * @author Vladimir Rodkin <mail@vovanr.com>
 */

define([
    'jquery',
], function (
    $
) {

    'use strict';

    var ScrollToItem;

    /**
     * @param {Object} o Options
     * @param {jQuery} o.$scroll Scroller block
     * @param {String} o.itemClassName Scroll items class name
     * @constructor
     * @alias module:ScrollToItem
     */
    ScrollToItem = function (o) {
        this._$scroll = o.$scroll;
        this._itemClassName = o.itemClassName;
    };

    ScrollToItem.prototype = {
        /**
         * @param {String} pk
         * @public
         */
        scrollToItem: function (pk) {
            var $item = $(this._itemClassName, this._$scroll).filter('[data-pk=\'' + pk + '\']');

            this._scrollToItemY($item);
            this._scrollToItemX($item);
        },

        /**
         * @param {jQuery} $item
         * @private
         */
        _scrollToItemY: function ($item) {
            var $scroll = this._$scroll;

            var currentScrollTop = $scroll[0].scrollTop;
            var scrollTop = null;
            var scrollHeight = $scroll.height();

            var itemScrollTop = $item.position().top;
            var itemHeight = $item.outerHeight();

            if (itemScrollTop < 0) {
                // item starts before viewport start
                scrollTop = currentScrollTop + itemScrollTop;
            } else if (itemScrollTop > 0) {
                // item starts after viewport start
                if (itemScrollTop < scrollHeight) {
                    // item starts in viewport
                    if (itemHeight >= scrollHeight) {
                        // item height >= viewport
                        scrollTop = currentScrollTop + itemScrollTop;
                    } else if (itemScrollTop > scrollHeight - itemHeight) {
                        // item height < viewport
                        scrollTop = currentScrollTop + itemScrollTop - (scrollHeight - itemHeight);
                    }
                } else {
                    // item starts on or after viewport end
                    if (itemHeight > scrollHeight) {
                        // item height > viewport
                        scrollTop = currentScrollTop + itemScrollTop;
                    } else {
                        // item height <= viewport
                        scrollTop = currentScrollTop + itemScrollTop - (scrollHeight - itemHeight);
                    }
                }
            }

            if (scrollTop !== null) {
                $scroll[0].scrollTop = scrollTop;
            }
        },

        /**
         * @param {jQuery} $item
         * @private
         */
        _scrollToItemX: function ($item) {
            var $scroll = this._$scroll;

            var currentScrollLeft = $scroll[0].scrollLeft;
            var scrollLeft = null;
            var scrollWidth = $scroll.width();

            var itemScrollLeft = $item.position().left;
            var itemWidth = $item.outerWidth();

            if (itemScrollLeft < 0) {
                // item starts before viewport start
                scrollLeft = currentScrollLeft + itemScrollLeft;
            } else if (itemScrollLeft > 0) {
                // item starts after viewport start
                if (itemScrollLeft < scrollWidth) {
                    // item starts in viewport
                    if (itemWidth >= scrollWidth) {
                        // item width >= viewport
                        scrollLeft = currentScrollLeft + itemScrollLeft;
                    } else if (itemScrollLeft > scrollWidth - itemWidth) {
                        // item width < viewport
                        scrollLeft = currentScrollLeft + itemScrollLeft - (scrollWidth - itemWidth);
                    }
                } else {
                    // item starts on or after viewport end
                    if (itemWidth > scrollWidth) {
                        // item width > viewport
                        scrollLeft = currentScrollLeft + itemScrollLeft;
                    } else {
                        // item width <= viewport
                        scrollLeft = currentScrollLeft + itemScrollLeft - (scrollWidth - itemWidth);
                    }
                }
            }

            if (scrollLeft !== null) {
                $scroll[0].scrollLeft = scrollLeft;
            }
        },

        /**
         * @public
         */
        destroy: function () {
            this._$scroll = null;
        },
    };

    return ScrollToItem;

});
