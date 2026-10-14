import type { CheckupItem } from './types'

const routine = (week: number, extra = ''): CheckupItem => ({
  id: `c${week}`,
  startWeek: week,
  endWeek: week,
  name: `孕 ${week} 周产检${extra}`,
  purpose: '常规产检：血压、体重、宫高腹围、胎心、尿常规',
  fasting: false,
  fullBladder: false,
  bring: ['产检手册', '医保卡'],
})

export const CHECKUPS: CheckupItem[] = [
  {
    id: 'c06', startWeek: 6, endWeek: 8, name: '早孕 B 超',
    purpose: '确认宫内妊娠，看胎心胎芽，核对孕周',
    fasting: false, fullBladder: true, bring: ['身份证', '医保卡'],
    note: '经腹 B 超需憋尿，经阴道 B 超不需要，以医院要求为准',
  },
  {
    id: 'c11', startWeek: 11, endWeek: 13, name: 'NT 检查 + 建档',
    purpose: '测量胎儿颈项透明层厚度，建立孕期档案并做首次全面检查',
    fasting: true, fullBladder: false, bring: ['身份证', '医保卡', '早孕 B 超单'],
    note: '建档抽血通常需空腹，带上早餐，抽完血再吃',
  },
  {
    id: 'c15', startWeek: 15, endWeek: 20, name: '唐氏筛查',
    purpose: '评估胎儿染色体异常风险',
    fasting: false, fullBladder: false, bring: ['产检手册', '医保卡'],
    note: '也可以在 12–22⁺⁶ 周改做无创 DNA（NIPT），按医生建议选择',
  },
  {
    id: 'c20', startWeek: 20, endWeek: 24, name: '系统超声（大排畸）',
    purpose: '全面检查胎儿结构发育',
    fasting: false, fullBladder: false, bring: ['产检手册'],
    note: '宝宝姿势不好时可能要走动后复查，预留半天时间',
  },
  {
    id: 'c24', startWeek: 24, endWeek: 28, name: '糖耐量试验（OGTT）',
    purpose: '筛查妊娠期糖尿病',
    fasting: true, fullBladder: false, bring: ['产检手册'],
    note: '前一晚 10 点后不再进食，空腹 8 小时以上；喝糖水后在医院静坐约 2 小时，期间不能进食',
  },
  routine(28),
  { ...routine(30, ' + 生长 B 超'), endWeek: 32, purpose: '常规产检，并做 B 超评估胎儿生长、胎位和羊水' },
  routine(32),
  routine(34),
  {
    id: 'c35', startWeek: 35, endWeek: 37, name: 'B 族链球菌（GBS）筛查',
    purpose: '筛查产道 B 族链球菌，阳性的话分娩时需要用抗生素',
    fasting: false, fullBladder: false, bring: ['产检手册'],
  },
  { ...routine(36, ' + 胎心监护'), purpose: '开始每周产检：评估胎位，做胎心监护' },
  { ...routine(37, ' + 胎心监护'), purpose: '常规产检 + 胎心监护' },
  { ...routine(38, ' + 胎心监护'), purpose: '常规产检 + 胎心监护' },
  { ...routine(39, ' + 胎心监护'), purpose: '常规产检 + 胎心监护' },
  {
    ...routine(40, ' + 胎心监护'), purpose: '常规产检 + 胎心监护',
    note: '到预产期还没有动静，按医生安排做监护或引产评估',
  },
]
