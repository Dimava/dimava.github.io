# Mods

## Installation

	<!-- put the required lines below line 15 of index.html -->
	
	<!-- for local files (manual updates, more safe, requires putting theese files next to index.html) -->
		<!-- <script src="showlifetime.js"></script> -->
		<!-- <script src="speedhack.js"></script> -->
		<!-- <script src="saving.js"></script> -->
		<!-- <link rel="stylesheet" href="custom.css"> -->
	
	<!-- for https: files (easier, autoupdate)  -->
		<script src="https://dimava.github.io/mods/inc/showlifetime.js"></script>
		<script src="https://dimava.github.io/mods/inc/speedhack.js"></script>
		<script src="https://dimava.github.io/mods/inc/saving.js"></script>
		<link rel="stylesheet" href="https://dimava.github.io/mods/inc/custom.css">
	
	<!-- // https: version has autoupdates, but local version is more safe in case you don't trust me because it has no autoupdates -->

## Custom.css : better style
 - Upgrade icons for upgrades
 - Blue border for optional
 - Life-up icon for decay lowers
 - Life-crash icon for decay uppers
 - Red background for disabled
 - Blue cross for action lockers
 - Automation list (F1) is a list instead of tabs
 - (it also has a theming support, ask me if you need a dark theme)

# Showlifetime.js : show estimated life time
 - Numbers in brackets are est food consumed
 - Decimals mean there is a high chance for 1 more food to be consumed
 - Estimation is based on displayed values so it's not perfect

# Saving.js : fast import / export
 - <kbd>Ctrl</kbd>+<kbd>C</kbd> for fast export (copy export string)
 - <kbd>Ctrl</kbd>+<kbd>V</kbd> to open import modal and paste clipboard data
   - <kbd>Ctrl</kbd>+<kbd>V</kbd>, <kbd>Enter</kbd> for fast import
 - <kbd>Ctrl</kbd>+<kbd>S</kbd> saves the game into a save named like `run78-19꞉10-ch3-Tiger_teaching-1,2,3,2,0,1,3,4,1,0,0.incsave`

# Speedhack.js : game speed multiplier and timeskips
 - Change game speed multiplier
   - use <kbd>\[</kbd>/<kbd>\]</kbd> keys to choose speed in the list of `0.01`, `0.05`, `0.25`, `1`, `2`, `5`, `10`, `20`
   - max working is around x10, for even bigger speed use timeskips 
   - on game open the multiplier is set to x20 so you don't forget to
 - Use number keys for timeskips
   - max timeskip is around 10 minutes, on higher values the game will reload so it'll be ignored
   - time values are following: <kbd>1</kbd>: `10s`, <kbd>2</kbd>: `20s`, <kbd>3</kbd>: `60s`, <kbd>4</kbd>: `300s`, 
   - timeskips only work on speedhack below x5