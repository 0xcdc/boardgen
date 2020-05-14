#! /usr/bin/env babel-node

import { v4 as uuidv4 } from 'uuid';
import JSZip from 'jszip';
import fs from 'fs';

const Hand = {
  id: "hand",
  type: "hand",
  x: 50,
  y: 820,
  z: 1,
  dragging: null,
  enabled: true,
};

function CardPile(title) {
  return {
    id: "e378b96e-519f-4d8e-bd58-e7da57cebcee",//uuidv4(),
    x: 50,
    y: 50,
    type: "cardPile",
    z: 700,
    hasShuffleButton: true,
    dragging: null,
  };
}

function NewSupplyPile(title, url, count) {
  let cardPile = CardPile(title);

  return [cardPile];
}

let gold = NewSupplyPile("Copper", "http://wiki.dominionstrategy.com/images/f/fb/Copper.jpg", 100);

let zip = new JSZip();
zip.file("widgets.json", JSON.stringify([Hand, gold]));

zip
  .generateNodeStream({type:'nodebuffer',streamFiles:true})
  .pipe(fs.createWriteStream('out.pcio'))
  .on('finish', function () {
      // JSZip generates a readable stream with a "end" event,
      // but is piped here in a writable stream which emits a "finish" event.
      console.log("out.pcio written.");
  });
