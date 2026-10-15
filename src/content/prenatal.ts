export interface PrenatalPractice {
  title: string
  detail: string
}

export interface PrenatalStage {
  id: string
  fromWeek: number
  toWeek: number
  title: string
  summary: string
  senses: string
  basis: string
  practices: PrenatalPractice[]
}

export interface PrenatalMyth {
  claim: string
  fact: string
}

export const PRENATAL_STAGES: PrenatalStage[] = [
  {
    id: 'forming',
    fromWeek: 4,
    toWeek: 18,
    title: '感官还在长',
    summary: '这阶段不用放音乐。把觉睡够、叶酸吃上、烟酒停掉，比胎教更影响大脑发育。',
    senses: '大脑和内耳都在成形。日常说话的音量，宝宝基本上还听不清。',
    basis: '这几个月对神经发育证据更充分的，是叶酸、避开酒精和烟草、以及妈妈能休息。声音暴露还没有可靠的「上课」效果。',
    practices: [
      { title: '照常说话就好', detail: '想跟肚子说话可以，音量和聊天一样。这是陪伴，不是课程。' },
      { title: '先把身体顾好', detail: '按产检补叶酸，不饮酒，远离二手烟。困了就睡。' },
      { title: '不必买胎教机', detail: '现在放给肚子听的歌，传进去又弱又闷，帮不上发育。' },
    ],
  },
  {
    id: 'hearing-starts',
    fromWeek: 19,
    toWeek: 24,
    title: '开始听得见较强的声音',
    summary: '每天用平时的音量说几分钟话就够。不要把音箱或耳机贴在肚子上。',
    senses: '大约从 19 周起，有研究记录到胎儿会对比较响的纯音做出反应。经过腹壁和羊水后，声音会变弱、变低沉。',
    basis: 'Hepper 与 Shahidullah（1994）观察到约 19 周对较强纯音的反应。这不等于已经能听清故事，也不说明放音乐能促进智力。',
    practices: [
      { title: '每天几分钟', detail: '用平时说话的声音，讲今天做了什么。固定在一个安静的时段即可。' },
      { title: '可以哼熟歌', detail: '哼你自己会哼的歌，音量像在房间里唱歌，不要刻意放大。' },
      { title: '音源离肚子远一点', detail: '手机、音箱放在房间里正常使用。不要贴腹播放，也不要戴耳机给肚子听。' },
    ],
  },
  {
    id: 'voice',
    fromWeek: 25,
    toWeek: 32,
    title: '能熟悉妈妈的声音',
    summary: '每天 10 分钟，重复同一小段话或同一首歌。出生后宝宝会偏好这些听过的声音。',
    senses: '孕晚期耳蜗已经能较稳定地处理声音。妈妈的声音从体内传来，比外面的音乐更清楚。',
    basis: '新生儿偏好母亲声音（DeCasper 与 Fifer，1980）。孕晚期反复听过的故事，出生后仍更喜欢（DeCasper 与 Spence，1986）。反复听过的元音，新生儿脑磁图里还看得到痕迹（Partanen 等，PNAS，2013）。',
    practices: [
      { title: '重复，而不是换花样', detail: '选一小段短故事或一首歌，每天读或哼大约 10 分钟。熟悉比内容多更有研究基础。' },
      { title: '爸爸也用正常音量', detail: '靠近说话即可。不必压着嗓子，也不必大声喊。' },
      { title: '背景保持安静', detail: '做的时候把电视音量调低。胎教时间结束就正常生活，不必整天循环播放。' },
    ],
  },
  {
    id: 'respond',
    fromWeek: 33,
    toWeek: 42,
    title: '声音、光和胎动',
    summary: '继续每天 10 到 15 分钟的重复声音。宝宝踢的时候，把手轻轻放上去回应，不要拍打。',
    senses: '听觉继续在用。孕晚期对较亮的环境光可能有反应。胎动也更有规律，适合用来相处，不能用来「训练」。',
    basis: '声音熟悉度的证据仍来自上面几项孕晚期研究。光照胎教、拍打肚子没有促进发育的证据。数胎动是在观察安危，不是胎教。',
    practices: [
      { title: '沿用同一段内容', detail: '还是那段故事或那首歌，每天 10 到 15 分钟。加长到几小时并没有更好的证据。' },
      { title: '踢的时候轻轻回应', detail: '手掌放在踢到的位置停一会儿，可以同时说话。不要拍、戳或摇晃肚子。' },
      { title: '光用房间亮度就够', detail: '白天拉开窗帘即可。不要用手电筒或灯照肚子。' },
      { title: '数胎动另算', detail: '从孕 28 周起每天固定时间数胎动，是为了发现异常，和胎教分开做。' },
    ],
  },
]

export const PRENATAL_MYTHS: PrenatalMyth[] = [
  {
    claim: '听莫扎特能提高智商',
    fact: '所谓莫扎特效应来自 1993 年一项大学生短暂空间测验，不能推论到胎儿，也没有可靠试验证明胎教音乐能提高智力。',
  },
  {
    claim: '耳机或胎教仪贴在肚子上效果更好',
    fact: '贴着腹壁播放可能过响。研究里有效的是房间里正常音量的人声和重复，不是把喇叭抵在皮肤上。',
  },
  {
    claim: '播放外语或识字内容，宝宝会提前学会',
    fact: '现有证据支持的是韵律和熟悉的声音，不是词汇、字母或双语教学。胎儿不能靠录音识字。',
  },
  {
    claim: '做得越久，发育越好',
    fact: '没有证据表明每天超过 15 分钟更好。妈妈累了、紧张了，反而偏离目前知道的有益条件。',
  },
]

export const PRENATAL_SOURCES: { title: string; detail: string }[] = [
  { title: 'DeCasper 与 Fifer，Science，1980', detail: '出生不久的婴儿更愿意听母亲的声音，而不是别的女性的声音。' },
  { title: 'DeCasper 与 Spence，1986', detail: '孕晚期反复听过的故事，新生儿吸吮测试里会更偏好。' },
  { title: 'Partanen 等，PNAS，2013', detail: '孕晚期反复播放的元音，出生后脑磁图仍能看出学习痕迹。' },
  { title: 'Hepper 与 Shahidullah，1994', detail: '约 19 周起，胎儿可对较强纯音产生反应；这不能延伸成早孕放音乐。' },
]

export function stageForWeek(week: number): PrenatalStage {
  return PRENATAL_STAGES.find((s) => week >= s.fromWeek && week <= s.toWeek) ?? PRENATAL_STAGES[PRENATAL_STAGES.length - 1]
}
