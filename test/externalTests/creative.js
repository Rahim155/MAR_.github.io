const assert = require('assert')
const SLOT = 36

module.exports = () => async (bot) => {
  const Item = require('prismarine-item')(bot.version)

  const item1 = new Item(1, 1, 0)
  const item2 = new Item(2, 1, 0)

  const promise = bot.creative.setInventorySlot(SLOT, item2)

  try {
    bot.creative.setInventorySlot(SLOT, item1)
  } catch (err) {
    assert.ok(err instanceof Error, 'The error has not been passed')
    assert.ok(bot.inventory.slots[SLOT] == null)
  }

  await promise
  assert.ok(bot.inventory.slots[SLOT] != null)
  assert.ok(bot.inventory.slots[SLOT].type === item2.type)
  await bot.creative.setInventorySlot(SLOT, new Item(3, 1, 0))
  assert.strictEqual(bot.inventory.slots[SLOT].type, 3)
  await bot.creative.setInventorySlot(SLOT, new Item(4, 1, 0))
  assert.strictEqual(bot.inventory.slots[SLOT].type, 4)
  await bot.creative.setInventorySlot(SLOT, null)
  assert.strictEqual(bot.inventory.slots[SLOT], null)
  // clear slot
  await bot.creative.setInventorySlot(SLOT, new Item(4, 1, 0))
  assert.strictEqual(bot.inventory.slots[SLOT].type, 4)
  await bot.creative.clearSlot(SLOT)
  assert.strictEqual(bot.inventory.slots[SLOT], null)
  // clear inventory
  for (let i = 0; i < 9; i++) {
    await bot.creative.setInventorySlot(36 + i, new Item(1, 1, 0))
  }
  assert.strictEqual(bot.inventory.slots.filter(item => item).length, 9)
  await bot.creative.clearInventory()
  assert.strictEqual(bot.inventory.slots.filter(item => item).length, 0)
}
