exports.getItems = (req, res, next) => {
  const data = [
    'apples',
    'oranges',
    'bananas'
  ];
  res.send(JSON.stringify(data));
};
