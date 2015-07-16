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
        var getScrollerTop = function () {
            return $('#fixtures .js-list__scroll')[0].scrollTop;
        };

        /**
         * @param {Number} scrollTop
         */
        var setScrollerTop = function (scrollTop) {
            $('#fixtures .js-list__scroll')[0].scrollTop = scrollTop;
        };

        var _bFixtureTemplate = $('#fixture-template');
        var _fixtureTemplate = _bFixtureTemplate.html();
        _bFixtureTemplate.empty();

        beforeEach(function () {
            $('#fixtures').html(_fixtureTemplate);
            assert.equal(getScrollerTop(), 0);
        });

        afterEach(function () {
            setScrollerTop(0);
        });

        describe('constructor', function () {
            it('should have `$scroll` option', function () {
                var m = module();
                assert.ok(m._$scroll.length);
            });

            it('should have `itemClassName` option', function () {
                var m = module();
                assert.ok(m._itemClassName);
            });
        });

        describe('#scrollToItem', function () {
            it('should fire `_scrollToItemY` with `$item` param', function () {
                var m = module({}, 10);
                sinon.stub(m, '_scrollToItemY');
                m.scrollToItem('2');
                assert.isTrue(m._scrollToItemY.calledOnce);
                assert.equal(m._scrollToItemY.getCall(0).args[0].data('pk'), '2');
                m._scrollToItemY.restore();
            });

            it('should fire `_scrollToItemX` with `$item` param', function () {
                var m = module({}, 10);
                sinon.stub(m, '_scrollToItemX');
                m.scrollToItem('2');
                assert.isTrue(m._scrollToItemX.calledOnce);
                assert.equal(m._scrollToItemX.getCall(0).args[0].data('pk'), '2');
                m._scrollToItemX.restore();
            });
        });

        describe('_scrollToItemY', function () {
            it('should fire `_getScroll`', function () {
                var m = module({}, 10);
                sinon.stub(m, '_getScroll');
                m._scrollToItemY($('#fixtures [data-pk=\'2\']'));
                assert.isTrue(m._getScroll.calledOnce);
                assert.isObject(m._getScroll.getCall(0).args[0]);
                m._getScroll.restore();
            });

            it('should understand items paddings', function () {
                var m = module({}, 10);
                sinon.stub(m, '_getScroll');
                var $item = $('#fixtures .js-list__item[data-pk=\'5\']');
                $item.css('padding', '50px');
                m._scrollToItemY($item);
                assert.equal(m._getScroll.getCall(0).args[0].itemSize, 110);
                m._getScroll.restore();
            });
        });

        describe('_getScroll', function () {
            describe('item starts before viewport start', function () {
                it('should scroll if item is on top', function () {
                    var m = module({}, 10);
                    var scrollTo = m._getScroll({
                        scrollStart: 30,
                        scrollSize: 30,
                        itemStart: -10,
                        itemSize: 10,
                    });
                    assert.equal(scrollTo, 20);
                });
            });

            describe('item start equals viewport start', function () {
                it('should not scroll if item start equals viewport start', function () {
                    var m = module({}, 10);
                    var scrollTo = m._getScroll({
                        scrollStart: 0,
                        scrollSize: 30,
                        itemStart: 0,
                        itemSize: 10,
                    });
                    assert.equal(scrollTo, 0);
                });
            });

            describe('item starts after viewport start', function () {
                describe('item starts in viewport', function () {
                    it('should not scroll if item starts and ends in viewport', function () {
                        var m = module({}, 10);
                        var scrollTo = m._getScroll({
                            scrollStart: 20,
                            scrollSize: 30,
                            itemStart: 10,
                            itemSize: 10,
                        });
                        assert.equal(scrollTo, 20);
                    });

                    it('should scroll if item starts in viewport and ends after viewport end', function () {
                        var m = module({}, 10);
                        var scrollTo = m._getScroll({
                            scrollStart: 20,
                            scrollSize: 30,
                            itemStart: 20,
                            itemSize: 20,
                        });
                        assert.equal(scrollTo, 30);
                    });

                    it('should scroll if item top in viewport and item height > scroll height', function () {
                        var m = module({}, 10);
                        var scrollTo = m._getScroll({
                            scrollStart: 30,
                            scrollSize: 30,
                            itemStart: 10,
                            itemSize: 50,
                        });
                        assert.equal(scrollTo, 40);
                    });
                });

                describe('item starts on or after viewport end', function () {
                    it('should scroll if item is on bottom', function () {
                        var m = module({}, 10);
                        var scrollTo = m._getScroll({
                            scrollStart: 0,
                            scrollSize: 30,
                            itemStart: 50,
                            itemSize: 20,
                        });
                        assert.equal(scrollTo, 40);
                    });

                    it('should scroll if item top === scroller height', function () {
                        var m = module({}, 10);
                        var scrollTo = m._getScroll({
                            scrollStart: 0,
                            scrollSize: 30,
                            itemStart: 30,
                            itemSize: 10,
                        });
                        assert.equal(scrollTo, 10);
                    });

                    it('should scroll to item top if item height > scroll height', function () {
                        var m = module({}, 10);
                        var scrollTo = m._getScroll({
                            scrollStart: 0,
                            scrollSize: 30,
                            itemStart: 50,
                            itemSize: 50,
                        });
                        assert.equal(scrollTo, 50);
                    });

                    it('should understand current scrolled', function () {
                        var m = module({}, 10);
                        var scrollTo = m._getScroll({
                            scrollStart: 0,
                            scrollSize: 30,
                            itemStart: 70,
                            itemSize: 10,
                        });
                        assert.equal(scrollTo, 50);
                        scrollTo = m._getScroll({
                            scrollStart: 50,
                            scrollSize: 30,
                            itemStart: 30,
                            itemSize: 10,
                        });
                        assert.equal(scrollTo, 60);
                    });
                });
            });
        });

        describe('#destroy', function () {
            it('should remove link from scroller block', function () {
                var m = module();
                assert.ok(m._$scroll.length);
                m.destroy();
                assert.isNull(m._$scroll);
            });
        });
    });

    if (window.mochaPhantomJS) {
        mochaPhantomJS.run();
    } else {
        mocha.run();
    }

});
