<script setup lang="ts">
  import { computed, ref, watch } from "vue";
  import FruitIcon from "@/components/FruitIcon.vue";
  import WeekTicks from "@/components/WeekTicks.vue";
  import SectionHead from "@/components/SectionHead.vue";
  import NutrientTag from "@/components/NutrientTag.vue";
  import MealBoard from "@/components/MealBoard.vue";
  import SupplementGrid from "@/components/SupplementGrid.vue";
  import CheckupTicket from "@/components/CheckupTicket.vue";
  import WeekNotes from "@/components/WeekNotes.vue";
  import Disclaimer from "@/components/Disclaimer.vue";
  import { useClock } from "@/composables/useClock";
  import { useProfileStore } from "@/stores/profile";
  import { useMealsStore } from "@/stores/meals";
  import { useRecordsStore } from "@/stores/records";
  import { formatCn, greeting, weekdayCn } from "@/core/date";
  import { getStatus } from "@/core/pregnancy";
  import { buildSchedule, nextCheckup } from "@/core/checkupSchedule";
  import { toIcs } from "@/core/ics";
  import { downloadFile } from "@/utils/download";
  import { getWeekInfo } from "@/content/weeks";
  import { stageForWeek } from "@/content/prenatal";
  import {
    FOCUS_TAGS,
    SUPPLEMENTS,
    SUPPLEMENT_HINT,
    TRIMESTER_LABEL,
  } from "@/content/nutrition";
  import { askAi, AiError } from "@/ai/client";
  import { useAiMealImages } from "@/composables/useAiMealImages";
  import {
    buildMealSystemPrompt,
    isCompleteMenu,
    parseMealAnswer,
  } from "@/ai/mealAnswer";
  import { PLAN_SLOTS } from "@/core/mealPlanner";
  import { getRecipe } from "@/content/recipes";
  import type { AiDish, PlanSlot } from "@/content/types";

  const { today, hour } = useClock();
  const profileStore = useProfileStore();
  const meals = useMealsStore();
  const records = useRecordsStore();

  const profile = computed(() => profileStore.profile!);
  const status = computed(() => getStatus(profile.value.dueDate, today.value));
  const info = computed(() => getWeekInfo(status.value.week));
  const prenatal = computed(() => stageForWeek(status.value.week));
  const log = computed(() => meals.logs[today.value]);
  const schedule = computed(() =>
    buildSchedule(profile.value.dueDate, records.checkupOverrides),
  );
  const next = computed(() => nextCheckup(schedule.value, today.value));
  const supplements = computed(() =>
    SUPPLEMENTS.filter((s) =>
      profile.value.supplementIds
        ? profile.value.supplementIds.includes(s.id)
        : s.trimesters.includes(status.value.trimester),
    ),
  );
  const taken = computed(() => records.supplementsTaken[today.value] ?? []);
  const generating = ref(false);
  const mealError = ref("");
  const preview = ref<Partial<Record<PlanSlot, AiDish>> | null>(null);
  const shownDishes = computed(() => preview.value ?? log.value?.dishes);
  const { paintingSlot, imageErrors, paint, stop } = useAiMealImages();

  watch(
    today,
    async (d) => {
      preview.value = null;
      mealError.value = "";
      stop();
      await Promise.all([
        meals.ensurePlans([d]),
        records.loadSupplements(d),
        records.loadCheckups(),
      ]);
    },
    { immediate: true },
  );

  async function generateMeals() {
    const p = profileStore.profile;
    if (!p?.ai || generating.value) return;
    generating.value = true;
    mealError.value = "";
    stop();
    preview.value = {};
    try {
      const names = log.value
        ? PLAN_SLOTS.map(
            (slot) =>
              log.value?.dishes?.[slot.key]?.name ??
              (log.value?.plan[slot.key]
                ? getRecipe(log.value.plan[slot.key]!)?.name
                : ""),
          ).filter((name): name is string => !!name)
        : [];
      const sys = buildMealSystemPrompt({
        week: status.value.week,
        day: status.value.day,
        trimester: status.value.trimester,
        exclusions: p.exclusions,
        focus: FOCUS_TAGS[status.value.trimester],
        currentNames: names,
      });
      let latest: Partial<Record<PlanSlot, AiDish>> = {};
      await askAi(
        p.ai,
        sys,
        "自己想五餐，只输出 JSON。",
        fetch,
        (transcript) => {
          latest = parseMealAnswer(transcript.content);
          preview.value = latest;
        },
        { reasoningEffort: "high" },
      );
      if (!isCompleteMenu(latest)) {
        mealError.value = "没有排成完整的五餐，请再试一次";
        preview.value = null;
        return;
      }
      await meals.applyAi(today.value, latest);
      preview.value = null;
      void paint(today.value);
    } catch (e) {
      mealError.value =
        e instanceof AiError ? e.message : "出了点问题，请稍后再试";
      preview.value = null;
    } finally {
      generating.value = false;
    }
  }

  function exportCalendar() {
    const ics = toIcs(schedule.value, {
      location: profile.value.hospital,
      now: new Date(),
    });
    downloadFile("产检日程.ics", ics, "text/calendar;charset=utf-8");
  }
</script>

<template>
  <main class="page">
    <div class="page-glow" />

    <header class="greet rise d1">
      <div>
        <div class="date">{{ formatCn(today) }} · {{ weekdayCn(today) }}</div>
        <h1>{{ greeting(hour) }}，今天也好好吃饭</h1>
      </div>
      <RouterLink to="/me/settings" class="icon-btn" aria-label="设置">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.7"
          stroke-linecap="round"
        >
          <circle cx="12" cy="12" r="3" />
          <path
            d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"
          />
        </svg>
      </RouterLink>
    </header>

    <section v-if="!status.inRange" class="card out-of-range rise d2">
      {{
        status.week < 4
          ? "孕周还不到 4 周，请确认预产期设置是否正确"
          : "已经过了预产期，请遵医嘱，密切留意身体变化"
      }}
      <RouterLink to="/me/settings">去设置 ›</RouterLink>
    </section>

    <section v-else class="hero rise d2">
      <div class="hero-row">
        <div>
          <div class="week-num">
            {{ status.week }}<sup>周 +{{ status.day }} 天</sup>
          </div>
          <div class="week-meta">
            <span class="pill apricot">{{
              TRIMESTER_LABEL[status.trimester]
            }}</span>
            <span class="pill ghost"
              >预产期 {{ formatCn(profile.dueDate) }}</span
            >
          </div>
        </div>
        <FruitIcon
          :shape="info.fruitShape"
          :color="info.fruitColor"
          :label="`宝宝大小像${info.fruit}`"
        />
      </div>
      <p class="baby-line">
        宝宝现在约 <b>{{ info.lengthCm }} 厘米、{{ info.weightG }} 克</b>，像{{
          info.fruit
        }}。<br />{{ info.baby }}
      </p>
      <WeekTicks :week="status.week" />
      <div class="countdown">
        <span v-if="status.daysToDue > 0"
          >距离见面还有<strong>{{ status.daysToDue }}</strong
          >天</span
        >
        <span v-else>宝宝随时可能到来</span>
        <span>已走过 {{ Math.round(status.progress * 100) }}%</span>
      </div>
    </section>

    <section class="block rise d3">
      <SectionHead idx="01" title="今日三餐"
        >已吃 {{ log?.eaten.length ?? 0 }} / 5</SectionHead
      >
      <div class="focus">
        <span>本阶段重点</span>
        <NutrientTag
          v-for="t in FOCUS_TAGS[status.trimester]"
          :key="t"
          :tag="t"
        />
      </div>
      <div class="meal-actions">
        <button
          v-if="profileStore.aiReady"
          class="btn dark"
          :disabled="generating"
          @click="generateMeals"
        >
          {{ generating ? "正在安排…" : "让 AI 安排今天" }}
        </button>
        <RouterLink v-else to="/me/settings" class="btn light"
          >用 AI 安排今天</RouterLink
        >
        <button
          v-if="log?.source === 'ai' && !generating"
          class="btn light"
          @click="
            stop();
            meals.restoreSystem(today);
          "
        >
          恢复系统推荐
        </button>
      </div>
      <p v-if="mealError" class="meal-error">{{ mealError }}</p>
      <MealBoard
        v-if="log"
        :key="today"
        :plan="log.plan"
        :eaten="log.eaten"
        :hour="hour"
        :dishes="shownDishes"
        :locked="generating"
        :painting-slot="paintingSlot"
        :image-errors="imageErrors"
        @toggle="(s) => meals.toggleEaten(today, s)"
        @swap="(s) => meals.swap(today, s)"
        @retry-image="(s) => paint(today, s)"
      />
      <p v-if="log?.source === 'ai' && !generating" class="faint ai-note">
        这顿由 AI 安排，请以医生意见为准
      </p>
    </section>

    <section v-if="supplements.length" class="block rise d4">
      <SectionHead idx="02" title="今日补剂"
        >{{ taken.length }} / {{ supplements.length }}</SectionHead
      >
      <SupplementGrid
        :items="supplements"
        :taken="taken"
        @toggle="(id) => records.toggleSupplement(today, id)"
      />
      <div class="hint">{{ SUPPLEMENT_HINT }}</div>
    </section>

    <section v-if="next" class="block rise d5">
      <SectionHead idx="03" title="下次产检"
        ><RouterLink to="/pregnancy/checkups">全部日程</RouterLink></SectionHead
      >
      <CheckupTicket
        :checkup="next"
        :today="today"
        :week-at-date="getStatus(profile.dueDate, next.date).week"
        @calendar="exportCalendar"
      />
    </section>

    <section class="block rise d6">
      <SectionHead idx="04" title="这周要留意" />
      <WeekNotes :tips="info.tips" />
      <RouterLink
        v-if="status.inRange"
        to="/pregnancy/prenatal"
        class="card prenatal"
      >
        <b>这周的胎教</b>
        <span>{{ prenatal.summary }}</span>
      </RouterLink>
      <Disclaimer />
    </section>
  </main>
</template>

<style scoped>
  .greet {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }
  .greet .date {
    font-size: 13px;
    color: var(--ink-soft);
    letter-spacing: 0.04em;
  }
  .greet h1 {
    margin: 4px 0 0;
    font-family: var(--font-title);
    font-size: 22px;
    font-weight: 600;
    letter-spacing: 0.02em;
  }
  .icon-btn {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 1px solid var(--line);
    background: var(--card);
    display: grid;
    place-items: center;
    color: var(--ink-soft);
  }
  .out-of-range {
    margin-top: 18px;
    padding: 16px;
    font-size: 14px;
    line-height: 1.6;
  }
  .out-of-range a {
    display: block;
    margin-top: 8px;
    color: var(--apricot);
    text-decoration: none;
  }
  .hero {
    margin-top: 18px;
  }
  .hero-row {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
  }
  .week-num {
    font-family: var(--font-display);
    font-variation-settings: "opsz" 144;
    font-weight: 400;
    font-size: 112px;
    line-height: 0.82;
    letter-spacing: -0.04em;
  }
  .week-num sup {
    font-family: var(--font-title);
    font-size: 18px;
    letter-spacing: 0;
    font-weight: 600;
    vertical-align: top;
    position: relative;
    top: 14px;
    margin-left: 6px;
  }
  .week-meta {
    margin-top: 10px;
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }
  .baby-line {
    margin: 14px 0 0;
    font-size: 14px;
    color: var(--ink-soft);
    line-height: 1.6;
  }
  .baby-line b {
    color: var(--ink);
    font-weight: 600;
  }
  .countdown {
    margin-top: 14px;
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    padding-top: 12px;
    border-top: 1px dashed var(--line);
    font-size: 13px;
    color: var(--ink-soft);
  }
  .countdown strong {
    font-family: var(--font-display);
    font-weight: 500;
    font-size: 26px;
    color: var(--ink);
    margin: 0 3px;
  }
  .focus {
    display: flex;
    gap: 6px;
    margin-bottom: 12px;
    font-size: 12.5px;
    color: var(--ink-soft);
    align-items: center;
  }
  .meal-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 12px;
  }
  .meal-actions .btn {
    height: 36px;
    padding: 0 14px;
    font-size: 13px;
    text-decoration: none;
  }
  .meal-error {
    margin: 0 0 10px;
    color: var(--alert);
    font-size: 13px;
  }
  .ai-note {
    margin: 8px 0 0;
    font-size: 12px;
  }
  .hint {
    margin-top: 10px;
    font-size: 12.5px;
    color: var(--ink-soft);
  }
  .prenatal {
    display: block;
    margin-top: 14px;
    padding: 14px 16px;
    text-decoration: none;
    color: inherit;
  }
  .prenatal b {
    display: block;
    font-family: var(--font-title);
    font-size: 16px;
  }
  .prenatal span {
    display: block;
    margin-top: 4px;
    font-size: 13.5px;
    line-height: 1.6;
    color: var(--ink-soft);
  }
</style>
