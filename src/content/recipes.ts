import type { Recipe } from './types'

export const RECIPES: Recipe[] = [
  {
    "id": "r1",
    "name": "小米南瓜粥 · 水煮蛋",
    "tip": "南瓜煮软，蛋要煮到蛋黄凝固",
    "kinds": [
      "breakfast"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "叶酸",
      "蛋白质",
      "清淡止吐"
    ],
    "avoidTags": [
      "蛋"
    ],
    "ingredients": [
      {
        "name": "小米",
        "amount": "50g",
        "category": "主食"
      },
      {
        "name": "南瓜",
        "amount": "100g",
        "category": "蔬菜"
      },
      {
        "name": "鸡蛋",
        "amount": "1 个",
        "category": "蛋奶"
      }
    ],
    "steps": [
      "小米和南瓜煮 25 分钟",
      "鸡蛋冷水下锅，水开后再煮 8 分钟"
    ]
  },
  {
    "id": "r2",
    "name": "白粥 · 蒸蛋",
    "tip": "孕吐时先吃两口，不必吃完",
    "kinds": [
      "breakfast"
    ],
    "trimesters": [
      1
    ],
    "tags": [
      "清淡止吐",
      "蛋白质"
    ],
    "avoidTags": [
      "蛋"
    ],
    "ingredients": [
      {
        "name": "大米",
        "amount": "40g",
        "category": "主食"
      },
      {
        "name": "鸡蛋",
        "amount": "1 个",
        "category": "蛋奶"
      }
    ],
    "steps": [
      "大米煮成稀粥",
      "蛋液加 1.5 倍温水蒸 10 分钟"
    ]
  },
  {
    "id": "r3",
    "name": "燕麦牛奶粥 · 香蕉",
    "tip": "燕麦选原味",
    "kinds": [
      "breakfast"
    ],
    "trimesters": [
      2,
      3
    ],
    "tags": [
      "补钙",
      "膳食纤维"
    ],
    "avoidTags": [
      "奶"
    ],
    "ingredients": [
      {
        "name": "燕麦",
        "amount": "40g",
        "category": "主食"
      },
      {
        "name": "牛奶",
        "amount": "250ml",
        "category": "蛋奶"
      },
      {
        "name": "香蕉",
        "amount": "1 根",
        "category": "水果"
      }
    ],
    "steps": [
      "燕麦和牛奶小火煮 5 分钟",
      "盛出后放香蕉片"
    ]
  },
  {
    "id": "r4",
    "name": "全麦面包 · 煎蛋 · 牛奶",
    "tip": "蛋两面煎到全熟",
    "kinds": [
      "breakfast"
    ],
    "trimesters": [
      2,
      3
    ],
    "tags": [
      "补钙",
      "蛋白质"
    ],
    "avoidTags": [
      "蛋",
      "奶"
    ],
    "ingredients": [
      {
        "name": "全麦面包",
        "amount": "2 片",
        "category": "主食"
      },
      {
        "name": "鸡蛋",
        "amount": "1 个",
        "category": "蛋奶"
      },
      {
        "name": "牛奶",
        "amount": "250ml",
        "category": "蛋奶"
      }
    ],
    "steps": [
      "鸡蛋煎至全熟",
      "面包烤一下，配热牛奶"
    ]
  },
  {
    "id": "r5",
    "name": "豆腐脑 · 小包子",
    "tip": "豆腐脑选咸口或少糖",
    "kinds": [
      "breakfast"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "补钙",
      "蛋白质"
    ],
    "avoidTags": [],
    "ingredients": [
      {
        "name": "北豆腐",
        "amount": "150g",
        "category": "豆制品"
      },
      {
        "name": "馒头",
        "amount": "1 个",
        "category": "主食"
      },
      {
        "name": "小白菜",
        "amount": "50g",
        "category": "蔬菜"
      }
    ],
    "steps": [
      "豆腐切块加少量水煮开",
      "配热馒头"
    ]
  },
  {
    "id": "r6",
    "name": "红薯 · 水煮蛋 · 豆浆",
    "tip": "豆浆必须煮透",
    "kinds": [
      "breakfast"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "膳食纤维",
      "蛋白质"
    ],
    "avoidTags": [
      "蛋"
    ],
    "ingredients": [
      {
        "name": "红薯",
        "amount": "1 个",
        "category": "主食"
      },
      {
        "name": "鸡蛋",
        "amount": "1 个",
        "category": "蛋奶"
      },
      {
        "name": "黄豆",
        "amount": "20g",
        "category": "豆制品"
      }
    ],
    "steps": [
      "红薯蒸 20 分钟",
      "鸡蛋煮熟",
      "豆浆煮沸后再煮 3 分钟"
    ]
  },
  {
    "id": "r7",
    "name": "番茄鸡蛋面",
    "tip": "汤别喝太咸",
    "kinds": [
      "breakfast"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "蛋白质",
      "维C"
    ],
    "avoidTags": [
      "蛋"
    ],
    "ingredients": [
      {
        "name": "面条",
        "amount": "80g",
        "category": "主食"
      },
      {
        "name": "鸡蛋",
        "amount": "1 个",
        "category": "蛋奶"
      },
      {
        "name": "番茄",
        "amount": "1 个",
        "category": "蔬菜"
      }
    ],
    "steps": [
      "番茄炒出汁，加水煮开",
      "淋入蛋液，下面条"
    ]
  },
  {
    "id": "r8",
    "name": "南瓜小米饼 · 酸奶",
    "tip": "少油煎到全熟",
    "kinds": [
      "breakfast"
    ],
    "trimesters": [
      2,
      3
    ],
    "tags": [
      "补钙",
      "膳食纤维"
    ],
    "avoidTags": [
      "蛋",
      "奶"
    ],
    "ingredients": [
      {
        "name": "南瓜",
        "amount": "100g",
        "category": "蔬菜"
      },
      {
        "name": "小米",
        "amount": "30g",
        "category": "主食"
      },
      {
        "name": "鸡蛋",
        "amount": "1 个",
        "category": "蛋奶"
      },
      {
        "name": "酸奶",
        "amount": "150g",
        "category": "蛋奶"
      }
    ],
    "steps": [
      "南瓜蒸熟压泥拌小米粉和蛋液",
      "少油煎熟",
      "配无糖酸奶"
    ]
  },
  {
    "id": "r9",
    "name": "菠菜蛋饼 · 牛奶",
    "tip": "菠菜先焯水",
    "kinds": [
      "breakfast"
    ],
    "trimesters": [
      2,
      3
    ],
    "tags": [
      "叶酸",
      "补钙"
    ],
    "avoidTags": [
      "蛋",
      "奶"
    ],
    "ingredients": [
      {
        "name": "菠菜",
        "amount": "80g",
        "category": "蔬菜"
      },
      {
        "name": "鸡蛋",
        "amount": "2 个",
        "category": "蛋奶"
      },
      {
        "name": "牛奶",
        "amount": "250ml",
        "category": "蛋奶"
      }
    ],
    "steps": [
      "菠菜焯水切碎拌蛋液",
      "摊成蛋饼",
      "配牛奶"
    ]
  },
  {
    "id": "r10",
    "name": "杂粮粥 · 茶叶蛋",
    "tip": "茶叶蛋咸，当天别再吃太咸",
    "kinds": [
      "breakfast"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "蛋白质",
      "膳食纤维"
    ],
    "avoidTags": [
      "蛋"
    ],
    "ingredients": [
      {
        "name": "燕麦",
        "amount": "20g",
        "category": "主食"
      },
      {
        "name": "大米",
        "amount": "30g",
        "category": "主食"
      },
      {
        "name": "鸡蛋",
        "amount": "1 个",
        "category": "蛋奶"
      }
    ],
    "steps": [
      "杂粮煮粥",
      "鸡蛋煮 10 分钟"
    ]
  },
  {
    "id": "r11",
    "name": "姜丝小米粥 · 苏打饼干",
    "tip": "起床前先吃两块饼干",
    "kinds": [
      "breakfast"
    ],
    "trimesters": [
      1
    ],
    "tags": [
      "清淡止吐"
    ],
    "avoidTags": [],
    "ingredients": [
      {
        "name": "小米",
        "amount": "40g",
        "category": "主食"
      },
      {
        "name": "生姜",
        "amount": "2 片",
        "category": "干货调料"
      },
      {
        "name": "苏打饼干",
        "amount": "3 块",
        "category": "主食"
      }
    ],
    "steps": [
      "小米加姜片煮成粥"
    ]
  },
  {
    "id": "r12",
    "name": "牛奶玉米 · 水煮蛋",
    "tip": "玉米当一部分主食",
    "kinds": [
      "breakfast"
    ],
    "trimesters": [
      2,
      3
    ],
    "tags": [
      "补钙",
      "蛋白质"
    ],
    "avoidTags": [
      "蛋",
      "奶"
    ],
    "ingredients": [
      {
        "name": "玉米",
        "amount": "1 根",
        "category": "主食"
      },
      {
        "name": "牛奶",
        "amount": "250ml",
        "category": "蛋奶"
      },
      {
        "name": "鸡蛋",
        "amount": "1 个",
        "category": "蛋奶"
      }
    ],
    "steps": [
      "玉米煮熟",
      "鸡蛋煮熟",
      "牛奶加热"
    ]
  },
  {
    "id": "r13",
    "name": "山药小米粥 · 蒸南瓜",
    "tip": "孕吐时喝粥就好",
    "kinds": [
      "breakfast"
    ],
    "trimesters": [
      1
    ],
    "tags": [
      "清淡止吐",
      "膳食纤维"
    ],
    "avoidTags": [],
    "ingredients": [
      {
        "name": "山药",
        "amount": "80g",
        "category": "蔬菜"
      },
      {
        "name": "小米",
        "amount": "40g",
        "category": "主食"
      },
      {
        "name": "南瓜",
        "amount": "80g",
        "category": "蔬菜"
      }
    ],
    "steps": [
      "山药去皮和南瓜、小米一起煮 25 分钟"
    ]
  },
  {
    "id": "r14",
    "name": "原味酸奶 · 一小把核桃",
    "tip": "酸奶无糖，核桃 2–3 个",
    "kinds": [
      "snack"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "补钙",
      "DHA"
    ],
    "avoidTags": [
      "奶",
      "坚果"
    ],
    "ingredients": [
      {
        "name": "酸奶",
        "amount": "150g",
        "category": "蛋奶"
      },
      {
        "name": "核桃",
        "amount": "10g",
        "category": "干货调料"
      }
    ],
    "steps": [
      "洗净或加热后直接吃"
    ]
  },
  {
    "id": "r15",
    "name": "橙子一个",
    "tip": "帮助正餐里的铁吸收",
    "kinds": [
      "snack"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "维C"
    ],
    "avoidTags": [],
    "ingredients": [
      {
        "name": "橙子",
        "amount": "1 个",
        "category": "水果"
      }
    ],
    "steps": [
      "洗净或加热后直接吃"
    ]
  },
  {
    "id": "r16",
    "name": "猕猴桃 · 无糖豆浆",
    "tip": "豆浆要煮透",
    "kinds": [
      "snack"
    ],
    "trimesters": [
      2,
      3
    ],
    "tags": [
      "维C",
      "补钙"
    ],
    "avoidTags": [],
    "ingredients": [
      {
        "name": "猕猴桃",
        "amount": "1 个",
        "category": "水果"
      },
      {
        "name": "黄豆",
        "amount": "20g",
        "category": "豆制品"
      }
    ],
    "steps": [
      "洗净或加热后直接吃"
    ]
  },
  {
    "id": "r17",
    "name": "苹果 · 巴氏奶",
    "tip": "奶温热更好喝",
    "kinds": [
      "snack"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "补钙",
      "膳食纤维"
    ],
    "avoidTags": [
      "奶"
    ],
    "ingredients": [
      {
        "name": "苹果",
        "amount": "1 个",
        "category": "水果"
      },
      {
        "name": "牛奶",
        "amount": "200ml",
        "category": "蛋奶"
      }
    ],
    "steps": [
      "洗净或加热后直接吃"
    ]
  },
  {
    "id": "r18",
    "name": "香蕉",
    "tip": "饿了先垫一垫",
    "kinds": [
      "snack"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "膳食纤维"
    ],
    "avoidTags": [],
    "ingredients": [
      {
        "name": "香蕉",
        "amount": "1 根",
        "category": "水果"
      }
    ],
    "steps": [
      "洗净或加热后直接吃"
    ]
  },
  {
    "id": "r19",
    "name": "蒸红薯",
    "tip": "当加餐，正餐主食就少一点",
    "kinds": [
      "snack"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "膳食纤维",
      "控糖"
    ],
    "avoidTags": [],
    "ingredients": [
      {
        "name": "红薯",
        "amount": "半个",
        "category": "主食"
      }
    ],
    "steps": [
      "洗净或加热后直接吃"
    ]
  },
  {
    "id": "r20",
    "name": "无糖酸奶",
    "tip": "看配料表，选无糖",
    "kinds": [
      "snack"
    ],
    "trimesters": [
      2,
      3
    ],
    "tags": [
      "补钙"
    ],
    "avoidTags": [
      "奶"
    ],
    "ingredients": [
      {
        "name": "酸奶",
        "amount": "150g",
        "category": "蛋奶"
      }
    ],
    "steps": [
      "洗净或加热后直接吃"
    ]
  },
  {
    "id": "r21",
    "name": "樱桃小番茄",
    "tip": "洗干净当水果",
    "kinds": [
      "snack"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "维C"
    ],
    "avoidTags": [],
    "ingredients": [
      {
        "name": "小番茄",
        "amount": "8 颗",
        "category": "水果"
      }
    ],
    "steps": [
      "洗净或加热后直接吃"
    ]
  },
  {
    "id": "r22",
    "name": "水煮蛋",
    "tip": "加餐补一口蛋白",
    "kinds": [
      "snack"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "蛋白质"
    ],
    "avoidTags": [
      "蛋"
    ],
    "ingredients": [
      {
        "name": "鸡蛋",
        "amount": "1 个",
        "category": "蛋奶"
      }
    ],
    "steps": [
      "洗净或加热后直接吃"
    ]
  },
  {
    "id": "r23",
    "name": "梨子",
    "tip": "嗓子干可以吃",
    "kinds": [
      "snack"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "膳食纤维"
    ],
    "avoidTags": [],
    "ingredients": [
      {
        "name": "梨",
        "amount": "1 个",
        "category": "水果"
      }
    ],
    "steps": [
      "洗净或加热后直接吃"
    ]
  },
  {
    "id": "r24",
    "name": "北豆腐一小块",
    "tip": "直接蒸热，撒少许酱油",
    "kinds": [
      "snack"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "补钙",
      "控糖"
    ],
    "avoidTags": [],
    "ingredients": [
      {
        "name": "北豆腐",
        "amount": "100g",
        "category": "豆制品"
      }
    ],
    "steps": [
      "洗净或加热后直接吃"
    ]
  },
  {
    "id": "r25",
    "name": "草莓",
    "tip": "仔细冲洗",
    "kinds": [
      "snack"
    ],
    "trimesters": [
      2,
      3
    ],
    "tags": [
      "维C"
    ],
    "avoidTags": [],
    "ingredients": [
      {
        "name": "草莓",
        "amount": "8 颗",
        "category": "水果"
      }
    ],
    "steps": [
      "洗净或加热后直接吃"
    ]
  },
  {
    "id": "r26",
    "name": "苏打饼干 · 温水",
    "tip": "孕吐时少量多次",
    "kinds": [
      "snack"
    ],
    "trimesters": [
      1
    ],
    "tags": [
      "清淡止吐"
    ],
    "avoidTags": [],
    "ingredients": [
      {
        "name": "苏打饼干",
        "amount": "3 块",
        "category": "主食"
      }
    ],
    "steps": [
      "洗净或加热后直接吃"
    ]
  },
  {
    "id": "r27",
    "name": "黑芝麻糊（无糖）",
    "tip": "一小碗",
    "kinds": [
      "snack"
    ],
    "trimesters": [
      2,
      3
    ],
    "tags": [
      "补钙"
    ],
    "avoidTags": [
      "奶"
    ],
    "ingredients": [
      {
        "name": "黑芝麻",
        "amount": "15g",
        "category": "干货调料"
      },
      {
        "name": "牛奶",
        "amount": "200ml",
        "category": "蛋奶"
      }
    ],
    "steps": [
      "洗净或加热后直接吃"
    ]
  },
  {
    "id": "r28",
    "name": "番茄炖牛腩 · 杂粮饭 · 蒜蓉西兰花",
    "tip": "牛腩焯水后和番茄小火炖 90 分钟",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "补铁"
    ],
    "avoidTags": [
      "牛肉",
      "荤"
    ],
    "ingredients": [
      {
        "name": "牛腩",
        "amount": "150g",
        "category": "肉禽"
      },
      {
        "name": "西兰花",
        "amount": "150g",
        "category": "蔬菜"
      },
      {
        "name": "大米",
        "amount": "50g",
        "category": "主食"
      },
      {
        "name": "糙米",
        "amount": "30g",
        "category": "主食"
      }
    ],
    "steps": [
      "牛腩焯水后和番茄小火炖 90 分钟",
      "大米和糙米一起煮",
      "蔬菜"
    ]
  },
  {
    "id": "r29",
    "name": "番茄炖牛腩 · 二米饭 · 蒜蓉西兰花",
    "tip": "牛腩焯水后和番茄小火炖 90 分钟",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "补铁"
    ],
    "avoidTags": [
      "牛肉",
      "荤"
    ],
    "ingredients": [
      {
        "name": "牛腩",
        "amount": "150g",
        "category": "肉禽"
      },
      {
        "name": "西兰花",
        "amount": "150g",
        "category": "蔬菜"
      },
      {
        "name": "大米",
        "amount": "50g",
        "category": "主食"
      },
      {
        "name": "小米",
        "amount": "30g",
        "category": "主食"
      }
    ],
    "steps": [
      "牛腩焯水后和番茄小火炖 90 分钟",
      "大米小米混合煮饭",
      "蔬菜"
    ]
  },
  {
    "id": "r30",
    "name": "番茄炖牛腩 · 燕麦饭 · 蒜蓉西兰花",
    "tip": "牛腩焯水后和番茄小火炖 90 分钟",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "补铁"
    ],
    "avoidTags": [
      "牛肉",
      "荤"
    ],
    "ingredients": [
      {
        "name": "牛腩",
        "amount": "150g",
        "category": "肉禽"
      },
      {
        "name": "西兰花",
        "amount": "150g",
        "category": "蔬菜"
      },
      {
        "name": "大米",
        "amount": "40g",
        "category": "主食"
      },
      {
        "name": "燕麦",
        "amount": "30g",
        "category": "主食"
      }
    ],
    "steps": [
      "牛腩焯水后和番茄小火炖 90 分钟",
      "大米和燕麦一起煮",
      "蔬菜"
    ]
  },
  {
    "id": "r31",
    "name": "番茄炖牛腩 · 杂粮饭 · 清炒菠菜",
    "tip": "牛腩焯水后和番茄小火炖 90 分钟",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "补铁",
      "叶酸"
    ],
    "avoidTags": [
      "牛肉",
      "荤"
    ],
    "ingredients": [
      {
        "name": "牛腩",
        "amount": "150g",
        "category": "肉禽"
      },
      {
        "name": "菠菜",
        "amount": "200g",
        "category": "蔬菜"
      },
      {
        "name": "大米",
        "amount": "50g",
        "category": "主食"
      },
      {
        "name": "糙米",
        "amount": "30g",
        "category": "主食"
      }
    ],
    "steps": [
      "牛腩焯水后和番茄小火炖 90 分钟",
      "大米和糙米一起煮",
      "蔬菜"
    ]
  },
  {
    "id": "r32",
    "name": "番茄炖牛腩 · 二米饭 · 清炒菠菜",
    "tip": "牛腩焯水后和番茄小火炖 90 分钟",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "补铁",
      "叶酸"
    ],
    "avoidTags": [
      "牛肉",
      "荤"
    ],
    "ingredients": [
      {
        "name": "牛腩",
        "amount": "150g",
        "category": "肉禽"
      },
      {
        "name": "菠菜",
        "amount": "200g",
        "category": "蔬菜"
      },
      {
        "name": "大米",
        "amount": "50g",
        "category": "主食"
      },
      {
        "name": "小米",
        "amount": "30g",
        "category": "主食"
      }
    ],
    "steps": [
      "牛腩焯水后和番茄小火炖 90 分钟",
      "大米小米混合煮饭",
      "蔬菜"
    ]
  },
  {
    "id": "r33",
    "name": "番茄炖牛腩 · 燕麦饭 · 清炒菠菜",
    "tip": "牛腩焯水后和番茄小火炖 90 分钟",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "补铁",
      "叶酸"
    ],
    "avoidTags": [
      "牛肉",
      "荤"
    ],
    "ingredients": [
      {
        "name": "牛腩",
        "amount": "150g",
        "category": "肉禽"
      },
      {
        "name": "菠菜",
        "amount": "200g",
        "category": "蔬菜"
      },
      {
        "name": "大米",
        "amount": "40g",
        "category": "主食"
      },
      {
        "name": "燕麦",
        "amount": "30g",
        "category": "主食"
      }
    ],
    "steps": [
      "牛腩焯水后和番茄小火炖 90 分钟",
      "大米和燕麦一起煮",
      "蔬菜"
    ]
  },
  {
    "id": "r34",
    "name": "番茄炖牛腩 · 杂粮饭 · 清炒油麦菜",
    "tip": "牛腩焯水后和番茄小火炖 90 分钟",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "补铁"
    ],
    "avoidTags": [
      "牛肉",
      "荤"
    ],
    "ingredients": [
      {
        "name": "牛腩",
        "amount": "150g",
        "category": "肉禽"
      },
      {
        "name": "油麦菜",
        "amount": "200g",
        "category": "蔬菜"
      },
      {
        "name": "大米",
        "amount": "50g",
        "category": "主食"
      },
      {
        "name": "糙米",
        "amount": "30g",
        "category": "主食"
      }
    ],
    "steps": [
      "牛腩焯水后和番茄小火炖 90 分钟",
      "大米和糙米一起煮",
      "蔬菜"
    ]
  },
  {
    "id": "r35",
    "name": "番茄炖牛腩 · 二米饭 · 清炒油麦菜",
    "tip": "牛腩焯水后和番茄小火炖 90 分钟",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "补铁"
    ],
    "avoidTags": [
      "牛肉",
      "荤"
    ],
    "ingredients": [
      {
        "name": "牛腩",
        "amount": "150g",
        "category": "肉禽"
      },
      {
        "name": "油麦菜",
        "amount": "200g",
        "category": "蔬菜"
      },
      {
        "name": "大米",
        "amount": "50g",
        "category": "主食"
      },
      {
        "name": "小米",
        "amount": "30g",
        "category": "主食"
      }
    ],
    "steps": [
      "牛腩焯水后和番茄小火炖 90 分钟",
      "大米小米混合煮饭",
      "蔬菜"
    ]
  },
  {
    "id": "r36",
    "name": "番茄炖牛腩 · 燕麦饭 · 清炒油麦菜",
    "tip": "牛腩焯水后和番茄小火炖 90 分钟",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "补铁"
    ],
    "avoidTags": [
      "牛肉",
      "荤"
    ],
    "ingredients": [
      {
        "name": "牛腩",
        "amount": "150g",
        "category": "肉禽"
      },
      {
        "name": "油麦菜",
        "amount": "200g",
        "category": "蔬菜"
      },
      {
        "name": "大米",
        "amount": "40g",
        "category": "主食"
      },
      {
        "name": "燕麦",
        "amount": "30g",
        "category": "主食"
      }
    ],
    "steps": [
      "牛腩焯水后和番茄小火炖 90 分钟",
      "大米和燕麦一起煮",
      "蔬菜"
    ]
  },
  {
    "id": "r37",
    "name": "番茄炖牛腩 · 杂粮饭 · 凉拌海带丝",
    "tip": "牛腩焯水后和番茄小火炖 90 分钟",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "补铁",
      "补碘"
    ],
    "avoidTags": [
      "牛肉",
      "荤"
    ],
    "ingredients": [
      {
        "name": "牛腩",
        "amount": "150g",
        "category": "肉禽"
      },
      {
        "name": "海带丝",
        "amount": "100g",
        "category": "蔬菜"
      },
      {
        "name": "大米",
        "amount": "50g",
        "category": "主食"
      },
      {
        "name": "糙米",
        "amount": "30g",
        "category": "主食"
      }
    ],
    "steps": [
      "牛腩焯水后和番茄小火炖 90 分钟",
      "大米和糙米一起煮",
      "蔬菜"
    ]
  },
  {
    "id": "r38",
    "name": "番茄炖牛腩 · 二米饭 · 凉拌海带丝",
    "tip": "牛腩焯水后和番茄小火炖 90 分钟",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "补铁",
      "补碘"
    ],
    "avoidTags": [
      "牛肉",
      "荤"
    ],
    "ingredients": [
      {
        "name": "牛腩",
        "amount": "150g",
        "category": "肉禽"
      },
      {
        "name": "海带丝",
        "amount": "100g",
        "category": "蔬菜"
      },
      {
        "name": "大米",
        "amount": "50g",
        "category": "主食"
      },
      {
        "name": "小米",
        "amount": "30g",
        "category": "主食"
      }
    ],
    "steps": [
      "牛腩焯水后和番茄小火炖 90 分钟",
      "大米小米混合煮饭",
      "蔬菜"
    ]
  },
  {
    "id": "r39",
    "name": "番茄炖牛腩 · 燕麦饭 · 凉拌海带丝",
    "tip": "牛腩焯水后和番茄小火炖 90 分钟",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "补铁",
      "补碘"
    ],
    "avoidTags": [
      "牛肉",
      "荤"
    ],
    "ingredients": [
      {
        "name": "牛腩",
        "amount": "150g",
        "category": "肉禽"
      },
      {
        "name": "海带丝",
        "amount": "100g",
        "category": "蔬菜"
      },
      {
        "name": "大米",
        "amount": "40g",
        "category": "主食"
      },
      {
        "name": "燕麦",
        "amount": "30g",
        "category": "主食"
      }
    ],
    "steps": [
      "牛腩焯水后和番茄小火炖 90 分钟",
      "大米和燕麦一起煮",
      "蔬菜"
    ]
  },
  {
    "id": "r40",
    "name": "番茄炖牛腩 · 杂粮饭 · 炒小白菜",
    "tip": "牛腩焯水后和番茄小火炖 90 分钟",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "补铁"
    ],
    "avoidTags": [
      "牛肉",
      "荤"
    ],
    "ingredients": [
      {
        "name": "牛腩",
        "amount": "150g",
        "category": "肉禽"
      },
      {
        "name": "小白菜",
        "amount": "200g",
        "category": "蔬菜"
      },
      {
        "name": "大米",
        "amount": "50g",
        "category": "主食"
      },
      {
        "name": "糙米",
        "amount": "30g",
        "category": "主食"
      }
    ],
    "steps": [
      "牛腩焯水后和番茄小火炖 90 分钟",
      "大米和糙米一起煮",
      "蔬菜"
    ]
  },
  {
    "id": "r41",
    "name": "番茄炖牛腩 · 二米饭 · 炒小白菜",
    "tip": "牛腩焯水后和番茄小火炖 90 分钟",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "补铁"
    ],
    "avoidTags": [
      "牛肉",
      "荤"
    ],
    "ingredients": [
      {
        "name": "牛腩",
        "amount": "150g",
        "category": "肉禽"
      },
      {
        "name": "小白菜",
        "amount": "200g",
        "category": "蔬菜"
      },
      {
        "name": "大米",
        "amount": "50g",
        "category": "主食"
      },
      {
        "name": "小米",
        "amount": "30g",
        "category": "主食"
      }
    ],
    "steps": [
      "牛腩焯水后和番茄小火炖 90 分钟",
      "大米小米混合煮饭",
      "蔬菜"
    ]
  },
  {
    "id": "r42",
    "name": "番茄炖牛腩 · 燕麦饭 · 炒小白菜",
    "tip": "牛腩焯水后和番茄小火炖 90 分钟",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "补铁"
    ],
    "avoidTags": [
      "牛肉",
      "荤"
    ],
    "ingredients": [
      {
        "name": "牛腩",
        "amount": "150g",
        "category": "肉禽"
      },
      {
        "name": "小白菜",
        "amount": "200g",
        "category": "蔬菜"
      },
      {
        "name": "大米",
        "amount": "40g",
        "category": "主食"
      },
      {
        "name": "燕麦",
        "amount": "30g",
        "category": "主食"
      }
    ],
    "steps": [
      "牛腩焯水后和番茄小火炖 90 分钟",
      "大米和燕麦一起煮",
      "蔬菜"
    ]
  },
  {
    "id": "r43",
    "name": "香菇滑鸡 · 杂粮饭 · 蒜蓉西兰花",
    "tip": "鸡腿肉和香菇蒸 20 分钟",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "蛋白质"
    ],
    "avoidTags": [
      "荤"
    ],
    "ingredients": [
      {
        "name": "鸡腿肉",
        "amount": "150g",
        "category": "肉禽"
      },
      {
        "name": "西兰花",
        "amount": "150g",
        "category": "蔬菜"
      },
      {
        "name": "大米",
        "amount": "50g",
        "category": "主食"
      },
      {
        "name": "糙米",
        "amount": "30g",
        "category": "主食"
      }
    ],
    "steps": [
      "鸡腿肉和香菇蒸 20 分钟",
      "大米和糙米一起煮",
      "蔬菜"
    ]
  },
  {
    "id": "r44",
    "name": "香菇滑鸡 · 二米饭 · 蒜蓉西兰花",
    "tip": "鸡腿肉和香菇蒸 20 分钟",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "蛋白质"
    ],
    "avoidTags": [
      "荤"
    ],
    "ingredients": [
      {
        "name": "鸡腿肉",
        "amount": "150g",
        "category": "肉禽"
      },
      {
        "name": "西兰花",
        "amount": "150g",
        "category": "蔬菜"
      },
      {
        "name": "大米",
        "amount": "50g",
        "category": "主食"
      },
      {
        "name": "小米",
        "amount": "30g",
        "category": "主食"
      }
    ],
    "steps": [
      "鸡腿肉和香菇蒸 20 分钟",
      "大米小米混合煮饭",
      "蔬菜"
    ]
  },
  {
    "id": "r45",
    "name": "香菇滑鸡 · 燕麦饭 · 蒜蓉西兰花",
    "tip": "鸡腿肉和香菇蒸 20 分钟",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "蛋白质"
    ],
    "avoidTags": [
      "荤"
    ],
    "ingredients": [
      {
        "name": "鸡腿肉",
        "amount": "150g",
        "category": "肉禽"
      },
      {
        "name": "西兰花",
        "amount": "150g",
        "category": "蔬菜"
      },
      {
        "name": "大米",
        "amount": "40g",
        "category": "主食"
      },
      {
        "name": "燕麦",
        "amount": "30g",
        "category": "主食"
      }
    ],
    "steps": [
      "鸡腿肉和香菇蒸 20 分钟",
      "大米和燕麦一起煮",
      "蔬菜"
    ]
  },
  {
    "id": "r46",
    "name": "香菇滑鸡 · 杂粮饭 · 清炒菠菜",
    "tip": "鸡腿肉和香菇蒸 20 分钟",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "蛋白质",
      "叶酸"
    ],
    "avoidTags": [
      "荤"
    ],
    "ingredients": [
      {
        "name": "鸡腿肉",
        "amount": "150g",
        "category": "肉禽"
      },
      {
        "name": "菠菜",
        "amount": "200g",
        "category": "蔬菜"
      },
      {
        "name": "大米",
        "amount": "50g",
        "category": "主食"
      },
      {
        "name": "糙米",
        "amount": "30g",
        "category": "主食"
      }
    ],
    "steps": [
      "鸡腿肉和香菇蒸 20 分钟",
      "大米和糙米一起煮",
      "蔬菜"
    ]
  },
  {
    "id": "r47",
    "name": "香菇滑鸡 · 二米饭 · 清炒菠菜",
    "tip": "鸡腿肉和香菇蒸 20 分钟",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "蛋白质",
      "叶酸"
    ],
    "avoidTags": [
      "荤"
    ],
    "ingredients": [
      {
        "name": "鸡腿肉",
        "amount": "150g",
        "category": "肉禽"
      },
      {
        "name": "菠菜",
        "amount": "200g",
        "category": "蔬菜"
      },
      {
        "name": "大米",
        "amount": "50g",
        "category": "主食"
      },
      {
        "name": "小米",
        "amount": "30g",
        "category": "主食"
      }
    ],
    "steps": [
      "鸡腿肉和香菇蒸 20 分钟",
      "大米小米混合煮饭",
      "蔬菜"
    ]
  },
  {
    "id": "r48",
    "name": "香菇滑鸡 · 燕麦饭 · 清炒菠菜",
    "tip": "鸡腿肉和香菇蒸 20 分钟",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "蛋白质",
      "叶酸"
    ],
    "avoidTags": [
      "荤"
    ],
    "ingredients": [
      {
        "name": "鸡腿肉",
        "amount": "150g",
        "category": "肉禽"
      },
      {
        "name": "菠菜",
        "amount": "200g",
        "category": "蔬菜"
      },
      {
        "name": "大米",
        "amount": "40g",
        "category": "主食"
      },
      {
        "name": "燕麦",
        "amount": "30g",
        "category": "主食"
      }
    ],
    "steps": [
      "鸡腿肉和香菇蒸 20 分钟",
      "大米和燕麦一起煮",
      "蔬菜"
    ]
  },
  {
    "id": "r49",
    "name": "香菇滑鸡 · 杂粮饭 · 清炒油麦菜",
    "tip": "鸡腿肉和香菇蒸 20 分钟",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "蛋白质"
    ],
    "avoidTags": [
      "荤"
    ],
    "ingredients": [
      {
        "name": "鸡腿肉",
        "amount": "150g",
        "category": "肉禽"
      },
      {
        "name": "油麦菜",
        "amount": "200g",
        "category": "蔬菜"
      },
      {
        "name": "大米",
        "amount": "50g",
        "category": "主食"
      },
      {
        "name": "糙米",
        "amount": "30g",
        "category": "主食"
      }
    ],
    "steps": [
      "鸡腿肉和香菇蒸 20 分钟",
      "大米和糙米一起煮",
      "蔬菜"
    ]
  },
  {
    "id": "r50",
    "name": "香菇滑鸡 · 二米饭 · 清炒油麦菜",
    "tip": "鸡腿肉和香菇蒸 20 分钟",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "蛋白质"
    ],
    "avoidTags": [
      "荤"
    ],
    "ingredients": [
      {
        "name": "鸡腿肉",
        "amount": "150g",
        "category": "肉禽"
      },
      {
        "name": "油麦菜",
        "amount": "200g",
        "category": "蔬菜"
      },
      {
        "name": "大米",
        "amount": "50g",
        "category": "主食"
      },
      {
        "name": "小米",
        "amount": "30g",
        "category": "主食"
      }
    ],
    "steps": [
      "鸡腿肉和香菇蒸 20 分钟",
      "大米小米混合煮饭",
      "蔬菜"
    ]
  },
  {
    "id": "r51",
    "name": "香菇滑鸡 · 燕麦饭 · 清炒油麦菜",
    "tip": "鸡腿肉和香菇蒸 20 分钟",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "蛋白质"
    ],
    "avoidTags": [
      "荤"
    ],
    "ingredients": [
      {
        "name": "鸡腿肉",
        "amount": "150g",
        "category": "肉禽"
      },
      {
        "name": "油麦菜",
        "amount": "200g",
        "category": "蔬菜"
      },
      {
        "name": "大米",
        "amount": "40g",
        "category": "主食"
      },
      {
        "name": "燕麦",
        "amount": "30g",
        "category": "主食"
      }
    ],
    "steps": [
      "鸡腿肉和香菇蒸 20 分钟",
      "大米和燕麦一起煮",
      "蔬菜"
    ]
  },
  {
    "id": "r52",
    "name": "香菇滑鸡 · 杂粮饭 · 凉拌海带丝",
    "tip": "鸡腿肉和香菇蒸 20 分钟",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "蛋白质",
      "补碘"
    ],
    "avoidTags": [
      "荤"
    ],
    "ingredients": [
      {
        "name": "鸡腿肉",
        "amount": "150g",
        "category": "肉禽"
      },
      {
        "name": "海带丝",
        "amount": "100g",
        "category": "蔬菜"
      },
      {
        "name": "大米",
        "amount": "50g",
        "category": "主食"
      },
      {
        "name": "糙米",
        "amount": "30g",
        "category": "主食"
      }
    ],
    "steps": [
      "鸡腿肉和香菇蒸 20 分钟",
      "大米和糙米一起煮",
      "蔬菜"
    ]
  },
  {
    "id": "r53",
    "name": "香菇滑鸡 · 二米饭 · 凉拌海带丝",
    "tip": "鸡腿肉和香菇蒸 20 分钟",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "蛋白质",
      "补碘"
    ],
    "avoidTags": [
      "荤"
    ],
    "ingredients": [
      {
        "name": "鸡腿肉",
        "amount": "150g",
        "category": "肉禽"
      },
      {
        "name": "海带丝",
        "amount": "100g",
        "category": "蔬菜"
      },
      {
        "name": "大米",
        "amount": "50g",
        "category": "主食"
      },
      {
        "name": "小米",
        "amount": "30g",
        "category": "主食"
      }
    ],
    "steps": [
      "鸡腿肉和香菇蒸 20 分钟",
      "大米小米混合煮饭",
      "蔬菜"
    ]
  },
  {
    "id": "r54",
    "name": "香菇滑鸡 · 燕麦饭 · 凉拌海带丝",
    "tip": "鸡腿肉和香菇蒸 20 分钟",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "蛋白质",
      "补碘"
    ],
    "avoidTags": [
      "荤"
    ],
    "ingredients": [
      {
        "name": "鸡腿肉",
        "amount": "150g",
        "category": "肉禽"
      },
      {
        "name": "海带丝",
        "amount": "100g",
        "category": "蔬菜"
      },
      {
        "name": "大米",
        "amount": "40g",
        "category": "主食"
      },
      {
        "name": "燕麦",
        "amount": "30g",
        "category": "主食"
      }
    ],
    "steps": [
      "鸡腿肉和香菇蒸 20 分钟",
      "大米和燕麦一起煮",
      "蔬菜"
    ]
  },
  {
    "id": "r55",
    "name": "香菇滑鸡 · 杂粮饭 · 炒小白菜",
    "tip": "鸡腿肉和香菇蒸 20 分钟",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "蛋白质"
    ],
    "avoidTags": [
      "荤"
    ],
    "ingredients": [
      {
        "name": "鸡腿肉",
        "amount": "150g",
        "category": "肉禽"
      },
      {
        "name": "小白菜",
        "amount": "200g",
        "category": "蔬菜"
      },
      {
        "name": "大米",
        "amount": "50g",
        "category": "主食"
      },
      {
        "name": "糙米",
        "amount": "30g",
        "category": "主食"
      }
    ],
    "steps": [
      "鸡腿肉和香菇蒸 20 分钟",
      "大米和糙米一起煮",
      "蔬菜"
    ]
  },
  {
    "id": "r56",
    "name": "香菇滑鸡 · 二米饭 · 炒小白菜",
    "tip": "鸡腿肉和香菇蒸 20 分钟",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "蛋白质"
    ],
    "avoidTags": [
      "荤"
    ],
    "ingredients": [
      {
        "name": "鸡腿肉",
        "amount": "150g",
        "category": "肉禽"
      },
      {
        "name": "小白菜",
        "amount": "200g",
        "category": "蔬菜"
      },
      {
        "name": "大米",
        "amount": "50g",
        "category": "主食"
      },
      {
        "name": "小米",
        "amount": "30g",
        "category": "主食"
      }
    ],
    "steps": [
      "鸡腿肉和香菇蒸 20 分钟",
      "大米小米混合煮饭",
      "蔬菜"
    ]
  },
  {
    "id": "r57",
    "name": "香菇滑鸡 · 燕麦饭 · 炒小白菜",
    "tip": "鸡腿肉和香菇蒸 20 分钟",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "蛋白质"
    ],
    "avoidTags": [
      "荤"
    ],
    "ingredients": [
      {
        "name": "鸡腿肉",
        "amount": "150g",
        "category": "肉禽"
      },
      {
        "name": "小白菜",
        "amount": "200g",
        "category": "蔬菜"
      },
      {
        "name": "大米",
        "amount": "40g",
        "category": "主食"
      },
      {
        "name": "燕麦",
        "amount": "30g",
        "category": "主食"
      }
    ],
    "steps": [
      "鸡腿肉和香菇蒸 20 分钟",
      "大米和燕麦一起煮",
      "蔬菜"
    ]
  },
  {
    "id": "r58",
    "name": "清炒虾仁 · 杂粮饭 · 蒜蓉西兰花",
    "tip": "虾仁炒至变色卷曲",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "蛋白质",
      "补钙"
    ],
    "avoidTags": [
      "海鲜",
      "荤"
    ],
    "ingredients": [
      {
        "name": "虾仁",
        "amount": "120g",
        "category": "水产"
      },
      {
        "name": "西兰花",
        "amount": "150g",
        "category": "蔬菜"
      },
      {
        "name": "大米",
        "amount": "50g",
        "category": "主食"
      },
      {
        "name": "糙米",
        "amount": "30g",
        "category": "主食"
      }
    ],
    "steps": [
      "虾仁炒至变色卷曲",
      "大米和糙米一起煮",
      "蔬菜"
    ]
  },
  {
    "id": "r59",
    "name": "清炒虾仁 · 二米饭 · 蒜蓉西兰花",
    "tip": "虾仁炒至变色卷曲",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "蛋白质",
      "补钙"
    ],
    "avoidTags": [
      "海鲜",
      "荤"
    ],
    "ingredients": [
      {
        "name": "虾仁",
        "amount": "120g",
        "category": "水产"
      },
      {
        "name": "西兰花",
        "amount": "150g",
        "category": "蔬菜"
      },
      {
        "name": "大米",
        "amount": "50g",
        "category": "主食"
      },
      {
        "name": "小米",
        "amount": "30g",
        "category": "主食"
      }
    ],
    "steps": [
      "虾仁炒至变色卷曲",
      "大米小米混合煮饭",
      "蔬菜"
    ]
  },
  {
    "id": "r60",
    "name": "清炒虾仁 · 燕麦饭 · 蒜蓉西兰花",
    "tip": "虾仁炒至变色卷曲",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "蛋白质",
      "补钙"
    ],
    "avoidTags": [
      "海鲜",
      "荤"
    ],
    "ingredients": [
      {
        "name": "虾仁",
        "amount": "120g",
        "category": "水产"
      },
      {
        "name": "西兰花",
        "amount": "150g",
        "category": "蔬菜"
      },
      {
        "name": "大米",
        "amount": "40g",
        "category": "主食"
      },
      {
        "name": "燕麦",
        "amount": "30g",
        "category": "主食"
      }
    ],
    "steps": [
      "虾仁炒至变色卷曲",
      "大米和燕麦一起煮",
      "蔬菜"
    ]
  },
  {
    "id": "r61",
    "name": "清炒虾仁 · 杂粮饭 · 清炒菠菜",
    "tip": "虾仁炒至变色卷曲",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "蛋白质",
      "补钙",
      "叶酸"
    ],
    "avoidTags": [
      "海鲜",
      "荤"
    ],
    "ingredients": [
      {
        "name": "虾仁",
        "amount": "120g",
        "category": "水产"
      },
      {
        "name": "菠菜",
        "amount": "200g",
        "category": "蔬菜"
      },
      {
        "name": "大米",
        "amount": "50g",
        "category": "主食"
      },
      {
        "name": "糙米",
        "amount": "30g",
        "category": "主食"
      }
    ],
    "steps": [
      "虾仁炒至变色卷曲",
      "大米和糙米一起煮",
      "蔬菜"
    ]
  },
  {
    "id": "r62",
    "name": "清炒虾仁 · 二米饭 · 清炒菠菜",
    "tip": "虾仁炒至变色卷曲",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "蛋白质",
      "补钙",
      "叶酸"
    ],
    "avoidTags": [
      "海鲜",
      "荤"
    ],
    "ingredients": [
      {
        "name": "虾仁",
        "amount": "120g",
        "category": "水产"
      },
      {
        "name": "菠菜",
        "amount": "200g",
        "category": "蔬菜"
      },
      {
        "name": "大米",
        "amount": "50g",
        "category": "主食"
      },
      {
        "name": "小米",
        "amount": "30g",
        "category": "主食"
      }
    ],
    "steps": [
      "虾仁炒至变色卷曲",
      "大米小米混合煮饭",
      "蔬菜"
    ]
  },
  {
    "id": "r63",
    "name": "清炒虾仁 · 燕麦饭 · 清炒菠菜",
    "tip": "虾仁炒至变色卷曲",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "蛋白质",
      "补钙",
      "叶酸"
    ],
    "avoidTags": [
      "海鲜",
      "荤"
    ],
    "ingredients": [
      {
        "name": "虾仁",
        "amount": "120g",
        "category": "水产"
      },
      {
        "name": "菠菜",
        "amount": "200g",
        "category": "蔬菜"
      },
      {
        "name": "大米",
        "amount": "40g",
        "category": "主食"
      },
      {
        "name": "燕麦",
        "amount": "30g",
        "category": "主食"
      }
    ],
    "steps": [
      "虾仁炒至变色卷曲",
      "大米和燕麦一起煮",
      "蔬菜"
    ]
  },
  {
    "id": "r64",
    "name": "清炒虾仁 · 杂粮饭 · 清炒油麦菜",
    "tip": "虾仁炒至变色卷曲",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "蛋白质",
      "补钙"
    ],
    "avoidTags": [
      "海鲜",
      "荤"
    ],
    "ingredients": [
      {
        "name": "虾仁",
        "amount": "120g",
        "category": "水产"
      },
      {
        "name": "油麦菜",
        "amount": "200g",
        "category": "蔬菜"
      },
      {
        "name": "大米",
        "amount": "50g",
        "category": "主食"
      },
      {
        "name": "糙米",
        "amount": "30g",
        "category": "主食"
      }
    ],
    "steps": [
      "虾仁炒至变色卷曲",
      "大米和糙米一起煮",
      "蔬菜"
    ]
  },
  {
    "id": "r65",
    "name": "清炒虾仁 · 二米饭 · 清炒油麦菜",
    "tip": "虾仁炒至变色卷曲",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "蛋白质",
      "补钙"
    ],
    "avoidTags": [
      "海鲜",
      "荤"
    ],
    "ingredients": [
      {
        "name": "虾仁",
        "amount": "120g",
        "category": "水产"
      },
      {
        "name": "油麦菜",
        "amount": "200g",
        "category": "蔬菜"
      },
      {
        "name": "大米",
        "amount": "50g",
        "category": "主食"
      },
      {
        "name": "小米",
        "amount": "30g",
        "category": "主食"
      }
    ],
    "steps": [
      "虾仁炒至变色卷曲",
      "大米小米混合煮饭",
      "蔬菜"
    ]
  },
  {
    "id": "r66",
    "name": "清炒虾仁 · 燕麦饭 · 清炒油麦菜",
    "tip": "虾仁炒至变色卷曲",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "蛋白质",
      "补钙"
    ],
    "avoidTags": [
      "海鲜",
      "荤"
    ],
    "ingredients": [
      {
        "name": "虾仁",
        "amount": "120g",
        "category": "水产"
      },
      {
        "name": "油麦菜",
        "amount": "200g",
        "category": "蔬菜"
      },
      {
        "name": "大米",
        "amount": "40g",
        "category": "主食"
      },
      {
        "name": "燕麦",
        "amount": "30g",
        "category": "主食"
      }
    ],
    "steps": [
      "虾仁炒至变色卷曲",
      "大米和燕麦一起煮",
      "蔬菜"
    ]
  },
  {
    "id": "r67",
    "name": "清炒虾仁 · 杂粮饭 · 凉拌海带丝",
    "tip": "虾仁炒至变色卷曲",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "蛋白质",
      "补钙",
      "补碘"
    ],
    "avoidTags": [
      "海鲜",
      "荤"
    ],
    "ingredients": [
      {
        "name": "虾仁",
        "amount": "120g",
        "category": "水产"
      },
      {
        "name": "海带丝",
        "amount": "100g",
        "category": "蔬菜"
      },
      {
        "name": "大米",
        "amount": "50g",
        "category": "主食"
      },
      {
        "name": "糙米",
        "amount": "30g",
        "category": "主食"
      }
    ],
    "steps": [
      "虾仁炒至变色卷曲",
      "大米和糙米一起煮",
      "蔬菜"
    ]
  },
  {
    "id": "r68",
    "name": "清炒虾仁 · 二米饭 · 凉拌海带丝",
    "tip": "虾仁炒至变色卷曲",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "蛋白质",
      "补钙",
      "补碘"
    ],
    "avoidTags": [
      "海鲜",
      "荤"
    ],
    "ingredients": [
      {
        "name": "虾仁",
        "amount": "120g",
        "category": "水产"
      },
      {
        "name": "海带丝",
        "amount": "100g",
        "category": "蔬菜"
      },
      {
        "name": "大米",
        "amount": "50g",
        "category": "主食"
      },
      {
        "name": "小米",
        "amount": "30g",
        "category": "主食"
      }
    ],
    "steps": [
      "虾仁炒至变色卷曲",
      "大米小米混合煮饭",
      "蔬菜"
    ]
  },
  {
    "id": "r69",
    "name": "清炒虾仁 · 燕麦饭 · 凉拌海带丝",
    "tip": "虾仁炒至变色卷曲",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "蛋白质",
      "补钙",
      "补碘"
    ],
    "avoidTags": [
      "海鲜",
      "荤"
    ],
    "ingredients": [
      {
        "name": "虾仁",
        "amount": "120g",
        "category": "水产"
      },
      {
        "name": "海带丝",
        "amount": "100g",
        "category": "蔬菜"
      },
      {
        "name": "大米",
        "amount": "40g",
        "category": "主食"
      },
      {
        "name": "燕麦",
        "amount": "30g",
        "category": "主食"
      }
    ],
    "steps": [
      "虾仁炒至变色卷曲",
      "大米和燕麦一起煮",
      "蔬菜"
    ]
  },
  {
    "id": "r70",
    "name": "清炒虾仁 · 杂粮饭 · 炒小白菜",
    "tip": "虾仁炒至变色卷曲",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "蛋白质",
      "补钙"
    ],
    "avoidTags": [
      "海鲜",
      "荤"
    ],
    "ingredients": [
      {
        "name": "虾仁",
        "amount": "120g",
        "category": "水产"
      },
      {
        "name": "小白菜",
        "amount": "200g",
        "category": "蔬菜"
      },
      {
        "name": "大米",
        "amount": "50g",
        "category": "主食"
      },
      {
        "name": "糙米",
        "amount": "30g",
        "category": "主食"
      }
    ],
    "steps": [
      "虾仁炒至变色卷曲",
      "大米和糙米一起煮",
      "蔬菜"
    ]
  },
  {
    "id": "r71",
    "name": "清炒虾仁 · 二米饭 · 炒小白菜",
    "tip": "虾仁炒至变色卷曲",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "蛋白质",
      "补钙"
    ],
    "avoidTags": [
      "海鲜",
      "荤"
    ],
    "ingredients": [
      {
        "name": "虾仁",
        "amount": "120g",
        "category": "水产"
      },
      {
        "name": "小白菜",
        "amount": "200g",
        "category": "蔬菜"
      },
      {
        "name": "大米",
        "amount": "50g",
        "category": "主食"
      },
      {
        "name": "小米",
        "amount": "30g",
        "category": "主食"
      }
    ],
    "steps": [
      "虾仁炒至变色卷曲",
      "大米小米混合煮饭",
      "蔬菜"
    ]
  },
  {
    "id": "r72",
    "name": "清炒虾仁 · 燕麦饭 · 炒小白菜",
    "tip": "虾仁炒至变色卷曲",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "蛋白质",
      "补钙"
    ],
    "avoidTags": [
      "海鲜",
      "荤"
    ],
    "ingredients": [
      {
        "name": "虾仁",
        "amount": "120g",
        "category": "水产"
      },
      {
        "name": "小白菜",
        "amount": "200g",
        "category": "蔬菜"
      },
      {
        "name": "大米",
        "amount": "40g",
        "category": "主食"
      },
      {
        "name": "燕麦",
        "amount": "30g",
        "category": "主食"
      }
    ],
    "steps": [
      "虾仁炒至变色卷曲",
      "大米和燕麦一起煮",
      "蔬菜"
    ]
  },
  {
    "id": "r73",
    "name": "清蒸鲈鱼 · 杂粮饭 · 蒜蓉西兰花",
    "tip": "鲈鱼铺姜片，水开后蒸 8 分钟",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "DHA",
      "蛋白质"
    ],
    "avoidTags": [
      "海鲜",
      "荤"
    ],
    "ingredients": [
      {
        "name": "鲈鱼",
        "amount": "1 条",
        "category": "水产"
      },
      {
        "name": "西兰花",
        "amount": "150g",
        "category": "蔬菜"
      },
      {
        "name": "大米",
        "amount": "50g",
        "category": "主食"
      },
      {
        "name": "糙米",
        "amount": "30g",
        "category": "主食"
      }
    ],
    "steps": [
      "鲈鱼铺姜片，水开后蒸 8 分钟",
      "大米和糙米一起煮",
      "蔬菜"
    ]
  },
  {
    "id": "r74",
    "name": "清蒸鲈鱼 · 二米饭 · 蒜蓉西兰花",
    "tip": "鲈鱼铺姜片，水开后蒸 8 分钟",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "DHA",
      "蛋白质"
    ],
    "avoidTags": [
      "海鲜",
      "荤"
    ],
    "ingredients": [
      {
        "name": "鲈鱼",
        "amount": "1 条",
        "category": "水产"
      },
      {
        "name": "西兰花",
        "amount": "150g",
        "category": "蔬菜"
      },
      {
        "name": "大米",
        "amount": "50g",
        "category": "主食"
      },
      {
        "name": "小米",
        "amount": "30g",
        "category": "主食"
      }
    ],
    "steps": [
      "鲈鱼铺姜片，水开后蒸 8 分钟",
      "大米小米混合煮饭",
      "蔬菜"
    ]
  },
  {
    "id": "r75",
    "name": "清蒸鲈鱼 · 燕麦饭 · 蒜蓉西兰花",
    "tip": "鲈鱼铺姜片，水开后蒸 8 分钟",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "DHA",
      "蛋白质"
    ],
    "avoidTags": [
      "海鲜",
      "荤"
    ],
    "ingredients": [
      {
        "name": "鲈鱼",
        "amount": "1 条",
        "category": "水产"
      },
      {
        "name": "西兰花",
        "amount": "150g",
        "category": "蔬菜"
      },
      {
        "name": "大米",
        "amount": "40g",
        "category": "主食"
      },
      {
        "name": "燕麦",
        "amount": "30g",
        "category": "主食"
      }
    ],
    "steps": [
      "鲈鱼铺姜片，水开后蒸 8 分钟",
      "大米和燕麦一起煮",
      "蔬菜"
    ]
  },
  {
    "id": "r76",
    "name": "清蒸鲈鱼 · 杂粮饭 · 清炒菠菜",
    "tip": "鲈鱼铺姜片，水开后蒸 8 分钟",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "DHA",
      "蛋白质",
      "叶酸"
    ],
    "avoidTags": [
      "海鲜",
      "荤"
    ],
    "ingredients": [
      {
        "name": "鲈鱼",
        "amount": "1 条",
        "category": "水产"
      },
      {
        "name": "菠菜",
        "amount": "200g",
        "category": "蔬菜"
      },
      {
        "name": "大米",
        "amount": "50g",
        "category": "主食"
      },
      {
        "name": "糙米",
        "amount": "30g",
        "category": "主食"
      }
    ],
    "steps": [
      "鲈鱼铺姜片，水开后蒸 8 分钟",
      "大米和糙米一起煮",
      "蔬菜"
    ]
  },
  {
    "id": "r77",
    "name": "清蒸鲈鱼 · 二米饭 · 清炒菠菜",
    "tip": "鲈鱼铺姜片，水开后蒸 8 分钟",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "DHA",
      "蛋白质",
      "叶酸"
    ],
    "avoidTags": [
      "海鲜",
      "荤"
    ],
    "ingredients": [
      {
        "name": "鲈鱼",
        "amount": "1 条",
        "category": "水产"
      },
      {
        "name": "菠菜",
        "amount": "200g",
        "category": "蔬菜"
      },
      {
        "name": "大米",
        "amount": "50g",
        "category": "主食"
      },
      {
        "name": "小米",
        "amount": "30g",
        "category": "主食"
      }
    ],
    "steps": [
      "鲈鱼铺姜片，水开后蒸 8 分钟",
      "大米小米混合煮饭",
      "蔬菜"
    ]
  },
  {
    "id": "r78",
    "name": "清蒸鲈鱼 · 燕麦饭 · 清炒菠菜",
    "tip": "鲈鱼铺姜片，水开后蒸 8 分钟",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "DHA",
      "蛋白质",
      "叶酸"
    ],
    "avoidTags": [
      "海鲜",
      "荤"
    ],
    "ingredients": [
      {
        "name": "鲈鱼",
        "amount": "1 条",
        "category": "水产"
      },
      {
        "name": "菠菜",
        "amount": "200g",
        "category": "蔬菜"
      },
      {
        "name": "大米",
        "amount": "40g",
        "category": "主食"
      },
      {
        "name": "燕麦",
        "amount": "30g",
        "category": "主食"
      }
    ],
    "steps": [
      "鲈鱼铺姜片，水开后蒸 8 分钟",
      "大米和燕麦一起煮",
      "蔬菜"
    ]
  },
  {
    "id": "r79",
    "name": "清蒸鲈鱼 · 杂粮饭 · 清炒油麦菜",
    "tip": "鲈鱼铺姜片，水开后蒸 8 分钟",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "DHA",
      "蛋白质"
    ],
    "avoidTags": [
      "海鲜",
      "荤"
    ],
    "ingredients": [
      {
        "name": "鲈鱼",
        "amount": "1 条",
        "category": "水产"
      },
      {
        "name": "油麦菜",
        "amount": "200g",
        "category": "蔬菜"
      },
      {
        "name": "大米",
        "amount": "50g",
        "category": "主食"
      },
      {
        "name": "糙米",
        "amount": "30g",
        "category": "主食"
      }
    ],
    "steps": [
      "鲈鱼铺姜片，水开后蒸 8 分钟",
      "大米和糙米一起煮",
      "蔬菜"
    ]
  },
  {
    "id": "r80",
    "name": "清蒸鲈鱼 · 二米饭 · 清炒油麦菜",
    "tip": "鲈鱼铺姜片，水开后蒸 8 分钟",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "DHA",
      "蛋白质"
    ],
    "avoidTags": [
      "海鲜",
      "荤"
    ],
    "ingredients": [
      {
        "name": "鲈鱼",
        "amount": "1 条",
        "category": "水产"
      },
      {
        "name": "油麦菜",
        "amount": "200g",
        "category": "蔬菜"
      },
      {
        "name": "大米",
        "amount": "50g",
        "category": "主食"
      },
      {
        "name": "小米",
        "amount": "30g",
        "category": "主食"
      }
    ],
    "steps": [
      "鲈鱼铺姜片，水开后蒸 8 分钟",
      "大米小米混合煮饭",
      "蔬菜"
    ]
  },
  {
    "id": "r81",
    "name": "清蒸鲈鱼 · 燕麦饭 · 清炒油麦菜",
    "tip": "鲈鱼铺姜片，水开后蒸 8 分钟",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "DHA",
      "蛋白质"
    ],
    "avoidTags": [
      "海鲜",
      "荤"
    ],
    "ingredients": [
      {
        "name": "鲈鱼",
        "amount": "1 条",
        "category": "水产"
      },
      {
        "name": "油麦菜",
        "amount": "200g",
        "category": "蔬菜"
      },
      {
        "name": "大米",
        "amount": "40g",
        "category": "主食"
      },
      {
        "name": "燕麦",
        "amount": "30g",
        "category": "主食"
      }
    ],
    "steps": [
      "鲈鱼铺姜片，水开后蒸 8 分钟",
      "大米和燕麦一起煮",
      "蔬菜"
    ]
  },
  {
    "id": "r82",
    "name": "清蒸鲈鱼 · 杂粮饭 · 凉拌海带丝",
    "tip": "鲈鱼铺姜片，水开后蒸 8 分钟",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "DHA",
      "蛋白质",
      "补碘"
    ],
    "avoidTags": [
      "海鲜",
      "荤"
    ],
    "ingredients": [
      {
        "name": "鲈鱼",
        "amount": "1 条",
        "category": "水产"
      },
      {
        "name": "海带丝",
        "amount": "100g",
        "category": "蔬菜"
      },
      {
        "name": "大米",
        "amount": "50g",
        "category": "主食"
      },
      {
        "name": "糙米",
        "amount": "30g",
        "category": "主食"
      }
    ],
    "steps": [
      "鲈鱼铺姜片，水开后蒸 8 分钟",
      "大米和糙米一起煮",
      "蔬菜"
    ]
  },
  {
    "id": "r83",
    "name": "清蒸鲈鱼 · 二米饭 · 凉拌海带丝",
    "tip": "鲈鱼铺姜片，水开后蒸 8 分钟",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "DHA",
      "蛋白质",
      "补碘"
    ],
    "avoidTags": [
      "海鲜",
      "荤"
    ],
    "ingredients": [
      {
        "name": "鲈鱼",
        "amount": "1 条",
        "category": "水产"
      },
      {
        "name": "海带丝",
        "amount": "100g",
        "category": "蔬菜"
      },
      {
        "name": "大米",
        "amount": "50g",
        "category": "主食"
      },
      {
        "name": "小米",
        "amount": "30g",
        "category": "主食"
      }
    ],
    "steps": [
      "鲈鱼铺姜片，水开后蒸 8 分钟",
      "大米小米混合煮饭",
      "蔬菜"
    ]
  },
  {
    "id": "r84",
    "name": "清蒸鲈鱼 · 燕麦饭 · 凉拌海带丝",
    "tip": "鲈鱼铺姜片，水开后蒸 8 分钟",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "DHA",
      "蛋白质",
      "补碘"
    ],
    "avoidTags": [
      "海鲜",
      "荤"
    ],
    "ingredients": [
      {
        "name": "鲈鱼",
        "amount": "1 条",
        "category": "水产"
      },
      {
        "name": "海带丝",
        "amount": "100g",
        "category": "蔬菜"
      },
      {
        "name": "大米",
        "amount": "40g",
        "category": "主食"
      },
      {
        "name": "燕麦",
        "amount": "30g",
        "category": "主食"
      }
    ],
    "steps": [
      "鲈鱼铺姜片，水开后蒸 8 分钟",
      "大米和燕麦一起煮",
      "蔬菜"
    ]
  },
  {
    "id": "r85",
    "name": "清蒸鲈鱼 · 杂粮饭 · 炒小白菜",
    "tip": "鲈鱼铺姜片，水开后蒸 8 分钟",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "DHA",
      "蛋白质"
    ],
    "avoidTags": [
      "海鲜",
      "荤"
    ],
    "ingredients": [
      {
        "name": "鲈鱼",
        "amount": "1 条",
        "category": "水产"
      },
      {
        "name": "小白菜",
        "amount": "200g",
        "category": "蔬菜"
      },
      {
        "name": "大米",
        "amount": "50g",
        "category": "主食"
      },
      {
        "name": "糙米",
        "amount": "30g",
        "category": "主食"
      }
    ],
    "steps": [
      "鲈鱼铺姜片，水开后蒸 8 分钟",
      "大米和糙米一起煮",
      "蔬菜"
    ]
  },
  {
    "id": "r86",
    "name": "清蒸鲈鱼 · 二米饭 · 炒小白菜",
    "tip": "鲈鱼铺姜片，水开后蒸 8 分钟",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "DHA",
      "蛋白质"
    ],
    "avoidTags": [
      "海鲜",
      "荤"
    ],
    "ingredients": [
      {
        "name": "鲈鱼",
        "amount": "1 条",
        "category": "水产"
      },
      {
        "name": "小白菜",
        "amount": "200g",
        "category": "蔬菜"
      },
      {
        "name": "大米",
        "amount": "50g",
        "category": "主食"
      },
      {
        "name": "小米",
        "amount": "30g",
        "category": "主食"
      }
    ],
    "steps": [
      "鲈鱼铺姜片，水开后蒸 8 分钟",
      "大米小米混合煮饭",
      "蔬菜"
    ]
  },
  {
    "id": "r87",
    "name": "清蒸鲈鱼 · 燕麦饭 · 炒小白菜",
    "tip": "鲈鱼铺姜片，水开后蒸 8 分钟",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "DHA",
      "蛋白质"
    ],
    "avoidTags": [
      "海鲜",
      "荤"
    ],
    "ingredients": [
      {
        "name": "鲈鱼",
        "amount": "1 条",
        "category": "水产"
      },
      {
        "name": "小白菜",
        "amount": "200g",
        "category": "蔬菜"
      },
      {
        "name": "大米",
        "amount": "40g",
        "category": "主食"
      },
      {
        "name": "燕麦",
        "amount": "30g",
        "category": "主食"
      }
    ],
    "steps": [
      "鲈鱼铺姜片，水开后蒸 8 分钟",
      "大米和燕麦一起煮",
      "蔬菜"
    ]
  },
  {
    "id": "r88",
    "name": "芹菜炒瘦肉 · 杂粮饭 · 蒜蓉西兰花",
    "tip": "瘦肉滑炒后加入芹菜",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "补铁"
    ],
    "avoidTags": [
      "猪肉",
      "荤"
    ],
    "ingredients": [
      {
        "name": "猪里脊",
        "amount": "120g",
        "category": "肉禽"
      },
      {
        "name": "西兰花",
        "amount": "150g",
        "category": "蔬菜"
      },
      {
        "name": "大米",
        "amount": "50g",
        "category": "主食"
      },
      {
        "name": "糙米",
        "amount": "30g",
        "category": "主食"
      }
    ],
    "steps": [
      "瘦肉滑炒后加入芹菜",
      "大米和糙米一起煮",
      "蔬菜"
    ]
  },
  {
    "id": "r89",
    "name": "芹菜炒瘦肉 · 二米饭 · 蒜蓉西兰花",
    "tip": "瘦肉滑炒后加入芹菜",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "补铁"
    ],
    "avoidTags": [
      "猪肉",
      "荤"
    ],
    "ingredients": [
      {
        "name": "猪里脊",
        "amount": "120g",
        "category": "肉禽"
      },
      {
        "name": "西兰花",
        "amount": "150g",
        "category": "蔬菜"
      },
      {
        "name": "大米",
        "amount": "50g",
        "category": "主食"
      },
      {
        "name": "小米",
        "amount": "30g",
        "category": "主食"
      }
    ],
    "steps": [
      "瘦肉滑炒后加入芹菜",
      "大米小米混合煮饭",
      "蔬菜"
    ]
  },
  {
    "id": "r90",
    "name": "芹菜炒瘦肉 · 燕麦饭 · 蒜蓉西兰花",
    "tip": "瘦肉滑炒后加入芹菜",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "补铁"
    ],
    "avoidTags": [
      "猪肉",
      "荤"
    ],
    "ingredients": [
      {
        "name": "猪里脊",
        "amount": "120g",
        "category": "肉禽"
      },
      {
        "name": "西兰花",
        "amount": "150g",
        "category": "蔬菜"
      },
      {
        "name": "大米",
        "amount": "40g",
        "category": "主食"
      },
      {
        "name": "燕麦",
        "amount": "30g",
        "category": "主食"
      }
    ],
    "steps": [
      "瘦肉滑炒后加入芹菜",
      "大米和燕麦一起煮",
      "蔬菜"
    ]
  },
  {
    "id": "r91",
    "name": "芹菜炒瘦肉 · 杂粮饭 · 清炒菠菜",
    "tip": "瘦肉滑炒后加入芹菜",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "补铁",
      "叶酸"
    ],
    "avoidTags": [
      "猪肉",
      "荤"
    ],
    "ingredients": [
      {
        "name": "猪里脊",
        "amount": "120g",
        "category": "肉禽"
      },
      {
        "name": "菠菜",
        "amount": "200g",
        "category": "蔬菜"
      },
      {
        "name": "大米",
        "amount": "50g",
        "category": "主食"
      },
      {
        "name": "糙米",
        "amount": "30g",
        "category": "主食"
      }
    ],
    "steps": [
      "瘦肉滑炒后加入芹菜",
      "大米和糙米一起煮",
      "蔬菜"
    ]
  },
  {
    "id": "r92",
    "name": "芹菜炒瘦肉 · 二米饭 · 清炒菠菜",
    "tip": "瘦肉滑炒后加入芹菜",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "补铁",
      "叶酸"
    ],
    "avoidTags": [
      "猪肉",
      "荤"
    ],
    "ingredients": [
      {
        "name": "猪里脊",
        "amount": "120g",
        "category": "肉禽"
      },
      {
        "name": "菠菜",
        "amount": "200g",
        "category": "蔬菜"
      },
      {
        "name": "大米",
        "amount": "50g",
        "category": "主食"
      },
      {
        "name": "小米",
        "amount": "30g",
        "category": "主食"
      }
    ],
    "steps": [
      "瘦肉滑炒后加入芹菜",
      "大米小米混合煮饭",
      "蔬菜"
    ]
  },
  {
    "id": "r93",
    "name": "芹菜炒瘦肉 · 燕麦饭 · 清炒菠菜",
    "tip": "瘦肉滑炒后加入芹菜",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "补铁",
      "叶酸"
    ],
    "avoidTags": [
      "猪肉",
      "荤"
    ],
    "ingredients": [
      {
        "name": "猪里脊",
        "amount": "120g",
        "category": "肉禽"
      },
      {
        "name": "菠菜",
        "amount": "200g",
        "category": "蔬菜"
      },
      {
        "name": "大米",
        "amount": "40g",
        "category": "主食"
      },
      {
        "name": "燕麦",
        "amount": "30g",
        "category": "主食"
      }
    ],
    "steps": [
      "瘦肉滑炒后加入芹菜",
      "大米和燕麦一起煮",
      "蔬菜"
    ]
  },
  {
    "id": "r94",
    "name": "芹菜炒瘦肉 · 杂粮饭 · 清炒油麦菜",
    "tip": "瘦肉滑炒后加入芹菜",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "补铁"
    ],
    "avoidTags": [
      "猪肉",
      "荤"
    ],
    "ingredients": [
      {
        "name": "猪里脊",
        "amount": "120g",
        "category": "肉禽"
      },
      {
        "name": "油麦菜",
        "amount": "200g",
        "category": "蔬菜"
      },
      {
        "name": "大米",
        "amount": "50g",
        "category": "主食"
      },
      {
        "name": "糙米",
        "amount": "30g",
        "category": "主食"
      }
    ],
    "steps": [
      "瘦肉滑炒后加入芹菜",
      "大米和糙米一起煮",
      "蔬菜"
    ]
  },
  {
    "id": "r95",
    "name": "芹菜炒瘦肉 · 二米饭 · 清炒油麦菜",
    "tip": "瘦肉滑炒后加入芹菜",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "补铁"
    ],
    "avoidTags": [
      "猪肉",
      "荤"
    ],
    "ingredients": [
      {
        "name": "猪里脊",
        "amount": "120g",
        "category": "肉禽"
      },
      {
        "name": "油麦菜",
        "amount": "200g",
        "category": "蔬菜"
      },
      {
        "name": "大米",
        "amount": "50g",
        "category": "主食"
      },
      {
        "name": "小米",
        "amount": "30g",
        "category": "主食"
      }
    ],
    "steps": [
      "瘦肉滑炒后加入芹菜",
      "大米小米混合煮饭",
      "蔬菜"
    ]
  },
  {
    "id": "r96",
    "name": "芹菜炒瘦肉 · 燕麦饭 · 清炒油麦菜",
    "tip": "瘦肉滑炒后加入芹菜",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "补铁"
    ],
    "avoidTags": [
      "猪肉",
      "荤"
    ],
    "ingredients": [
      {
        "name": "猪里脊",
        "amount": "120g",
        "category": "肉禽"
      },
      {
        "name": "油麦菜",
        "amount": "200g",
        "category": "蔬菜"
      },
      {
        "name": "大米",
        "amount": "40g",
        "category": "主食"
      },
      {
        "name": "燕麦",
        "amount": "30g",
        "category": "主食"
      }
    ],
    "steps": [
      "瘦肉滑炒后加入芹菜",
      "大米和燕麦一起煮",
      "蔬菜"
    ]
  },
  {
    "id": "r97",
    "name": "芹菜炒瘦肉 · 杂粮饭 · 凉拌海带丝",
    "tip": "瘦肉滑炒后加入芹菜",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "补铁",
      "补碘"
    ],
    "avoidTags": [
      "猪肉",
      "荤"
    ],
    "ingredients": [
      {
        "name": "猪里脊",
        "amount": "120g",
        "category": "肉禽"
      },
      {
        "name": "海带丝",
        "amount": "100g",
        "category": "蔬菜"
      },
      {
        "name": "大米",
        "amount": "50g",
        "category": "主食"
      },
      {
        "name": "糙米",
        "amount": "30g",
        "category": "主食"
      }
    ],
    "steps": [
      "瘦肉滑炒后加入芹菜",
      "大米和糙米一起煮",
      "蔬菜"
    ]
  },
  {
    "id": "r98",
    "name": "芹菜炒瘦肉 · 二米饭 · 凉拌海带丝",
    "tip": "瘦肉滑炒后加入芹菜",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "补铁",
      "补碘"
    ],
    "avoidTags": [
      "猪肉",
      "荤"
    ],
    "ingredients": [
      {
        "name": "猪里脊",
        "amount": "120g",
        "category": "肉禽"
      },
      {
        "name": "海带丝",
        "amount": "100g",
        "category": "蔬菜"
      },
      {
        "name": "大米",
        "amount": "50g",
        "category": "主食"
      },
      {
        "name": "小米",
        "amount": "30g",
        "category": "主食"
      }
    ],
    "steps": [
      "瘦肉滑炒后加入芹菜",
      "大米小米混合煮饭",
      "蔬菜"
    ]
  },
  {
    "id": "r99",
    "name": "芹菜炒瘦肉 · 燕麦饭 · 凉拌海带丝",
    "tip": "瘦肉滑炒后加入芹菜",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "补铁",
      "补碘"
    ],
    "avoidTags": [
      "猪肉",
      "荤"
    ],
    "ingredients": [
      {
        "name": "猪里脊",
        "amount": "120g",
        "category": "肉禽"
      },
      {
        "name": "海带丝",
        "amount": "100g",
        "category": "蔬菜"
      },
      {
        "name": "大米",
        "amount": "40g",
        "category": "主食"
      },
      {
        "name": "燕麦",
        "amount": "30g",
        "category": "主食"
      }
    ],
    "steps": [
      "瘦肉滑炒后加入芹菜",
      "大米和燕麦一起煮",
      "蔬菜"
    ]
  },
  {
    "id": "r100",
    "name": "白灼虾 · 软米饭 · 炒生菜",
    "tip": "虾做到全熟变红",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      1
    ],
    "tags": [
      "蛋白质",
      "清淡止吐"
    ],
    "avoidTags": [
      "海鲜",
      "荤"
    ],
    "ingredients": [
      {
        "name": "虾",
        "amount": "8 只",
        "category": "水产"
      },
      {
        "name": "大米",
        "amount": "70g",
        "category": "主食"
      },
      {
        "name": "生菜",
        "amount": "150g",
        "category": "蔬菜"
      }
    ],
    "steps": [
      "虾煮至变红卷曲",
      "生菜焯水"
    ]
  },
  {
    "id": "r101",
    "name": "蒸蛋羹 · 白粥 · 焯菠菜",
    "tip": "蛋羹用温水，口感更嫩但仍要蒸熟",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      1
    ],
    "tags": [
      "蛋白质",
      "叶酸",
      "清淡止吐"
    ],
    "avoidTags": [
      "蛋"
    ],
    "ingredients": [
      {
        "name": "鸡蛋",
        "amount": "2 个",
        "category": "蛋奶"
      },
      {
        "name": "大米",
        "amount": "40g",
        "category": "主食"
      },
      {
        "name": "菠菜",
        "amount": "100g",
        "category": "蔬菜"
      }
    ],
    "steps": [
      "蛋液蒸 12 分钟至凝固",
      "菠菜焯水"
    ]
  },
  {
    "id": "r102",
    "name": "豆腐蔬菜汤 · 馒头",
    "tip": "汤清淡，少盐",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      1
    ],
    "tags": [
      "补钙",
      "清淡止吐"
    ],
    "avoidTags": [],
    "ingredients": [
      {
        "name": "北豆腐",
        "amount": "150g",
        "category": "豆制品"
      },
      {
        "name": "小白菜",
        "amount": "100g",
        "category": "蔬菜"
      },
      {
        "name": "馒头",
        "amount": "1 个",
        "category": "主食"
      }
    ],
    "steps": [
      "豆腐和小白菜煮成汤",
      "馒头加热"
    ]
  },
  {
    "id": "r103",
    "name": "番茄豆腐 · 杂粮饭 · 清炒菠菜",
    "tip": "少油少盐，蔬菜做熟再吃",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "叶酸",
      "补钙"
    ],
    "avoidTags": [],
    "ingredients": [
      {
        "name": "北豆腐",
        "amount": "180g",
        "category": "豆制品"
      },
      {
        "name": "番茄",
        "amount": "2 个",
        "category": "蔬菜"
      },
      {
        "name": "菠菜",
        "amount": "150g",
        "category": "蔬菜"
      },
      {
        "name": "大米",
        "amount": "40g",
        "category": "主食"
      },
      {
        "name": "糙米",
        "amount": "30g",
        "category": "主食"
      }
    ],
    "steps": [
      "蛋白质食材做到熟",
      "蔬菜焯水或快炒",
      "主食煮熟后一起吃"
    ]
  },
  {
    "id": "r104",
    "name": "香菇油菜 · 二米饭",
    "tip": "少油少盐，蔬菜做熟再吃",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "补钙",
      "膳食纤维"
    ],
    "avoidTags": [],
    "ingredients": [
      {
        "name": "香菇",
        "amount": "6 朵",
        "category": "蔬菜"
      },
      {
        "name": "油菜",
        "amount": "200g",
        "category": "蔬菜"
      },
      {
        "name": "大米",
        "amount": "50g",
        "category": "主食"
      },
      {
        "name": "小米",
        "amount": "30g",
        "category": "主食"
      }
    ],
    "steps": [
      "蛋白质食材做到熟",
      "蔬菜焯水或快炒",
      "主食煮熟后一起吃"
    ]
  },
  {
    "id": "r105",
    "name": "海带豆腐汤 · 红薯",
    "tip": "少油少盐，蔬菜做熟再吃",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "补钙",
      "补碘"
    ],
    "avoidTags": [],
    "ingredients": [
      {
        "name": "海带",
        "amount": "50g",
        "category": "蔬菜"
      },
      {
        "name": "北豆腐",
        "amount": "150g",
        "category": "豆制品"
      },
      {
        "name": "红薯",
        "amount": "1 个",
        "category": "主食"
      }
    ],
    "steps": [
      "蛋白质食材做到熟",
      "蔬菜焯水或快炒",
      "主食煮熟后一起吃"
    ]
  },
  {
    "id": "r106",
    "name": "白菜炖粉条 · 蒸南瓜",
    "tip": "少油少盐，蔬菜做熟再吃",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "补钙",
      "膳食纤维"
    ],
    "avoidTags": [],
    "ingredients": [
      {
        "name": "白菜",
        "amount": "200g",
        "category": "蔬菜"
      },
      {
        "name": "粉条",
        "amount": "40g",
        "category": "主食"
      },
      {
        "name": "南瓜",
        "amount": "150g",
        "category": "蔬菜"
      }
    ],
    "steps": [
      "蛋白质食材做到熟",
      "蔬菜焯水或快炒",
      "主食煮熟后一起吃"
    ]
  },
  {
    "id": "r107",
    "name": "西兰花炒香干 · 燕麦饭",
    "tip": "少油少盐，蔬菜做熟再吃",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "补钙",
      "膳食纤维"
    ],
    "avoidTags": [],
    "ingredients": [
      {
        "name": "西兰花",
        "amount": "150g",
        "category": "蔬菜"
      },
      {
        "name": "香干",
        "amount": "100g",
        "category": "豆制品"
      },
      {
        "name": "燕麦",
        "amount": "40g",
        "category": "主食"
      },
      {
        "name": "大米",
        "amount": "30g",
        "category": "主食"
      }
    ],
    "steps": [
      "蛋白质食材做到熟",
      "蔬菜焯水或快炒",
      "主食煮熟后一起吃"
    ]
  },
  {
    "id": "r108",
    "name": "番茄鸡蛋 · 软米饭 · 焯菠菜",
    "tip": "少油少盐，蔬菜做熟再吃",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "叶酸",
      "补钙"
    ],
    "avoidTags": [
      "蛋"
    ],
    "ingredients": [
      {
        "name": "番茄",
        "amount": "2 个",
        "category": "蔬菜"
      },
      {
        "name": "鸡蛋",
        "amount": "2 个",
        "category": "蛋奶"
      },
      {
        "name": "菠菜",
        "amount": "100g",
        "category": "蔬菜"
      },
      {
        "name": "大米",
        "amount": "70g",
        "category": "主食"
      }
    ],
    "steps": [
      "蛋白质食材做到熟",
      "蔬菜焯水或快炒",
      "主食煮熟后一起吃"
    ]
  },
  {
    "id": "r109",
    "name": "黄瓜拌豆腐丝 · 杂粮粥",
    "tip": "少油少盐，蔬菜做熟再吃",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      1
    ],
    "tags": [
      "补钙",
      "膳食纤维"
    ],
    "avoidTags": [],
    "ingredients": [
      {
        "name": "黄瓜",
        "amount": "1 根",
        "category": "蔬菜"
      },
      {
        "name": "北豆腐",
        "amount": "150g",
        "category": "豆制品"
      },
      {
        "name": "小米",
        "amount": "40g",
        "category": "主食"
      }
    ],
    "steps": [
      "蛋白质食材做到熟",
      "蔬菜焯水或快炒",
      "主食煮熟后一起吃"
    ]
  },
  {
    "id": "r110",
    "name": "素什锦 · 二米饭",
    "tip": "少油少盐，蔬菜做熟再吃",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "补钙",
      "膳食纤维"
    ],
    "avoidTags": [],
    "ingredients": [
      {
        "name": "胡萝卜",
        "amount": "50g",
        "category": "蔬菜"
      },
      {
        "name": "香菇",
        "amount": "4 朵",
        "category": "蔬菜"
      },
      {
        "name": "北豆腐",
        "amount": "100g",
        "category": "豆制品"
      },
      {
        "name": "大米",
        "amount": "50g",
        "category": "主食"
      },
      {
        "name": "小米",
        "amount": "30g",
        "category": "主食"
      }
    ],
    "steps": [
      "蛋白质食材做到熟",
      "蔬菜焯水或快炒",
      "主食煮熟后一起吃"
    ]
  },
  {
    "id": "r111",
    "name": "菠菜豆腐汤 · 馒头",
    "tip": "少油少盐，蔬菜做熟再吃",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      1,
      2,
      3
    ],
    "tags": [
      "叶酸",
      "补钙"
    ],
    "avoidTags": [],
    "ingredients": [
      {
        "name": "菠菜",
        "amount": "150g",
        "category": "蔬菜"
      },
      {
        "name": "北豆腐",
        "amount": "150g",
        "category": "豆制品"
      },
      {
        "name": "馒头",
        "amount": "1 个",
        "category": "主食"
      }
    ],
    "steps": [
      "蛋白质食材做到熟",
      "蔬菜焯水或快炒",
      "主食煮熟后一起吃"
    ]
  },
  {
    "id": "r112",
    "name": "清炒荷兰豆 · 蒸红薯 · 鸡蛋",
    "tip": "少油少盐，蔬菜做熟再吃",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      2,
      3
    ],
    "tags": [
      "补钙",
      "膳食纤维"
    ],
    "avoidTags": [
      "蛋"
    ],
    "ingredients": [
      {
        "name": "荷兰豆",
        "amount": "150g",
        "category": "蔬菜"
      },
      {
        "name": "红薯",
        "amount": "1 个",
        "category": "主食"
      },
      {
        "name": "鸡蛋",
        "amount": "1 个",
        "category": "蛋奶"
      }
    ],
    "steps": [
      "蛋白质食材做到熟",
      "蔬菜焯水或快炒",
      "主食煮熟后一起吃"
    ]
  },
  {
    "id": "r113",
    "name": "杂蔬鸡胸 · 燕麦饭",
    "tip": "少油，适合糖耐前后",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      2,
      3
    ],
    "tags": [
      "蛋白质",
      "控糖"
    ],
    "avoidTags": [
      "荤"
    ],
    "ingredients": [
      {
        "name": "鸡胸肉",
        "amount": "140g",
        "category": "肉禽"
      },
      {
        "name": "西兰花",
        "amount": "150g",
        "category": "蔬菜"
      },
      {
        "name": "燕麦",
        "amount": "40g",
        "category": "主食"
      },
      {
        "name": "大米",
        "amount": "30g",
        "category": "主食"
      }
    ],
    "steps": [
      "主食提前浸泡后煮熟",
      "蛋白质食材做到全熟",
      "蔬菜少油快炒或焯水"
    ]
  },
  {
    "id": "r114",
    "name": "清蒸鳕鱼 · 糙米饭 · 凉拌黄瓜",
    "tip": "酱汁单独少放",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      2,
      3
    ],
    "tags": [
      "DHA",
      "控糖"
    ],
    "avoidTags": [
      "海鲜",
      "荤"
    ],
    "ingredients": [
      {
        "name": "鳕鱼",
        "amount": "150g",
        "category": "水产"
      },
      {
        "name": "糙米",
        "amount": "70g",
        "category": "主食"
      },
      {
        "name": "黄瓜",
        "amount": "1 根",
        "category": "蔬菜"
      }
    ],
    "steps": [
      "主食提前浸泡后煮熟",
      "蛋白质食材做到全熟",
      "蔬菜少油快炒或焯水"
    ]
  },
  {
    "id": "r115",
    "name": "北豆腐炒青菜 · 杂粮饭",
    "tip": "北豆腐含钙更高",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      2,
      3
    ],
    "tags": [
      "补钙",
      "控糖"
    ],
    "avoidTags": [],
    "ingredients": [
      {
        "name": "北豆腐",
        "amount": "200g",
        "category": "豆制品"
      },
      {
        "name": "油麦菜",
        "amount": "200g",
        "category": "蔬菜"
      },
      {
        "name": "糙米",
        "amount": "40g",
        "category": "主食"
      },
      {
        "name": "大米",
        "amount": "30g",
        "category": "主食"
      }
    ],
    "steps": [
      "主食提前浸泡后煮熟",
      "蛋白质食材做到全熟",
      "蔬菜少油快炒或焯水"
    ]
  },
  {
    "id": "r116",
    "name": "香菇鸡腿 · 二米饭 · 蒜蓉西兰花",
    "tip": "鸡腿去皮",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      2,
      3
    ],
    "tags": [
      "蛋白质",
      "控糖"
    ],
    "avoidTags": [
      "荤"
    ],
    "ingredients": [
      {
        "name": "鸡腿肉",
        "amount": "140g",
        "category": "肉禽"
      },
      {
        "name": "香菇",
        "amount": "5 朵",
        "category": "蔬菜"
      },
      {
        "name": "西兰花",
        "amount": "120g",
        "category": "蔬菜"
      },
      {
        "name": "大米",
        "amount": "40g",
        "category": "主食"
      },
      {
        "name": "小米",
        "amount": "30g",
        "category": "主食"
      }
    ],
    "steps": [
      "主食提前浸泡后煮熟",
      "蛋白质食材做到全熟",
      "蔬菜少油快炒或焯水"
    ]
  },
  {
    "id": "r117",
    "name": "番茄豆腐 · 燕麦饭",
    "tip": "不放糖",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      2,
      3
    ],
    "tags": [
      "补钙",
      "控糖",
      "维C"
    ],
    "avoidTags": [],
    "ingredients": [
      {
        "name": "北豆腐",
        "amount": "180g",
        "category": "豆制品"
      },
      {
        "name": "番茄",
        "amount": "2 个",
        "category": "蔬菜"
      },
      {
        "name": "燕麦",
        "amount": "50g",
        "category": "主食"
      }
    ],
    "steps": [
      "主食提前浸泡后煮熟",
      "蛋白质食材做到全熟",
      "蔬菜少油快炒或焯水"
    ]
  },
  {
    "id": "r118",
    "name": "白灼西兰花虾仁 · 糙米饭",
    "tip": "虾仁煮熟即可",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      2,
      3
    ],
    "tags": [
      "蛋白质",
      "控糖"
    ],
    "avoidTags": [
      "海鲜",
      "荤"
    ],
    "ingredients": [
      {
        "name": "虾仁",
        "amount": "120g",
        "category": "水产"
      },
      {
        "name": "西兰花",
        "amount": "150g",
        "category": "蔬菜"
      },
      {
        "name": "糙米",
        "amount": "70g",
        "category": "主食"
      }
    ],
    "steps": [
      "主食提前浸泡后煮熟",
      "蛋白质食材做到全熟",
      "蔬菜少油快炒或焯水"
    ]
  },
  {
    "id": "r119",
    "name": "菠菜蛋汤 · 杂粮馒头",
    "tip": "菠菜先焯水",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      2,
      3
    ],
    "tags": [
      "叶酸",
      "控糖"
    ],
    "avoidTags": [
      "蛋"
    ],
    "ingredients": [
      {
        "name": "菠菜",
        "amount": "150g",
        "category": "蔬菜"
      },
      {
        "name": "鸡蛋",
        "amount": "1 个",
        "category": "蛋奶"
      },
      {
        "name": "馒头",
        "amount": "1 个",
        "category": "主食"
      },
      {
        "name": "燕麦",
        "amount": "20g",
        "category": "主食"
      }
    ],
    "steps": [
      "主食提前浸泡后煮熟",
      "蛋白质食材做到全熟",
      "蔬菜少油快炒或焯水"
    ]
  },
  {
    "id": "r120",
    "name": "清炒芦笋鸡胸 · 藜麦饭",
    "tip": "少油快炒",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      2,
      3
    ],
    "tags": [
      "蛋白质",
      "控糖"
    ],
    "avoidTags": [
      "荤"
    ],
    "ingredients": [
      {
        "name": "鸡胸肉",
        "amount": "130g",
        "category": "肉禽"
      },
      {
        "name": "芦笋",
        "amount": "150g",
        "category": "蔬菜"
      },
      {
        "name": "大米",
        "amount": "40g",
        "category": "主食"
      },
      {
        "name": "燕麦",
        "amount": "30g",
        "category": "主食"
      }
    ],
    "steps": [
      "主食提前浸泡后煮熟",
      "蛋白质食材做到全熟",
      "蔬菜少油快炒或焯水"
    ]
  },
  {
    "id": "r121",
    "name": "海带豆腐汤 · 红薯",
    "tip": "海带提前泡洗",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      2,
      3
    ],
    "tags": [
      "补碘",
      "补钙",
      "控糖"
    ],
    "avoidTags": [],
    "ingredients": [
      {
        "name": "海带",
        "amount": "50g",
        "category": "蔬菜"
      },
      {
        "name": "北豆腐",
        "amount": "150g",
        "category": "豆制品"
      },
      {
        "name": "红薯",
        "amount": "1 个",
        "category": "主食"
      }
    ],
    "steps": [
      "主食提前浸泡后煮熟",
      "蛋白质食材做到全熟",
      "蔬菜少油快炒或焯水"
    ]
  },
  {
    "id": "r122",
    "name": "彩椒牛肉 · 杂粮饭",
    "tip": "牛肉炒到全熟无粉色",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      2,
      3
    ],
    "tags": [
      "补铁",
      "控糖"
    ],
    "avoidTags": [
      "牛肉",
      "荤"
    ],
    "ingredients": [
      {
        "name": "牛肉",
        "amount": "120g",
        "category": "肉禽"
      },
      {
        "name": "彩椒",
        "amount": "1 个",
        "category": "蔬菜"
      },
      {
        "name": "糙米",
        "amount": "40g",
        "category": "主食"
      },
      {
        "name": "大米",
        "amount": "30g",
        "category": "主食"
      }
    ],
    "steps": [
      "主食提前浸泡后煮熟",
      "蛋白质食材做到全熟",
      "蔬菜少油快炒或焯水"
    ]
  },
  {
    "id": "r123",
    "name": "菌菇豆腐煲 · 二米饭",
    "tip": "菌菇提供鲜味，少放盐",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      2,
      3
    ],
    "tags": [
      "补钙",
      "控糖"
    ],
    "avoidTags": [],
    "ingredients": [
      {
        "name": "香菇",
        "amount": "4 朵",
        "category": "蔬菜"
      },
      {
        "name": "北豆腐",
        "amount": "180g",
        "category": "豆制品"
      },
      {
        "name": "小白菜",
        "amount": "100g",
        "category": "蔬菜"
      },
      {
        "name": "大米",
        "amount": "40g",
        "category": "主食"
      },
      {
        "name": "小米",
        "amount": "30g",
        "category": "主食"
      }
    ],
    "steps": [
      "主食提前浸泡后煮熟",
      "蛋白质食材做到全熟",
      "蔬菜少油快炒或焯水"
    ]
  },
  {
    "id": "r124",
    "name": "洋葱牛肉 · 燕麦饭",
    "tip": "牛肉全熟",
    "kinds": [
      "lunch",
      "dinner"
    ],
    "trimesters": [
      2,
      3
    ],
    "tags": [
      "补铁",
      "控糖"
    ],
    "avoidTags": [
      "牛肉",
      "荤"
    ],
    "ingredients": [
      {
        "name": "牛肉",
        "amount": "120g",
        "category": "肉禽"
      },
      {
        "name": "洋葱",
        "amount": "半个",
        "category": "蔬菜"
      },
      {
        "name": "燕麦",
        "amount": "40g",
        "category": "主食"
      },
      {
        "name": "大米",
        "amount": "30g",
        "category": "主食"
      }
    ],
    "steps": [
      "主食提前浸泡后煮熟",
      "蛋白质食材做到全熟",
      "蔬菜少油快炒或焯水"
    ]
  }
]

const byId = new Map(RECIPES.map((r) => [r.id, r]))

export function getRecipe(id: string): Recipe | undefined {
  return byId.get(id)
}
