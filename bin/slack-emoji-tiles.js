#!/usr/bin/env node

var Jimp = require('jimp');
var path = require('path');
var os = require('os');
var commandLineArgs = require('command-line-args');

const optionDefinitions = [
	{ name: 'image', alias: 'i', type: String, defaultOption: true },
	{ name: 'outputDir', alias: 'o', type: String, defaultValue: undefined },
	{ name: 'maxTiles', alias: 't', type: Number, defaultValue: 10 },
	{ name: 'tileSize', alias: 's', type: Number, defaultValue: 128 },
	{ name: 'showUsage', alias: 'u', type: Boolean, defaultValue: false }
];
// Read command line arguments
const options = commandLineArgs(optionDefinitions);

// Extract CLI args
const showUsage = options.showUsage;
const tileMaxDim = options.tileSize;
const maxTiles = options.maxTiles;
const outputDir = options.outputDir;
const fileName = options.image;
const ext = path.extname(fileName);
const fileTitle = path.basename(fileName, ext);
let emojiArrary = [];

// SLICE
Jimp.read(fileName, (err, emoji) => {
	if (err) throw err;
	let width = emoji.bitmap.width;
	let height = emoji.bitmap.height;

	// We don't really want to go spamming everyone with TONS of emoji
	// so by default we cap this 10
	if (tileCount(height) > maxTiles || tileCount(width) > maxTiles) {
		emoji = width > height 
				? emoji.resize(maxTiles * tileMaxDim, Jimp.AUTO)
				: emoji.resize(Jimp.AUTO, maxTiles * tileMaxDim);
		width = emoji.bitmap.width;
		height = emoji.bitmap.height;
	}

	let nearestWidth = nextNearestTileMaxDim(width);
	let nearestHeight = nextNearestTileMaxDim(height);

	let compositex = Math.ceil((nearestWidth - width) / 2);
	let compositey = Math.ceil((nearestHeight - height) / 2);

	const source = new Jimp(nearestWidth, nearestHeight, Jimp.cssColorToHex('rgba(0,0,0,0)'))
					.composite(emoji, compositex, compositey, {mode: Jimp.BLEND_OVERLAY});

	emojiArrary = new Array(tileCount(nearestHeight));
	for (let x = 0; x < emojiArrary.length; x++) emojiArrary[x] = new Array(tileCount(nearestWidth));

	for (let i = 0, column = 0; i < nearestWidth; i += tileMaxDim, column += 1){
		for (let j = 0, row = 0; j < nearestHeight; j+= tileMaxDim, row += 1){				
			let copy = source.clone();
			copy = copy.crop(i, j, tileMaxDim, tileMaxDim);
			let emojiName = `${fileTitle}-${row}_${column}`;
			copy.write(`${outputDir || fileTitle}/${emojiName}.png`);
			emojiArrary[row][column] = emojiName;
		}
	}

	if (showUsage) {
		process.stdout.write('After you\'ve uploaded the output sliced emoji to slack, use your jumbo emoji like:')
		process.stdout.write(os.EOL);
		for (let row = 0; row < emojiArrary.length; row++) {
			for (let column = 0; column < emojiArrary[row].length; column++){
				process.stdout.write(`:${emojiArrary[row][column]}:`);
			}
			process.stdout.write(os.EOL);
		}
	}
});



function tileCount(num) {
	return num / tileMaxDim;
}

function nextNearestTileMaxDim(num) {
	if (typeof num !== 'number') throw 'Dimension not a number';
	const remainder = num / tileMaxDim;
	const multiplier = Math.ceil(remainder);
	return tileMaxDim * multiplier;
}