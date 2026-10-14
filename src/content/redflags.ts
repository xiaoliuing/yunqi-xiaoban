import type { RedFlag } from './types'

export const RED_FLAGS: RedFlag[] = [
  { id: 'bleeding', symptom: '阴道出血', level: 'emergency', detail: '任何孕周出现出血，无论多少，都要马上去医院' },
  { id: 'fluid', symptom: '阴道流出清水样液体', level: 'emergency', detail: '可能是破水。平躺、垫高臀部，立即去医院' },
  { id: 'pain', symptom: '剧烈或持续的腹痛', level: 'emergency', detail: '腹部发硬、疼痛不缓解，可能是胎盘早剥等急症' },
  { id: 'kicks', symptom: '胎动明显减少或消失', level: 'emergency', detail: '孕 28 周后，2 小时胎动少于 10 次，或比平时明显减少' },
  { id: 'headache', symptom: '剧烈头痛、视物模糊、眼前闪光', level: 'emergency', detail: '可能是子痫前期，尤其伴有血压升高时' },
  { id: 'seizure', symptom: '抽搐或意识不清', level: 'emergency', detail: '立即拨打 120' },
  { id: 'breath', symptom: '呼吸困难、胸痛', level: 'emergency', detail: '可能是心肺问题或血栓，立即就医' },
  { id: 'preterm', symptom: '未满 37 周出现规律宫缩', level: 'emergency', detail: '每 10 分钟一次以上的规律发紧或腰酸，可能是早产' },
  { id: 'leg', symptom: '单侧小腿红肿疼痛', level: 'emergency', detail: '可能是下肢静脉血栓' },
  { id: 'fever-high', symptom: '高烧 38.5℃ 以上', level: 'emergency', detail: '高热对胎儿有影响，需要尽快就医并在医生指导下退烧' },
  { id: 'vomit', symptom: '剧烈呕吐，超过 24 小时吃不下、喝不下', level: 'soon', detail: '可能是妊娠剧吐，容易脱水，需要补液' },
  { id: 'swelling', symptom: '脸和手突然明显水肿', level: 'soon', detail: '脚踝轻度水肿常见，但突然加重或伴头痛要警惕血压问题' },
  { id: 'itch', symptom: '全身瘙痒，手心脚心最明显', level: 'soon', detail: '孕晚期可能是妊娠期肝内胆汁淤积症，需要抽血检查' },
  { id: 'urine', symptom: '排尿疼痛或灼烧感', level: 'soon', detail: '可能是尿路感染，孕期要及时治疗' },
  { id: 'fever', symptom: '低烧 37.5–38.5℃', level: 'soon', detail: '多喝水、物理降温，持续不退要就医' },
  { id: 'discharge', symptom: '白带异常、有异味或瘙痒', level: 'soon', detail: '可能是阴道炎，下次产检前就可以去看' },
]
