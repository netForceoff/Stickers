class Main {
	constructor() {
		this.stickers = new Stickers;
		this.localFunction = new LocalStorage;
		this.createButtonForAddStickers();
		this.displaySavedStickers();
		let half = this;
		//localStorage.clear();
	}

	createButtonForAddStickers() {
		let button = document.createElement('button');
		button.innerHTML = 'Добавить новый стикер';

		button.addEventListener('click', () => {
			this.stickers.createSticker();
			window.location.reload();
		});

		document.body.appendChild(button);
			
	}

	displaySavedStickers() {
		window.onload = () =>  {
			let data = this.stickers.getData();
			console.log(data);
			let id;
			for (let i in data) {
				let sticker = document.createElement('textarea');

				sticker.draggable = "true";
				sticker.style.left = data[i].positionX;
				sticker.style.top = data[i].positionY;
				sticker.value = data[i].textValue;
				sticker.style.width = data[i].w;
				sticker.style.height = data[i].h;
				sticker.style.zIndex = data[i].zIndex;

				id = i;
				this.stickers.moveSticker(sticker, id);
				this.stickers.changeZIndex(sticker, id);
				this.stickers.deleteStickers(sticker, id);
				this.stickers.changheAndSaveSize(sticker, id);
				this.stickers.newText(sticker, id);
				document.body.appendChild(sticker);
			}
		}
	}
}

class Stickers {
	constructor() {
		this.localFunction = new LocalStorage;
		this.data = this.getData();
		if (this.data == null) {
			this.id = 0
		} else {
			this.id = Object.keys(this.data).length;
		}
		this.zIndex = 0;
	}

	createSticker() {
		let sticker = document.createElement('textarea');
		sticker.draggable = "true";
		sticker.style.zIndex = this.zIndex;
		sticker.style.width = '200px';
		sticker.style.height = '200px';
		document.body.appendChild(sticker);

		this.localFunction.saveSticker(sticker, this.id);

		this.changeZIndex(sticker, this.id);
		this.moveSticker(sticker, this.id);
		this.deleteStickers(sticker, this.id);
		this.changheAndSaveSize(sticker, this.id);
		this.newText(sticker, this.id);
		this.id++;
	}

	moveSticker(sticker, id) {
		let offsetX;
		let offsetY;
		let half = this;

		sticker.addEventListener('dragstart', function(event) {
			offsetX = event.offsetX;
			offsetY = event.offsetY;
		});

		sticker.addEventListener('dragend', function(event) {
			this.style.top = event.pageY - offsetY + 'px';
			this.style.left = event.pageX - offsetX + 'px';
			half.localFunction.saveSticker(this, id);
			
		});	
	}

	deleteStickers(sticker, id) {
		sticker.addEventListener('mousedown', event => {
			if (event.which == 2) {
				document.body.removeChild(sticker);
				event.preventDefault();

				delete this.data[id]; 
				this.localFunction.saveAll('sticker', this.data);
				console.log(this.data);
			}
		});
	}

	changeZIndex(sticker, id) {
		sticker.addEventListener('click', () => {
			let maxIndex = this.findMaxIndex() + 1;
			sticker.style.zIndex = maxIndex;
			this.data[id].zIndex = sticker.style.zIndex;
			this.localFunction.saveAll('sticker', this.data);
			this.zIndex++;
		});
	}

	newText(sticker, id) {
		sticker.placeholder = id + 'sticker';
		sticker.addEventListener('change', () => {
			this.data[id].textValue = sticker.value;
			this.localFunction.saveAll('sticker', this.data);
		});

	}

	findMaxIndex() {
		let stickers = document.querySelectorAll('textarea');
		let maxIndex = 0;
		for (var i = 0; i < stickers.length; i++) {
			if (maxIndex < parseInt(stickers[i].style.zIndex)) {
				maxIndex = parseInt(stickers[i].style.zIndex);
				} 
			}
		return maxIndex;
	}

	changheAndSaveSize(sticker, id) {
		sticker.addEventListener('mouseup', () => {
			this.data[id].w = sticker.style.width;
			this.data[id].h =  sticker.style.height;
			this.data[id].textValue = sticker.value;
			this.localFunction.saveAll('sticker', this.data);	
		});
	}

	getData() {
		let data = this.localFunction.getAll('sticker');
			if (data == null) {
			data = {};
		}
		return data;
	}
}

class LocalStorage {
	saveSticker(sticker, id) {
		let data = this.getAll('sticker');

		if (data == null) {
			data = {};
		}

		data[id] = {
			positionX: sticker.style.left,
			positionY: sticker.style.top,
			w: sticker.style.width,
			h: sticker.style.height,
			textValue: sticker.value,
			zIndex: sticker.style.zIndex
		};
		console.log(data);

		this.saveAll('sticker', data);
	}

	saveAll(id, data) {
		localStorage.setItem(id, JSON.stringify(data));
	}

	getAll(id) {
		let json = localStorage.getItem(id);
			return JSON.parse(json);
	}
}

new Main();