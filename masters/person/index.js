exports.render = function(data) {
  return `
<section id="baldr-master-quote">

  <p>${data.name}</p>

  <img src="${data.image}">

</section>
`;

};
