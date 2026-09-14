/**
 * Google ADK & AEBOP™ Standard: Quality Flywheel Eval Runner
 * Автоматизированный запуск регрессионных тестов точности калибровки
 * и работы Guardrails Системы Аньянова.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ADKAgentRunner } from '../../src/engine/adk/runtime';

interface TestCase {
  id: string;
  query: string;
  expected: {
    social_x_range: [number, number];
    thermo_y_range: [number, number];
    formal_index: number;
    temperature_c: number;
    requires_approval: boolean;
  };
  description: string;
}

async function runEvaluations() {
  console.log('\n🚀 [Google ADK Quality Flywheel] Запуск регрессионных тестов...');
  const datasetPath = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    'datasets/golden_multi_turn_trajectories.json'
  );

  if (!fs.existsSync(datasetPath)) {
    console.error(`❌ Датасет не найден: ${datasetPath}`);
    process.exit(1);
  }

  const dataset: TestCase[] = JSON.parse(fs.readFileSync(datasetPath, 'utf-8'));
  console.log(`📋 Загружено эталонных сценариев: ${dataset.length}\n`);

  let passed = 0;
  let failed = 0;
  const resultsTable: {
    id: string;
    query: string;
    status: string;
    details: string;
  }[] = [];

  for (const tc of dataset) {
    const runner = new ADKAgentRunner();
    const res = await runner.run(tc.query);

    const issues: string[] = [];

    // 1. Проверка Approval Gate
    const approvalTriggered = !!res.pendingApproval?.required;
    if (tc.expected.requires_approval !== approvalTriggered) {
      issues.push(
        `ApprovalGate mismatch: ожидалось ${tc.expected.requires_approval}, получено ${approvalTriggered}`
      );
    }

    // Если был Approval Gate, проверяем аргументы в pendingArgs
    const actualCoords = approvalTriggered
      ? {
          socialX: res.pendingApproval?.pendingArgs.social_x,
          thermoY: res.pendingApproval?.pendingArgs.thermo_y,
          formalIndex: res.pendingApproval?.pendingArgs.formal_index,
          temperatureC: res.pendingApproval?.pendingArgs.temperature_c,
        }
      : res.state.currentCoords;

    // 2. Проверка SocialX
    const [minX, maxX] = tc.expected.social_x_range;
    if (actualCoords.socialX < minX - 0.05 || actualCoords.socialX > maxX + 0.05) {
      issues.push(
        `SocialX ${actualCoords.socialX.toFixed(2)} вне диапазона [${minX}, ${maxX}]`
      );
    }

    // 3. Проверка ThermoY
    const [minY, maxY] = tc.expected.thermo_y_range;
    if (actualCoords.thermoY < minY - 0.05 || actualCoords.thermoY > maxY + 0.05) {
      issues.push(
        `ThermoY ${actualCoords.thermoY.toFixed(2)} вне диапазона [${minY}, ${maxY}]`
      );
    }

    // 4. Проверка FormalIndex
    if (actualCoords.formalIndex !== tc.expected.formal_index) {
      issues.push(
        `FormalIndex ${actualCoords.formalIndex} != ожидаемого ${tc.expected.formal_index}`
      );
    }

    // 5. Проверка Temperature
    if (Math.abs(actualCoords.temperatureC - tc.expected.temperature_c) > 2) {
      issues.push(
        `Temp ${actualCoords.temperatureC}°C != ожидаемой ${tc.expected.temperature_c}°C`
      );
    }

    if (issues.length === 0) {
      passed++;
      resultsTable.push({
        id: tc.id,
        query: tc.query.substring(0, 35) + (tc.query.length > 35 ? '...' : ''),
        status: '🟢 PASS',
        details: approvalTriggered ? 'Approval Gate OK' : 'Coords & State OK',
      });
    } else {
      failed++;
      resultsTable.push({
        id: tc.id,
        query: tc.query.substring(0, 35) + (tc.query.length > 35 ? '...' : ''),
        status: '🔴 FAIL',
        details: issues.join('; '),
      });
    }
  }

  // Вывод таблицы
  console.log('| ID | Сценарий | Статус | Детали |');
  console.log('|---|---|:---:|---|');
  resultsTable.forEach((r) => {
    console.log(`| ${r.id} | ${r.query} | ${r.status} | ${r.details} |`);
  });

  const passRate = (passed / dataset.length) * 100;
  console.log('\n-------------------------------------------------------------');
  console.log(`Всего тестов: ${dataset.length} | Успешно: ${passed} | Ошибок: ${failed}`);
  console.log(`Итоговый показатель качества (Pass Rate): ${passRate.toFixed(1)}%`);
  console.log('-------------------------------------------------------------\n');

  if (passRate >= 95.0) {
    console.log('✅ [QUALITY FLYWHEEL PASSED] Качество удовлетворяет стандарту Google ADK (>= 95%)!\n');
    process.exit(0);
  } else {
    console.error('❌ [QUALITY FLYWHEEL FAILED] Показатель качества ниже порога 95%!\n');
    process.exit(1);
  }
}

runEvaluations().catch((err) => {
  console.error('Критическая ошибка запуска эвалов:', err);
  process.exit(1);
});
