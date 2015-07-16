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

        describe('#scrollToItem', function () {
            it('should fire `_scrollToItemY` with `$item` param', function () {
                var m = module({}, 10);
                sinon.stub(m, '_scrollToItemY');
                m.scrollToItem('2');
                assert.isTrue(m._scrollToItemY.calledOnce);
                assert.equal(m._scrollToItemY.getCall(0).args[0].data('pk'), '2');
                m._scrollToItemY.restore();
            });
        });

        describe('_scrollToItemX', function () {
            describe('item starts before viewport start', function () {
                it('should scroll if item is on left', function () {
                    var m = module({}, 10);
                    setScrollerLeft(30);
                    assert.equal(getScrollerLeft(), 30);
                    m.scrollToItem('2');
                    assert.equal(getScrollerLeft(), 20);
                });
            });

            describe('item start equals viewport start', function () {
                it('should not scroll if item start equals viewport start', function () {
                    var m = module({}, 10);
                    m.scrollToItem('0');
                    assert.equal(getScrollerLeft(), 0);
                });
            });

            describe('item starts after viewport start', function () {
                describe('item starts in viewport', function () {
                    it('should not scroll if item starts and ends in viewport', function () {
                        var m = module({}, 10);
                        setScrollerLeft(20);
                        m.scrollToItem('3');
                        assert.equal(getScrollerLeft(), 20);
                    });

                    it('should scroll if item starts in viewport and ends after viewport end', function () {
                        var m = module({}, 10);
                        $('#fixtures .js-list__item[data-pk=\'4\']').width(20);
                        setScrollerLeft(20);
                        m.scrollToItem('4');
                        assert.equal(getScrollerLeft(), 30);
                    });

                    it('should scroll if item left in viewport and item width > scroll width', function () {
                        var m = module({}, 10);
                        setScrollerLeft(30);
                        $('#fixtures .js-list__item[data-pk=\'4\']').width(50);
                        m.scrollToItem('4');
                        assert.equal(getScrollerLeft(), 40);
                    });
                });

                describe('item starts on or after viewport end', function () {
                    it('should scroll if item is on right', function () {
                        var m = module({}, 10);
                        $('#fixtures .js-list__item[data-pk=\'5\']').width(20);
                        m.scrollToItem('5');
                        assert.equal(getScrollerLeft(), 40);
                    });

                    it('should scroll if item left === scroller width', function () {
                        var m = module({}, 10);
                        m.scrollToItem('3');
                        assert.equal(getScrollerLeft(), 10);
                    });

                    it('should scroll to item left if item width > scroll width', function () {
                        var m = module({}, 10);
                        $('#fixtures .js-list__item[data-pk=\'5\']').width(50);
                        m.scrollToItem('5');
                        assert.equal(getScrollerLeft(), 50);
                    });

                    it('should be good', function () {
                        var m = module({}, 10);
                        $('#fixtures .js-list__item[data-pk=\'4\']').width(50);
                        $('#fixtures .js-list__item[data-pk=\'5\']').width(50);
                        m.scrollToItem('4');
                        assert.equal(getScrollerLeft(), 40);
                        m.scrollToItem('5');
                        assert.equal(getScrollerLeft(), 90);
                    });

                    it('should understand current scrolled', function () {
                        var m = module({}, 10);
                        setScrollerLeft(0);
                        m.scrollToItem('7');
                        assert.equal(getScrollerLeft(), 50);
                        m.scrollToItem('8');
                        assert.equal(getScrollerLeft(), 60);
                    });
                });
            });

            it('should understand items paddings', function () {
                var m = module({}, 10);
                $('#fixtures .js-list__item[data-pk=\'5\']').css('padding', '50px');
                m.scrollToItem('5');
                assert.equal(getScrollerLeft(), 50);
            });
        });
    });

    if (window.mochaPhantomJS) {
        mochaPhantomJS.run();
    } else {
        mocha.run();
    }

});
