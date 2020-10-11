module.exports.History = class {
  constructor() {
    this.items = [];
  }

  addItem(item) {
    this.items.splice(0, 0, item);
  }
};

module.exports.generateHistoryContent = (history) => {
  const itemsHtml = history.items.map(v => `<tr><td>${v}</td></tr>`).join('');
  return `
<html>
<head>
<style>
table {
  border-collapse: collapse;
  width: 100%;
}

td {
  padding: 0px;
  text-align: left;
  border-bottom: 1px solid #ddd;
  font-family: monospace;
}

tr:hover {background-color:#f5f5f5;}

</style>
</head>
<body>
<table>
  ${itemsHtml}
</table>

</body>
</html>`;
};