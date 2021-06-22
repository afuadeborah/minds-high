const app = {};

// Global Variables
app.strainArr = []

app.strainResult = []

app.classes = []


// Ajax Call/Promise
app.strainPromise = () => {

    $.ajax({
        url: `http://strainapi.evanbusse.com/i1WrQR6/strains/search/all`,
        method: `GET`,
        dataType: `json`

    })
    .then((data) => {

        // Info comes back as an object and I need the names AND the info for each to convert it all to an array

        const allStrains = Object.entries(data)

        app.getStrains(allStrains)
    
        console.log(allStrains)
    })
    // Error handling
    .catch( () => {
        console.log("No data to display")
    })

}


// Pull off data needed
app.getStrains = (data) => {

    data.map((strain) => {

        const strains = {
            "name": strain[0],
            "race": strain[1].race,
            "effects": strain[1].effects.positive,
        }
        
        return app.strainArr.push(strains)
        
    })

}


// Print one race of strains on filter
app.printStrains = (array) => {

    const sliced = array.slice(0, 31)
    const strainCont = $('.strain-container')


    sliced.forEach((arr) => {
        // Abbreviate the name of the strain
        const strainName = arr.name
        const strainEff = arr.effects

        // Thank you Beyond Bootcamp! Capitalize and grab the first 2 letters
        const capitalize = (string) => {

            const strArray = [...string]

            const newArray = strArray.map((s, index, array) => {

                if(index === 0 || array[index - 1] === ' ') {

                    return array[index].toUpperCase()

                }

                return s

            });

            return newArray.join('').substring(0, 2)

        }

        // Split the effects array to display on each card
        const split = (str) => {

            const effArray = [...str]

            const splFx = effArray.map((s, index, arr) => {

                if (array[index - 1] === ',') {

                    return array[index].split(" ")
                }

                return s
            })

            return splFx.join(" | ")
        }

        // This will add filterable attributes as data categories we can filter through later
        const dataCat = (str) => {
            const fxArray = [...str]

            const dataFx = fxArray.map((s, index, arr) => {

                if (array[index - 1] === ',') {

                    return array[index].split(" ")
                }

                return s
            })

            return dataFx.join(" ").toLowerCase()
        }

        const innerHtml = `
            <div class="strain-card ${arr.race} ${dataCat(strainEff)}" tabindex="0">

                <div class="result-info">
                    <p class="periodic">${capitalize(strainName)}</p>
                    <p class="result-race">${arr.race}</p>
                </div>

                <h3 class="result-title">${strainName}</h3>

                <p class="strain-label">Feel</p>
                <div class="effect-con">
                    <p>${split(strainEff)}</p>
                </div>

            </div>
        `

        strainCont.append(innerHtml)

    })
}


// Shuffle Race Array
app.shuffle = (array) => {

    for (let i = array.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


// Select a race
app.selectRace = () => {
    const delegate = $('.strain-container')
    const delegateClass = delegate[0].children


    $(".race-btn").on('click', function (event) {

        event.preventDefault()

        const name = $(this).val();
        

        const filteredRace = app.strainArr.filter(strains => {

            return strains.race === name
        })
        
        // Fade out the race we clicked on
        $(this).fadeTo("slow", 0.33)


        // Shuffle the strains of the selected race so that we don't get only the first 30 in the same order each time.
        app.shuffle(filteredRace)

        app.strainResult.push(filteredRace)
        
        // Print the results we selected
        app.printStrains(filteredRace)

        //  Convert the classes of each strain we print into an array
        const list = Array.from(delegateClass)
        
        const classes = list.forEach((item) => {
            app.classes.push(item.classList.value.split(' ').splice(2, 7))
        })
        
        
    })
    
    
}


// Filter strains for result
app.clickFilter = () => {

    const effect = $('.effect-btn-container')
    let selectClass = app.classes


    effect.on('click', 'input', function(){
        
        let feeling = this.id
        // Check to see if the box is checked true/false
        if(this.checked) {
            // if true
            for(let i of selectClass) {

                if (i.includes(feeling)){

                    $(`.${feeling}`).addClass('active')
                }
                
            }

    
        }
 
    })
}


// Scroll back to top, clear arrays, empty results, reset it all y'all
app.backToTop = () => {
    const upTop = $('#restart');

    upTop.on('click', function(){
        $('html, body').animate({
        scrollTop: $("header").offset().top
        }, 1200);

        // Empty all the arrays holding user selected info
        app.strainArr = []
        app.strainResult = []
        app.classes = []

        // Clear the results
        $('.strain-container').empty()

        // Uncheck the checkboxes
        $('.race-btn').css('opacity', '1')

        // Fetch data from the API again
        app.strainPromise()
       
    })

}


// Init
app.init = function (){
    // Start app on load
    app.strainPromise()
    app.selectRace()
    // Event handlers
    app.clickFilter()
    app.backToTop()
}


// Document Ready
$(function(){
    app.init()
})


// Create a function that shows an error message if the effects don't match
// Add an uncheck condition
// Add a condition to undo strain type


