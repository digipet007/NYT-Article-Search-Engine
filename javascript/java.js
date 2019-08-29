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
            //remove all child nodes from card section whenever the API call is made. (deals with edge case of piling cards on multiple searches)
            $("#card-section").empty();
            console.log(queryURL);
            for(i = 0; i < numArticles; i++){
                // console.log(NYTData.response.docs[i].web_url);

                //Manipulate DOM to create a div for each displayed item
                var cardSection = $("<div>");
                cardSection.addClass("card card-body bg-light");
                cardSection.attr("id", "article-" + i);
                $("#card-section").append(cardSection);

                //if the returned object is missing key values, don't render that info
                //this series of conditionals tracks headline and section name to make sure they exist
                if(NYTData.response.docs[i].headline != null){
                    // console.log(NYTData.response.docs[i].headline.main);
                    $("#article-" + i).append("<h3>" + NYTData.response.docs[i].headline.main + "</h3>");
                }
                //if there is a byline and it has the property/key of "original", then render it
                // if(NYTData.response.docs[i].byline && NYTData.response.docs[i].byline.hasOwnProperty("original")){
                if(NYTData.response.docs[i].byline && NYTData.response.docs[i].byline.original != null){
                    console.log(NYTData.response.docs[i].byline.original);
                    $("#article-" + i).append("<h4>" + NYTData.response.docs[i].byline.original + "</h4>");
                }

                // Attach article content to its respective div
                $("#article-" + i).append("<h5>" + NYTData.response.docs[i].section_name + "</h5>");
                $("#article-" + i).append("<h5>" + NYTData.response.docs[i].pub_date + "</h5>");
                $("#article-" + i).append("<a href=" + NYTData.response.docs[i].web_url + ">" + NYTData.response.docs[0].web_url + "</a>");
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
