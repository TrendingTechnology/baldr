exports.render = function(data, presentation) {
  return `
<section id="master-person">

  <img src="${presentation.pwd}/${data.image}">

  <div id="info-box">
    <p>${data.name}</p>
  </div>

</section>
`;

};
