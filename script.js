const app = {};

// Global Variables



// Ajax Call/Promise
app.strainPromise = () => {

    $.ajax({
        url: `http://strainapi.evanbusse.com/i1WrQR6/strains/search/all`,
        method: `GET`,
        dataType: `json`

    })
    .then((res) => {
        console.log(res)

    })
    // Error handling
    .catch( (err) => {
        console.log("No data to display")
    })

    
}





// Init
app.init = function (){
    // start app here
    app.strainPromise()

    // event handlers
}



// Document Ready
$(function(){

    app.init()

})