var fs = require('fs');
var content = JSON.parse(fs.readFileSync('to-migrate.json'));

// console.log();

let { addresses } = content;

let newAddresses = {};
let newShares = {};
let newEdits = {};
Object.entries(addresses).map(([key, value]) => {
  newAddresses[key] = {
    address: value.address,
    shareUrl: value.shareUrl,
    createdAt: value.createdAt
  };
  newShares[value.shareUrl] = {
    address: key
  };
  newEdits[value.editUrl] = {
    address: key
  };
});

// console.log(newAddresses, newShares, newEdits);

fs.writeFileSync(
  'migrated.json',
  JSON.stringify({
    addresses: newAddresses,
    shares: newShares,
    edits: newEdits
  })
);
