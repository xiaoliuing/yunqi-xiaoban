/**
 * 每一餐一份短提示词。只写成品的样子和位置。
 * 不写 never / no / not，也不写 pumpkin、yolk、rice 这类容易画错的词。
 */

const DISH: Record<string, string> = {
  小米南瓜粥: 'one large white bowl of vivid golden millet porridge, with three soft orange pieces sitting separate in the porridge',
  水煮蛋: 'one white plate with two boiled-egg halves, cut side up, bright solid yellow centers',
  白粥: 'one large white bowl of smooth flat white liquid, creamy like warm milk soup, the surface level',
  蒸蛋: 'one large white bowl of smooth pale yellow custard, the top one even color, silky and flat',
  燕麦牛奶粥: 'one white bowl of creamy white porridge with soft oat flakes and a few yellow fruit slices on top',
  香蕉: 'one peeled yellow banana lying on a white plate',
  全麦面包: 'two slices of deep golden toast on a white plate',
  煎蛋: 'one flat golden fried egg on a white plate, the center fully set',
  牛奶: 'one clear glass of white milk',
  豆腐脑: 'one white bowl of soft white pudding with a few dark drops on the surface',
  小包子: 'one small steamer with three small white buns, pleats on top',
  红薯: 'one split orange sweet potato on a white plate, soft orange inside, skin cracked open',
  豆浆: 'one clear glass of pale beige liquid',
  番茄鸡蛋面: 'one white bowl of noodles in a pale red broth, with small red pieces and yellow cooked curds',
  南瓜小米饼: 'two small golden round cakes on a white plate, orange color mixed into the cakes',
  酸奶: 'one small glass of plain white yogurt',
  菠菜蛋饼: 'one yellow omelette on a white plate, with green flecks cooked inside',
  杂粮粥: 'one white bowl of soft mixed-grain porridge, pale gold and creamy',
  茶叶蛋: 'one brown peeled egg on a small white plate, cut open to a solid yellow center',
  姜丝小米粥: 'one white bowl of pale yellow millet porridge with a few thin pale shreds on the surface',
  苏打饼干: 'three pale square crackers on a white plate',
  牛奶玉米: 'one short piece of yellow corn with plump kernels on a white plate, beside one small glass of white milk',
  山药小米粥: 'one white bowl of golden millet porridge with a few soft white slices in it',
  蒸南瓜: 'one small white dish of soft orange pieces',
  原味酸奶: 'one small glass of plain white yogurt',
  一小把核桃: 'three brown walnut pieces on a small white plate',
  橙子一个: 'one orange cut open on a white plate, segments beside the remaining half',
  猕猴桃: 'one green fruit cut in half on a white plate, black seeds in the green center',
  无糖豆浆: 'one clear glass of pale beige liquid',
  苹果: 'one apple cut open on a white plate, pale flesh showing',
  巴氏奶: 'one clear glass of warm white milk',
  蒸红薯: 'one split orange sweet potato on a white plate, soft orange inside',
  无糖酸奶: 'one small glass of plain white yogurt',
  樱桃小番茄: 'a few tiny round red tomatoes on a white plate',
  梨子: 'one pale pear cut open on a white plate',
  北豆腐一小块: 'one small white square of tofu on a little dish, with a few dark drops on top',
  草莓: 'a few red berries with green caps on a white plate',
  温水: 'one clear glass of water',
  '黑芝麻糊（无糖）': 'one small white bowl of smooth dark gray pudding',
  番茄炖牛腩: 'one white bowl of small brown meat chunks in a red sauce',
  杂粮饭: 'one white bowl filled level with white grains mixed with brown grains',
  蒜蓉西兰花: 'one white plate of small bright green florets',
  二米饭: 'one white bowl filled level with white grains mixed with yellow grains',
  燕麦饭: 'one white bowl filled level with white grains mixed with soft flakes',
  清炒菠菜: 'one white plate of dark green cooked leaves',
  清炒油麦菜: 'one white plate of long dark green cooked leaves',
  凉拌海带丝: 'one small white dish of dark green thin strands',
  炒小白菜: 'one white plate of cooked greens with white stems and green leaves',
  香菇滑鸡: 'one white plate of pale cooked meat slices and brown mushroom slices in a little sauce',
  清炒虾仁: 'one white plate of pink curled shrimp pieces',
  清蒸鲈鱼: 'one oval white plate with one cooked pale fish, a few thin pale shreds on top',
  芹菜炒瘦肉: 'one white plate of short dark green stalks and thin brown meat slices',
  白灼虾: 'one white plate of several red curved shrimp',
  软米饭: 'one white bowl filled level with soft white grains',
  炒生菜: 'one white plate of pale green cooked leaves',
  蒸蛋羹: 'one white bowl of smooth pale yellow custard, the top even and flat',
  焯菠菜: 'one white plate of bright green cooked leaves',
  豆腐蔬菜汤: 'one white bowl of clear soup with white cubes and green leaves',
  馒头: 'one plain white bun on a small white plate',
  番茄豆腐: 'one white plate of white cubes in a red sauce',
  香菇油菜: 'one white plate of green stalks and brown mushroom slices',
  海带豆腐汤: 'one white bowl of soup with dark green slices and white cubes',
  白菜炖粉条: 'one white bowl of soft pale leaves and clear noodles',
  西兰花炒香干: 'one white plate of small green florets and brown slices',
  番茄鸡蛋: 'one white plate of soft fluffy yellow scramble mixed with several soft red wedges, the scramble and wedges shiny with a little light red sauce',
  黄瓜拌豆腐丝: 'one small white dish of green strips and white strips',
  素什锦: 'one white plate of small cooked vegetable cubes in orange, brown, and green',
  菠菜豆腐汤: 'one white bowl of soup with green leaves and white cubes',
  清炒荷兰豆: 'one white plate of bright green pods',
  鸡蛋: 'two boiled-egg halves on a white plate, cut side up, solid yellow centers',
  杂蔬鸡胸: 'one white plate of pale meat slices and small cooked vegetable pieces',
  清蒸鳕鱼: 'one white plate with one thick piece of pale cooked fish',
  糙米饭: 'one white bowl filled level with light brown grains',
  凉拌黄瓜: 'one small white dish of glossy green strips',
  北豆腐炒青菜: 'one white plate of white cubes and cooked green leaves',
  香菇鸡腿: 'one white plate of brown meat pieces and brown mushroom slices in a little sauce',
  白灼西兰花虾仁: 'one white plate of small green florets and pink curled shrimp pieces',
  菠菜蛋汤: 'one white bowl of clear soup with green leaves and thin yellow ribbons',
  杂粮馒头: 'one light brown bun on a small white plate',
  清炒芦笋鸡胸: 'one white plate of short green stalks and pale meat slices',
  藜麦饭: 'one white bowl filled level with white grains and tiny round grains',
  彩椒牛肉: 'one white plate of red and green strips with thin brown meat slices',
  菌菇豆腐煲: 'one small pot of white cubes and brown mushroom slices in a little broth',
  洋葱牛肉: 'one white plate of soft pale strips and thin brown meat slices',
}

const HEADER = 'Bold cartoon, thick dark outlines, bright flat colors, food drawn large and clear.'
const FOOTER = 'Background is a very pale cool white, much lighter than the food.'

const EXACT: Record<string, string> = {
  '番茄鸡蛋 · 软米饭 · 焯菠菜': [
    HEADER,
    'Left: one white plate of soft fluffy yellow scramble mixed with several soft red wedges, the scramble and wedges shiny with a little light red sauce.',
    'Center: one white bowl filled to the brim with plain soft white grains.',
    'Right: one white plate of bright green cooked leaves.',
    `${FOOTER} Only these three dishes.`,
  ].join(' '),
  '白粥 · 蒸蛋': [
    HEADER,
    'Left half: one large white bowl filled with smooth flat white liquid, creamy like warm milk soup, the surface unbroken and level.',
    'Right half: one large white bowl filled with smooth pale yellow custard, the top one even color all over, silky and flat.',
    `${FOOTER} Only these two bowls.`,
  ].join(' '),
  '小米南瓜粥 · 水煮蛋': [
    HEADER,
    'Left half of the picture: one large white bowl of vivid golden millet porridge. Three soft orange pieces sit in the porridge, separate and easy to see.',
    'Right half of the picture: one large white plate. Two large boiled-egg halves sit on the plate, cut side up, with bright solid yellow centers.',
    `${FOOTER} Only the bowl and the plate.`,
  ].join(' '),
}

/** 按餐名返回一份完整提示词。多道菜从左到右摆开。 */
export function mealPrompt(name: string): string {
  if (EXACT[name]) return EXACT[name]
  const parts = name.split(' · ')
  const missing = parts.filter((part) => !DISH[part])
  if (missing.length) throw new Error(`missing scene for ${missing.join(', ')}`)
  const places = parts.length === 1 ? [''] : parts.length === 2 ? ['Left half:', 'Right half:'] : ['Left:', 'Center:', 'Right:']
  const scene = parts.length === 1
    ? `The picture shows ${DISH[parts[0]]}.`
    : parts.map((part, index) => `${places[index]} ${DISH[part]}.`).join(' ')
  const prompt = `${HEADER} ${scene} ${FOOTER} Only these dishes.`
  if (prompt.length > 1500) throw new Error(`prompt longer than 1500: ${name}`)
  return prompt
}
