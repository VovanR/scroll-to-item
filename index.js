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
         * Y axis
         *
         * @param {jQuery} $item
         * @private
         */
        _scrollToItemY: function ($item) {
            var $scroll = this._$scroll;

            var scrollTop = this._getScroll({
                scrollStart: $scroll[0].scrollTop,
                scrollSize: $scroll.height(),
                itemStart: $item.position().top,
                itemSize: $item.outerHeight(),
            });

            $scroll[0].scrollTop = scrollTop;
        },

        /**
         * X axis
         *
         * @param {jQuery} $item
         * @private
         */
        _scrollToItemX: function ($item) {
            var $scroll = this._$scroll;

            var scrollLeft = this._getScroll({
                scrollStart: $scroll[0].scrollLeft,
                scrollSize: $scroll.width(),
                itemStart: $item.position().left,
                itemSize: $item.outerWidth(),
            });

            $scroll[0].scrollLeft = scrollLeft;
        },

        /**
         * @param {Object} o
         * @param {Number} o.scrollStart
         * @param {Number} o.scrollSize
         * @param {Number} o.itemStart
         * @param {Number} o.itemSize
         * @return {Number}
         * @private
         */
        _getScroll: function (o) {
            var scrollTo = o.scrollStart;

            if (o.itemStart < 0) {
                // item starts before viewport start
                scrollTo += o.itemStart;
            } else if (o.itemStart > 0) {
                // item starts after viewport start
                if (o.itemStart < o.scrollSize) {
                    // item starts in viewport
                    if (o.itemSize >= o.scrollSize) {
                        // item size >= viewport
                        scrollTo += o.itemStart;
                    } else if (o.itemStart > o.scrollSize - o.itemSize) {
                        // item size < viewport
                        scrollTo += o.itemStart - (o.scrollSize - o.itemSize);
                    }
                } else {
                    // item starts on or after viewport end
                    if (o.itemSize > o.scrollSize) {
                        // item size > viewport
                        scrollTo += o.itemStart;
                    } else {
                        // item size <= viewport
                        scrollTo += o.itemStart - (o.scrollSize - o.itemSize);
                    }
                }
            }

            return scrollTo;
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
