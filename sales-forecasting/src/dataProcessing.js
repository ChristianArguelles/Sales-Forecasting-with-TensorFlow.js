export const preprocessData = (rawData) => {
    const products = [...new Set(rawData.map((row) => row.product_description))];
    const productMap = products.reduce((map, product, index) => {
      map[product] = index;
      return map;
    }, {});
  
    const quantities = rawData.map((row) => parseFloat(row.quantity_sold));
    const maxQuantity = Math.max(...quantities);
    const minQuantity = Math.min(...quantities);
  
    const normalize = (value) => (value - minQuantity) / (maxQuantity - minQuantity);
  
    return rawData.map((row) => ({
      sales_date: parseInt(row.sales_date.split('-')[1], 10),
      product_description: productMap[row.product_description],
      quantity_sold: normalize(parseFloat(row.quantity_sold)),
    }));
  };
  