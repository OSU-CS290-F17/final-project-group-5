function handleDeletePost(event){
    
    var result = confirm("Want to delete this bunny?");
    if (result) {
        
        var deleteRequest = new XMLHttpRequest();
        var deleteBunnyURL = window.location.pathname.substr(window.location.pathname.lastIndexOf('/')+1);
        deleteRequest.open('DELETE', deleteBunnyURL);
        
        var delObj = {
            id: deleteBunnyURL
        };
    
        var requestBody = JSON.stringify(delObj);
    
        deleteRequest.setRequestHeader('Content-type', 'application/json');
        deleteRequest.addEventListener('load', function(event){
            if(event.target.status !== 200){
                alert("Error deleting bunny from DB: " + event.target.response);
            }
            else{
                window.location.href = "/";
            }
        });
    
        deleteRequest.send(requestBody);
    }
    

}

window.addEventListener('DOMContentLoaded', function () {
    var deleteButton = document.getElementById('delete-bunny-button');
    deleteButton.addEventListener('click', handleDeletePost);
    
});
