import Tada from '../src/main';

describe('Tests of Tata', function() {
    before(() => {
        window.__html__ = window.__html__ || {};

        this.partial = window.__html__['tests/partials/images.html'];
        this.clock = sinon.useFakeTimers();
    });

    beforeEach(() => {
        document.body.innerHTML = this.partial;

        this.imageNodeList = Array.from(document.getElementsByTagName('img'));
        this.divNodeList = Array.from(document.getElementsByTagName('div'));

        window.scrollTo(0, 0);

        Tada.calcViewport();
        Tada.calcThreshold();
    });

    after(() => {
        document.body.innerHTML = '';

        this.partial = null;
        this.clock = null;
        this.imageNodeList = null;
    });

    describe('#valid()', () => {
        it('화면에 보이는 요소를 판단할 수 있다.', (done) => {
            // Given
            const isVisible = Tada.valid(this.imageNodeList[0]);

            // Then
            assert(isVisible);

            done();
        });

        it('화면에 보이지 않는 요소를 판단할 수 있다.', (done) => {
            // Given
            const isInvisible = !Tada.valid(this.divNodeList[0]);

            // Then
            assert(isInvisible);

            done();
        });
    });

    describe('#add()', () => {
        it('화면에 보이는 이미지를 불러올 수 있다.', (done) => {
            // Given
            const targetImages = this.imageNodeList.filter((i) => Tada.valid(i));
            const beforeImages = targetImages.map((i) => i.cloneNode());
            const lastIndex = this.imageNodeList.indexOf(targetImages[targetImages.length - 1]);

            // When
            Tada.add('.images');

            this.clock.tick(50);

            // Then
            beforeImages.forEach((i) => assert(i.getAttribute('src') === ''));
            targetImages.forEach((i) => assert.match(i.getAttribute('src'), /^http:\/\//g));

            assert(this.imageNodeList[lastIndex + 1].getAttribute('src') === '');

            done();
        });

        it('스크롤을 내리면 내린 만큼 보이는 이미지를 불러올 수 있다.', (done) => {
            // Given
            const visibleImages = this.imageNodeList.filter((i) => Tada.valid(i));
            const nextIndex = this.imageNodeList.indexOf(visibleImages[visibleImages.length - 1]) + 1;
            const targetImage = this.imageNodeList[nextIndex];
            const beforeImage = targetImage.cloneNode();
            const imageHeight = parseInt(window.getComputedStyle(this.imageNodeList[0]).height, 10);

            // When
            Tada.add('.images');

            this.clock.tick(50);

            window.scrollTo(0, imageHeight);
            window.dispatchEvent(new CustomEvent('scroll'));

            this.clock.tick(50);

            // Then
            assert(beforeImage.getAttribute('src') === '');
            assert.match(targetImage.getAttribute('src'), /^http:\/\//g);

            done();
        });

        it('data-src 속성이 <img> 외의 엘리먼트에 존재하면 style 속성으로 이미지를 불러온다.', (done) => {
            // Given
            window.scrollTo(0, this.divNodeList[0].offsetTop);

            const visibleDivs = this.divNodeList.filter((i) => Tada.valid(i));
            const beforeDivs = visibleDivs.map((d) => d.cloneNode());
            const lastIndex = this.divNodeList.indexOf(visibleDivs[visibleDivs.length - 1]);

            // When
            Tada.add('.images');

            this.clock.tick(50);

            // Then
            beforeDivs.forEach((d) => assert(d.getAttribute('style') === null));
            visibleDivs.forEach((d) => assert.match(d.style['background-image'], /http:\/\//g));

            assert(this.divNodeList[lastIndex + 1].getAttribute('style') === null)

            done();
        });
    });
});

