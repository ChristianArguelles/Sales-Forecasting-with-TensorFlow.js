import * as tf from '@tensorflow/tfjs';

export const trainModel = async (data) => {
  const inputs = data.map((d) => [d.sales_date, d.product_description]);
  const outputs = data.map((d) => d.quantity_sold);

  const inputTensor = tf.tensor2d(inputs);
  const outputTensor = tf.tensor2d(outputs, [outputs.length, 1]);

  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 10, activation: 'relu', inputShape: [2] }));
  model.add(tf.layers.dense({ units: 1 }));

  model.compile({
    optimizer: 'adam',
    loss: 'meanSquaredError',
  });

  await model.fit(inputTensor, outputTensor, { epochs: 50, shuffle: true });

  return model;
};

export const makePredictions = (model, futureData) => {
  const inputTensor = tf.tensor2d(futureData);
  const predictions = model.predict(inputTensor).dataSync();
  return predictions;
};
