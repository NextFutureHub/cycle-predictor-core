import { PregnancyPrediction, ISODate } from "../types";

/**
 * Валидация даты последней менструации
 */
function validateLastPeriodDate(date: Date): void {
  const today = new Date();
  const maxDaysAgo = 280; // Максимум 40 недель назад
  
  if (date > today) {
    throw new Error("Дата последней менструации не может быть в будущем");
  }
  
  const daysAgo = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (daysAgo > maxDaysAgo) {
    throw new Error("Дата последней менструации слишком давняя для расчета беременности");
  }
}

/**
 * Прогнозирование беременности на основе даты последней менструации
 */
export function predictPregnancy(lastPeriodDate: Date): PregnancyPrediction {
    validateLastPeriodDate(lastPeriodDate);
    
    const MS_IN_DAY = 1000 * 60 * 60 * 24;
    const PREGNANCY_DAYS = 280;

    const today = new Date();
    const dueDate = new Date(lastPeriodDate.getTime() + PREGNANCY_DAYS * MS_IN_DAY);

    const daysPassed = Math.floor((today.getTime() - lastPeriodDate.getTime()) / MS_IN_DAY);
    const currentWeek = Math.min(Math.floor(daysPassed / 7) + 1, 40);
    const currentTrimester = currentWeek <= 13 ? 1 : currentWeek <= 27 ? 2 : 3;
    const daysRemaining = Math.max(PREGNANCY_DAYS - daysPassed, 0);

    const milestonesByWeek: Record<number, string[]> = {
        5: ["Формирование сердцебиения"],
        8: ["Начало движения эмбриона"],
        12: ["Завершение первого триместра", "Снижение риска выкидыша"],
        16: ["Первые шевеления плода (для повторнородящих)"],
        20: ["Первые шевеления плода (для первородящих)"],
        24: ["Плод жизнеспособен вне матки"],
        28: ["Начало третьего триместра"],
        32: ["Плод занимает окончательное положение"],
        36: ["Плод считается доношенным"],
        40: ["Ожидаемая дата родов"],
    };

    return {
        dueDate,
        currentWeek,
        currentTrimester,
        daysRemaining,
        milestones: milestonesByWeek[currentWeek] || [],
    };
}