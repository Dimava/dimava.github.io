"use strict";
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
    // event.code is like `KeyD` or `Digit5` or `ArrowLeft` or `ShiftLeft` or `Space`
    if (event.code == 'Space') {
        PointAmount = PointAmount + Click;
        log.innerText = "You made a click with spacebar!";
    }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUVBLElBQUksU0FBaUIsRUFDbEIsV0FBbUIsRUFDbkIsWUFBb0IsRUFDcEIsVUFBa0IsQ0FBQztBQUV0QixJQUFJLFdBQW1CLEVBQ3BCLFlBQW9CLEVBQ3BCLEtBQWEsRUFDYixjQUFzQixFQUN0QixtQkFBMkIsRUFDM0IsYUFBcUIsRUFDckIsU0FBaUIsRUFDakIsYUFBcUIsRUFDckIsaUJBQXlCLENBQzFCO0FBRUYsU0FBUyxvQkFBb0I7SUFDNUIsV0FBVyxHQUFHLENBQUMsQ0FBQztJQUNoQixZQUFZLEdBQUcsQ0FBQyxDQUFDO0lBQ2pCLEtBQUssR0FBRyxDQUFDLENBQUM7SUFDVixjQUFjLEdBQUcsRUFBRSxDQUFDO0lBQ3BCLG1CQUFtQixHQUFHLENBQUMsQ0FBQztJQUN4QixhQUFhLEdBQUcsS0FBSyxDQUFDO0lBQ3RCLFNBQVMsR0FBRyxDQUFDLENBQUM7SUFDZCxpQkFBaUIsR0FBRyxDQUFDLENBQUM7QUFDdkIsQ0FBQztBQUdELFNBQVMsK0JBQStCO0lBQ3ZDLFdBQVcsR0FBRyxDQUFDLENBQUM7SUFDaEIsWUFBWSxHQUFHLENBQUMsQ0FBQztJQUNqQixLQUFLLEdBQUcsQ0FBQyxDQUFDO0lBQ1YsYUFBYSxHQUFHLG1CQUFtQixHQUFHLENBQUMsQ0FBQztJQUN4QyxjQUFjLEdBQUcsRUFBRSxDQUFDO0FBQ3JCLENBQUM7QUFFRCxTQUFTLGFBQWE7SUFDckIsT0FBTztXQUNHLFdBQVc7b0JBQ0YsbUJBQW1CO2VBQ3hCLGNBQWMsaUJBQWlCLFlBQVk7a0VBQ1EsYUFBYTs7OztJQUkzRSxTQUFTLFFBQVEsV0FBVyxRQUFRLFlBQVk7OztFQUdsRCxDQUFDO0FBQ0gsQ0FBQztBQUVELHVCQUF1QjtBQUN2QixJQUFJO0FBQ0osOENBQThDO0FBRTlDLHNFQUFzRTtBQUV0RSx1R0FBdUc7QUFFdkcsdUVBQXVF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bUQ7QUFDbkQsUUFBUTtBQUNSLE9BQU87QUFDUCxpQ0FBaUM7QUFDakMsdUNBQXVDO0FBQ3ZDLGlEQUFpRDtBQUVqRCxxQkFBcUI7QUFDckIsMERBQTBEO0FBRTFELGdEQUFnRDtBQUVoRCxtQ0FBbUM7QUFFbkMsc0NBQXNDO0FBQ3RDLHNCQUFzQjtBQUN0Qiw2Q0FBNkM7QUFDN0MsUUFBUTtBQUNSLDJDQUEyQztBQUMzQyxzQkFBc0I7QUFDdEIsbURBQW1EO0FBQ25ELFFBQVE7QUFDUixPQUFPO0FBQ1AsTUFBTTtBQUNOLFdBQVc7QUFDWCxvQkFBb0I7QUFDcEIsdUVBQXVFO0FBQ3ZFLE1BQU07QUFDTixLQUFLO0FBQ0wsZ0NBQWdDO0FBQ2hDLG1CQUFtQjtBQUNuQixLQUFLO0FBQ0wsSUFBSTtBQUNKLCtCQUErQjtBQUMvQixrQkFBa0I7QUFDbEIsc0NBQXNDO0FBQ3RDLElBQUk7QUFDSiwrQkFBK0I7QUFDL0Isa0JBQWtCO0FBQ2xCLGNBQWM7QUFDZCxtREFBbUQ7QUFDbkQsNENBQTRDO0FBQzVDLGtEQUFrRDtBQUVsRCxJQUFJO0FBQ0osWUFBWTtBQUNaLElBQUk7QUFFSixhQUFhO0FBQ2IsSUFBSTtBQUNKLG9CQUFvQjtBQUVwQiwrQkFBK0I7QUFDL0IsS0FBSztBQUNMLHFCQUFxQjtBQUVyQixpQkFBaUI7QUFDakIsS0FBSztBQUNMLElBQUkiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuXHJcbmxldCBDbGlja1J1bmU6IG51bWJlclxyXG5cdCwgVXBncmFkZVJ1bmU6IG51bWJlclxyXG5cdCwgUHJlc3RpZ2VSdW5lOiBudW1iZXJcclxuXHQsIFJ1bmVDaGFuY2U6IG51bWJlcjtcclxuXHJcbmxldCBQb2ludEFtb3VudDogbnVtYmVyXHJcblx0LCBVcGdyYWRlUHJpY2U6IG51bWJlclxyXG5cdCwgQ2xpY2s6IG51bWJlclxyXG5cdCwgVXBncmFkZVByb2NlbnQ6IG51bWJlclxyXG5cdCwgUHJlc3RpZ2VQb2ludEFtb3VudDogbnVtYmVyXHJcblx0LCBQcmVzdGlnZVByaWNlOiBudW1iZXJcclxuXHQsIFJ1bmVQcmljZTogbnVtYmVyXHJcblx0LCBQcmVzdGlnZUJvb3N0OiBudW1iZXJcclxuXHQsIFByZXN0aWdlUG9pbnRHYWluOiBudW1iZXJcclxuXHQ7XHJcblxyXG5mdW5jdGlvbiByZXNldFRvRGVmYXVsdFZhbHVlcygpOiB2b2lkIHtcclxuXHRQb2ludEFtb3VudCA9IDA7XHJcblx0VXBncmFkZVByaWNlID0gMjtcclxuXHRDbGljayA9IDE7XHJcblx0VXBncmFkZVByb2NlbnQgPSA1MDtcclxuXHRQcmVzdGlnZVBvaW50QW1vdW50ID0gMDtcclxuXHRQcmVzdGlnZVByaWNlID0gMTAwMDA7XHJcblx0UnVuZVByaWNlID0gMTtcclxuXHRQcmVzdGlnZVBvaW50R2FpbiA9IDE7XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBwcmVzdGlnZUFuZFVwZGF0ZVByZXN0aWdlVmFsdWVzKCk6IHZvaWQge1xyXG5cdFBvaW50QW1vdW50ID0gMDtcclxuXHRVcGdyYWRlUHJpY2UgPSAyO1xyXG5cdENsaWNrID0gMTtcclxuXHRQcmVzdGlnZUJvb3N0ID0gUHJlc3RpZ2VQb2ludEFtb3VudCAqIDU7XHJcblx0VXBncmFkZVByb2NlbnQgPSA1MDtcclxufVxyXG5cclxuZnVuY3Rpb24gTWFpbkludGVyZmFjZSgpOiBzdHJpbmcge1xyXG5cdHJldHVybiBgXHJcblx0UG9pbnRzOiAke1BvaW50QW1vdW50fVxyXG5cdFByZXN0aWdlLVBvaW50czogJHtQcmVzdGlnZVBvaW50QW1vdW50fVxyXG5cdFVwZ3JhZGVbMl0gKyR7VXBncmFkZVByb2NlbnR9JSBwZXIgQ2xpY2sgfCAke1VwZ3JhZGVQcmljZX0gUG9pbnRzXHJcblx0UHJlc3RpZ2VbM10gUmVzZXRzIHlvdXIgUHJvZ3Jlc3MgYnV0IGdpdmVzIHlvdSBhIFBvaW50LUJvbnVzIHwgJHtQcmVzdGlnZVByaWNlfSBQb2ludHNcclxuXHJcblx0UnVuZXNbNF1cclxuXHQtLS0gICAtLS0gICAtLS1cclxuXHR8JHtDbGlja1J1bmV9fCAgIHwke1VwZ3JhZGVSdW5lfXwgICB8JHtQcmVzdGlnZVJ1bmV9fFxyXG5cdC0tLSAgIC0tLSAgIC0tLVxyXG5cdHxQcmVzcyAxIHRvIGdldCBtb3JlIFBvaW50c3xcclxuXHRgO1xyXG59XHJcblxyXG4vLyBpbnQgUnVuZW5JbnRlcmZhY2UoKVxyXG4vLyB7XHJcbi8vIFx0Y291dCA8PCBcIlBvaW50czogXCIgPDwgUG9pbnRBbW91bnQgPDwgZW5kbDtcclxuXHJcbi8vIFx0Y291dCA8PCBcIlByZXN0aWdlLVBvaW50czpcIiA8PCBQcmVzdGlnZVBvaW50QW1vdW50IDw8IGVuZGwgPDwgZW5kbDtcclxuXHJcbi8vIFx0Y291dCA8PCBcInxSdW5lcyBhcmUgVXBncmFkZXMgdGhhdCB3b24ndCBnZXQgcmVzZXQgd2hlbiB5b3UgUHJlc3RpZ2V8XCIgPDwgUnVuZVByaWNlIDw8IGVuZGwgPDwgZW5kbDtcclxuXHJcbi8vIFx0Y291dCA8PCBcIkNsaWNrIFJ1bmU6IERvdWJsZXMgeW91IFBvaW50cyBwZXIgQ2xpY2tcIiA8PCBlbmRsIDw8IGVuZGw7XHJcblxyXG4vLyBcdGNvdXQgPDwgXCJVcGdyYWRlIFJ1bmU6IFVwZ3JhZGVzIHlvdXIgVXBncmFkZS1VcGdyYWRlXCIgPDwgZW5kbCA8PCBlbmRsO1xyXG5cclxuLy8gXHRjb3V0IDw8IFwiUHJlc3RpZ2UgUnVuZTogRG91YmxlcyB5b3VyIFByZXN0aWdlLVBvaW50cyBwZXIgUHJlc3RpZ2VcIiA8PCBlbmRsIDw8IGVuZGw7XHJcblxyXG4vLyBcdGNvdXQgPDwgXCJbMV1PcGVuIGEgUnVuZSB8IFsyXUJhY2tcIiA8PCBlbmRsO1xyXG5cclxuLy8gXHRSdW5lSW5wdXQgPSBnZXRjaCgpO1xyXG5cclxuLy8gXHRyZXR1cm4gMDtcclxuLy8gfVxyXG5cclxuXHJcbnJlc2V0VG9EZWZhdWx0VmFsdWVzKCk7XHJcbmZ1bmN0aW9uIGtleWRvd25MaXN0ZW5lcihldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQge1xyXG5cdC8vIGV2ZW50LmNvZGUgaXMgbGlrZSBgS2V5RGAgb3IgYERpZ2l0NWAgb3IgYEFycm93TGVmdGAgb3IgYFNoaWZ0TGVmdGAgb3IgYFNwYWNlYFxyXG5cdGlmKGV2ZW50LmNvZGUgPT0gJ1NwYWNlJykge1xyXG5cdFx0UG9pbnRBbW91bnQgPSBQb2ludEFtb3VudCArIENsaWNrO1xyXG5cdFx0bG9nLmlubmVyVGV4dCA9IFwiWW91IG1hZGUgYSBjbGljayB3aXRoIHNwYWNlYmFyIVwiO1xyXG5cdH1cclxufVxyXG5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywga2V5ZG93bkxpc3RlbmVyKTtcclxuZnVuY3Rpb24gb250aWNrKCkge1xyXG5cclxufVxyXG5zZXRJbnRlcnZhbChvbnRpY2ssIDEwMDAvKiBtcyAqLyk7XHJcbmZ1bmN0aW9uIHVwZGF0ZUd1aSgpIHtcclxuXHRtYWluVGV4dC5pbm5lclRleHQgPSBNYWluSW50ZXJmYWNlKCk7XHJcbn1cclxuc2V0SW50ZXJ2YWwodXBkYXRlR3VpLCAxMDAvKiBtcyAqLyk7XHJcblxyXG5kb2N1bWVudC5ib2R5LmlubmVySFRNTCA9IGBcclxuPHByZT48Y29kZT5cclxuXHQ8bWFpbiBpZD1cIm1haW5UZXh0XCI+IGhlcmUgZ29lcyBtYWluIHRleHQgPC9tYWluPiA8YnI+XHJcblx0PGJ1dHRvbiBpZD1cImNsaWNrQnV0dG9uMVwiPiBDbGljayEgPC9idXR0b24+XHJcblx0PGJ1dHRvbiBpZD1cImNsaWNrQnV0dG9uMlwiPiBVcGdyYWRlISA8L2J1dHRvbj5cclxuXHQ8YnV0dG9uIGlkPVwiY2xpY2tCdXR0b25QcmVzdGlnZVwiPiBQcmVzdGlnZSEgPC9idXR0b24+XHJcblx0PGJyPlxyXG5cdDxkaXYgaWQ9XCJsb2dcIj4gdXBkYXRlZCBpbmZvIGdvZXMgaGVyZSA8L2Rpdj5cclxuPC9jb2RlPjwvcHJlPlxyXG5gXHJcblxyXG5kZWNsYXJlIGxldCBtYWluVGV4dDogSFRNTEVsZW1lbnQ7XHJcbmRlY2xhcmUgbGV0IGNsaWNrQnV0dG9uMTogSFRNTEJ1dHRvbkVsZW1lbnQ7XHJcbmRlY2xhcmUgbGV0IGNsaWNrQnV0dG9uMjogSFRNTEJ1dHRvbkVsZW1lbnQ7XHJcbmRlY2xhcmUgbGV0IGNsaWNrQnV0dG9uUHJlc3RpZ2U6IEhUTUxCdXR0b25FbGVtZW50O1xyXG5kZWNsYXJlIGxldCBsb2c6IEhUTUxFbGVtZW50O1xyXG5cclxuY2xpY2tCdXR0b24xLm9uY2xpY2sgPSBmdW5jdGlvbiAoKSB7XHJcblx0UG9pbnRBbW91bnQgPSBQb2ludEFtb3VudCArIENsaWNrO1xyXG5cdGxvZy5pbm5lclRleHQgPSBcIllvdSBtYWRlIGEgY2xpY2shXCI7XHJcbn1cclxuY2xpY2tCdXR0b24yLm9uY2xpY2sgPSBmdW5jdGlvbiAoKSB7XHJcblx0aWYgKFBvaW50QW1vdW50ID49IFVwZ3JhZGVQcmljZSkge1xyXG5cdFx0Q2xpY2sgPSBDbGljayArIENsaWNrIC8gMTAwICogVXBncmFkZVByb2NlbnQ7XHJcblx0XHRQb2ludEFtb3VudCA9IFBvaW50QW1vdW50IC0gVXBncmFkZVByaWNlO1xyXG5cdFx0VXBncmFkZVByaWNlID0gVXBncmFkZVByaWNlICogMjtcclxuXHR9IGVsc2Uge1xyXG5cdFx0bG9nLmlubmVyVGV4dCA9IGBZb3UgZG9uJ3QgaGF2ZSBlbm91Z2ggUG9pbnRzIGZvciB1cGdyYWRlICgke1BvaW50QW1vdW50fS8ke1VwZ3JhZGVQcmljZX0pIWA7XHJcblx0fVxyXG59XHJcbmNsaWNrQnV0dG9uUHJlc3RpZ2Uub25jbGljayA9IGZ1bmN0aW9uICgpIHtcclxuXHRpZiAoUG9pbnRBbW91bnQgPj0gUHJlc3RpZ2VQcmljZSkge1xyXG5cdFx0UHJlc3RpZ2VQb2ludEFtb3VudCA9IFByZXN0aWdlUG9pbnRBbW91bnQgKyBQcmVzdGlnZVBvaW50R2FpbjtcclxuXHRcdHByZXN0aWdlQW5kVXBkYXRlUHJlc3RpZ2VWYWx1ZXMoKTtcclxuXHRcdENsaWNrID0gQ2xpY2sgKyAoQ2xpY2sgLyAxMDApICogUHJlc3RpZ2VCb29zdDtcclxuXHRcdFByZXN0aWdlUHJpY2UgPSBQcmVzdGlnZVByaWNlICogMy41O1xyXG5cdH1cclxuXHRlbHNlIHtcclxuXHRcdGxvZy5pbm5lclRleHQgPSBgWW91IGRvbid0IGhhdmUgZW5vdWdoIFBvaW50cyBmb3IgUHJlc3RpZ2UoJHtQb2ludEFtb3VudH0vJHtQcmVzdGlnZVByaWNlfSkhYDtcclxuXHR9XHJcbn1cclxuXHJcbi8vIFx0ZWxzZSBpZiAoTWFpbklucHV0ID09ICczJykge1xyXG4vLyB9XHJcbi8vIGVsc2UgaWYgKE1haW5JbnB1dCA9PSAnNCcpIHtcclxuLy8gXHRSdW5lbkludGVyZmFjZUp1bXA6XHJcblxyXG4vLyBcdHN5c3RlbShcIkNMU1wiKTtcclxuLy8gXHRSdW5lbkludGVyZmFjZSgpO1xyXG5cclxuLy8gXHRpZiAoUnVuZUlucHV0ID09ICcxJykge1xyXG4vLyBcdFx0T3BlblJ1bmVKdW1wOlxyXG4vLyBcdFx0aWYgKFByZXN0aWdlUG9pbnRBbW91bnQgPj0gUnVuZVByaWNlKSB7XHJcbi8vIFx0XHRcdFByZXN0aWdlUG9pbnRBbW91bnQgPSBQcmVzdGlnZVBvaW50QW1vdW50IC0gUnVuZVByaWNlO1xyXG4vLyBcdFx0XHRSdW5lUHJpY2UgPSBSdW5lUHJpY2UgKiAxLjI1O1xyXG5cclxuLy8gXHRcdFx0c3JhbmQodGltZShOVUxMKSk7XHJcbi8vIFx0XHRcdFJ1bmVDaGFuY2UgPSByYW5kKCkgJSAzICsgMTtcclxuXHJcbi8vIFx0XHRcdGlmIChSdW5lQ2hhbmNlID09IDEpIHtcclxuLy8gXHRcdFx0XHRDbGljayA9IENsaWNrICogMjtcclxuLy8gXHRcdFx0XHRDbGlja1J1bmUgPSBDbGlja1J1bmUgKyAxO1xyXG5cclxuLy8gXHRcdFx0XHRzeXN0ZW0oXCJDTFNcIik7XHJcbi8vIFx0XHRcdFx0Y291dCA8PCBcIllvdSBnb3QgYSBDbGljay1SdW5lIVwiIDw8IGVuZGwgPDwgZW5kbDtcclxuXHJcbi8vIFx0XHRcdFx0Y291dCA8PCBcIlsxXU9wZW4gYW5vdGhlciBSdW5lIHwgWzJdQmFja1wiO1xyXG5cclxuLy8gXHRcdFx0XHRDbGlja1J1bmVJbnB1dCA9IGdldGNoKCk7XHJcblxyXG4vLyBcdFx0XHRcdGlmIChDbGlja1J1bmVJbnB1dCA9PSAnMScpIHtcclxuLy8gXHRcdFx0XHRcdHN5c3RlbShcIkNMU1wiKTtcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgZ290byBPcGVuUnVuZUp1bXA7XHJcbi8vIFx0XHRcdFx0fVxyXG4vLyBcdFx0XHRcdGVsc2UgaWYgKENsaWNrUnVuZUlucHV0ID09ICcyJykge1xyXG4vLyBcdFx0XHRcdFx0c3lzdGVtKFwiQ0xTXCIpO1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICBnb3RvIFJ1bmVuSW50ZXJmYWNlSnVtcDtcclxuLy8gXHRcdFx0XHR9XHJcbi8vIFx0XHRcdH1cclxuLy8gXHRcdFx0ZWxzZSBpZiAoUnVuZUNoYW5jZSA9PSAyKSB7XHJcbi8vIFx0XHRcdFx0VXBncmFkZVJ1bmUgPSBVcGdyYWRlUnVuZSArIDE7XHJcbi8vIFx0XHRcdFx0VXBncmFkZVByb2NlbnQgPSBVcGdyYWRlUHJvY2VudCArIDUwO1xyXG5cclxuLy8gXHRcdFx0XHRzeXN0ZW0oXCJDTFNcIik7XHJcbi8vIFx0XHRcdFx0Y291dCA8PCBcIllvdSBnb3QgYSBVcGdyYWRlLVJ1bmUhXCIgPDwgZW5kbCA8PCBlbmRsO1xyXG5cclxuLy8gXHRcdFx0XHRjb3V0IDw8IFwiWzFdT3BlbiBhbm90aGVyIFJ1bmUgfCBbMl1CYWNrXCI7XHJcblxyXG4vLyBcdFx0XHRcdFVwZ3JhZGVSdW5lSW5wdXQgPSBnZXRjaCgpO1xyXG5cclxuLy8gXHRcdFx0XHRpZiAoVXBncmFkZVJ1bmVJbnB1dCA9PSAnMScpIHtcclxuLy8gXHRcdFx0XHRcdHN5c3RlbShcIkNMU1wiKTtcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgZ290byBPcGVuUnVuZUp1bXA7XHJcbi8vIFx0XHRcdFx0fVxyXG4vLyBcdFx0XHRcdGVsc2UgaWYgKFVwZ3JhZGVSdW5lSW5wdXQgPT0gJzInKSB7XHJcbi8vIFx0XHRcdFx0XHRzeXN0ZW0oXCJDTFNcIik7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgIGdvdG8gUnVuZW5JbnRlcmZhY2VKdW1wO1xyXG4vLyBcdFx0XHRcdH1cclxuLy8gXHRcdFx0fVxyXG4vLyBcdFx0XHRlbHNlIGlmIChSdW5lQ2hhbmNlID09IDMpIHtcclxuLy8gXHRcdFx0XHRQcmVzdGlnZVJ1bmUgPSBQcmVzdGlnZVJ1bmUgKyAxO1xyXG4vLyBcdFx0XHRcdFByZXN0aWdlUG9pbnRHYWluID0gUHJlc3RpZ2VQb2ludEdhaW4gKiAyO1xyXG5cclxuLy8gXHRcdFx0XHRzeXN0ZW0oXCJDTFNcIik7XHJcbi8vIFx0XHRcdFx0Y291dCA8PCBcIllvdSBnb3QgYSBQcmVzdGlnZS1SdW5lIVwiIDw8IGVuZGwgPDwgZW5kbDtcclxuXHJcbi8vIFx0XHRcdFx0Y291dCA8PCBcIlsxXU9wZW4gYW5vdGhlciBSdW5lIHwgWzJdQmFja1wiO1xyXG5cclxuLy8gXHRcdFx0XHRQcmVzdGlnZVJ1bmVJbnB1dCA9IGdldGNoKCk7XHJcblxyXG4vLyBcdFx0XHRcdGlmIChQcmVzdGlnZVJ1bmVJbnB1dCA9PSAnMScpIHtcclxuLy8gXHRcdFx0XHRcdHN5c3RlbShcIkNMU1wiKTtcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgZ290byBPcGVuUnVuZUp1bXA7XHJcbi8vIFx0XHRcdFx0fVxyXG4vLyBcdFx0XHRcdGVsc2UgaWYgKFByZXN0aWdlUnVuZUlucHV0ID09ICcyJykge1xyXG4vLyBcdFx0XHRcdFx0c3lzdGVtKFwiQ0xTXCIpO1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICBnb3RvIFJ1bmVuSW50ZXJmYWNlSnVtcDtcclxuLy8gXHRcdFx0XHR9XHJcbi8vIFx0XHRcdH1cclxuLy8gXHRcdH1cclxuLy8gXHRcdGVsc2Uge1xyXG4vLyBcdFx0XHRzeXN0ZW0oXCJDTFNcIik7XHJcbi8vIFx0XHRcdGNvdXQgPDwgXCJZb3UgZG9uJ3QgaGF2ZSBlbm91Z2ggUHJlc3RpZ2UtUG9pbnRzIVwiIDw8IGVuZGwgPDwgZW5kbDtcclxuLy8gXHRcdH1cclxuLy8gXHR9XHJcbi8vIFx0ZWxzZSBpZiAoUnVuZUlucHV0ID09ICcyJykge1xyXG4vLyBcdFx0c3lzdGVtKFwiQ0xTXCIpO1xyXG4vLyBcdH1cclxuLy8gfVxyXG4vLyBlbHNlIGlmIChNYWluSW5wdXQgPT0gJzgnKSB7XHJcbi8vIFx0c3lzdGVtKFwiQ0xTXCIpO1xyXG4vLyBcdFBvaW50QW1vdW50ID0gUG9pbnRBbW91bnQgKyAxMDAwMDtcclxuLy8gfVxyXG4vLyBlbHNlIGlmIChNYWluSW5wdXQgPT0gJzknKSB7XHJcbi8vIFx0c3lzdGVtKFwiQ0xTXCIpO1xyXG4vLyBcdENsaWNrID0gMTtcclxuLy8gXHRQcmVzdGlnZVBvaW50QW1vdW50ID0gUHJlc3RpZ2VQb2ludEFtb3VudCArIDEwO1xyXG4vLyBcdFByZXN0aWdlQm9vc3QgPSBQcmVzdGlnZVBvaW50QW1vdW50ICogNTtcclxuLy8gXHRDbGljayA9IENsaWNrICsgKENsaWNrIC8gMTAwKSAqIFByZXN0aWdlQm9vc3Q7XHJcblxyXG4vLyB9XHJcbi8vIHJldHVybiAwO1xyXG4vLyB9XHJcblxyXG4vLyBpbnQgbWFpbigpXHJcbi8vIHtcclxuLy8gXHREZWZhdWx0VmFsdWVzKCk7XHJcblxyXG4vLyBcdGZvciAoaW50IGkgPSAyOyBpID4gMTsgaSsrKVxyXG4vLyBcdHtcclxuLy8gXHRcdE1haW5JbnRlcmZhY2UoKTtcclxuXHJcbi8vIFx0XHRXaGF0SW5wdXQoKTtcclxuLy8gXHR9XHJcbi8vIH0iXX0=