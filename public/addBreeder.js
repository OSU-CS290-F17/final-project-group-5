function handleBreederAccept(){

  var name        = document.querySelectorAll('[name=name]')[0]
  var birthdate   = document.querySelectorAll('[name=date]')[0]
  var image       = document.querySelectorAll('[name=image]')[0]
  var description = document.querySelectorAll('[name=description]')[0]
  var mother      = document.querySelectorAll('[name=mother]')[0]
  var father      = document.querySelectorAll('[name=father]')[0]
  var isCurrent   = document.querySelectorAll('[name=iscurrent]')[0]
  var breed       = document.querySelectorAll('[name=breed]')[0]

  if(!name || !birthdate || !image || !breed){
    alert("You must input all required fields!");
  }
  else{
    var postRequest = new XMLHttpRequest();
    var postURL = '/addBreeder';
    postRequest.open('post', postURL);

    var bunObj = {
      name: name.value,
      birthdate: birthdate.value,
      image: image.value,
      description: description.value,
      mother: mother.value,
      father: father.value,
      isCurrent: isCurrent.checked,
      breed: breed.value
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
