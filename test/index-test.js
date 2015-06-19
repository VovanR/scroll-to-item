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
            // setScrollerTop(0);
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

        describe('_init', function () {
        });

        describe('_bindControls', function () {
        });

        describe('#scrollToItem', function () {
            describe('item starts before viewport start', function () {
                it('should scroll if item is on top', function () {
                    var m = module({}, 10);
                    setScrollerTop(30);
                    assert.equal(getScrollerTop(), 30);
                    m.scrollToItem('2');
                    assert.equal(getScrollerTop(), 20);
                });
            });

            describe('item start equals viewport start', function () {
                it('should not scroll if item start equals viewport start', function () {
                    var m = module({}, 10);
                    m.scrollToItem('0');
                    assert.equal(getScrollerTop(), 0);
                });
            });

            describe('item starts after viewport start', function () {
                describe('item starts in viewport', function () {
                    it('should not scroll if item starts and ends in viewport', function () {
                        var m = module({}, 10);
                        setScrollerTop(20);
                        m.scrollToItem('3');
                        assert.equal(getScrollerTop(), 20);
                    });

                    it('should scroll if item starts in viewport and ends after viewport end', function () {
                        var m = module({}, 10);
                        $('#fixtures .js-list__item[data-pk=\'4\']').height(20);
                        setScrollerTop(20);
                        m.scrollToItem('4');
                        assert.equal(getScrollerTop(), 30);
                    });

                    it('should scroll if item top in viewport and item height > scroll height', function () {
                        var m = module({}, 10);
                        setScrollerTop(30);
                        $('#fixtures .js-list__item[data-pk=\'4\']').height(50);
                        m.scrollToItem('4');
                        assert.equal(getScrollerTop(), 40);
                    });
                });

                describe('item starts on or after viewport end', function () {
                    it('should scroll if item is on bottom', function () {
                        var m = module({}, 10);
                        $('#fixtures .js-list__item[data-pk=\'5\']').height(20);
                        m.scrollToItem('5');
                        assert.equal(getScrollerTop(), 40);
                    });

                    it('should scroll if item top === scroller height', function () {
                        var m = module({}, 10);
                        m.scrollToItem('3');
                        assert.equal(getScrollerTop(), 10);
                    });

                    it('should scroll to item top if item height > scroll height', function () {
                        var m = module({}, 10);
                        $('#fixtures .js-list__item[data-pk=\'5\']').height(50);
                        m.scrollToItem('5');
                        assert.equal(getScrollerTop(), 50);
                    });

                    it('should be good', function () {
                        var m = module({}, 10);
                        $('#fixtures .js-list__item[data-pk=\'4\']').height(50);
                        $('#fixtures .js-list__item[data-pk=\'5\']').height(50);
                        m.scrollToItem('4');
                        assert.equal(getScrollerTop(), 40);
                        m.scrollToItem('5');
                        assert.equal(getScrollerTop(), 90);
                    });

                    it('should understand current scrolled', function () {
                        var m = module({}, 10);
                        setScrollerTop(0);
                        m.scrollToItem('7');
                        assert.equal(getScrollerTop(), 50);
                        m.scrollToItem('8');
                        assert.equal(getScrollerTop(), 60);
                    });
                });
            });

            it('should understand items paddings', function () {
                var m = module({}, 10);
                $('#fixtures .js-list__item[data-pk=\'5\']').css('padding', '50px');
                m.scrollToItem('5');
                assert.equal(getScrollerTop(), 50);
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
