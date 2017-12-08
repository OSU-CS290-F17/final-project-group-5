function handleBuyPost(event){

  var result = confirm("Want to buy this bunny?");
  if (result) {

    var buyRequest = new XMLHttpRequest();
    var buyBunnyURL = "/buybunny";
    buyRequest.open('POST', buyBunnyURL);

    var buyObj = {
      id: window.location.pathname.substr(window.location.pathname.lastIndexOf('/')+1)
    };

    var requestBody = JSON.stringify(buyObj);

    buyRequest.setRequestHeader('Content-type', 'application/json');
    buyRequest.addEventListener('load', function(event){
      if(event.target.status !== 200){
        alert("Error buying bunny from DB: " + event.target.response);
      }
      else{
        window.location.href = "/";
      }
    });
    buyRequest.send(requestBody);
  }
}

window.addEventListener('DOMContentLoaded', function () {
  var buyButton = document.getElementById('buy-bunny-button');
  buyButton.addEventListener('click', handleBuyPost);

});
