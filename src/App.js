import React, { useState } from 'react';

function calculateBayesCriterion(paymentMatrix, probabilities) {
  const n = paymentMatrix.length;
  const m = paymentMatrix[0].length;
  let maxValue = -Infinity;
  let recommendedStrategy = 0;

  for (let i = 0; i < n; i++) {
    let sum = 0;
    for (let j = 0; j < m; j++) {
      sum += paymentMatrix[i][j] * probabilities[j];
    }
    if (sum > maxValue) {
      maxValue = sum;
      recommendedStrategy = i + 1;
    }
  }

  return { recommendedStrategy, maxValue: maxValue.toFixed(2) };
}

function calculateLaplaceCriterion(paymentMatrix) {
  const n = paymentMatrix.length;
  const m = paymentMatrix[0].length;
  const laplaceMatrix = [];

  // Вычисляем среднее арифметическое для каждой стратегии
  for (let i = 0; i < n; i++) {
    let sum = 0;
    for (let j = 0; j < m; j++) {
      sum += paymentMatrix[i][j];
    }
    const average = sum / m;
    laplaceMatrix.push(average);
  }

  // Находим максимальное значение в матрице Лапласа
  const maxValue = Math.max(...laplaceMatrix);

  // Находим индекс максимального значения в матрице Лапласа
  const maxIndex = laplaceMatrix.indexOf(maxValue);

  // Возвращаем номер рекомендуемой стратегии и максимальное значение
  return {
    recommendedStrategy: maxIndex + 1,
    maxValue: maxValue.toFixed(2),
  };
}

function calculateWaldCriterion(paymentMatrix) {
  const n = paymentMatrix.length;
  const m = paymentMatrix[0].length;
  let maxMinValue = -Infinity;
  let recommendedStrategy = 0;

  for (let i = 0; i < n; i++) {
    let minValue = Infinity;
    for (let j = 0; j < m; j++) {
      if (paymentMatrix[i][j] < minValue) {
        minValue = paymentMatrix[i][j];
      }
    }
    if (minValue > maxMinValue) {
      maxMinValue = minValue;
      recommendedStrategy = i + 1;
    }
  }

  return { recommendedStrategy, maxMinValue: maxMinValue.toFixed(2) };
}

function calculateSavageCriterion(paymentMatrix) {
  const n = paymentMatrix.length;
  const m = paymentMatrix[0].length;
  const regretMatrix = [];

  // Вычисляем матрицу рисков
  for (let i = 0; i < n; i++) {
    const maxValue = Math.max(...paymentMatrix[i]);
    const regretRow = [];
    for (let j = 0; j < m; j++) {
      regretRow.push(maxValue - paymentMatrix[i][j]);
    }
    regretMatrix.push(regretRow);
  }

  // Вычисляем максимальное значение в каждой строке матрицы рисков
  const maxRegrets = [];
  for (let i = 0; i < n; i++) {
    const maxRegret = Math.max(...regretMatrix[i]);
    maxRegrets.push(maxRegret);
  }

  // Находим минимальное максимальное значение в матрице рисков
  const minMaxRegret = Math.min(...maxRegrets);

  // Находим индекс минимального максимального значения в матрице рисков
  const minIndex = maxRegrets.indexOf(minMaxRegret);

  // Возвращаем номер рекомендуемой стратегии и минимальное максимальное значение
  return {
    recommendedStrategy: minIndex + 1,
    minMaxRegret: minMaxRegret.toFixed(2),
  };
}

function calculateHurwiczCriterion(paymentMatrix, optimismCoefficient) {
  const n = paymentMatrix.length;
  const m = paymentMatrix[0].length;
  let maxHurwiczValue = -Infinity;
  let recommendedStrategy = 0;

  for (let i = 0; i < n; i++) {
    const maxValue = Math.max(...paymentMatrix[i]);
    const minValue = Math.min(...paymentMatrix[i]);
    const hurwiczValue = optimismCoefficient * maxValue + (1 - optimismCoefficient) * minValue;
    if (hurwiczValue > maxHurwiczValue) {
      maxHurwiczValue = hurwiczValue;
      recommendedStrategy = i + 1;
    }
  }

  return { recommendedStrategy, maxHurwiczValue: maxHurwiczValue.toFixed(2) };
}

function simplifyPaymentMatrix(paymentMatrix) {
  return paymentMatrix.map((row) => row.map((value) => Math.round(value)));
}

function calculateRiskMatrix(paymentMatrix) {
  const n = paymentMatrix.length;
  const m = paymentMatrix[0].length;
  const riskMatrix = [];

  // Вычисляем матрицу рисков
  for (let i = 0; i < n; i++) {
    const maxValue = Math.max(...paymentMatrix[i]);
    const riskRow = [];
    for (let j = 0; j < m; j++) {
      riskRow.push(maxValue - paymentMatrix[i][j]);
    }
    riskMatrix.push(riskRow);
  }

  return riskMatrix;
}

function getSolutionType(paymentMatrix) {
  const n = paymentMatrix.length;
  const m = paymentMatrix[0].length;

  // Проверяем, является ли решение чистым
  for (let i = 0; i < n; i++) {
    let isMax = true;
    for (let j = 0; j < m; j++) {
      if (paymentMatrix[i][j] < paymentMatrix[j][i]) {
        isMax = false;
        break;
      }
    }
    if (isMax) {
      return 'Чистое решение';
    }
  }

  // Если решение не чистое, то оно смешанное
  return 'Смешанное решение';
}

function GameTheorySolution() {
  const [data, setData] = useState({
    abricot: [0, 0, 0, 0],
    pear: [0, 0, 0, 0],
    apple: [0, 0, 0, 0],
    cherry: [0, 0, 0, 0],
    probabilities: [0, 0, 0, 0],
  });
  const [results, setResults] = useState({});

  const handleChange = (event, index, type) => {
    const value = event.target.value;
    const newData = {...data};
    newData[type][index] = value;
    setData(newData);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const abricotProfit = [120 * data.abricot[0], 120 * data.abricot[1], 120 * data.abricot[2], 120 * data.abricot[3]];
    const pearProfit = [90 * data.pear[0], 90 * data.pear[1], 90 * data.pear[2], 90 * data.pear[3]];
    const appleProfit = [70 * data.apple[0], 70 * data.apple[1], 70 * data.apple[2], 70 * data.apple[3]];
    const cherryProfit = [100 * data.cherry[0], 100 * data.cherry[1], 100 * data.cherry[2], 100 * data.cherry[3]];

    const paymentMatrix = [abricotProfit, pearProfit, appleProfit, cherryProfit];
    const simplifiedPaymentMatrix = simplifyPaymentMatrix(paymentMatrix);

    const bayesCriterion = calculateBayesCriterion(paymentMatrix, data.probabilities);
    const laplaceCriterion = calculateLaplaceCriterion(simplifiedPaymentMatrix);
    const waldCriterion = calculateWaldCriterion(simplifiedPaymentMatrix);
    const savageCriterion = calculateSavageCriterion(simplifiedPaymentMatrix);
    const hurwiczCriterion = calculateHurwiczCriterion(simplifiedPaymentMatrix, 0.5);

    const riskMatrix = calculateRiskMatrix(simplifiedPaymentMatrix);

    setResults({
      paymentMatrix,
      simplifiedPaymentMatrix,
      solutionType: getSolutionType(paymentMatrix),
      riskMatrix,
      bayesCriterion,
      laplaceCriterion,
      waldCriterion,
      savageCriterion,
      hurwiczCriterion,
    });
  };

  return (
    <div>
      <h3>Введите данные:</h3>
      <table>
        <thead>
          <tr>
            <th>Место у ручья + тень</th>
            <th>Склон+солнечная сторона</th>
            <th>Место вдоль забора + песок</th>
            <th>Плодородная земля + сила ветра</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><input type="number" value={data.abricot[0]} onChange={(e) => handleChange(e, 0, 'abricot')} /></td>
            <td><input type="number" value={data.abricot[1]} onChange={(e) => handleChange(e, 1, 'abricot')} /></td>
            <td><input type="number" value={data.abricot[2]} onChange={(e) => handleChange(e, 2, 'abricot')} /></td>
            <td><input type="number" value={data.abricot[3]} onChange={(e) => handleChange(e, 3, 'abricot')} /></td>
          </tr>
          <tr>
            <td><input type="number" value={data.pear[0]} onChange={(e) => handleChange(e, 0, 'pear')} /></td>
            <td><input type="number" value={data.pear[1]} onChange={(e) => handleChange(e, 1, 'pear')} /></td>
            <td><input type="number" value={data.pear[2]} onChange={(e) => handleChange(e, 2, 'pear')} /></td>
            <td><input type="number" value={data.pear[3]} onChange={(e) => handleChange(e, 3, 'pear')} /></td>
          </tr>
          <tr>
            <td><input type="number" value={data.apple[0]} onChange={(e) => handleChange(e, 0, 'apple')} /></td>
            <td><input type="number" value={data.apple[1]} onChange={(e) => handleChange(e, 1, 'apple')} /></td>
            <td><input type="number" value={data.apple[2]} onChange={(e) => handleChange(e, 2, 'apple')} /></td>
            <td><input type="number" value={data.apple[3]} onChange={(e) => handleChange(e, 3, 'apple')} /></td>
          </tr>
          <tr>
            <td><input type="number" value={data.cherry[0]} onChange={(e) => handleChange(e, 0, 'cherry')} /></td>
            <td><input type="number" value={data.cherry[1]} onChange={(e) => handleChange(e, 1, 'cherry')} /></td>
            <td><input type="number" value={data.cherry[2]} onChange={(e) => handleChange(e, 2, 'cherry')} /></td>
            <td><input type="number" value={data.cherry[3]} onChange={(e) => handleChange(e, 3, 'cherry')} /></td>
          </tr>
        </tbody>
      </table>
      <table>
        <thead>
          <tr>
            <th>q1</th>
            <th>q2</th>
            <th>q3</th>
            <th>q4</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><input type="number" value={data.probabilities[0]} onChange={(e) => handleChange(e, 0, 'probabilities')} /></td>
            <td><input type="number" value={data.probabilities[1]} onChange={(e) => handleChange(e, 1, 'probabilities')} /></td>
            <td><input type="number" value={data.probabilities[2]} onChange={(e) => handleChange(e, 2, 'probabilities')} /></td>
            <td><input type="number" value={data.probabilities[3]} onChange={(e) => handleChange(e, 3, 'probabilities')} /></td>
          </tr>
        </tbody>
      </table>
      <button type="submit" onClick={handleSubmit}>Рассчитать</button>
      {Object.keys(results).length > 0 && (
        <>
          <h3>Платежная матрица:</h3>
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Место у ручья + тень</th>
                <th>Склон+солнечная сторона</th>
                <th>Место вдоль забора + песок</th>
                <th>Плодородная земля + сила ветра</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Абрикос</td>
                {results.paymentMatrix[0].map((value, index) => (
                  <td key={index}>{value}</td>
                ))}
              </tr>
              <tr>
                <td>Груша</td>
                {results.paymentMatrix[1].map((value, index) => (
                  <td key={index}>{value}</td>
                ))}
              </tr>
              <tr>
                <td>Яблоня</td>
                {results.paymentMatrix[2].map((value, index) => (
                  <td key={index}>{value}</td>
                ))}
              </tr>
              <tr>
                <td>Вишня</td>
                {results.paymentMatrix[3].map((value, index) => (
                  <td key={index}>{value}</td>
                ))}
              </tr>
            </tbody>
          </table>
          <h3>Упрощенная платежная матрица:</h3>
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Место у ручья + тень</th>
                <th>Склон+солнечная сторона</th>
                <th>Место вдоль забора + песок</th>
                <th>Плодородная земля + сила ветра</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Абрикос</td>
                {results.simplifiedPaymentMatrix[0].map((value, index) => (
                  <td key={index}>{value}</td>
                ))}
              </tr>
              <tr>
                <td>Груша</td>
                {results.simplifiedPaymentMatrix[1].map((value, index) => (
                  <td key={index}>{value}</td>
                ))}
              </tr>
              <tr>
                <td>Яблоня</td>
                {results.simplifiedPaymentMatrix[2].map((value, index) => (
                  <td key={index}>{value}</td>
                ))}
              </tr>
              <tr>
                <td>Вишня</td>
                {results.simplifiedPaymentMatrix[3].map((value, index) => (
                  <td key={index}>{value}</td>
                ))}
              </tr>
            </tbody>
          </table>
          <h3>Тип решения:</h3>
          <p>{results.solutionType}</p>
          <h3>Матрица рисков:</h3>
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Место у ручья + тень</th>
                <th>Склон+солнечная сторона</th>
                <th>Место вдоль забора + песок</th>
                <th>Плодородная земля + сила ветра</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Абрикос</td>
                {results.riskMatrix[0].map((value, index) => (
                  <td key={index}>{value}</td>
                ))}
              </tr>
              <tr>
                <td>Груша</td>
                {results.riskMatrix[1].map((value, index) => (
                  <td key={index}>{value}</td>
                ))}
              </tr>
              <tr>
                <td>Яблоня</td>
                {results.riskMatrix[2].map((value, index) => (
                  <td key={index}>{value}</td>
                ))}
              </tr>
              <tr>
                <td>Вишня</td>
                {results.riskMatrix[3].map((value, index) => (
                  <td key={index}>{value}</td>
                ))}
              </tr>
            </tbody>
          </table>
          <h3>Рекомендации:</h3>
          <Results
            criterion="Байеса"
            recommendation={results.bayesCriterion.recommendedStrategy}
            maxValue={results.bayesCriterion.maxValue}
          />
          <Results
            criterion="Лапласа"
            recommendation={results.laplaceCriterion.recommendedStrategy}
            maxValue={results.laplaceCriterion.maxValue}
          />
          <Results
            criterion="Вальда"
            recommendation={results.waldCriterion.recommendedStrategy}
            maxValue={results.waldCriterion.maxMinValue}
          />
          <Results
            criterion="Сэвиджа"
            recommendation={results.savageCriterion.recommendedStrategy}
            maxValue={results.savageCriterion.minMaxRegret}
          />
          <Results
            criterion="Гурвица"
            recommendation={results.hurwiczCriterion.recommendedStrategy}
            maxValue={results.hurwiczCriterion.maxHurwiczValue}
          />
        </>
      )}
    </div>
  );
}

const Results = ({ criterion, recommendation, maxValue }) => (
  <div>
    <h3>Критерий: {criterion}</h3>
    <p>Рекомендуется выбрать стратегию: {recommendation} (максимальное значение: {maxValue})</p>
  </div>
);

export default GameTheorySolution;
