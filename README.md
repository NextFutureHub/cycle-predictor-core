# cycle-predictor-core

**Предупреждение:** библиотека не является медицинским изделием и не заменяет консультацию врача. Все прогнозы вероятностные.

## Установка

```bash
npm i cycle-predictor-core
```

## Быстрый старт

```ts
import { PredictionEngine } from "cycle-predictor-core";

const engine = new PredictionEngine({ strategy: "wma" });

const history = {
  periodStarts: [
    { date: "2025-01-02" },
    { date: "2025-01-31" },
    { date: "2025-03-01" },
    { date: "2025-03-29" },
    { date: "2025-04-27" },
  ],
};

console.log("next period", engine.predictNextPeriod(history));
console.log("ovulation", engine.predictOvulation(history));
console.log("fertile window", engine.predictFertileWindow(history));
```

## API

- `new PredictionEngine(config?)` — инициализация; ключевые опции:
  - `strategy`: `'wma' | 'calendar'` (по умолчанию `wma`)
  - `lutealPhaseDays`: по умолчанию `14`
  - `irregularityStdThreshold`: по умолчанию `4`
- `engine.analyze(history)` → сводка по данным
- `engine.predictNextPeriod(history)` → дата + окно + confidence
- `engine.predictOvulation(history)` → дата + окно + confidence
- `engine.predictFertileWindow(history)` → окно фертильности

### Расширение правилами

```ts
import { BaseRule } from "cycle-predictor-core/dist/plugins/baseRule";

class CustomRule extends BaseRule {
  id = "custom";
  predictNextPeriod(history, cfg, summary) {
    // ваша логика...
    return { likely: null, window: null, confidence: 0, notes: ["custom"] };
  }
}

engine.register(new CustomRule());
```

## Данные

`history.periodStarts[]` — массив дат первого дня цикла (YYYY-MM-DD). Минимум 2 даты для базового прогноза, 3+ для умеренной уверенности, 6+ — высокая уверенность.

## Лицензия

MIT

// ─────────────────────────────────────────────────────────────────────────────
// file: LICENSE
MIT License

Copyright (c) 2025 Your Name

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
