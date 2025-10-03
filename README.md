
# cyclia

**Warning:** This library is not a medical device and does not replace professional medical advice. All predictions are probabilistic and for informational purposes only.


[🌐 Website](https://cycle-landing.vercel.app/) · [📦 npm](https://www.npmjs.com/package/cyclia) · [⭐ GitHub](https://github.com/NextFutureHub/cyclia)

[![npm version](https://badge.fury.io/js/cyclia.svg)](https://badge.fury.io/js/cyclia)
[![npm downloads](https://img.shields.io/npm/dm/cyclia.svg)](https://www.npmjs.com/package/cyclia)
[![npm status](https://img.shields.io/badge/npm-published-green.svg)](https://www.npmjs.com/package/cyclia)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D16.0.0-green.svg)](https://nodejs.org/)
[![Tests](https://img.shields.io/badge/Tests-Passing-green.svg)](https://github.com/NextFutureHub/cyclia)
[![Build](https://img.shields.io/badge/Build-Passing-green.svg)](https://github.com/NextFutureHub/cyclia)


Library for predicting menstrual cycles based on historical data. Provides accurate algorithms for forecasting upcoming periods, ovulation, and fertile windows.


## 🚀 Features

- **Multiple prediction strategies**: Calendar and WMA (Weighted Moving Average)
- **Data quality analysis**: automatic assessment of cycle regularity
- **Ovulation prediction**: based on luteal phase
- **Fertile window detection**: for pregnancy planning
- **Pregnancy tracking**: current week, trimester, and milestones
- **Confidence system**: confidence score for each prediction
- **Extensible architecture**: ability to add custom algorithms
- **TypeScript support**: full typing out of the box


## 📦 Installation

```bash
npm install cyclia
```

```bash
yarn add cyclia
```

```bash
pnpm add cyclia
```


## 📖 Documentation

Detailed usage examples and API are described on the [official website](https://cycle-landing.vercel.app/).


## 🎯 Quick Start

### Basic Usage

```typescript
import { PredictionEngine } from "cyclia";

const engine = new PredictionEngine({ strategy: "wma" });

const history = {
  periodStarts: [
    { date: "2025-01-02" },
    { date: "2025-01-31" }, // 29 дней
    { date: "2025-03-01" }, // 29 дней
    { date: "2025-03-29" }, // 28 дней
    { date: "2025-04-27" }, // 29 дней
  ],
};

// Predict next period
const nextPeriod = engine.predictNextPeriod(history);
console.log("Next period:", nextPeriod.likely);
console.log("Confidence:", Math.round(nextPeriod.confidence * 100) + "%");

// Predict ovulation
const ovulation = engine.predictOvulation(history);
console.log("Ovulation:", ovulation.likely);

// Fertile window
const fertile = engine.predictFertileWindow(history);
console.log("Fertile window:", fertile.start, "-", fertile.end);

// Pregnancy prediction
const pregnancy = engine.predictPregnancy(new Date("2025-01-15"));
console.log("Pregnancy week:", pregnancy.currentWeek);
console.log("Due date:", pregnancy.dueDate);
```


### Data Analysis

```typescript
// Get analytics summary
const summary = engine.analyze(history);
console.log("Average cycle length:", summary.averageCycle);
console.log("Regularity:", summary.irregular ? "Irregular" : "Regular");
console.log("Data quality:", summary.dataQuality);
```


## 📚 API Reference

### PredictionEngine

Main class for working with predictions.


#### Constructor

```typescript
new PredictionEngine(config?: PredictorConfig)
```

#### Configuration (PredictorConfig)

| Parameter                   | Type                  | Default      | Description                                   |
| --------------------------- | --------------------- | ------------ | --------------------------------------------- |
| `strategy`                  | `'wma' \| 'calendar'` | `'wma'`      | Prediction strategy                           |
| `lutealPhaseDays`           | `number`              | `14`         | Luteal phase duration                         |
| `irregularityStdThreshold`  | `number`              | `4`          | Irregularity threshold (standard deviation)    |
| `minIntervalsForConfidence` | `number`              | `3`          | Minimum intervals for confidence              |
| `timezone`                  | `string`              | Local TZ     | Timezone for calculations                     |


#### Methods

##### `analyze(history: HistoryInput): AnalyticsSummary`

Analyzes historical data and returns a summary.

```typescript
const summary = engine.analyze(history);
// {
//   sampleSize: 4,
//   cycleIntervals: [29, 29, 28, 29],
//   averageCycle: 28.75,
//   medianCycle: 29,
//   stdCycle: 0.5,
//   irregular: false,
//   dataQuality: "medium"
// }
```


##### `predictNextPeriod(history: HistoryInput): PredictionResult`

Predicts the date of the next period.

```typescript
const result = engine.predictNextPeriod(history);
// {
//   likely: "2025-05-26",
//   window: { start: "2025-05-24", end: "2025-05-28" },
//   confidence: 0.8,
//   notes: ["wma: weighted last intervals", "irregularity: ±2d"]
// }
```


##### `predictOvulation(history: HistoryInput): PredictionResult`

Predicts the date of ovulation.


##### `predictFertileWindow(history: HistoryInput): FertileWindow`

Determines the fertile window.

```typescript
const fertile = engine.predictFertileWindow(history);
// {
//   start: "2025-05-07",
//   peak: "2025-05-12",
//   end: "2025-05-13",
//   confidence: 0.7,
//   notes: ["ovulation = nextPeriod - lutealPhaseDays", "fertile = ovulation ± (−5..+1)"]
// }
```


##### `predictPregnancy(lastPeriodDate: Date): PregnancyPrediction`

Predicts pregnancy progress based on last period date.

```typescript
const pregnancy = engine.predictPregnancy(new Date("2025-01-15"));
// {
//   dueDate: Date,
//   currentWeek: 12,
//   currentTrimester: 1,
//   daysRemaining: 196,
//   milestones: ["Завершение первого триместра", "Снижение риска выкидыша"]
// }
```


##### `predictPregnancyFromHistory(history: HistoryInput): PregnancyPrediction`

Predicts pregnancy progress using the last period date from cycle history.

```typescript
const pregnancy = engine.predictPregnancyFromHistory(history);
// Uses the most recent period date from history
```


### Data Types

#### HistoryInput

```typescript
interface HistoryInput {
  periodStarts: PeriodStartRecord[];
}

interface PeriodStartRecord {
  date: ISODate; // YYYY-MM-DD
}
```


#### PredictionResult

```typescript
interface PredictionResult {
  likely: ISODate | null; // Вероятная дата
  window: DateRange | null; // Окно прогноза
  confidence: number; // Уверенность (0-1)
  notes: string[]; // Комментарии
}
```


#### FertileWindow

```typescript
interface FertileWindow {
  start: ISODate; // Начало фертильного окна
  peak: ISODate; // Пик фертильности (овуляция)
  end: ISODate; // Конец фертильного окна
  confidence: number; // Уверенность
  notes: string[]; // Комментарии
}
```


#### PregnancyPrediction

```typescript
interface PregnancyPrediction {
  dueDate: Date; // Предполагаемая дата родов
  currentWeek: number; // Текущая неделя беременности
  currentTrimester: number; // Текущий триместр (1-3)
  daysRemaining: number; // Дней до родов
  milestones: string[]; // Вехи развития для текущей недели
}
```


## 🎨 Integration with UI Frameworks

### React/Next.js

#### Prediction Hook

```typescript
import { useState, useEffect } from "react";
import { PredictionEngine, HistoryInput } from "cyclia";

const useCyclePredictions = (history: HistoryInput) => {
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (history.periodStarts.length >= 2) {
      setLoading(true);
      setError(null);

      try {
        const engine = new PredictionEngine({ strategy: "wma" });

        const nextPeriod = engine.predictNextPeriod(history);
        const ovulation = engine.predictOvulation(history);
        const fertile = engine.predictFertileWindow(history);
        const summary = engine.analyze(history);

        setPredictions({ nextPeriod, ovulation, fertile, summary });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  }, [history]);

  return { predictions, loading, error };
};
```


#### Calendar Component

```typescript
import React from 'react';
import { useCyclePredictions } from './hooks/useCyclePredictions';

interface CycleCalendarProps {
  periodHistory: HistoryInput;
}

const CycleCalendar: React.FC<CycleCalendarProps> = ({ periodHistory }) => {
  const { predictions, loading, error } = useCyclePredictions(periodHistory);

  if (loading) return <div>Анализируем данные...</div>;
  if (error) return <div>Ошибка: {error}</div>;
  if (!predictions) return <div>Недостаточно данных для прогноза</div>;

  return (
    <div className="cycle-calendar">
      <div className="prediction-card">
        <h3>Следующая менструация</h3>
        <div className="date">{predictions.nextPeriod.likely}</div>
        <div className="confidence">
          Уверенность: {Math.round(predictions.nextPeriod.confidence * 100)}%
        </div>
        {predictions.nextPeriod.window && (
          <div className="window">
            Окно: {predictions.nextPeriod.window.start} - {predictions.nextPeriod.window.end}
          </div>
        )}
      </div>

      <div className="prediction-card">
        <h3>Овуляция</h3>
        <div className="date">{predictions.ovulation.likely}</div>
        <div className="confidence">
          Уверенность: {Math.round(predictions.ovulation.confidence * 100)}%
        </div>
      </div>

      <div className="prediction-card">
        <h3>Фертильное окно</h3>
        <div className="fertile-range">
          {predictions.fertile.start} - {predictions.fertile.end}
        </div>
        <div className="peak">Пик: {predictions.fertile.peak}</div>
      </div>

      <div className="analytics">
        <h3>Анализ данных</h3>
        <p>Средний цикл: {predictions.summary.averageCycle} дней</p>
        <p>Регулярность: {predictions.summary.irregular ? 'Нерегулярный' : 'Регулярный'}</p>
        <p>Качество данных: {predictions.summary.dataQuality}</p>
      </div>
    </div>
  );
};
```


### Vue.js

#### Composition API

```typescript
<template>
  <div class="cycle-predictor">
    <div v-if="loading">Анализируем данные...</div>
    <div v-else-if="error">Ошибка: {{ error }}</div>
    <div v-else-if="predictions" class="predictions">
      <div class="prediction-card">
        <h3>Следующая менструация</h3>
        <p>{{ predictions.nextPeriod.likely }}</p>
        <p>Уверенность: {{ Math.round(predictions.nextPeriod.confidence * 100) }}%</p>
      </div>

      <div class="prediction-card">
        <h3>Овуляция</h3>
        <p>{{ predictions.ovulation.likely }}</p>
      </div>

      <div class="prediction-card">
        <h3>Фертильное окно</h3>
        <p>{{ predictions.fertile.start }} - {{ predictions.fertile.end }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { PredictionEngine, type HistoryInput } from 'cyclia';

const props = defineProps<{
  periodHistory: HistoryInput;
}>();

const predictions = ref(null);
const loading = ref(false);
const error = ref(null);

const calculatePredictions = async () => {
  if (props.periodHistory.periodStarts.length < 2) {
    predictions.value = null;
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    const engine = new PredictionEngine({ strategy: 'wma' });
    predictions.value = {
      nextPeriod: engine.predictNextPeriod(props.periodHistory),
      ovulation: engine.predictOvulation(props.periodHistory),
      fertile: engine.predictFertileWindow(props.periodHistory),
      summary: engine.analyze(props.periodHistory)
    };
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

watch(() => props.periodHistory, calculatePredictions, { immediate: true });
</script>
```


### Angular

#### Service

```typescript
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import {
  PredictionEngine,
  type HistoryInput,
  type PredictionResult,
} from "cyclia";

export interface CyclePredictions {
  nextPeriod: PredictionResult;
  ovulation: PredictionResult;
  fertile: any;
  summary: any;
}

@Injectable({
  providedIn: "root",
})
export class CyclePredictionService {
  private engine = new PredictionEngine({ strategy: "wma" });
  private predictionsSubject = new BehaviorSubject<CyclePredictions | null>(
    null
  );
  private loadingSubject = new BehaviorSubject<boolean>(false);

  predictions$ = this.predictionsSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();

  calculatePredictions(history: HistoryInput): void {
    if (history.periodStarts.length < 2) {
      this.predictionsSubject.next(null);
      return;
    }

    this.loadingSubject.next(true);

    try {
      const predictions = {
        nextPeriod: this.engine.predictNextPeriod(history),
        ovulation: this.engine.predictOvulation(history),
        fertile: this.engine.predictFertileWindow(history),
        summary: this.engine.analyze(history),
      };

      this.predictionsSubject.next(predictions);
    } catch (error) {
      console.error("Ошибка расчета прогнозов:", error);
    } finally {
      this.loadingSubject.next(false);
    }
  }
}
```


#### Component

```typescript
import { Component, Input, OnInit } from "@angular/core";
import {
  CyclePredictionService,
  type CyclePredictions,
} from "./cycle-prediction.service";
import { type HistoryInput } from "cyclia";

@Component({
  selector: "app-cycle-predictor",
  template: `
    <div class="cycle-predictor">
      <div *ngIf="loading$ | async" class="loading">Анализируем данные...</div>

      <div *ngIf="predictions$ | async as predictions" class="predictions">
        <div class="prediction-card">
          <h3>Следующая менструация</h3>
          <p class="date">{{ predictions.nextPeriod.likely }}</p>
          <p class="confidence">
            Уверенность:
            {{ predictions.nextPeriod.confidence * 100 | number: "1.0-0" }}%
          </p>
        </div>

        <div class="prediction-card">
          <h3>Овуляция</h3>
          <p class="date">{{ predictions.ovulation.likely }}</p>
        </div>

        <div class="prediction-card">
          <h3>Фертильное окно</h3>
          <p class="range">
            {{ predictions.fertile.start }} - {{ predictions.fertile.end }}
          </p>
          <p class="peak">Пик: {{ predictions.fertile.peak }}</p>
        </div>
      </div>
    </div>
  `,
  styleUrls: ["./cycle-predictor.component.scss"],
})
export class CyclePredictorComponent implements OnInit {
  @Input() periodHistory!: HistoryInput;

  predictions$ = this.predictionService.predictions$;
  loading$ = this.predictionService.loading$;

  constructor(private predictionService: CyclePredictionService) {}

  ngOnInit() {
    this.predictionService.calculatePredictions(this.periodHistory);
  }
}
```


## 📱 Mobile Applications

### React Native

```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PredictionEngine, type HistoryInput } from 'cyclia';

interface CyclePredictorProps {
  periodHistory: HistoryInput;
}

const CyclePredictor: React.FC<CyclePredictorProps> = ({ periodHistory }) => {
  const [predictions, setPredictions] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (periodHistory.periodStarts.length >= 2) {
      setLoading(true);

      const engine = new PredictionEngine({ strategy: 'wma' });
      const nextPeriod = engine.predictNextPeriod(periodHistory);
      const ovulation = engine.predictOvulation(periodHistory);
      const fertile = engine.predictFertileWindow(periodHistory);

      setPredictions({ nextPeriod, ovulation, fertile });
      setLoading(false);
    }
  }, [periodHistory]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Анализируем данные...</Text>
      </View>
    );
  }

  if (!predictions) {
    return (
      <View style={styles.container}>
        <Text>Недостаточно данных для прогноза</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Следующая менструация</Text>
        <Text style={styles.date}>{predictions.nextPeriod.likely}</Text>
        <Text style={styles.confidence}>
          Уверенность: {Math.round(predictions.nextPeriod.confidence * 100)}%
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Овуляция</Text>
        <Text style={styles.date}>{predictions.ovulation.likely}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Фертильное окно</Text>
        <Text style={styles.range}>
          {predictions.fertile.start} - {predictions.fertile.end}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  date: {
    fontSize: 16,
    color: '#333',
  },
  confidence: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  range: {
    fontSize: 16,
    color: '#333',
  },
});

export default CyclePredictor;
```


## 🔧 Extending Functionality

### Creating Custom Algorithms

```typescript
import {
  BaseRule,
  type HistoryInput,
  type PredictionResult,
  type PredictorConfig,
  type AnalyticsSummary,
} from "cyclia";

class MLPredictionRule extends BaseRule {
  readonly id = "ml-prediction";

  predictNextPeriod(
    history: HistoryInput,
    cfg: Required<PredictorConfig>,
    summary: AnalyticsSummary
  ): PredictionResult {
    // Ваша ML логика здесь
    const mlPrediction = this.runMLModel(history, summary);

    return {
      likely: mlPrediction.date,
      window: {
        start: mlPrediction.startDate,
        end: mlPrediction.endDate,
      },
      confidence: mlPrediction.confidence,
      notes: ["ML-based prediction", `model: ${mlPrediction.modelName}`],
    };
  }

  private runMLModel(history: HistoryInput, summary: AnalyticsSummary) {
    // Интеграция с вашей ML моделью
    // Например, TensorFlow.js, ONNX.js, или внешний API
    return {
      date: "2025-06-15",
      startDate: "2025-06-13",
      endDate: "2025-06-17",
      confidence: 0.85,
      modelName: "cycle-predictor-v1",
    };
  }
}

// Register in engine
const engine = new PredictionEngine();
engine.register(new MLPredictionRule());

// Usage
const result = engine.predictNextPeriod(history);
```


### Integration with External Data

```typescript
class EnhancedPredictionEngine extends PredictionEngine {
  async predictWithExternalFactors(history: HistoryInput) {
    const basePrediction = this.predictNextPeriod(history);

    // Получаем дополнительные факторы
    const weatherData = await this.getWeatherData();
    const stressLevel = await this.getStressLevel();
    const sleepQuality = await this.getSleepQuality();

    // Корректируем прогноз
    return this.adjustPrediction(basePrediction, {
      weather: weatherData,
      stress: stressLevel,
      sleep: sleepQuality,
    });
  }

  private adjustPrediction(basePrediction: PredictionResult, factors: any) {
    let adjustedConfidence = basePrediction.confidence;
    const notes = [...basePrediction.notes];

    // Корректировка на основе факторов
    if (factors.stress > 7) {
      adjustedConfidence *= 0.9;
      notes.push("high stress detected");
    }

    if (factors.sleep < 6) {
      adjustedConfidence *= 0.95;
      notes.push("poor sleep quality");
    }

    return {
      ...basePrediction,
      confidence: Math.max(0.1, adjustedConfidence),
      notes,
    };
  }
}
```


## 🗄️ Working with Data

### Saving and Loading

```typescript
class CycleDataService {
  private readonly STORAGE_KEY = "cycle_history";
  private readonly PREDICTIONS_KEY = "cycle_predictions";

  async savePeriodDate(date: string): Promise<void> {
    const history = await this.loadHistory();
    history.periodStarts.push({ date });
    await this.saveHistory(history);

    // Пересчитываем прогнозы
    const engine = new PredictionEngine();
    const predictions = engine.predictNextPeriod(history);
    await this.savePredictions(predictions);
  }

  async loadHistory(): Promise<HistoryInput> {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : { periodStarts: [] };
  }

  async saveHistory(history: HistoryInput): Promise<void> {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
  }

  async getCurrentPredictions(): Promise<any> {
    const history = await this.loadHistory();
    const engine = new PredictionEngine();

    return {
      nextPeriod: engine.predictNextPeriod(history),
      ovulation: engine.predictOvulation(history),
      fertile: engine.predictFertileWindow(history),
      summary: engine.analyze(history),
    };
  }
}
```


### Data Export

```typescript
class DataExportService {
  exportToCSV(history: HistoryInput): string {
    const headers = ["Date", "Cycle Length"];
    const rows = [];

    for (let i = 1; i < history.periodStarts.length; i++) {
      const prev = new Date(history.periodStarts[i - 1].date);
      const curr = new Date(history.periodStarts[i].date);
      const cycleLength = Math.round(
        (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24)
      );

      rows.push([history.periodStarts[i].date, cycleLength]);
    }

    return [headers, ...rows].map((row) => row.join(",")).join("\n");
  }

  exportToJSON(history: HistoryInput, predictions: any): string {
    return JSON.stringify(
      {
        history,
        predictions,
        exportDate: new Date().toISOString(),
      },
      null,
      2
    );
  }
}
```


## 🧪 Testing

### Unit Tests

```typescript
import { PredictionEngine } from "cycle-predictor-core";

describe("PredictionEngine", () => {
  let engine: PredictionEngine;

  beforeEach(() => {
    engine = new PredictionEngine({ strategy: "wma" });
  });

  it("should predict next period correctly", () => {
    const history = {
      periodStarts: [
        { date: "2025-01-01" },
        { date: "2025-01-30" }, // 29 дней
        { date: "2025-02-28" }, // 29 дней
      ],
    };

    const result = engine.predictNextPeriod(history);

    expect(result.likely).toBeTruthy();
    expect(result.confidence).toBeGreaterThan(0);
    expect(result.confidence).toBeLessThanOrEqual(1);
  });

  it("should handle irregular cycles", () => {
    const history = {
      periodStarts: [
        { date: "2025-01-01" },
        { date: "2025-01-25" }, // 24 дня
        { date: "2025-02-28" }, // 33 дня
        { date: "2025-03-25" }, // 25 дней
      ],
    };

    const summary = engine.analyze(history);
    expect(summary.irregular).toBe(true);
  });
});
```


### Integration Tests

```typescript
describe("Cycle Prediction Integration", () => {
  it("should provide consistent predictions across methods", () => {
    const engine = new PredictionEngine();
    const history = {
      periodStarts: [
        { date: "2025-01-01" },
        { date: "2025-01-30" },
        { date: "2025-02-28" },
        { date: "2025-03-29" },
      ],
    };

    const nextPeriod = engine.predictNextPeriod(history);
    const ovulation = engine.predictOvulation(history);
    const fertile = engine.predictFertileWindow(history);

    // Проверяем логическую связь между прогнозами
    expect(nextPeriod.likely).toBeTruthy();
    expect(ovulation.likely).toBeTruthy();
    expect(fertile.start).toBeTruthy();
    expect(fertile.end).toBeTruthy();
  });
});
```


## 🚀 Performance

### Optimization for Large Data Volumes

```typescript
class OptimizedPredictionEngine extends PredictionEngine {
  private cache = new Map<string, any>();

  predictNextPeriod(history: HistoryInput): PredictionResult {
    const cacheKey = this.generateCacheKey(history);

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const result = super.predictNextPeriod(history);
    this.cache.set(cacheKey, result);

    return result;
  }

  private generateCacheKey(history: HistoryInput): string {
    return JSON.stringify(history.periodStarts.map((p) => p.date));
  }

  clearCache(): void {
    this.cache.clear();
  }
}
```


### Web Worker for Heavy Computations

```typescript
// worker.ts
import { PredictionEngine } from "cyclia";

self.onmessage = (event) => {
  const { history, config } = event.data;

  try {
    const engine = new PredictionEngine(config);
    const predictions = {
      nextPeriod: engine.predictNextPeriod(history),
      ovulation: engine.predictOvulation(history),
      fertile: engine.predictFertileWindow(history),
      summary: engine.analyze(history),
    };

    self.postMessage({ success: true, predictions });
  } catch (error) {
    self.postMessage({ success: false, error: error.message });
  }
};

// main.ts
const worker = new Worker("./worker.js");

worker.onmessage = (event) => {
  if (event.data.success) {
    setPredictions(event.data.predictions);
  } else {
    setError(event.data.error);
  }
};

const calculatePredictions = (history: HistoryInput) => {
  worker.postMessage({ history, config: { strategy: "wma" } });
};
```


## 🔒 Security and Privacy

### Local Data Processing

```typescript
class PrivacyAwarePredictionEngine extends PredictionEngine {
  // Все вычисления происходят локально
  // Данные не отправляются на сервер

  predictNextPeriod(history: HistoryInput): PredictionResult {
    // Локальная обработка
    return super.predictNextPeriod(history);
  }
}
```


### Data Encryption

```typescript
import CryptoJS from "crypto-js";

class EncryptedDataService {
  private readonly SECRET_KEY = "your-secret-key";

  encryptData(data: any): string {
    return CryptoJS.AES.encrypt(
      JSON.stringify(data),
      this.SECRET_KEY
    ).toString();
  }

  decryptData(encryptedData: string): any {
    const bytes = CryptoJS.AES.decrypt(encryptedData, this.SECRET_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  }

  async saveEncryptedHistory(history: HistoryInput): Promise<void> {
    const encrypted = this.encryptData(history);
    localStorage.setItem("encrypted_cycle_data", encrypted);
  }

  async loadEncryptedHistory(): Promise<HistoryInput> {
    const encrypted = localStorage.getItem("encrypted_cycle_data");
    if (!encrypted) return { periodStarts: [] };

    return this.decryptData(encrypted);
  }
}
```


## 📊 Monitoring and Analytics

### Usage Logging

```typescript
class AnalyticsService {
  logPredictionRequest(history: HistoryInput, predictions: any): void {
    const event = {
      timestamp: new Date().toISOString(),
      dataPoints: history.periodStarts.length,
      predictionType: "cycle",
      confidence: predictions.nextPeriod.confidence,
      irregular: predictions.summary.irregular,
    };

    // Отправка в аналитическую систему
    this.sendAnalytics(event);
  }

  private sendAnalytics(event: any): void {
    // Интеграция с Google Analytics, Mixpanel, etc.
    if (typeof gtag !== "undefined") {
      gtag("event", "cycle_prediction", event);
    }
  }
}
```


## 🤝 Contributing

### Development Setup

```bash
git clone https://github.com/NextFutureHub/cyclia.git
cd cyclia
npm install
npm run test
```


### Project Structure


```
cyclia/
├── src/
│   ├── core/           # Core logic
│   ├── plugins/        # Prediction algorithms
│   ├── utils/          # Utilities
│   ├── types.ts        # TypeScript types
│   └── index.ts        # Entry point
├── tests/              # Tests
├── docs/               # Documentation
└── examples/           # Usage examples
```


### Adding New Algorithms

1. Create a new class that extends `BaseRule`
2. Implement the `predictNextPeriod` and `predictFertility` methods
3. Add tests
4. Update documentation

```typescript
// src/plugins/yourAlgorithm.ts
import { BaseRule } from "./baseRule";

export class YourAlgorithm extends BaseRule {
  readonly id = "your-algorithm";

  predictNextPeriod(history, cfg, summary) {
    // Your logic here
    return {
      likely: "2025-06-15",
      window: { start: "2025-06-13", end: "2025-06-17" },
      confidence: 0.8,
      notes: ["your algorithm"],
    };
  }
}
```


### Submitting a Pull Request

1. Fork the repository
2. Create a branch for your feature
3. Add tests
4. Update documentation
5. Submit a Pull Request


## 📈 Roadmap

### Planned Features

- [ ] Machine learning for improved accuracy
- [ ] Integration with wearable devices
- [ ] Multi-user support
- [ ] API for server-side processing
- [ ] Plugins for popular frameworks
- [ ] Integration with medical systems


### Versions

- **v1.0.0** - Basic functionality


## 📞 Support

- **Email**: support@cycle-predictor.com


## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

⭐ If you like this library, consider giving it a star on GitHub!

---

**Important**: This library is for informational purposes only and does not replace medical advice. Always consult your doctor for health matters.
