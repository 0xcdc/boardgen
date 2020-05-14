#! /usr/bin/env babel-node

import { v4 as uuidv4 } from 'uuid';
import JSZip from 'jszip';
import fs from 'fs';


const xSpacing = 135;
const xCenter = (xSpacing -10) / 2;

const victoryCardCount = 12;

var pileX = 30-xSpacing;
var z = 1;

const Hand = [{
  id: "hand",
  type: "hand",
  x: 50,
  y: 820,
  z: z++,
  dragging: null,
  enabled: true,
}];

function cardPile(label) {
  pileX += xSpacing;
  return {
    id: uuidv4(),
    x: pileX,
    y: 30,
    type: "cardPile",
    dragging: null,
    z: z++,
    label,
  };
}

function cardDeck({x, y, label, image, id: parentId}) {
  const xOffset = 10;
  const yOffset = 45;
  let cardType = `type-${uuidv4()}`;
  return {
    id: uuidv4(),
    x: x + xOffset,
    y: y + yOffset,
    type: "cardDeck",
    cardTypes: {
      [cardType]: {
        label,
        image,
      },
    },
    faceTemplate: {
      includeBorder: true,
      includeRadius: true,
      objects: [{
        type: "image",
        x: 0,
        y: 0,
        w: 103,
        h: 160,
        color: "white",
        valueType: "dynamic",
        value: "image"
        }]
    },
    backTemplate: {
      includeBorder: false,
      includeRadius: true,
      objects: [
        {
          type: "image",
          x: 0,
          y: 0,
          w: 103,
          h: 160,
          color: "#a23b2a",
          valueType: "static",
          value: "/img/cardback-red.svg"
        }
      ]
    },
    dragging: null,
    z: z++,
    "parent": parentId,
    onRemoveFromHand: null,
    cardOverlapH: 0
  };
}

function card({cardType, deck, parentId, x, y}) {
  return {
    id: uuidv4(),
    type: "card",
    cardType,
    deck,
    "parent": parentId,
    x,
    y,
    z: z++,
    dragging: null,
    faceup: true
  };
}

function newSupplyPile(title, image, count) {
  let pile = cardPile(title);
  let deck = cardDeck({...pile, image});
  let cards = [];
  for(let i=0;i<count;i++) {
    let c = card({
      cardType: Object.keys(deck.cardTypes)[0],
      deck: deck.id,
      parentId: pile.id,
      x: pile.x,
      y: pile.y,
    });

    cards.push(c);
  }

  return [].concat(pile,deck,cards);
}

let victoryCards = [].concat(
  newSupplyPile("Estate", "http://wiki.dominionstrategy.com/images/9/91/Estate.jpg", victoryCardCount),
  newSupplyPile("Duchy", "http://wiki.dominionstrategy.com/images/4/4a/Duchy.jpg", victoryCardCount),
  newSupplyPile("Province", "http://wiki.dominionstrategy.com/images/c/cd/ProvinceOld.jpg", victoryCardCount),
);

pileX += xSpacing;

let treasureCards = [].concat(
  newSupplyPile("Copper", "http://wiki.dominionstrategy.com/images/f/fb/Copper.jpg", 100),
  newSupplyPile("Silver", "http://wiki.dominionstrategy.com/images/5/5d/Silver.jpg", 100),
  newSupplyPile("Gold", "http://wiki.dominionstrategy.com/images/5/50/Gold.jpg", 100),
);

let data = [].concat(Hand, victoryCards, treasureCards);
let zip = new JSZip();
zip.file("widgets.json", JSON.stringify(data));

/*
zip
  .generateNodeStream({type:'nodebuffer',streamFiles:true})
  .pipe(fs.createWriteStream('out.pcio'))
  .on('finish', function () {
      // JSZip generates a readable stream with a "end" event,
      // but is piped here in a writable stream which emits a "finish" event.
      console.log("out.pcio written.");
  });

*/

zip.generateAsync({
      type: "nodebuffer"
  }).then(function (content) {
    // relative to folder_1/, this file only contains:
    // folder_2/
    // folder_2/hello.txt
    fs.writeFile("out.pcio", content, function(err){/*...*/});
    console.log("wrote out.pcio");
});



