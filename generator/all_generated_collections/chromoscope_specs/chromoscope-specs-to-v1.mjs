import * as fs from "node:fs/promises";

function fix(spec) {
	// "name" is not a supported property
	const ideogram = spec.views?.[0]?.views?.[0]?.tracks?.[0];
	delete ideogram['name'];
	ideogram['title'] = 'Ideogram';

	// 'mouseEvents' is outside of 'experimental'
	function moveMouseEventsOut(subSpecs) {
		if ('experimental' in subSpecs && 'mouseEvents' in subSpecs.experimental) {
			const { mouseEvents } = subSpecs.experimental;
			delete subSpecs['experimental'];
			subSpecs['mouseEvents'] = mouseEvents;
		}

		if ('views' in subSpecs) {
			subSpecs.views.forEach(moveMouseEventsOut);
		} else if ('tracks' in subSpecs) {
			subSpecs.tracks.forEach(moveMouseEventsOut);
		}
	}
	moveMouseEventsOut(spec);
}

/**
const input = process.argv[2];
const output = `${input.split('.json')[0]}.v1.json`;
const specStr = await fs.readFile(input, "utf8");
const spec = JSON.parse(specStr);
fix(spec);
await fs.writeFile(output, JSON.stringify(spec));
*/

const files = await fs.readdir('.');
files.forEach(async input => {
	if (!input.endsWith('.json')) return;
	// const output = `${input.split('.json')[0]}.v1.json`;
	const output = input; // just replace the current file
	const specStr = await fs.readFile(input, "utf8");
	const spec = JSON.parse(specStr);
	fix(spec);
	await fs.writeFile(output, JSON.stringify(spec));
});
