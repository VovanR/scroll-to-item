requirejs([
    'jquery',
    'chai',
    'sinon',
    'lodash',
    '../index',
], function (
    $,
    chai,
    sinon,
    _,
    ScrollToItem
) {

    'use strict';

    mocha.setup('bdd');
    var assert = chai.assert;

    describe('ScrollToItem', function () {
        var listItemTemplate = _.template($('#list__item-template').html());
        /**
         */
        var module = function (o, count) {
            var $fixtures = $('#fixtures');

            if (count) {
                var $list = $fixtures.find('.js-list');
                var items = [];
                _.times(count, function (i) {
                    items.push(listItemTemplate({
                        pk: i,
                    }));
                });
                items = items.join('');
                $list.html(items);
            }

            o = _.defaults(
                o || {},
                {
                    $scroll: $fixtures.find('.js-list__scroll'),
                    itemClassName: '.js-list__item',
                }
            );

            return new ScrollToItem(o);
        };

        /**
         * @return {Number}
         */
        var getScrollerLeft = function () {
            return $('#fixtures .js-list__scroll')[0].scrollLeft;
        };

        /**
         * @param {Number} scrollLeft
         */
        var setScrollerLeft = function (scrollLeft) {
            $('#fixtures .js-list__scroll')[0].scrollLeft = scrollLeft;
        };

        var _bFixtureTemplate = $('#fixture-template');
        var _fixtureTemplate = _bFixtureTemplate.html();
        _bFixtureTemplate.empty();

        beforeEach(function () {
            $('#fixtures').html(_fixtureTemplate);
            assert.equal(getScrollerLeft(), 0);
        });

        afterEach(function () {
            setScrollerLeft(0);
        });

        describe('constructor', function () {
        });

        describe('_scrollToItemX', function () {
            it('should fire `_getScroll`', function () {
                var m = module({}, 10);
                sinon.stub(m, '_getScroll');
                m._scrollToItemX($('#fixtures [data-pk=\'2\']'));
                assert.isTrue(m._getScroll.calledOnce);
                assert.isObject(m._getScroll.getCall(0).args[0]);
                m._getScroll.restore();
            });

            it('should understand items paddings', function () {
                var m = module({}, 10);
                sinon.stub(m, '_getScroll');
                var $item = $('#fixtures .js-list__item[data-pk=\'5\']');
                $item.css('padding', '50px');
                m._scrollToItemX($item);
                assert.equal(m._getScroll.getCall(0).args[0].itemSize, 110);
                m._getScroll.restore();
            });
        });
    });

    if (window.mochaPhantomJS) {
        mochaPhantomJS.run();
    } else {
        mocha.run();
    }

});
