(function () {
    function carouselBanner(option) {
        if (!option.select) {
            console.error('carouselBanner: not set DOM');
            return;
        }

        var dom = option.select,
            time = option.time || 3000,
            width = option.width || 'auto',
            height = option.height || 'auto',
            type = option.type || 'fade',
            dot = option.dot || false,
            domEvent = option.domEvent || false,
            source = dom.querySelectorAll('.carousel_banner_content');

        if (type === 'slide' &&
            width === 'auto' &&
            height === 'auto') {
            var imgHeight = dom.querySelector('img'),
            style = imgHeight.currentStyle || window.getComputedStyle(imgHeight);
            width = style.width;
            height = style.height;
        }

        dom.style = 'overflow:hidden;' +
            'position:relative;' +
            'width:' + width + ';' +
            'height:' + height + ';';

        if (!source.length) {
            console.error('carouselBanner: not set carousel_banner_content class');
            return;
        }


        var data = dom2Data(source, {
            'node' : 'a',
            'attributes': ['href', 'className', 'dataset', 'target'],
            'children': {
                'node' : 'img',
                'attributes': ['src', 'srcset', 'className'],
            }
        });

        if (source.length === 1) {
            if (domEvent) {
                domEvent(domEventDataFeed(source[0], data[0].attributes.dataset));
            }
            return;
        }

        dom.innerHTML = '';

        if (dot) {
            initDot();
        }

        switch (type) {
            case 'slide':
                slide();
                break;
            case 'fade':
                fade();
                break;
            case 'random':
                random();
                break;
            default:
                fade();
                break;
        }

        function initDot() {
            var dotContainer =  document.createElement('div');
            dotContainer.setAttribute('class', 'carousel_banner_dot_container')
            dotContainer.style = 'width:' + data.length + 'em;';
            for (var i = 0; i < data.length; i++) {
                var dot = document.createElement('div');
                dot.setAttribute('class', 'carousel_banner_dot');
                if (i === 0) {
                    dot.setAttribute('class', 'carousel_banner_dot focus');
                }
                dotContainer.appendChild(dot);
            }
            dom.appendChild(dotContainer);
        }

        function domEventDataFeed(dom, obj) {
            var tmpObj = {};
            tmpObj.dom = dom;
            for (var x in obj) {
                tmpObj[x] = obj[x];
            }
            return tmpObj;
        }

        function fade() {

            var fadeDom = data2Dom(data);
            for (var i = 0; i < fadeDom.length; i++) {
                if (i === 0) {
                    fadeDom[i].classList.add('fade_in');
                }
                fadeDom[i].classList.add('fade');
                if (domEvent) {
                    domEvent(domEventDataFeed(fadeDom[i], data[i].attributes.dataset));
                }
                dom.appendChild(fadeDom[i]);
            }

            var counter = 0,
                dots = document.querySelectorAll('.carousel_banner_dot'),
                intervalID;

            intervalManager(true, fadeTimer, time);

            dom.addEventListener('mouseenter', function () {
                intervalManager(false);
            });

            dom.addEventListener('mouseleave', function () {
                intervalManager(true, fadeTimer, time);
            });

            function fadeTimer() {
                if (dots.length) {
                    dots[counter].classList.remove('focus');
                }
                fadeDom[counter].classList.remove('fade_in');
                counter++;
                if (counter >= fadeDom.length) {
                    counter = 0;
                }
                fadeDom[counter].classList.add('fade_in');
                if (dots.length) {
                    dots[counter].classList.add('focus');
                }
            }

            function intervalManager(flag, animate, time) {
               if(flag) {
                 intervalID = setInterval(animate, time);
               } else {
                 clearInterval(intervalID);
               }
            }
        }

        function slide() {
            var currentCount = 0,
                transitionAction = false,
                slideInterval = true,
                slideContainer = document.createElement('div'),
                arrow,
                dots = dom.querySelectorAll('.carousel_banner_dot'),
                intervalID,
                currentCountIncrease = currentCount + 1,
                currentCountDecrease = data.length - 1,
                currentData = [data[currentCountDecrease], data[currentCount], data[currentCountIncrease]];


            slideContainer.style = 'overflow:hidden;' +
                'position:absolute;' +
                'top:0;' +
                'left:0;' +
                'width:' + width + ';' +
                'height:' + height + ';';
            dom.appendChild(slideContainer);
            var slideDom = data2Dom(currentData);

            for (var k = 0; k < slideDom.length; k++) {
                slideDom[k].style = 'position:absolute;' +
                    'top:0;' +
                    'width:' + width + 'px;'+
                    'height:' + height + 'px;'+
                    'left:' + parseInt(width, 10)*(k - 1) + 'px;';
                if (domEvent) {
                    domEvent(domEventDataFeed(slideDom[k], currentData[k].attributes.dataset));
                }
                slideContainer.appendChild(slideDom[k]);
            }

            intervalManager(true, function () {
                arrow = '+';
                slideTimer(arrow);
            }, time);

            // dom.addEventListener('mouseenter', function () {
            //     intervalManager(false);
            // });

            // dom.addEventListener('mouseleave', function () {
            //     intervalManager(true, slideTimer, time);
            // });
            var xDown = null;
            var xDiff = null;
            var yDown = null;

            dom.addEventListener('touchstart', handleTouchStart);
            dom.addEventListener('touchmove', handleTouchMove);
            dom.addEventListener('touchend', handleTouchEnd);
            dom.addEventListener('transitionend', handleTransitionEnd);

            function handleTouchStart(e) {
                xDown = e.touches[0].clientX;
                yDown = e.touches[0].clientY;
                intervalManager(false);
                slideInterval = false;
            }

            function handleTouchMove(e) {
                var xUp = e.touches[0].clientX;
                var yUp = e.touches[0].clientY;

                var xDiff = xDown - xUp;
                var yDiff = yDown - yUp;

                if (Math.abs(xDiff) > Math.abs(yDiff)) {
                    if (xDiff > 0) {
                        console.log('left swipe');
                    } else {
                        console.log('right swipe');
                    }
                }
            }

            function handleTouchEnd(e) {
                console.log(xDown);
                console.log(e.changedTouches[0].clientX);
                if ((xDown - e.changedTouches[0].clientX) > 0) {
                    arrow = '+';
                    console.log('left end');
                } else {
                    arrow = '-';
                    console.log('right end');
                }
                if ((xDown - e.changedTouches[0].clientX)) {
                    slideTimer(arrow);
                }
            }


            function handleTransitionEnd(e) {
                if (transitionAction) {
                    transitionAction = false;
                    updateData(arrow);
                    if (!slideInterval) {
                        arrow = '+';
                        slideInterval = true;
                        intervalManager(true, function () {
                            slideTimer(arrow);
                        }, time);
                    }
                }
            }
            function updateData(arrow) {
                if (arrow === '+') {
                    slideContainer.childNodes[0].outerHTML = '';
                    delete slideContainer.childNodes[0];
                    var tmpArray = [data[currentCountIncrease]];
                    var nextDom = data2Dom(tmpArray);
                    for (var i = 0; i < nextDom.length; i++) {
                        nextDom[i].style = 'position:absolute;' +
                            'top:0;' +
                            'width:' + width + 'px;'+
                            'height:' + height + 'px;'+
                            'left:' + parseInt(width, 10)*1 + 'px;';
                        if (domEvent) {
                            domEvent(domEventDataFeed(nextDom[i], data[currentCountIncrease].attributes.dataset));
                        }
                        slideContainer.appendChild(nextDom[i]);
                    }
                } else {
                    slideContainer.childNodes[slideDom.length - 1].outerHTML = '';
                    delete slideContainer.childNodes[slideDom.length - 1];
                    var tmpArray = [data[currentCountDecrease]];
                    var prevDom = data2Dom(tmpArray);
                    for (var i = 0; i < prevDom.length; i++) {
                        prevDom[i].style = 'position:absolute;' +
                            'top:0;' +
                            'width:' + width + 'px;'+
                            'height:' + height + 'px;'+
                            'left:' + parseInt(width, 10)*(-1) + 'px;';
                        if (domEvent) {
                            domEvent(domEventDataFeed(prevDom[i], data[currentCountDecrease].attributes.dataset));
                        }
                        slideContainer.childNodes[0].parentNode.insertBefore(prevDom[i], slideContainer.childNodes[0]);
                    }
                }
            }

            function slideTimer(arrow) {
                transitionAction = true;
                if (dots.length) {
                    dots[currentCount].classList.remove('focus');
                }

                arrow = arrow || '+';
                updateCounter(arrow);

                for (var k = 0; k < slideContainer.childNodes.length; k++) {
                    var left;
                    if (arrow === '+') {
                        left = parseInt(width, 10)*(k - 2);
                    } else {
                        left = parseInt(width, 10)*(k);
                    }
                    slideContainer.childNodes[k].style = 'position:absolute;' +
                        'top:0;' +
                        'width:' + width + 'px;'+
                        'height:' + height + 'px;'+
                        'left:' + left + 'px;';
                }
                if (dots.length) {
                    dots[currentCount].classList.add('focus');
                }
            }

            function updateCounter(type) {
                if (type === '+') {
                    currentCount++;
                    if (currentCount > data.length - 1) {
                        currentCount = 0;
                    }
                } else {
                    currentCount--;
                    if (currentCount < 0) {
                        currentCount = data.length - 1;
                    }
                }
                currentCountIncrease = currentCount + 1;
                currentCountDecrease = currentCount - 1;
                if (currentCountIncrease > data.length - 1) {
                    currentCountIncrease = 0;
                }
                if (currentCountDecrease < 0) {
                    currentCountDecrease = data.length - 1;
                }
                // console.log(currentCountDecrease, currentCount, currentCountIncrease);
            }

            function intervalManager(flag, animate, time) {
               if(flag) {
                 intervalID = setInterval(animate, time);
               } else {
                 clearInterval(intervalID);
                 intervalID = null;
               }
            }
        }

        function random() {
            var randomDom = data2Dom(data),
                rand = Math.floor((Math.random() * randomDom.length) + 0);
            if (domEvent) {
                domEvent(domEventDataFeed(randomDom[rand], data[rand].attributes.dataset));
            }
            dom.appendChild(randomDom[rand]);
        }

        function dom2Data(select, format) {
            var tmpData = [];

            for (var i = 0; i < select.length; i++) {
                var tmpObj = {
                    'node': format.node,
                    'attributes': {},
                    'children': {
                        'node': format.children.node,
                        'attributes': {}
                    }
                };
                for (var j = 0; j < format.attributes.length; j++) {
                    tmpObj['attributes'][format.attributes[j]] = select[i][format.attributes[j]];
                }
                for (var k = 0; k < format.attributes.length; k++) {
                    tmpObj['children']['attributes'][format.children.attributes[k]] = select[i].children[0][format.children.attributes[k]];
                }
                tmpData.push(tmpObj);
            }

            return tmpData;
        }

        function data2Dom(data) {
            var tmpData = [];
            for (var i = 0; i < data.length; i++) {
                var node = document.createElement(data[i].node);
                for (var x in data[i]['attributes']) {
                    node[x] = data[i]['attributes'][x];
                    if (x === 'dataset') {
                        for (var d in data[i]['attributes'][x]) {
                            node.setAttribute('data-' + d, data[i]['attributes'][x][d])
                        }
                    }
                }
                var childNode = document.createElement(data[i]['children'].node);
                for (var y in data[i]['children']['attributes']) {
                    childNode[y] = data[i]['children']['attributes'][y];
                }
                node.appendChild(childNode);
                tmpData.push(node);
            }
            return tmpData;
        }
    }
    window.carouselBanner = carouselBanner;
})();