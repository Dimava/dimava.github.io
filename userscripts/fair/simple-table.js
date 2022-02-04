
let gameData = Vue.reactive({ladderData: ladderData});
ladderData = Vue.reactive(ladderData);

window._handleLadderInit ??= handleLadderInit;
handleLadderInit = function(...a) {
	_handleLadderInit(...a);
	gameData.ladderData = ladderData;
	ladderData = gameData.ladderData;
}

// add some styling
_style = $('style#myStyle').length ? $('style#myStyle') : $('<style id="myStyle"></style>').appendTo('head');
_style.html(`
	tr.ranker-promoted {
		background: hsl(0 0% 80% / 1);
		color: hsl(0 0% 40% / 1);
	}
	tr.ranker-you {
		background: cyan;
	}
	tr.ranker-alt {
		background: cyan;
	}
`)


LadderVue = {
	props: ['ladderData'],
	template: `
		<div class="row">
			<div class="col-7">
			<table class="table table-sm caption-top table-borderless" style="table-layout: fixed;">
				<tr><th width="60"> # </th><th> Username </th><th class="text-end"> Power </th><th class="text-end"> Points </th></tr>
				<LadderRowVue v-for="ranker of visibleRankers" :ranker="ranker" :key="ranker.accountId" />
			</table>
			</div>
		</div>
	`,
	computed: {
		visibleRankers() {
			// this function is copied from ladder.js
			const rank = ladderData.yourRanker.rank;
			const offset = 10;
			return ladderData.rankers.filter(ranker => {
				if (ranker.uuid) return true;
				if (ranker.rank == 1) return true;
				return Math.abs(ranker.rank - rank) < offset;
			});
		}
	}
};

LadderRowVue = {
	props: ['ranker'],
	template: `	
		<tr :class="{'ranker-promoted': !ranker.growing, 'ranker-you': ranker.you}">
			<td>
				<a v-if="vinegarable" href="#" style="text-decoration: none" onclick="throwVinegar()">🍇</a>
				<span v-else>{{ ranker.rank }}{{ assholeTag }}</span>
			</td>
			<td style="overflow: hidden;">
				{{ ranker.username }}
				<span v-if="ranker.you" onclick="promptNameChange()">🖉</span>
			</td>
			<td class="text-end"> {{ numberFormatter.format(this.ranker.power) }} [
				[+{{('' + this.ranker.bias).padStart(2, '0')}}
				x{{('' + this.ranker.multiplier).padStart(2, '0')}}]
			</td>
			<td class="text-end"> {{ numberFormatter.format(this.ranker.points) }} </td>
		</tr>
	`,
	computed: {
		assholeTag() {
			// this function is extracted from ladder.js
			let ranker = this.ranker;
			let tag = (ranker.timesAsshole < infoData.assholeTags.length) ?
				infoData.assholeTags[ranker.timesAsshole] : infoData.assholeTags[infoData.assholeTags.length - 1];
			// convert html to text
			return $('<a/>').html(tag).text();
		},
		vinegarable() {
			// this function is extracted from ladder.js
			/*
				(ranker.rank === 1 && !ranker.you && ranker.growing && ladderData.rankers.length >= Math.max(infoData.minimumPeopleForPromote, ladderData.currentLadder.number)
				&& ladderData.firstRanker.points.cmp(infoData.pointsForPromote) >= 0 && ladderData.yourRanker.vinegar.cmp(getVinegarThrowCost()) >= 0) ?
				'<a href="#" style="text-decoration: none" onclick="throwVinegar()">🍇</a>' : ranker.rank;
			*/
			if (this.ranker.rank != 1) return false;
			if (this.ranker.you) return false;
			if (!this.ranker.growing) return false;
			if (ladderData.rankers.length < Math.max(infoData.minimumPeopleForPromote, ladderData.currentLadder.number)) return false;
			if (ladderData.firstRanker.points.cmp(infoData.pointsForPromote) < 0) return false;
			if (ladderData.yourRanker.vinegar.cmp(getVinegarThrowCost()) < 0) return false;
			return true;
		},
		rank() {
			// this function is extracted from ladder.js from writeNewRow
			let ranker = this.ranker;
			(ranker.rank === 1 && !ranker.you && ranker.growing && ladderData.rankers.length >= Math.max(infoData.minimumPeopleForPromote, ladderData.currentLadder.number)
				&& ladderData.firstRanker.points.cmp(infoData.pointsForPromote) >= 0 && ladderData.yourRanker.vinegar.cmp(getVinegarThrowCost()) >= 0) ?
				'<a href="#" style="text-decoration: none" onclick="throwVinegar()">🍇</a>' : ranker.rank;
		},
		// external constants have to be imported
		numberFormatter() {
			return numberFormatter;
		},
	},
};


$('#app').remove();
$('<div id="app" class="container-fluid"/>').prependTo('body')
app = Vue.createApp(LadderVue, gameData)
app.component('LadderRowVue', LadderRowVue);
app.mount('#app')
