if (!ladderData._isReactive) {
	_ladderData = ladderData;
	ladderData = Vue.reactive(ladderData);
	ladderData._isReactive = true;
}

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

Ranker = class Ranker {
	promptNameChange(newUsername) {
		if (!newUsername) {
			newUsername = window.prompt("What shall be your new name? (max. 32 characters)", this.username);
		}
		if (!newUsername) return;
		if (newUsername == this.username) return;
		if (newUsername.length > 32) {
			alert('The maximum number of characters in your username is 32, not ' + newUsername.length + '!');
			newUsername = newUsername.slice(0, 32);
		}
        stompClient.send("/app/account/name", {}, JSON.stringify({
            'uuid': this.uuid,
            'content': newUsername
        }))
    }
	get uuid() {
		let ls = localStorage['acc' + this.accountId] || '';
		if (ls.length != 36) ls = '';
		Object.defineProperty(this, 'uuid', {value: ls});
		return ls;
	}
}

LadderRowVue = class LadderRowVue extends VueImpl.with(makeClass({
	ranker: Ranker
})) {
	static t = `
		<tr :class="{'ranker-promoted': !ranker.growing, 'ranker-you': isYou, 'ranker-alt': isAlt}">
			<td>
				<a v-if="vinegarable" href="#" style="text-decoration: none" onclick="throwVinegar()">🍇</a>
				<span v-else>{{ ranker.rank }}{{ assholeTag }}</span>
				
			</td>
			<td style="overflow: hidden;">
				<a v-if="isAlt" :href="'#acc'+ranker.accountId" target="_blank">{{ ranker.growing ? '' : '^' }}{{ ranker.username }}</a>
				<span v-else>{{ ranker.growing ? '' : '^' }}{{ ranker.username }}</span>
				<sup v-if="isYou">you</sup>
				<sup v-if="isAlt">alt</sup>
				<span v-if="isYou || isAlt" @click="changeUsername">🖉</span>
			</td>
			<td class="text-end"> {{ power }} {{ multi }} </td>
			<td class="text-end"> {{ points }} </td>
		</tr>	
	`
	get assholeTag() {
		let ranker = this.ranker;
		let tag = (ranker.timesAsshole < infoData.assholeTags.length) ?
        infoData.assholeTags[ranker.timesAsshole] : infoData.assholeTags[infoData.assholeTags.length - 1];
        return $('<a/>').html(tag).text();
	}
	get vinegarable() {
		if (this.ranker.rank != 1) return false;
		if (this.ranker.you) return false;
		if (!this.ranker.growing) return false;
		if (ladderData.rankers.length < Math.max(infoData.minimumPeopleForPromote, ladderData.currentLadder.number)) return false;
        if (ladderData.firstRanker.points.cmp(infoData.pointsForPromote) < 0) return false;
        if (ladderData.yourRanker.vinegar.cmp(getVinegarThrowCost()) < 0) return false;
		return true;		
	}
	get rank() {
		(ranker.rank === 1 && !ranker.you && ranker.growing && ladderData.rankers.length >= Math.max(infoData.minimumPeopleForPromote, ladderData.currentLadder.number)
        && ladderData.firstRanker.points.cmp(infoData.pointsForPromote) >= 0 && ladderData.yourRanker.vinegar.cmp(getVinegarThrowCost()) >= 0) ?
        '<a href="#" style="text-decoration: none" onclick="throwVinegar()">🍇</a>' : ranker.rank;
	}
	get points() {
		return numberFormatter.format(this.ranker.points);
	}
	get isYou() {
		return this.ranker.you;
	}
	get power() {
		return numberFormatter.format(this.ranker.power);
	}
	get multi() {
		return `[+${('' + this.ranker.bias).padStart(2, '0')} x${('' + this.ranker.multiplier).padStart(2, '0')}]`;
	}
	changeUsername() {
		this.ranker.promptNameChange();
	}


	get uuid() {
		return this.ranker.uuid;
	}
	get isAlt() {
		return !!this.uuid && !this.isYou;
	}
}
__decorate([VDAV.Template], LadderRowVue, 't', null);
LadderRowVue = __decorate([Component], LadderRowVue);

LadderVue = class LadderVue extends VueImpl.with(makeClass({
	ladderData: null
})) {
	static t = `
		<div class="row">
			<div class="col-7">
			<table class="table table-sm caption-top table-borderless" style="table-layout: fixed;">
				<tr><th width="60"> # </th><th> Username </th><th class="text-end"> Power </th><th class="text-end"> Points </th></tr>
				<LadderRowVue v-for="ranker of visibleRankers" :ranker="ranker" :key="ranker.accountId" />
			</table>
			</div>
		</div>
	`;
	get visibleRankers() {
		const rank = ladderData.yourRanker.rank;
		const offset = 10;
		return this.ladderData.rankers.filter(ranker => {
			if (!(ranker instanceof Ranker)) Object.setPrototypeOf(ranker, Ranker.prototype);
			if (ranker.uuid) return true;
			if (ranker.rank == 1) return true;
			return Math.abs(ranker.rank - rank) < offset;
		});
	}
}
__decorate([VDAV.Template], LadderVue, 't', null);
LadderVue = __decorate([Component], LadderVue);

window.app?.unmount();
$('#app').remove();
$('<div id="app" class="container-fluid"/>').prependTo('body')
app = Vue.createApp(LadderVue, {
	ladderData,
})
.use(VuePropDecoratorAVariation.known)
lad = app.mount('#app')

