"use strict";

// this script is made from `./index.ts` by typescript compiler

let ClickRune, UpgradeRune, PrestigeRune, RuneChance;
let PointAmount, UpgradePrice, Click, UpgradeProcent, PrestigePointAmount, PrestigePrice, RunePrice, PrestigeBoost, PrestigePointGain;
function resetToDefaultValues() {
    PointAmount = 0;
    UpgradePrice = 2;
    Click = 1;
    UpgradeProcent = 50;
    PrestigePointAmount = 0;
    PrestigePrice = 10000;
    RunePrice = 1;
    PrestigePointGain = 1;
}
function prestigeAndUpdatePrestigeValues() {
    PointAmount = 0;
    UpgradePrice = 2;
    Click = 1;
    PrestigeBoost = PrestigePointAmount * 5;
    UpgradeProcent = 50;
}
function MainInterface() {
    return `
	Points: ${PointAmount}
	Prestige-Points: ${PrestigePointAmount}
	Upgrade[2] +${UpgradeProcent}% per Click | ${UpgradePrice} Points
	Prestige[3] Resets your Progress but gives you a Point-Bonus | ${PrestigePrice} Points

	Runes[4]
	---   ---   ---
	|${ClickRune}|   |${UpgradeRune}|   |${PrestigeRune}|
	---   ---   ---
	|Press 1 to get more Points|
	`;
}
// int RunenInterface()
// {
// 	cout << "Points: " << PointAmount << endl;
// 	cout << "Prestige-Points:" << PrestigePointAmount << endl << endl;
// 	cout << "|Runes are Upgrades that won't get reset when you Prestige|" << RunePrice << endl << endl;
// 	cout << "Click Rune: Doubles you Points per Click" << endl << endl;
// 	cout << "Upgrade Rune: Upgrades your Upgrade-Upgrade" << endl << endl;
// 	cout << "Prestige Rune: Doubles your Prestige-Points per Prestige" << endl << endl;
// 	cout << "[1]Open a Rune | [2]Back" << endl;
// 	RuneInput = getch();
// 	return 0;
// }
resetToDefaultValues();
function keydownListener(event) {
}
addEventListener('keydown', keydownListener);
function ontick() {
}
setInterval(ontick, 1000 /* ms */);
function updateGui() {
    mainText.innerText = MainInterface();
}
setInterval(updateGui, 100 /* ms */);
document.body.innerHTML = `
<pre><code>
	<main id="mainText"> here goes main text </main> <br>
	<button id="clickButton1"> Click! </button>
	<button id="clickButton2"> Upgrade! </button>
	<button id="clickButtonPrestige"> Prestige! </button>
	<br>
	<div id="log"> updated info goes here </div>
</code></pre>
`;
clickButton1.onclick = function () {
    PointAmount = PointAmount + Click;
    log.innerText = "You made a click!";
};
clickButton2.onclick = function () {
    if (PointAmount >= UpgradePrice) {
        Click = Click + Click / 100 * UpgradeProcent;
        PointAmount = PointAmount - UpgradePrice;
        UpgradePrice = UpgradePrice * 2;
    }
    else {
        log.innerText = `You don't have enough Points for upgrade (${PointAmount}/${UpgradePrice})!`;
    }
};
clickButtonPrestige.onclick = function () {
    if (PointAmount >= PrestigePrice) {
        PrestigePointAmount = PrestigePointAmount + PrestigePointGain;
        prestigeAndUpdatePrestigeValues();
        Click = Click + (Click / 100) * PrestigeBoost;
        PrestigePrice = PrestigePrice * 3.5;
    }
    else {
        log.innerText = `You don't have enough Points for Prestige(${PointAmount}/${PrestigePrice})!`;
    }
};
// 	else if (MainInput == '3') {
// }
// else if (MainInput == '4') {
// 	RunenInterfaceJump:
// 	system("CLS");
// 	RunenInterface();
// 	if (RuneInput == '1') {
// 		OpenRuneJump:
// 		if (PrestigePointAmount >= RunePrice) {
// 			PrestigePointAmount = PrestigePointAmount - RunePrice;
// 			RunePrice = RunePrice * 1.25;
// 			srand(time(NULL));
// 			RuneChance = rand() % 3 + 1;
// 			if (RuneChance == 1) {
// 				Click = Click * 2;
// 				ClickRune = ClickRune + 1;
// 				system("CLS");
// 				cout << "You got a Click-Rune!" << endl << endl;
// 				cout << "[1]Open another Rune | [2]Back";
// 				ClickRuneInput = getch();
// 				if (ClickRuneInput == '1') {
// 					system("CLS");
//                         goto OpenRuneJump;
// 				}
// 				else if (ClickRuneInput == '2') {
// 					system("CLS");
//                         goto RunenInterfaceJump;
// 				}
// 			}
// 			else if (RuneChance == 2) {
// 				UpgradeRune = UpgradeRune + 1;
// 				UpgradeProcent = UpgradeProcent + 50;
// 				system("CLS");
// 				cout << "You got a Upgrade-Rune!" << endl << endl;
// 				cout << "[1]Open another Rune | [2]Back";
// 				UpgradeRuneInput = getch();
// 				if (UpgradeRuneInput == '1') {
// 					system("CLS");
//                         goto OpenRuneJump;
// 				}
// 				else if (UpgradeRuneInput == '2') {
// 					system("CLS");
//                         goto RunenInterfaceJump;
// 				}
// 			}
// 			else if (RuneChance == 3) {
// 				PrestigeRune = PrestigeRune + 1;
// 				PrestigePointGain = PrestigePointGain * 2;
// 				system("CLS");
// 				cout << "You got a Prestige-Rune!" << endl << endl;
// 				cout << "[1]Open another Rune | [2]Back";
// 				PrestigeRuneInput = getch();
// 				if (PrestigeRuneInput == '1') {
// 					system("CLS");
//                         goto OpenRuneJump;
// 				}
// 				else if (PrestigeRuneInput == '2') {
// 					system("CLS");
//                         goto RunenInterfaceJump;
// 				}
// 			}
// 		}
// 		else {
// 			system("CLS");
// 			cout << "You don't have enough Prestige-Points!" << endl << endl;
// 		}
// 	}
// 	else if (RuneInput == '2') {
// 		system("CLS");
// 	}
// }
// else if (MainInput == '8') {
// 	system("CLS");
// 	PointAmount = PointAmount + 10000;
// }
// else if (MainInput == '9') {
// 	system("CLS");
// 	Click = 1;
// 	PrestigePointAmount = PrestigePointAmount + 10;
// 	PrestigeBoost = PrestigePointAmount * 5;
// 	Click = Click + (Click / 100) * PrestigeBoost;
// }
// return 0;
// }
// int main()
// {
// 	DefaultValues();
// 	for (int i = 2; i > 1; i++)
// 	{
// 		MainInterface();
// 		WhatInput();
// 	}
// }
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUVBLElBQUksU0FBaUIsRUFDbEIsV0FBbUIsRUFDbkIsWUFBb0IsRUFDcEIsVUFBa0IsQ0FBQztBQUV0QixJQUFJLFdBQW1CLEVBQ3BCLFlBQW9CLEVBQ3BCLEtBQWEsRUFDYixjQUFzQixFQUN0QixtQkFBMkIsRUFDM0IsYUFBcUIsRUFDckIsU0FBaUIsRUFDakIsYUFBcUIsRUFDckIsaUJBQXlCLENBQzFCO0FBRUYsU0FBUyxvQkFBb0I7SUFDNUIsV0FBVyxHQUFHLENBQUMsQ0FBQztJQUNoQixZQUFZLEdBQUcsQ0FBQyxDQUFDO0lBQ2pCLEtBQUssR0FBRyxDQUFDLENBQUM7SUFDVixjQUFjLEdBQUcsRUFBRSxDQUFDO0lBQ3BCLG1CQUFtQixHQUFHLENBQUMsQ0FBQztJQUN4QixhQUFhLEdBQUcsS0FBSyxDQUFDO0lBQ3RCLFNBQVMsR0FBRyxDQUFDLENBQUM7SUFDZCxpQkFBaUIsR0FBRyxDQUFDLENBQUM7QUFDdkIsQ0FBQztBQUdELFNBQVMsK0JBQStCO0lBQ3ZDLFdBQVcsR0FBRyxDQUFDLENBQUM7SUFDaEIsWUFBWSxHQUFHLENBQUMsQ0FBQztJQUNqQixLQUFLLEdBQUcsQ0FBQyxDQUFDO0lBQ1YsYUFBYSxHQUFHLG1CQUFtQixHQUFHLENBQUMsQ0FBQztJQUN4QyxjQUFjLEdBQUcsRUFBRSxDQUFDO0FBQ3JCLENBQUM7QUFFRCxTQUFTLGFBQWE7SUFDckIsT0FBTztXQUNHLFdBQVc7b0JBQ0YsbUJBQW1CO2VBQ3hCLGNBQWMsaUJBQWlCLFlBQVk7a0VBQ1EsYUFBYTs7OztJQUkzRSxTQUFTLFFBQVEsV0FBVyxRQUFRLFlBQVk7OztFQUdsRCxDQUFDO0FBQ0gsQ0FBQztBQUVELHVCQUF1QjtBQUN2QixJQUFJO0FBQ0osOENBQThDO0FBRTlDLHNFQUFzRTtBQUV0RSx1R0FBdUc7QUFFdkcsdUVBQXVF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c0JBQXNCO0FBQ3RCLDZDQUE2QztBQUM3QyxRQUFRO0FBQ1IsMkNBQTJDO0FBQzNDLHNCQUFzQjtBQUN0QixtREFBbUQ7QUFDbkQsUUFBUTtBQUNSLE9BQU87QUFDUCxNQUFNO0FBQ04sV0FBVztBQUNYLG9CQUFvQjtBQUNwQix1RUFBdUU7QUFDdkUsTUFBTTtBQUNOLEtBQUs7QUFDTCxnQ0FBZ0M7QUFDaEMsbUJBQW1CO0FBQ25CLEtBQUs7QUFDTCxJQUFJO0FBQ0osK0JBQStCO0FBQy9CLGtCQUFrQjtBQUNsQixzQ0FBc0M7QUFDdEMsSUFBSTtBQUNKLCtCQUErQjtBQUMvQixrQkFBa0I7QUFDbEIsY0FBYztBQUNkLG1EQUFtRDtBQUNuRCw0Q0FBNEM7QUFDNUMsa0RBQWtEO0FBRWxELElBQUk7QUFDSixZQUFZO0FBQ1osSUFBSTtBQUVKLGFBQWE7QUFDYixJQUFJO0FBQ0osb0JBQW9CO0FBRXBCLCtCQUErQjtBQUMvQixLQUFLO0FBQ0wscUJBQXFCO0FBRXJCLGlCQUFpQjtBQUNqQixLQUFLO0FBQ0wsSUFBSSIsInNvdXJjZXNDb250ZW50IjpbIlxyXG5cclxubGV0IENsaWNrUnVuZTogbnVtYmVyXHJcblx0LCBVcGdyYWRlUnVuZTogbnVtYmVyXHJcblx0LCBQcmVzdGlnZVJ1bmU6IG51bWJlclxyXG5cdCwgUnVuZUNoYW5jZTogbnVtYmVyO1xyXG5cclxubGV0IFBvaW50QW1vdW50OiBudW1iZXJcclxuXHQsIFVwZ3JhZGVQcmljZTogbnVtYmVyXHJcblx0LCBDbGljazogbnVtYmVyXHJcblx0LCBVcGdyYWRlUHJvY2VudDogbnVtYmVyXHJcblx0LCBQcmVzdGlnZVBvaW50QW1vdW50OiBudW1iZXJcclxuXHQsIFByZXN0aWdlUHJpY2U6IG51bWJlclxyXG5cdCwgUnVuZVByaWNlOiBudW1iZXJcclxuXHQsIFByZXN0aWdlQm9vc3Q6IG51bWJlclxyXG5cdCwgUHJlc3RpZ2VQb2ludEdhaW46IG51bWJlclxyXG5cdDtcclxuXHJcbmZ1bmN0aW9uIHJlc2V0VG9EZWZhdWx0VmFsdWVzKCk6IHZvaWQge1xyXG5cdFBvaW50QW1vdW50ID0gMDtcclxuXHRVcGdyYWRlUHJpY2UgPSAyO1xyXG5cdENsaWNrID0gMTtcclxuXHRVcGdyYWRlUHJvY2VudCA9IDUwO1xyXG5cdFByZXN0aWdlUG9pbnRBbW91bnQgPSAwO1xyXG5cdFByZXN0aWdlUHJpY2UgPSAxMDAwMDtcclxuXHRSdW5lUHJpY2UgPSAxO1xyXG5cdFByZXN0aWdlUG9pbnRHYWluID0gMTtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIHByZXN0aWdlQW5kVXBkYXRlUHJlc3RpZ2VWYWx1ZXMoKTogdm9pZCB7XHJcblx0UG9pbnRBbW91bnQgPSAwO1xyXG5cdFVwZ3JhZGVQcmljZSA9IDI7XHJcblx0Q2xpY2sgPSAxO1xyXG5cdFByZXN0aWdlQm9vc3QgPSBQcmVzdGlnZVBvaW50QW1vdW50ICogNTtcclxuXHRVcGdyYWRlUHJvY2VudCA9IDUwO1xyXG59XHJcblxyXG5mdW5jdGlvbiBNYWluSW50ZXJmYWNlKCk6IHN0cmluZyB7XHJcblx0cmV0dXJuIGBcclxuXHRQb2ludHM6ICR7UG9pbnRBbW91bnR9XHJcblx0UHJlc3RpZ2UtUG9pbnRzOiAke1ByZXN0aWdlUG9pbnRBbW91bnR9XHJcblx0VXBncmFkZVsyXSArJHtVcGdyYWRlUHJvY2VudH0lIHBlciBDbGljayB8ICR7VXBncmFkZVByaWNlfSBQb2ludHNcclxuXHRQcmVzdGlnZVszXSBSZXNldHMgeW91ciBQcm9ncmVzcyBidXQgZ2l2ZXMgeW91IGEgUG9pbnQtQm9udXMgfCAke1ByZXN0aWdlUHJpY2V9IFBvaW50c1xyXG5cclxuXHRSdW5lc1s0XVxyXG5cdC0tLSAgIC0tLSAgIC0tLVxyXG5cdHwke0NsaWNrUnVuZX18ICAgfCR7VXBncmFkZVJ1bmV9fCAgIHwke1ByZXN0aWdlUnVuZX18XHJcblx0LS0tICAgLS0tICAgLS0tXHJcblx0fFByZXNzIDEgdG8gZ2V0IG1vcmUgUG9pbnRzfFxyXG5cdGA7XHJcbn1cclxuXHJcbi8vIGludCBSdW5lbkludGVyZmFjZSgpXHJcbi8vIHtcclxuLy8gXHRjb3V0IDw8IFwiUG9pbnRzOiBcIiA8PCBQb2ludEFtb3VudCA8PCBlbmRsO1xyXG5cclxuLy8gXHRjb3V0IDw8IFwiUHJlc3RpZ2UtUG9pbnRzOlwiIDw8IFByZXN0aWdlUG9pbnRBbW91bnQgPDwgZW5kbCA8PCBlbmRsO1xyXG5cclxuLy8gXHRjb3V0IDw8IFwifFJ1bmVzIGFyZSBVcGdyYWRlcyB0aGF0IHdvbid0IGdldCByZXNldCB3aGVuIHlvdSBQcmVzdGlnZXxcIiA8PCBSdW5lUHJpY2UgPDwgZW5kbCA8PCBlbmRsO1xyXG5cclxuLy8gXHRjb3V0IDw8IFwiQ2xpY2sgUnVuZTogRG91YmxlcyB5b3UgUG9pbnRzIHBlciBDbGlja1wiIDw8IGVuZGwgPDwgZW5kbDtcclxuXHJcbi8vIFx0Y291dCA8PCBcIlVwZ3JhZGUgUnVuZTogVXBncmFkZXMgeW91ciBVcGdyYWRlLVVwZ3JhZGVcIiA8PCBlbmRsIDw8IGVuZGw7XHJcblxyXG4vLyBcdGNvdXQgPDwgXCJQcmVzdGlnZSBSdW5lOiBEb3VibGVzIHlvdXIgUHJlc3RpZ2UtUG9pbnRzIHBlciBQcmVzdGlnZVwiIDw8IGVuZGwgPDwgZW5kbDtcclxuXHJcbi8vIFx0Y291dCA8PCBcIlsxXU9wZW4gYSBSdW5lIHwgWzJdQmFja1wiIDw8IGVuZGw7XHJcblxyXG4vLyBcdFJ1bmVJbnB1dCA9IGdldGNoKCk7XHJcblxyXG4vLyBcdHJldHVybiAwO1xyXG4vLyB9XHJcblxyXG5cclxucmVzZXRUb0RlZmF1bHRWYWx1ZXMoKTtcclxuZnVuY3Rpb24ga2V5ZG93bkxpc3RlbmVyKGV2ZW50OiBLZXlib2FyZEV2ZW50KTogdm9pZCB7XHJcblxyXG59XHJcbmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBrZXlkb3duTGlzdGVuZXIpO1xyXG5mdW5jdGlvbiBvbnRpY2soKSB7XHJcblxyXG59XHJcbnNldEludGVydmFsKG9udGljaywgMTAwMC8qIG1zICovKTtcclxuZnVuY3Rpb24gdXBkYXRlR3VpKCkge1xyXG5cdG1haW5UZXh0LmlubmVyVGV4dCA9IE1haW5JbnRlcmZhY2UoKTtcclxufVxyXG5zZXRJbnRlcnZhbCh1cGRhdGVHdWksIDEwMC8qIG1zICovKTtcclxuXHJcbmRvY3VtZW50LmJvZHkuaW5uZXJIVE1MID0gYFxyXG48cHJlPjxjb2RlPlxyXG5cdDxtYWluIGlkPVwibWFpblRleHRcIj4gaGVyZSBnb2VzIG1haW4gdGV4dCA8L21haW4+IDxicj5cclxuXHQ8YnV0dG9uIGlkPVwiY2xpY2tCdXR0b24xXCI+IENsaWNrISA8L2J1dHRvbj5cclxuXHQ8YnV0dG9uIGlkPVwiY2xpY2tCdXR0b24yXCI+IFVwZ3JhZGUhIDwvYnV0dG9uPlxyXG5cdDxidXR0b24gaWQ9XCJjbGlja0J1dHRvblByZXN0aWdlXCI+IFByZXN0aWdlISA8L2J1dHRvbj5cclxuXHQ8YnI+XHJcblx0PGRpdiBpZD1cImxvZ1wiPiB1cGRhdGVkIGluZm8gZ29lcyBoZXJlIDwvZGl2PlxyXG48L2NvZGU+PC9wcmU+XHJcbmBcclxuXHJcbmRlY2xhcmUgbGV0IG1haW5UZXh0OiBIVE1MRWxlbWVudDtcclxuZGVjbGFyZSBsZXQgY2xpY2tCdXR0b24xOiBIVE1MQnV0dG9uRWxlbWVudDtcclxuZGVjbGFyZSBsZXQgY2xpY2tCdXR0b24yOiBIVE1MQnV0dG9uRWxlbWVudDtcclxuZGVjbGFyZSBsZXQgY2xpY2tCdXR0b25QcmVzdGlnZTogSFRNTEJ1dHRvbkVsZW1lbnQ7XHJcbmRlY2xhcmUgbGV0IGxvZzogSFRNTEVsZW1lbnQ7XHJcblxyXG5jbGlja0J1dHRvbjEub25jbGljayA9IGZ1bmN0aW9uICgpIHtcclxuXHRQb2ludEFtb3VudCA9IFBvaW50QW1vdW50ICsgQ2xpY2s7XHJcblx0bG9nLmlubmVyVGV4dCA9IFwiWW91IG1hZGUgYSBjbGljayFcIjtcclxufVxyXG5jbGlja0J1dHRvbjIub25jbGljayA9IGZ1bmN0aW9uICgpIHtcclxuXHRpZiAoUG9pbnRBbW91bnQgPj0gVXBncmFkZVByaWNlKSB7XHJcblx0XHRDbGljayA9IENsaWNrICsgQ2xpY2sgLyAxMDAgKiBVcGdyYWRlUHJvY2VudDtcclxuXHRcdFBvaW50QW1vdW50ID0gUG9pbnRBbW91bnQgLSBVcGdyYWRlUHJpY2U7XHJcblx0XHRVcGdyYWRlUHJpY2UgPSBVcGdyYWRlUHJpY2UgKiAyO1xyXG5cdH0gZWxzZSB7XHJcblx0XHRsb2cuaW5uZXJUZXh0ID0gYFlvdSBkb24ndCBoYXZlIGVub3VnaCBQb2ludHMgZm9yIHVwZ3JhZGUgKCR7UG9pbnRBbW91bnR9LyR7VXBncmFkZVByaWNlfSkhYDtcclxuXHR9XHJcbn1cclxuY2xpY2tCdXR0b25QcmVzdGlnZS5vbmNsaWNrID0gZnVuY3Rpb24gKCkge1xyXG5cdGlmIChQb2ludEFtb3VudCA+PSBQcmVzdGlnZVByaWNlKSB7XHJcblx0XHRQcmVzdGlnZVBvaW50QW1vdW50ID0gUHJlc3RpZ2VQb2ludEFtb3VudCArIFByZXN0aWdlUG9pbnRHYWluO1xyXG5cdFx0cHJlc3RpZ2VBbmRVcGRhdGVQcmVzdGlnZVZhbHVlcygpO1xyXG5cdFx0Q2xpY2sgPSBDbGljayArIChDbGljayAvIDEwMCkgKiBQcmVzdGlnZUJvb3N0O1xyXG5cdFx0UHJlc3RpZ2VQcmljZSA9IFByZXN0aWdlUHJpY2UgKiAzLjU7XHJcblx0fVxyXG5cdGVsc2Uge1xyXG5cdFx0bG9nLmlubmVyVGV4dCA9IGBZb3UgZG9uJ3QgaGF2ZSBlbm91Z2ggUG9pbnRzIGZvciBQcmVzdGlnZSgke1BvaW50QW1vdW50fS8ke1ByZXN0aWdlUHJpY2V9KSFgO1xyXG5cdH1cclxufVxyXG5cclxuLy8gXHRlbHNlIGlmIChNYWluSW5wdXQgPT0gJzMnKSB7XHJcbi8vIH1cclxuLy8gZWxzZSBpZiAoTWFpbklucHV0ID09ICc0Jykge1xyXG4vLyBcdFJ1bmVuSW50ZXJmYWNlSnVtcDpcclxuXHJcbi8vIFx0c3lzdGVtKFwiQ0xTXCIpO1xyXG4vLyBcdFJ1bmVuSW50ZXJmYWNlKCk7XHJcblxyXG4vLyBcdGlmIChSdW5lSW5wdXQgPT0gJzEnKSB7XHJcbi8vIFx0XHRPcGVuUnVuZUp1bXA6XHJcbi8vIFx0XHRpZiAoUHJlc3RpZ2VQb2ludEFtb3VudCA+PSBSdW5lUHJpY2UpIHtcclxuLy8gXHRcdFx0UHJlc3RpZ2VQb2ludEFtb3VudCA9IFByZXN0aWdlUG9pbnRBbW91bnQgLSBSdW5lUHJpY2U7XHJcbi8vIFx0XHRcdFJ1bmVQcmljZSA9IFJ1bmVQcmljZSAqIDEuMjU7XHJcblxyXG4vLyBcdFx0XHRzcmFuZCh0aW1lKE5VTEwpKTtcclxuLy8gXHRcdFx0UnVuZUNoYW5jZSA9IHJhbmQoKSAlIDMgKyAxO1xyXG5cclxuLy8gXHRcdFx0aWYgKFJ1bmVDaGFuY2UgPT0gMSkge1xyXG4vLyBcdFx0XHRcdENsaWNrID0gQ2xpY2sgKiAyO1xyXG4vLyBcdFx0XHRcdENsaWNrUnVuZSA9IENsaWNrUnVuZSArIDE7XHJcblxyXG4vLyBcdFx0XHRcdHN5c3RlbShcIkNMU1wiKTtcclxuLy8gXHRcdFx0XHRjb3V0IDw8IFwiWW91IGdvdCBhIENsaWNrLVJ1bmUhXCIgPDwgZW5kbCA8PCBlbmRsO1xyXG5cclxuLy8gXHRcdFx0XHRjb3V0IDw8IFwiWzFdT3BlbiBhbm90aGVyIFJ1bmUgfCBbMl1CYWNrXCI7XHJcblxyXG4vLyBcdFx0XHRcdENsaWNrUnVuZUlucHV0ID0gZ2V0Y2goKTtcclxuXHJcbi8vIFx0XHRcdFx0aWYgKENsaWNrUnVuZUlucHV0ID09ICcxJykge1xyXG4vLyBcdFx0XHRcdFx0c3lzdGVtKFwiQ0xTXCIpO1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICBnb3RvIE9wZW5SdW5lSnVtcDtcclxuLy8gXHRcdFx0XHR9XHJcbi8vIFx0XHRcdFx0ZWxzZSBpZiAoQ2xpY2tSdW5lSW5wdXQgPT0gJzInKSB7XHJcbi8vIFx0XHRcdFx0XHRzeXN0ZW0oXCJDTFNcIik7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgIGdvdG8gUnVuZW5JbnRlcmZhY2VKdW1wO1xyXG4vLyBcdFx0XHRcdH1cclxuLy8gXHRcdFx0fVxyXG4vLyBcdFx0XHRlbHNlIGlmIChSdW5lQ2hhbmNlID09IDIpIHtcclxuLy8gXHRcdFx0XHRVcGdyYWRlUnVuZSA9IFVwZ3JhZGVSdW5lICsgMTtcclxuLy8gXHRcdFx0XHRVcGdyYWRlUHJvY2VudCA9IFVwZ3JhZGVQcm9jZW50ICsgNTA7XHJcblxyXG4vLyBcdFx0XHRcdHN5c3RlbShcIkNMU1wiKTtcclxuLy8gXHRcdFx0XHRjb3V0IDw8IFwiWW91IGdvdCBhIFVwZ3JhZGUtUnVuZSFcIiA8PCBlbmRsIDw8IGVuZGw7XHJcblxyXG4vLyBcdFx0XHRcdGNvdXQgPDwgXCJbMV1PcGVuIGFub3RoZXIgUnVuZSB8IFsyXUJhY2tcIjtcclxuXHJcbi8vIFx0XHRcdFx0VXBncmFkZVJ1bmVJbnB1dCA9IGdldGNoKCk7XHJcblxyXG4vLyBcdFx0XHRcdGlmIChVcGdyYWRlUnVuZUlucHV0ID09ICcxJykge1xyXG4vLyBcdFx0XHRcdFx0c3lzdGVtKFwiQ0xTXCIpO1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICBnb3RvIE9wZW5SdW5lSnVtcDtcclxuLy8gXHRcdFx0XHR9XHJcbi8vIFx0XHRcdFx0ZWxzZSBpZiAoVXBncmFkZVJ1bmVJbnB1dCA9PSAnMicpIHtcclxuLy8gXHRcdFx0XHRcdHN5c3RlbShcIkNMU1wiKTtcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgZ290byBSdW5lbkludGVyZmFjZUp1bXA7XHJcbi8vIFx0XHRcdFx0fVxyXG4vLyBcdFx0XHR9XHJcbi8vIFx0XHRcdGVsc2UgaWYgKFJ1bmVDaGFuY2UgPT0gMykge1xyXG4vLyBcdFx0XHRcdFByZXN0aWdlUnVuZSA9IFByZXN0aWdlUnVuZSArIDE7XHJcbi8vIFx0XHRcdFx0UHJlc3RpZ2VQb2ludEdhaW4gPSBQcmVzdGlnZVBvaW50R2FpbiAqIDI7XHJcblxyXG4vLyBcdFx0XHRcdHN5c3RlbShcIkNMU1wiKTtcclxuLy8gXHRcdFx0XHRjb3V0IDw8IFwiWW91IGdvdCBhIFByZXN0aWdlLVJ1bmUhXCIgPDwgZW5kbCA8PCBlbmRsO1xyXG5cclxuLy8gXHRcdFx0XHRjb3V0IDw8IFwiWzFdT3BlbiBhbm90aGVyIFJ1bmUgfCBbMl1CYWNrXCI7XHJcblxyXG4vLyBcdFx0XHRcdFByZXN0aWdlUnVuZUlucHV0ID0gZ2V0Y2goKTtcclxuXHJcbi8vIFx0XHRcdFx0aWYgKFByZXN0aWdlUnVuZUlucHV0ID09ICcxJykge1xyXG4vLyBcdFx0XHRcdFx0c3lzdGVtKFwiQ0xTXCIpO1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICBnb3RvIE9wZW5SdW5lSnVtcDtcclxuLy8gXHRcdFx0XHR9XHJcbi8vIFx0XHRcdFx0ZWxzZSBpZiAoUHJlc3RpZ2VSdW5lSW5wdXQgPT0gJzInKSB7XHJcbi8vIFx0XHRcdFx0XHRzeXN0ZW0oXCJDTFNcIik7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgIGdvdG8gUnVuZW5JbnRlcmZhY2VKdW1wO1xyXG4vLyBcdFx0XHRcdH1cclxuLy8gXHRcdFx0fVxyXG4vLyBcdFx0fVxyXG4vLyBcdFx0ZWxzZSB7XHJcbi8vIFx0XHRcdHN5c3RlbShcIkNMU1wiKTtcclxuLy8gXHRcdFx0Y291dCA8PCBcIllvdSBkb24ndCBoYXZlIGVub3VnaCBQcmVzdGlnZS1Qb2ludHMhXCIgPDwgZW5kbCA8PCBlbmRsO1xyXG4vLyBcdFx0fVxyXG4vLyBcdH1cclxuLy8gXHRlbHNlIGlmIChSdW5lSW5wdXQgPT0gJzInKSB7XHJcbi8vIFx0XHRzeXN0ZW0oXCJDTFNcIik7XHJcbi8vIFx0fVxyXG4vLyB9XHJcbi8vIGVsc2UgaWYgKE1haW5JbnB1dCA9PSAnOCcpIHtcclxuLy8gXHRzeXN0ZW0oXCJDTFNcIik7XHJcbi8vIFx0UG9pbnRBbW91bnQgPSBQb2ludEFtb3VudCArIDEwMDAwO1xyXG4vLyB9XHJcbi8vIGVsc2UgaWYgKE1haW5JbnB1dCA9PSAnOScpIHtcclxuLy8gXHRzeXN0ZW0oXCJDTFNcIik7XHJcbi8vIFx0Q2xpY2sgPSAxO1xyXG4vLyBcdFByZXN0aWdlUG9pbnRBbW91bnQgPSBQcmVzdGlnZVBvaW50QW1vdW50ICsgMTA7XHJcbi8vIFx0UHJlc3RpZ2VCb29zdCA9IFByZXN0aWdlUG9pbnRBbW91bnQgKiA1O1xyXG4vLyBcdENsaWNrID0gQ2xpY2sgKyAoQ2xpY2sgLyAxMDApICogUHJlc3RpZ2VCb29zdDtcclxuXHJcbi8vIH1cclxuLy8gcmV0dXJuIDA7XHJcbi8vIH1cclxuXHJcbi8vIGludCBtYWluKClcclxuLy8ge1xyXG4vLyBcdERlZmF1bHRWYWx1ZXMoKTtcclxuXHJcbi8vIFx0Zm9yIChpbnQgaSA9IDI7IGkgPiAxOyBpKyspXHJcbi8vIFx0e1xyXG4vLyBcdFx0TWFpbkludGVyZmFjZSgpO1xyXG5cclxuLy8gXHRcdFdoYXRJbnB1dCgpO1xyXG4vLyBcdH1cclxuLy8gfSJdfQ==