/**
 * @author Vladimir Rodkin <mail@vovanr.com>
 */

define([
    'jquery',
    'lodash',
    'scroll-to-item',
], function (
    $,
    _,
    ScrollToItem
) {

    'use strict';

    var App;

    App = function () {
        this._initialize();
    };

    App.prototype = {
        /**
         * Initialize
         *
         * @private
         */
        _initialize: function () {
            this._scrollToItem = new ScrollToItem({
                $scroll: $('.js-list__scroll'),
                itemClassName: '.js-list__item',
            });
            this._fillList(10);
            this._bindList();
        },

        /**
         * @param {Number} count
         * @private
         */
        _fillList: function (count) {
            var listItemTemplate = _.template($('#list__item-template').html());
            var $list = $('.js-list');
            var items = [];
            _.times(count, function (i) {
                items.push(listItemTemplate({
                    pk: i,
                    size: _.random(20, 110, false),
                }));
            });
            items = items.join('');
            $list.html(items);

            var anchorTemplate = _.template($('#anchors__item-template').html());
            var $anchors = $('.js-anchors');
            var anchors = [];
            _.times(count, function (i) {
                anchors.push(anchorTemplate({
                    pk: i,
                }));
            });
            anchors = anchors.join('');
            $anchors.html(anchors);
        },

        /**
         * @private
         */
        _bindList: function () {
            var _this = this;
            $('.js-list').on('click', '.js-list__item', function () {
                var $this = $(this);
                var pk = $this.data('pk')
                _this._selectItem(pk);
            });

            $('.js-anchors').on('click', '.js-anchors__item', function () {
                var $this = $(this);
                var pk = $this.data('pk')
                _this._selectItem(pk);
            });

            $('#direction-toggler').on('click', function () {
                $('.js-list__scroll').toggleClass('list__scroll_x');
            });
        },

        /**
         */
        _selectItem: function (pk) {
            this._scrollToItem.scrollToItem(pk);
            $('.js-list__item').removeClass('_state_current');
            $('.js-list__item[data-pk=\'' + pk + '\']').addClass('_state_current');
        },
    };

    return new App();

});
