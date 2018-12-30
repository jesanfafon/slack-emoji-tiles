# slack-emoji-tiles
Turns an image into an NxM array of emoji for making jumbo-emoji in slack.

It turns out that emoji in slack can be displayed with no whitespace between them. This means you can use NxM emoji tiles to display an image of any kind as an "emoji".

## Installation

*Note you must have `node` and `npm` installed. If you don't, go to [nodejs.org](https://www.nodejs.org) and follow the install instructions there.*

```bash
$ npm install -g slack-emoji-tiles
```

## Usage

Usage is pretty simple:

```bash
$ slack-emoji-tiles path/to/img -o path/to/output
```

### Options

- `i`, `image`: (required, default) the path to the image you want to slice
- `o`, `outputDir`: (optional) the path to output the sliced images to. If no value is passed, a folder with the title of the image is created in your working directory as the output path
- `t`, `maxTiles`: (optional, default 10) the maximum number of tiles in either dimension to generate
- `s`, `tileSize`: (optional, default 128) the size in pixels the resulting tiles should have. Slack's maximum emoji-size is 128x128
- `u`, `showUsage`: (optional, flag) if present, an example usage of the tiled emoji is printed

Pass short aliases with a single `-` and the full names with `--`

### Example

For the following example, test.jpg is an image with the intial dimensions 1557 x 2177
```bash
$ slack-emoji-tiles test.jpg -o emoji -t 2 -u
After you've uploaded the output sliced emoji to slack, use your jumbo emoji like:
:test-0_0::test-0_1:
:test-1_0::test-1_1:
$ ls
emoji/  test.jpg
$ ls emoji/
test-0_0.png  test-0_1.png  test-1_0.png  test-1_1.png
```

## Uploading to Slack
I recommend the chrome extension [Slack Emoji Uploader](https://chrome.google.com/webstore/detail/slack-emoji-uploader/jfacjbibcobdehekkieokkloinlfdomg) by Juan Gonzalez

#### Credits
Image manipulation accomplished using [Jimp](https://www.npmjs.com/package/jimp)