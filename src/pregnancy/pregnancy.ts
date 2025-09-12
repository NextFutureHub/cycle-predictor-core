import { PregnancyPrediction } from "../types";

export function prefictPregnancy(lastPeriodDate: Date): PregnancyPrediction {
    const MS_IN_DAY = 1000 * 60 * 60 * 24;
    const MS_IN_WEEK = MS_IN_DAY * 7;
    const PREGNANCY_DAYS = 280;

    const today = new Date();
    const dueDate = new Date(lastPeriodDate.getTime() + PREGNANCY_DAYS * MS_IN_DAY);

    const daysPassed = Math.floor((today.getTime() - lastPeriodDate.getTime()) / MS_IN_DAY);
    const currentWeek = Math.min(Math.floor(daysPassed / 7) + 1, 40);
    const currentTrimester = currentWeek <=13 ? 1 : currentWeek <= 27 ? 2 : 3;
    const daysRemaining = Math.max(PREGNANCY_DAYS - daysPassed, 0);

    const milestonesByWeek : Record<number, string[]> = {
        5: ["Формирование сердцебиения"],
        12: ["Завершение первого триместра", "Снижение риска выкидыша"],
        20: ["первое шевеление плода"],
        28: ["начало третьего триместра"],
        40: ["Ожилдаемая дата родов"],
    }

    return {
        dueDate,
        currentWeek,
        currentTrimester,
        daysRemaining,
        milestones: milestonesByWeek[currentWeek] || [],
    };
}