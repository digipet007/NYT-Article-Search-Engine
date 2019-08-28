//SETUP VARIABLES
//===============================================
var authKey = "psE8JudDOYAJlFc7J0AcAFAwAGlJ0rsG";
var queryTerm = "";
var numResults = 0;
var startYear = 0;
var endYear = 0;

//URL Base
var queryURLBase = "https://api.nytimes.com/svc/search/v2/articlesearch.json?" + "&api-key=" + authKey;

//track number of articles
var articleCounter = 0;

//FUNCTIONS
//===============================================

function runQuery(numArticles, queryURL){
    
    //AJAX Function
    $.ajax({url: queryURL, method: "GET"})
        .done(function(NYTData){
            console.log(queryURL);
            for(i = 0; i < numArticles; i++){
                console.log(NYTData.response.docs[i].web_url);

                //Manipulate DOM to create a div for each displayed item
                var cardSection = $("<div>");
                cardSection.addClass("card card-body bg-light");
                cardSection.attr("id", "article-" + i);
                $("#card-section").append(cardSection);

                // Attach article content to its respective div
                var title = (NYTData.response.docs[i].headline.main);
                $("article-" + i).append(title);
                // var author = NYTData.response.docs[0].byline.original
                // var section = NYTData.response.docs[0].section_name
                // var date = NYTData.response.docs[0].pub_date;
                // var link = NYTData.response.docs[0].web_url;
            }
            
            // console.log(numResults)
            console.log(NYTData);
        })
    
}

//MAIN PROCESSES
//===============================================

$("#searchBtn").on("click", function(){

    //gets search term to add to queryURLBase
    queryTerm = $("#search").val().trim();
    // console.log(queryTerm);
    var newURL = queryURLBase + "&q=" + queryTerm;

    //Add in the number of reords to retrieve
    numResults = parseInt($("#numRecords").val(), 10); 
    // console.log(numResults);
    // console.log(typeof numResults);

    //Get the start year and the end year
    startYear = $("#startYear").val().trim();
    endYear = $("#endYear").val().trim();

    // console.log(queryURLBase);

    if(parseInt(startYear)) {
        startYear = startYear + "0101";
        parseInt(startYear);
        //Add the date info to the URL
        newURL = newURL + "&begin_date=" + startYear;
    }
    if(parseInt(endYear)) {
        endYear = endYear + "0101";
        parseInt(endYear);
        //Add the date info to the URL
        newURL = newURL + "&end_date=" + endYear;
    }

    // console.log(newURL);
    //Send the AJAX Call the URL
    runQuery(numResults, newURL);

    //prevents program from going to a new page
    return false;
})

//1. Retrieve user inputs and convert to variables
//2. Use those variabes to run an AJAX call to the New York Times
//3. Break Down the NYT Object into usable fields
//4. Dynamically generate html content 

//5. Dealing with "edge cases" --bugs or situations that are not intuitive
