const isItemRecombobulated = function (item) {
  let recombobulated;

  if (item.tag?.ExtraAttributes?.rarity_upgrades != undefined) {
    recombobulated = true;
  }

  return recombobulated;
};

const isChambered = function (item) {
  let chambers;

  if (item.tag?.ExtraAttributes?.id !== undefined) {
    if(item.tag?.ExtraAttributes?.id.includes("DIVAN_") && !item.tag?.ExtraAttributes?.id.includes("FRAG" || "ALLOY" || "DRILL")) {
      if(item.tag?.ExtraAttributes?.gemstone_slots ?? item.tag?.ExtraAttributes["gems"]["unlocked_slots"]) {
        chambers = item.tag?.ExtraAttributes?.gemstone_slots ?? item.tag?.ExtraAttributes["gems"]["unlocked_slots"].length;
      }
    }
  }

  return chambers;
};

const skinned = function(item, db) {
  let skin = [];
  let object = {};
  if(item.skin) {
    object.skin = item.skin;
    object.price = db[`pet_skin_${item.skin.toString()}`.toLowerCase()];
    skin.push(object);
    return skin;
  }
}

const isDonated = function(item) {
  let donated;
  if(item.tag?.ExtraAttributes != undefined && item.tag?.ExtraAttributes?.donated_museum != undefined && item.tag?.ExtraAttributes?.donated_museum == 1) {
    donated = true;
  }
  return donated;
}

const getNetworth = async function (data, profile, db) {
  const output = { categories: {} };

  for (const key of Object.keys(data).filter(k => k != 'sacks')) {
    const category = { items: [], total: 0 };

    for (const item of data[key].filter(i => i.price)) {
      category.total += item.price;

      category.items.push({
        id: item.modified.id,
        name: item.modified.name,
        price: parseInt(item.price),
        donated: isDonated(item),
        recomb: isItemRecombobulated(item),
        chambers: isChambered(item),
        skin: skinned(item, db),
        heldItem: item.heldItem,
        candies: item.candyUsed,
        count: item.Count ?? 1
      });
    }

    if (category.items.length > 0) {
      output.categories[key] = {
        total: parseInt(category.total),
        top_items: category.items.sort((a, b) => b.price - a.price).filter(e => e)
      };
    }
  }

  output.bank = profile.banking?.balance ?? null;
  output.purse = profile.coin_purse ?? null;
  output.sacks = data.sacks ?? 0;

  output.networth = Object.values(output.categories).reduce((a, b) => a + b.total, 0) + output.sacks;

  output.irl = (((output.networth + output.bank + output.purse) / db["booster_cookie"]) * 350) * 0.0067067073 ?? 0;

  return output;

};

module.exports = { getNetworth };
