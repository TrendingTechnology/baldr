exports.render = function(data, presentation) {
  return `
<section id="baldr-master-person">

  <p>${data.name}</p>

  <img src="${presentation.pwd}/${data.image}">

</section>
`;

};
