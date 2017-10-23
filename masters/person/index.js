exports.render = function(data, presentation) {
  return `
<section id="baldr-master-quote">

  <p>${data.name}</p>

   ${presentation.pwd}

  <img src="${presentation.pwd}/${data.image}">

</section>
`;

};
