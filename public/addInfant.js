function handleBreederAccept(){

  var price       = document.querySelectorAll('[name=price]')[0]
  var birthdate   = document.querySelectorAll('[name=date]')[0]
  var image       = document.querySelectorAll('[name=image]')[0]
  var shortdescription = document.querySelectorAll('[name=short-description]')[0]
  var longdescription = document.querySelectorAll('[name=long-description]')[0]
  var mother      = document.querySelectorAll('[name=mother]')[0]
  var father      = document.querySelectorAll('[name=father]')[0]

  if(!birthdate || !image || !price || !longdescription || !shortdescription){
    alert("You must input all required fields!");
  }
  else{
    var postRequest = new XMLHttpRequest();
    var postURL = '/addInfant';
    postRequest.open('post', postURL);

    var bunObj = {
      price: parseInt(price.value),
      birthdate: birthdate.value,
      image: image.value,
      shortdescription: shortdescription.value,
      longdescription: longdescription.value,
      mother: mother.value,
      father: father.value
    };

    var requestBody = JSON.stringify(bunObj);

    postRequest.setRequestHeader('Content-Type', 'application/json');
    postRequest.addEventListener('load', function(event){
      if(event.target.status !== 200){
        alert("Error uploading new breeder to DB: " + event.target.response);
      } else {
        alert("Sent!");
      }
    });

    postRequest.send(requestBody);
  }
}

window.addEventListener('DOMContentLoaded', function () {
  var bunnyAcceptButton = document.getElementById('bunny-accept');
  bunnyAcceptButton.addEventListener('click', handleBreederAccept);
});
