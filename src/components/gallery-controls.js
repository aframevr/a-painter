/* globals AFRAME THREE */
AFRAME.registerComponent('gallery-controls', {
  dependencies: ['tracked-controls', 'brush'],

  schema: {},

  galleryIndex: 1,

  gallery: [{
    image: 'aframe-astronaut',
    href: 'https://ucarecdn.com/9687f762-43ff-488d-8e33-8885770f59b3/',
  }, {
    image: 'you-shall-not-pass',
    href: 'https://ucarecdn.com/962b242b-87a9-422c-b730-febdc470f203/',
  }, {
    image: 'alien-creeper',
    href: 'https://ucarecdn.com/c9c89a30-7259-46aa-9b02-64b72adb3fb2/',
  }, {
    image: 'flying-man',
    href: 'https://ucarecdn.com/bacf6186-96b1-404c-9751-e955ece04919/',
  }, {
    image: 'skull-head',
    href: 'https://ucarecdn.com/d939bcb0-bc69-4600-a5d2-3e0b47e0639c/',
  }, {
    image: 'spongebob-imagination',
    href: 'https://ucarecdn.com/b6298564-d13b-4917-89cd-6a6b2ceb8efd/',
  }, {
    image: 'man-and-butterfly',
    href: 'https://ucarecdn.com/3e089e07-be62-48e1-9f12-9a284c249e77/',
  }, {
    image: 'tree-stub',
    href: 'https://ucarecdn.com/3f92dffd-1c66-400d-898a-9a9decd5f07a/',
  }],

  init: function () {
    var el = this.el;
    var self = this;

    this.setPreviews();

    var handleAxisMoveDebounced = debounce(this.handleAxisMove.bind(this), 250);
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    // this.el.addEventListener('axismove', handleAxisMoveDebounced);

    function debounce(func, wait, immediate) {
    	var timeout;
    	return function() {
    		var context = this, args = arguments;
    		var later = function() {
    			timeout = null;
    			if (!immediate) func.apply(context, args);
    		};
    		var callNow = immediate && !timeout;
    		clearTimeout(timeout);
    		timeout = setTimeout(later, wait);
    		if (callNow) func.apply(context, args);
    	};
    };
  },

  handleKeyDown: function(evt) {
    if (evt.keyCode === 40 || evt.keyCode === 38) {
      this.handleAxisMove(evt);
    }

    if (evt.keyCode === 13) {
      this.handlePreviewSelect.apply(this);
    }
  },

  handleAxisMove: function(evt) {
    // evt = { detail: { axis: [1, -1] } };
    // if ((evt.detail.axis[0] === 0 && evt.detail.axis[1] === 0) &&
    //     this.data.hand === 'left') {
    //   return;
    // }

    var direction;
    if (evt.keyCode === 40) {
      direction = 'forward';
    } else if (evt.keyCode === 38) {
      direction = 'backward';
    }

    // direction = evt.detail.axis[1] < 0 ? 'forward' : 'backward';
    if (direction === 'backward' && this.galleryIndex >= 1) {
      this.galleryIndex--;
      this.setPreviews();
    } else if (this.galleryIndex < this.gallery.length - 1 &&
      direction === 'forward') {
      this.galleryIndex++;
      this.setPreviews();
    }
  },

  setPreviews: function () {
    var preview0 = document.querySelector('#preview-0');
    var preview1 = document.querySelector('#preview-1');
    var preview2 = document.querySelector('#preview-2');

    if (!this.gallery[this.galleryIndex - 1]) {
      preview0.setAttribute('src', null);
    } else {
      preview0.setAttribute('src', '#preview-' + this.gallery[this.galleryIndex - 1].image);
    }

    preview1.setAttribute('src', '#preview-' + this.gallery[this.galleryIndex].image);

    if (!this.gallery[this.galleryIndex + 1]) {
      preview2.setAttribute('src', null);
    } else {
      preview2.setAttribute('src', '#preview-' + this.gallery[this.galleryIndex + 1].image);
    }
  },

  handlePreviewSelect: function() {
    this.el.sceneEl.systems.brush.loadFromUrl(this.gallery[this.galleryIndex].href);
  },
});
