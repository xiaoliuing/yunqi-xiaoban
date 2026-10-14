import type { FoodEntry } from './types'

export const FOODS: FoodEntry[] = [
  {
    "name": "酒",
    "aliases": [
      "啤酒",
      "白酒",
      "红酒",
      "米酒",
      "醪糟",
      "酒酿"
    ],
    "level": "avoid",
    "reason": "酒精会通过胎盘影响胎儿发育，不存在安全剂量",
    "advice": "整个孕期都不要喝，含酒精的菜也避免"
  },
  {
    "name": "生鱼片",
    "aliases": [
      "刺身",
      "生鱼"
    ],
    "level": "avoid",
    "reason": "可能含寄生虫和李斯特菌",
    "advice": "鱼要做熟再吃"
  },
  {
    "name": "寿司",
    "aliases": [],
    "level": "caution",
    "reason": "含生鱼的寿司有寄生虫和细菌风险",
    "advice": "可以吃全熟食材做的寿司，如鳗鱼、玉子、蔬菜卷"
  },
  {
    "name": "溏心蛋",
    "aliases": [
      "生鸡蛋",
      "温泉蛋",
      "半熟蛋"
    ],
    "level": "avoid",
    "reason": "未熟透的蛋可能带有沙门氏菌",
    "advice": "蛋黄蛋白都凝固后再吃"
  },
  {
    "name": "鸡蛋",
    "aliases": [
      "水煮蛋",
      "煎蛋"
    ],
    "level": "ok",
    "reason": "优质蛋白和胆碱的好来源",
    "advice": "每天 1 个，煮熟吃"
  },
  {
    "name": "生牛奶",
    "aliases": [
      "未消毒奶",
      "生乳"
    ],
    "level": "avoid",
    "reason": "未经巴氏消毒，可能有李斯特菌",
    "advice": "选择巴氏消毒奶或常温灭菌奶"
  },
  {
    "name": "牛奶",
    "aliases": [
      "纯牛奶"
    ],
    "level": "ok",
    "reason": "补钙的主要来源",
    "advice": "孕中晚期每天 300–500g 奶或奶制品"
  },
  {
    "name": "软质奶酪",
    "aliases": [
      "布里奶酪",
      "卡芒贝尔"
    ],
    "level": "caution",
    "reason": "未经消毒的软奶酪可能有李斯特菌",
    "advice": "只吃标明巴氏消毒的产品，或加热后吃"
  },
  {
    "name": "半熟牛排",
    "aliases": [
      "三分熟",
      "五分熟"
    ],
    "level": "avoid",
    "reason": "未熟透的肉可能带有弓形虫",
    "advice": "牛排做到全熟"
  },
  {
    "name": "冷切肉",
    "aliases": [
      "火腿片",
      "熟食冷盘",
      "午餐肉"
    ],
    "level": "caution",
    "reason": "冷藏即食肉类有李斯特菌风险",
    "advice": "加热到冒热气再吃，平时少吃"
  },
  {
    "name": "腊肉",
    "aliases": [
      "腊肠",
      "咸鱼",
      "腌肉"
    ],
    "level": "caution",
    "reason": "含盐量高，可能含亚硝酸盐",
    "advice": "偶尔少量，做熟再吃"
  },
  {
    "name": "生蚝",
    "aliases": [
      "牡蛎"
    ],
    "level": "caution",
    "reason": "生吃有诺如病毒和细菌风险",
    "advice": "彻底做熟可以吃，富含锌"
  },
  {
    "name": "螃蟹",
    "aliases": [
      "大闸蟹",
      "蟹"
    ],
    "level": "caution",
    "reason": "不新鲜或没熟透容易引起食物中毒",
    "advice": "新鲜、蒸熟透，适量吃；对海鲜过敏不要吃"
  },
  {
    "name": "鲨鱼",
    "aliases": [
      "旗鱼",
      "方头鱼",
      "剑鱼"
    ],
    "level": "avoid",
    "reason": "大型掠食性鱼类汞含量高",
    "advice": "换成三文鱼、鲈鱼、鳕鱼等低汞鱼"
  },
  {
    "name": "三文鱼",
    "aliases": [
      "鲑鱼"
    ],
    "level": "ok",
    "reason": "低汞，富含 DHA",
    "advice": "做熟吃，每周 2–3 次鱼"
  },
  {
    "name": "鲈鱼",
    "aliases": [],
    "level": "ok",
    "reason": "低汞，蛋白质好吸收",
    "advice": "清蒸最佳"
  },
  {
    "name": "咖啡",
    "aliases": [
      "拿铁",
      "美式"
    ],
    "level": "caution",
    "reason": "咖啡因摄入过多与流产、低出生体重有关",
    "advice": "每天咖啡因不超过 200mg，约一杯中杯美式"
  },
  {
    "name": "浓茶",
    "aliases": [
      "奶茶"
    ],
    "level": "caution",
    "reason": "含咖啡因，茶多酚影响铁吸收",
    "advice": "淡茶少量，别和补铁的餐一起喝"
  },
  {
    "name": "动物肝脏",
    "aliases": [
      "猪肝",
      "鸡肝"
    ],
    "level": "caution",
    "reason": "补铁效果好，但维生素 A 含量很高，过量有致畸风险",
    "advice": "每周 1–2 次，每次 20–50g"
  },
  {
    "name": "动物血",
    "aliases": [
      "鸭血",
      "猪血"
    ],
    "level": "ok",
    "reason": "血红素铁含量高，好吸收",
    "advice": "每周 1–2 次，选正规渠道"
  },
  {
    "name": "山楂",
    "aliases": [
      "山楂片",
      "糖葫芦"
    ],
    "level": "caution",
    "reason": "大量食用可能刺激子宫收缩，加工品含糖高",
    "advice": "偶尔吃几颗没关系，别当零食大量吃"
  },
  {
    "name": "芦荟",
    "aliases": [],
    "level": "avoid",
    "reason": "口服可能引起腹泻和子宫收缩",
    "advice": "不要吃芦荟或芦荟饮料，外用护肤品可以"
  },
  {
    "name": "薏米",
    "aliases": [
      "薏仁"
    ],
    "level": "caution",
    "reason": "传统观点认为孕早期不宜多吃，证据有限",
    "advice": "孕早期避免大量，偶尔少量没关系"
  },
  {
    "name": "桂圆",
    "aliases": [
      "龙眼"
    ],
    "level": "caution",
    "reason": "含糖量比较高，吃多了热量上去",
    "advice": "一次几颗，血糖偏高要少吃"
  },
  {
    "name": "西瓜",
    "aliases": [],
    "level": "caution",
    "reason": "含糖量较高，易让血糖升高",
    "advice": "一次一小块，糖耐前后注意控制"
  },
  {
    "name": "榴莲",
    "aliases": [],
    "level": "caution",
    "reason": "热量和含糖量都高",
    "advice": "一次 1–2 块，血糖高要避免"
  },
  {
    "name": "菠萝",
    "aliases": [
      "凤梨"
    ],
    "level": "ok",
    "reason": "正常饮食量不会导致流产",
    "advice": "适量吃，过敏体质先少量尝试"
  },
  {
    "name": "木瓜",
    "aliases": [],
    "level": "ok",
    "reason": "成熟木瓜可以吃，富含维生素 C",
    "advice": "吃熟透的；青木瓜含较多乳胶，避免"
  },
  {
    "name": "鲜黄花菜",
    "aliases": [
      "新鲜金针菜"
    ],
    "level": "avoid",
    "reason": "新鲜黄花菜含秋水仙碱，会引起中毒",
    "advice": "吃干黄花菜，泡发后彻底煮熟"
  },
  {
    "name": "发芽土豆",
    "aliases": [
      "青皮土豆"
    ],
    "level": "avoid",
    "reason": "含龙葵素，会引起中毒",
    "advice": "发芽、变绿的土豆直接扔掉"
  },
  {
    "name": "槟榔",
    "aliases": [],
    "level": "avoid",
    "reason": "一级致癌物，与不良妊娠结局有关",
    "advice": "不要吃"
  },
  {
    "name": "人参",
    "aliases": [
      "西洋参",
      "高丽参"
    ],
    "level": "caution",
    "reason": "药材类补品可能影响血压和凝血",
    "advice": "不要自行进补，先问医生"
  },
  {
    "name": "燕窝",
    "aliases": [],
    "level": "ok",
    "reason": "可以吃，但营养价值与鸡蛋、牛奶相近",
    "advice": "不必刻意购买"
  },
  {
    "name": "冰淇淋",
    "aliases": [
      "雪糕"
    ],
    "level": "caution",
    "reason": "糖分高，少数产品有李斯特菌风险",
    "advice": "偶尔吃正规品牌，一次少量"
  },
  {
    "name": "方便面",
    "aliases": [
      "泡面"
    ],
    "level": "caution",
    "reason": "高盐高油、营养单一",
    "advice": "偶尔应急可以，加个蛋和青菜"
  },
  {
    "name": "菠菜",
    "aliases": [],
    "level": "ok",
    "reason": "富含叶酸，按平常的量吃就好",
    "advice": "焯水去草酸后再炒或凉拌"
  },
  {
    "name": "海带",
    "aliases": [
      "紫菜",
      "裙带菜"
    ],
    "level": "ok",
    "reason": "补碘的好食物",
    "advice": "每周 1–2 次，配合加碘盐"
  },
  {
    "name": "酸奶",
    "aliases": [],
    "level": "ok",
    "reason": "补钙，帮助肠道",
    "advice": "选无糖或低糖的"
  },
  {
    "name": "核桃",
    "aliases": [
      "杏仁",
      "腰果"
    ],
    "level": "ok",
    "reason": "健康脂肪和维生素 E",
    "advice": "每天一小把（约 10g），坚果过敏不要吃"
  },
  {
    "name": "苹果",
    "aliases": [],
    "level": "ok",
    "reason": "好消化，膳食纤维温和",
    "advice": "每天一个就好，连皮洗净吃"
  },
  {
    "name": "香蕉",
    "aliases": [],
    "level": "ok",
    "reason": "提供钾和能量，缓解便秘",
    "advice": "一次一根，别一次吃很多"
  },
  {
    "name": "橙子",
    "aliases": [],
    "level": "ok",
    "reason": "维生素 C 帮助铁吸收",
    "advice": "饭后吃，别和钙片一起大量喝橙汁"
  },
  {
    "name": "猕猴桃",
    "aliases": [],
    "level": "ok",
    "reason": "维生素 C 很高",
    "advice": "一天一个"
  },
  {
    "name": "葡萄",
    "aliases": [],
    "level": "caution",
    "reason": "含糖量不低",
    "advice": "一小把，吐籽，洗干净"
  },
  {
    "name": "荔枝",
    "aliases": [],
    "level": "caution",
    "reason": "含糖高，空腹大量吃可能引起不适",
    "advice": "一次 3–5 颗"
  },
  {
    "name": "芒果",
    "aliases": [],
    "level": "caution",
    "reason": "有人会过敏",
    "advice": "第一次少量尝试，过敏史不要吃"
  },
  {
    "name": "柿子",
    "aliases": [],
    "level": "caution",
    "reason": "空腹大量吃可能引起胃石",
    "advice": "饭后吃一个，别空腹吃一堆"
  },
  {
    "name": "樱桃",
    "aliases": [],
    "level": "ok",
    "reason": "含铁和维生素 C",
    "advice": "洗干净，适量"
  },
  {
    "name": "草莓",
    "aliases": [],
    "level": "ok",
    "reason": "维生素 C 丰富",
    "advice": "仔细冲洗，农药残留要洗掉"
  },
  {
    "name": "火龙果",
    "aliases": [],
    "level": "ok",
    "reason": "膳食纤维帮助排便",
    "advice": "红心、白心都可以"
  },
  {
    "name": "柚子",
    "aliases": [],
    "level": "caution",
    "reason": "可能影响部分药物代谢",
    "advice": "在吃药的话先问医生，否则适量"
  },
  {
    "name": "梨",
    "aliases": [],
    "level": "ok",
    "reason": "水分多，润喉",
    "advice": "可以直接吃或煮梨水"
  },
  {
    "name": "桃子",
    "aliases": [],
    "level": "ok",
    "reason": "水分和纤维都不错",
    "advice": "洗干净去皮吃也可以"
  },
  {
    "name": "牛油果",
    "aliases": [],
    "level": "ok",
    "reason": "优质脂肪，按平常的量吃就好",
    "advice": "一次半个，热量不低"
  },
  {
    "name": "蓝莓",
    "aliases": [],
    "level": "ok",
    "reason": "抗氧化物质丰富",
    "advice": "洗干净当加餐"
  },
  {
    "name": "哈密瓜",
    "aliases": [],
    "level": "caution",
    "reason": "含糖较高，按平常的量吃就好",
    "advice": "一次两三片"
  },
  {
    "name": "石榴",
    "aliases": [],
    "level": "ok",
    "reason": "维生素 C 和膳食纤维",
    "advice": "吐籽麻烦就吃一点"
  },
  {
    "name": "杏",
    "aliases": [],
    "level": "ok",
    "reason": "正常量没有特殊风险",
    "advice": "别吃苦杏仁"
  },
  {
    "name": "李子",
    "aliases": [],
    "level": "ok",
    "reason": "水分多，按平常的量吃就好",
    "advice": "适量，吃多了容易拉肚子"
  },
  {
    "name": "枣",
    "aliases": [
      "红枣"
    ],
    "level": "ok",
    "reason": "补铁的传统食物，含糖",
    "advice": "每天 3–5 颗"
  },
  {
    "name": "柠檬",
    "aliases": [],
    "level": "ok",
    "reason": "可以调味、提供维生素 C",
    "advice": "泡水喝，别空腹喝浓柠檬水"
  },
  {
    "name": "西兰花",
    "aliases": [],
    "level": "ok",
    "reason": "叶酸和维生素 C 都高",
    "advice": "蒸或焯水后快炒"
  },
  {
    "name": "胡萝卜",
    "aliases": [],
    "level": "ok",
    "reason": "β-胡萝卜素要加油才好吸收",
    "advice": "用油炒或和肉一起炖"
  },
  {
    "name": "番茄",
    "aliases": [],
    "level": "ok",
    "reason": "维生素 C 和番茄红素",
    "advice": "熟吃吸收更好"
  },
  {
    "name": "苦瓜",
    "aliases": [],
    "level": "ok",
    "reason": "热量低，按平常的量吃就好",
    "advice": "苦味重就少放，别指望它降血糖"
  },
  {
    "name": "韭菜",
    "aliases": [],
    "level": "ok",
    "reason": "正常做熟吃没有禁忌",
    "advice": "做熟，别生吃"
  },
  {
    "name": "香菜",
    "aliases": [],
    "level": "ok",
    "reason": "可以调味，按平常的量吃就好",
    "advice": "不喜欢就不放"
  },
  {
    "name": "木耳",
    "aliases": [],
    "level": "ok",
    "reason": "泡发后富含膳食纤维",
    "advice": "泡发后摘掉根部，煮熟"
  },
  {
    "name": "香菇",
    "aliases": [],
    "level": "ok",
    "reason": "鲜味足，能代替部分盐",
    "advice": "做熟吃"
  },
  {
    "name": "马齿苋",
    "aliases": [],
    "level": "caution",
    "reason": "可能刺激子宫，证据有限",
    "advice": "孕期少吃，不要当菜大量吃"
  },
  {
    "name": "豆芽",
    "aliases": [],
    "level": "ok",
    "reason": "清淡好消化",
    "advice": "一定要炒熟"
  },
  {
    "name": "茄子",
    "aliases": [],
    "level": "ok",
    "reason": "吸油，注意少油",
    "advice": "蒸着吃更合适"
  },
  {
    "name": "南瓜",
    "aliases": [],
    "level": "ok",
    "reason": "好消化，β-胡萝卜素丰富",
    "advice": "蒸南瓜当主食的一部分"
  },
  {
    "name": "黄瓜",
    "aliases": [],
    "level": "ok",
    "reason": "水分多热量低",
    "advice": "洗净生吃或凉拌"
  },
  {
    "name": "生菜",
    "aliases": [],
    "level": "caution",
    "reason": "生吃有寄生虫和细菌风险",
    "advice": "孕期建议焯水或做熟"
  },
  {
    "name": "油麦菜",
    "aliases": [],
    "level": "ok",
    "reason": "清淡，叶酸不错",
    "advice": "大火快炒"
  },
  {
    "name": "小白菜",
    "aliases": [],
    "level": "ok",
    "reason": "温和好消化",
    "advice": "快炒或做汤"
  },
  {
    "name": "芹菜",
    "aliases": [],
    "level": "ok",
    "reason": "膳食纤维高",
    "advice": "炒熟吃，降压药使用者正常饮食量即可"
  },
  {
    "name": "莲藕",
    "aliases": [],
    "level": "ok",
    "reason": "可以当蔬菜吃",
    "advice": "炒或炖"
  },
  {
    "name": "山药",
    "aliases": [],
    "level": "ok",
    "reason": "好消化，按平常的量吃就好",
    "advice": "去皮时戴手套，避免手痒"
  },
  {
    "name": "玉米",
    "aliases": [],
    "level": "ok",
    "reason": "可当部分主食",
    "advice": "一根就差不多"
  },
  {
    "name": "牛肉",
    "aliases": [],
    "level": "ok",
    "reason": "血红素铁和优质蛋白",
    "advice": "做全熟，每周几次"
  },
  {
    "name": "羊肉",
    "aliases": [],
    "level": "ok",
    "reason": "优质蛋白，没有“上火伤胎”的可靠证据",
    "advice": "做熟适量吃，不爱吃可以不吃"
  },
  {
    "name": "猪肉",
    "aliases": [],
    "level": "ok",
    "reason": "日常蛋白质来源",
    "advice": "瘦肉为主，做熟"
  },
  {
    "name": "鸡肉",
    "aliases": [],
    "level": "ok",
    "reason": "脂肪相对少，好消化",
    "advice": "去皮更清淡"
  },
  {
    "name": "鸭肉",
    "aliases": [],
    "level": "ok",
    "reason": "蛋白质不错",
    "advice": "炖汤撇油"
  },
  {
    "name": "虾",
    "aliases": [],
    "level": "ok",
    "reason": "高蛋白低脂",
    "advice": "做熟，对海鲜过敏不要吃"
  },
  {
    "name": "鱿鱼",
    "aliases": [],
    "level": "ok",
    "reason": "蛋白质可以，胆固醇偏高",
    "advice": "偶尔吃，一定要熟"
  },
  {
    "name": "带鱼",
    "aliases": [],
    "level": "ok",
    "reason": "海鱼，提供碘和蛋白",
    "advice": "煎或炖熟"
  },
  {
    "name": "金枪鱼罐头",
    "aliases": [],
    "level": "caution",
    "reason": "罐头金枪鱼汞含量高于三文鱼",
    "advice": "每周不超过 1 次，选清水浸的"
  },
  {
    "name": "鳕鱼",
    "aliases": [],
    "level": "ok",
    "reason": "低汞白肉鱼",
    "advice": "清蒸或烤"
  },
  {
    "name": "甲鱼",
    "aliases": [],
    "level": "caution",
    "reason": "没有特殊滋补必要，且不好消化",
    "advice": "不必特意吃，要吃就做熟适量"
  },
  {
    "name": "虾皮",
    "aliases": [],
    "level": "ok",
    "reason": "钙含量高，按平常的量吃就好",
    "advice": "每次一小勺，注意盐分"
  },
  {
    "name": "小米",
    "aliases": [],
    "level": "ok",
    "reason": "好消化，适合孕吐时",
    "advice": "煮粥，适量即可"
  },
  {
    "name": "燕麦",
    "aliases": [],
    "level": "ok",
    "reason": "膳食纤维和 β-葡聚糖",
    "advice": "选原味，别选高糖麦片"
  },
  {
    "name": "糙米",
    "aliases": [],
    "level": "ok",
    "reason": "升糖比白米慢",
    "advice": "提前浸泡，和白米混着煮"
  },
  {
    "name": "红薯",
    "aliases": [],
    "level": "ok",
    "reason": "可替代部分主食",
    "advice": "一个拳头大小"
  },
  {
    "name": "豆腐",
    "aliases": [
      "北豆腐",
      "嫩豆腐"
    ],
    "level": "ok",
    "reason": "植物蛋白，北豆腐含钙更高",
    "advice": "用石膏或卤水点的更好"
  },
  {
    "name": "豆浆",
    "aliases": [],
    "level": "caution",
    "reason": "没煮透会含抗营养因子",
    "advice": "一定煮沸后再喝，无糖"
  },
  {
    "name": "腐竹",
    "aliases": [],
    "level": "ok",
    "reason": "植物蛋白，按平常的量吃就好",
    "advice": "泡发后烧入菜里"
  },
  {
    "name": "粽子",
    "aliases": [],
    "level": "caution",
    "reason": "糯米不好消化，甜粽含糖高",
    "advice": "一次小半个，细嚼"
  },
  {
    "name": "年糕",
    "aliases": [],
    "level": "caution",
    "reason": "糯米制品，升糖快",
    "advice": "少量，配蔬菜"
  },
  {
    "name": "面条",
    "aliases": [],
    "level": "ok",
    "reason": "好消化，按平常的量吃就好",
    "advice": "配鸡蛋和青菜，少喝咸汤"
  },
  {
    "name": "馒头",
    "aliases": [],
    "level": "ok",
    "reason": "发酵面食相对好消化",
    "advice": "一个，配蛋和奶"
  },
  {
    "name": "面包",
    "aliases": [],
    "level": "caution",
    "reason": "很多面包糖和油偏高",
    "advice": "选全麦、配料表短的"
  },
  {
    "name": "米饭",
    "aliases": [],
    "level": "ok",
    "reason": "主食基础，按平常的量吃就好",
    "advice": "孕中晚期可以把一半换成杂粮"
  },
  {
    "name": "可乐",
    "aliases": [
      "汽水"
    ],
    "level": "caution",
    "reason": "糖和咖啡因",
    "advice": "偶尔几口，不要当水喝"
  },
  {
    "name": "功能饮料",
    "aliases": [],
    "level": "avoid",
    "reason": "咖啡因和添加成分不适合孕期",
    "advice": "换成白开水或牛奶"
  },
  {
    "name": "蜂蜜",
    "aliases": [],
    "level": "ok",
    "reason": "孕妈可以吃，一岁内宝宝不能吃",
    "advice": "少量代替糖，别用生蜂蜜涂伤口"
  },
  {
    "name": "红糖",
    "aliases": [],
    "level": "ok",
    "reason": "就是糖，没有特殊补血作用",
    "advice": "可以调味，血糖高要少"
  },
  {
    "name": "巧克力",
    "aliases": [],
    "level": "caution",
    "reason": "含糖，黑巧还含少量咖啡因",
    "advice": "一两小块解馋"
  },
  {
    "name": "薯片",
    "aliases": [],
    "level": "caution",
    "reason": "高盐高油，按平常的量吃就好",
    "advice": "偶尔几片"
  },
  {
    "name": "辣条",
    "aliases": [],
    "level": "caution",
    "reason": "高盐高添加剂",
    "advice": "孕期最好不吃"
  },
  {
    "name": "花椒",
    "aliases": [],
    "level": "ok",
    "reason": "正常调味量没问题",
    "advice": "太麻的少吃，避免肠胃不适"
  },
  {
    "name": "味精",
    "aliases": [],
    "level": "ok",
    "reason": "正常用量是安全的",
    "advice": "少放，鲜味用香菇和番茄代替更好"
  },
  {
    "name": "代糖",
    "aliases": [
      "阿斯巴甜",
      "赤藓糖醇"
    ],
    "level": "caution",
    "reason": "孕期不必刻意用代糖",
    "advice": "优先少吃甜食，而不是换成代糖"
  },
  {
    "name": "阿胶",
    "aliases": [],
    "level": "caution",
    "reason": "没有必要自行进补，含糖糕点热量高",
    "advice": "想吃先问医生"
  },
  {
    "name": "枸杞",
    "aliases": [],
    "level": "ok",
    "reason": "可以泡水或入菜，别指望它补全身",
    "advice": "每天一小把"
  },
  {
    "name": "蛋白粉",
    "aliases": [],
    "level": "caution",
    "reason": "正常吃饭不需要额外蛋白粉",
    "advice": "除非医生或营养师建议"
  },
  {
    "name": "益母草",
    "aliases": [],
    "level": "avoid",
    "reason": "可能引起子宫收缩",
    "advice": "不要泡水喝"
  },
  {
    "name": "藏红花",
    "aliases": [],
    "level": "avoid",
    "reason": "可能刺激子宫",
    "advice": "不要当茶喝，烹饪里也不要放"
  },
  {
    "name": "当归",
    "aliases": [],
    "level": "avoid",
    "reason": "可能引起子宫收缩",
    "advice": "不要自行用当归进补"
  },
  {
    "name": "桃胶",
    "aliases": [],
    "level": "ok",
    "reason": "主要是膳食纤维，没有特殊功效",
    "advice": "泡发煮熟，不必天天吃"
  },
  {
    "name": "姜",
    "aliases": [
      "生姜"
    ],
    "level": "ok",
    "reason": "少量可以缓解孕吐",
    "advice": "做菜放几片，别空腹喝浓姜汤"
  },
  {
    "name": "蒜",
    "aliases": [
      "大蒜"
    ],
    "level": "ok",
    "reason": "正常做菜没问题",
    "advice": "生蒜刺激胃，熟吃更舒服"
  },
  {
    "name": "醋",
    "aliases": [],
    "level": "ok",
    "reason": "可以开胃，按平常的量吃就好",
    "advice": "不要大量喝醋减肥"
  },
  {
    "name": "酱油",
    "aliases": [],
    "level": "ok",
    "reason": "注意钠含量",
    "advice": "少放，选低钠的更好"
  },
  {
    "name": "辣椒",
    "aliases": [],
    "level": "caution",
    "reason": "本身不伤胎，但容易烧心、加重痔疮",
    "advice": "能吃辣就少量，孕吐期停掉"
  },
  {
    "name": "火锅",
    "aliases": [],
    "level": "caution",
    "reason": "肉类容易没烫熟，汤底油盐重",
    "advice": "肉类煮熟透，少喝汤，清汤锅更好"
  },
  {
    "name": "烧烤",
    "aliases": [],
    "level": "caution",
    "reason": "容易不熟，还有焦糊物",
    "advice": "偶尔吃全熟的，别吃焦黑的"
  },
  {
    "name": "沙拉",
    "aliases": [],
    "level": "caution",
    "reason": "生蔬菜和沙拉酱有卫生和热量问题",
    "advice": "蔬菜焯水，酱单独少放"
  },
  {
    "name": "隔夜菜",
    "aliases": [],
    "level": "caution",
    "reason": "冷藏不当容易细菌超标",
    "advice": "彻底加热一次，不要反复热"
  },
  {
    "name": "皮蛋",
    "aliases": [],
    "level": "caution",
    "reason": "铅含量已比过去低，但仍偏咸",
    "advice": "偶尔几瓣，选正规品牌"
  },
  {
    "name": "茶叶蛋",
    "aliases": [],
    "level": "ok",
    "reason": "蛋是熟的，按平常的量吃就好",
    "advice": "少吃，卤汁很咸"
  },
  {
    "name": "银耳",
    "aliases": [],
    "level": "ok",
    "reason": "可以做汤，按平常的量吃就好",
    "advice": "煮熟，别吃来路不明的鲜银耳"
  },
  {
    "name": "莲子",
    "aliases": [],
    "level": "ok",
    "reason": "可以煮粥，按平常的量吃就好",
    "advice": "去芯，别一次吃太多"
  },
  {
    "name": "黑芝麻",
    "aliases": [],
    "level": "ok",
    "reason": "钙和健康脂肪",
    "advice": "一小勺拌进粥里"
  },
  {
    "name": "花生",
    "aliases": [],
    "level": "ok",
    "reason": "优质脂肪和蛋白",
    "advice": "过敏不要吃，每天一小把"
  },
  {
    "name": "奇亚籽",
    "aliases": [],
    "level": "ok",
    "reason": "膳食纤维高",
    "advice": "泡开再吃，一次一勺"
  },
  {
    "name": "苏打饼干",
    "aliases": [],
    "level": "ok",
    "reason": "孕吐时起床前垫几块",
    "advice": "选低盐的，别当正餐"
  },
  {
    "name": "全麦面包",
    "aliases": [],
    "level": "ok",
    "reason": "比白面包纤维多",
    "advice": "看配料表，第一位应是全麦粉"
  }
]
