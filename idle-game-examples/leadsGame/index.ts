

let ClickRune: number
, UpgradeRune: number
, PrestigeRune: number
, RuneChance: number;

let PointAmount: number
, UpgradePrice: number
, Click: number
, UpgradeProcent: number
, PrestigePointAmount: number
, PrestigePrice: number
, RunePrice: number
, PrestigeBoost: number
, PrestigePointGain: number
;

function resetToDefaultValues(): void {
PointAmount = 0;
UpgradePrice = 2;
Click = 1;
UpgradeProcent = 50;
PrestigePointAmount = 0;
PrestigePrice = 10000;
RunePrice = 1;
PrestigePointGain = 1;
}


function prestigeAndUpdatePrestigeValues(): void {
PointAmount = 0;
UpgradePrice = 2;
Click = 1;
PrestigeBoost = PrestigePointAmount * 5;
UpgradeProcent = 50;
}

function MainInterface(): string {
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
function keydownListener(event: KeyboardEvent): void {
// event.code is like `KeyD` or `Digit5` or `ArrowLeft` or `ShiftLeft` or `Space`
if(event.code == 'Space') {
	PointAmount = PointAmount + Click;
	log.innerText = "You made a click with spacebar!";
}
}
addEventListener('keydown', keydownListener);
function ontick() {

}
setInterval(ontick, 1000/* ms */);
function updateGui() {
mainText.innerText = MainInterface();
}
setInterval(updateGui, 100/* ms */);

document.body.innerHTML = `
<pre><code>
<main id="mainText"> here goes main text </main> <br>
<button id="clickButton1"> Click! </button>
<button id="clickButton2"> Upgrade! </button>
<button id="clickButtonPrestige"> Prestige! </button>
<br>
<div id="log"> updated info goes here </div>
</code></pre>
`

declare let mainText: HTMLElement;
declare let clickButton1: HTMLButtonElement;
declare let clickButton2: HTMLButtonElement;
declare let clickButtonPrestige: HTMLButtonElement;
declare let log: HTMLElement;

clickButton1.onclick = function () {
PointAmount = PointAmount + Click;
log.innerText = "You made a click!";
}
clickButton2.onclick = function () {
if (PointAmount >= UpgradePrice) {
	Click = Click + Click / 100 * UpgradeProcent;
	PointAmount = PointAmount - UpgradePrice;
	UpgradePrice = UpgradePrice * 2;
} else {
	log.innerText = `You don't have enough Points for upgrade (${PointAmount}/${UpgradePrice})!`;
}
}
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
}

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