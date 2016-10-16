var TicTacToe = function(options) {

	var settings = $.extend({
		notice: $('.notice'),
		logo: {
			cross: $('.logo__slot--cross'),
			circle: $('.logo__slot--circle'),
			activeClass: 'logo__slot--active',
			winnerClass: 'logo__slot--winner'
		},
		checker: {
			element: $('.checker'),
			winnerClass: 'checker__slot--winner'
		},
		checkerSlot: $('.checker__slot'),
		player: {
			cross: {
				className: 'checker__slot--cross'
			},
			circle: {
				className: 'checker__slot--circle'
			}
		},
		reloadBtn: $('.btn__new-game')
	}, options);

	var checker = {
		0: {
			value: true,
			owner: null
		},
		1: {
			value: true,
			owner: null
		},
		2: {
			value: true,
			owner: null
		},
		3: {
			value: true,
			owner: null
		},
		4: {
			value: true,
			owner: null
		},
		5: {
			value: true,
			owner: null
		},
		6: {
			value: true,
			owner: null
		},
		7: {
			value: true,
			owner: null
		},
		8: {
			value: true,
			owner: null
		}
	};
	var winningPatterns = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6]
	];
	var gameHistory = [];
	var player = 'cross';

	var getSlot = function(slot) {
		var slotIndex = slot.index();
		if (slotIndex >= 0 && slotIndex <= 8) {
			return slotIndex;
		}
		return false;
	};

	var canUpdate = function(slot) {
		return checker[getSlot(slot)].value;
	};

	var getSlotOwner = function(slot) {
		return checker[slot].owner;
	};

	var isYourTurn = function() {
		if (getLastPlayer() === undefined && player === 'cross') {
			return true;
		}
		else if (getLastPlayer() === player) {
			return false;
		}
		return true;
	};

	var getLastPlayer = function() {
		return gameHistory[gameHistory.length - 1];
	};

	var getWhoseTurn = function() {
		if (getLastPlayer() === undefined || getLastPlayer() === 'circle') {
			return 'cross';
		}
		return 'circle';
	};

	var hasSomeoneWon = function() {
		for (var i = 0; i < winningPatterns.length; i++) {
			var pattern = winningPatterns[i];
			var sequence = {};
			for (var j = 0; j < winningPatterns[i].length; j++) {
				sequence[j] = getSlotOwner(winningPatterns[i][j]);
			}
			if ((sequence[0] === sequence[1]) && (sequence[1] === sequence[2])) {
				if ((sequence[0] !== null) && (sequence[1] !== null) && (sequence[2] !== null)) {
					return {pattern: pattern, winner: sequence[0]};
				}
			}
		}
		return false;
	};

	var countOccupiedSlots = function() {
		var occupiedSlots = 0;
		for (var slot in checker) {
			if (!checker[slot].value) {
				++occupiedSlots;
			}
		}
		return occupiedSlots;
	};

	var updateGameHistory = function(player) {
		gameHistory.push(player);
	};

	var switchUser = function() {
		if (player === 'cross') {
			player = 'circle';
		}
		else if (player === 'circle') {
			player = 'cross';
		}
	};

	var updateTurnNotice = function(player) {
		updateDrawNotice();
		settings.logo[player].addClass(settings.logo.activeClass);
	};

	var updateWinnerNotice = function(winner) {
		updateDrawNotice();
		settings.logo[winner].addClass(settings.logo.winnerClass);
	};

	var updateDrawNotice = function(winner) {
		settings.logo.circle.removeClass(settings.logo.activeClass);
		settings.logo.cross.removeClass(settings.logo.activeClass);
	};

	var updateSlot = function(slot) {
		if (!hasSomeoneWon() && isYourTurn() && canUpdate(slot)) {
			checker[getSlot(slot)].value = false;
			checker[getSlot(slot)].owner = player;
			markSlot(slot, checker[getSlot(slot)].owner);
			updateGameHistory(player);
			updateTurnNotice(getWhoseTurn());
			switchUser();
		}
	};

	var markSlot = function(slot, owner) {
		settings.checkerSlot
			.eq(getSlot(slot))
			.addClass(settings.player[owner].className);
	};

	var highlightWinner = function(slots) {
		$.each(slots, function(index, value) {
			settings.checkerSlot
				.eq(value)
				.addClass(settings.checker.winnerClass);
		});
	};

	var restartGame = function() {
		location.reload();
	};

	settings.checkerSlot.on('click', function() {
		updateSlot($(this));
		var winner = hasSomeoneWon();
		if (winner) {
			highlightWinner(winner.pattern);
			updateWinnerNotice(winner.winner);
			settings.reloadBtn.show();
		}
		else if (countOccupiedSlots() == 9) {
			updateDrawNotice();
			settings.reloadBtn.show();
		}
	});

	settings.reloadBtn.on('click', function() {
		restartGame();
	});

};
