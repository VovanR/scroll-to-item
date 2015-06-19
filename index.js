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
            var $scroll = this._$scroll;

            var currentScrollTop = $scroll[0].scrollTop;
            var scrollTop = null;
            var scrollHeight = $scroll.height();

            var $item = $(this._itemClassName, $scroll).filter('[data-pk=\'' + pk + '\']');
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
         * @public
         */
        destroy: function () {
            this._$scroll = null;
        },
    };

    return ScrollToItem;

});
