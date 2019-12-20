// $(function() {
//   $("#queryForm")
//     .parsley()
//     .on("field:validated", function() {
//       console.log("validated whether true or false");
//     });
// });

// require("dotenv").config();

//SETUP VARIABLES
//===============================================
// var authKey = process.env.API_KEY;
var queryTerm = "";
var numResults = 0;
var startYear = 0;
var endYear = 0;

//URL Base
var queryURLBase =
  "https://api.nytimes.com/svc/search/v2/articlesearch.json?" +
  "&api-key=" +
  // process.env.API_KEY;
  "psE8JudDOYAJlFc7J0AcAFAwAGlJ0rsG";
//bug: can't access environmental variable because this file is on the front end

//FUNCTIONS
//===============================================

function runQuery(numArticles, queryURL) {
  //AJAX Function
  $.ajax({ url: queryURL, method: "GET" }).done(function(NYTData) {
    console.log(queryURL);
    console.log(NYTData);
    $("#card-section").empty();
    for (i = 0; i < numArticles; i++) {
      //Manipulate DOM to create a div for each displayed item
      var cardSection = $("<div>");
      cardSection.addClass("card card-body bg-light");
      cardSection.attr("id", "article-" + i);
      $("#card-section").append(cardSection);
      //if the returned object is missing key values, don't render that info
      //this series of conditionals tracks headline and section name to make sure they exist
      if (NYTData.response.docs[i].headline !== null) {
        $("#article-" + i).append(
          "<h3>" + NYTData.response.docs[i].headline.main + "</h3>"
        );
      }
      //if there is a byline and it has the property/key of "original", then render it
      if (
        NYTData.response.docs[i].byline &&
        NYTData.response.docs[i].byline.original !== null
      ) {
        console.log(NYTData.response.docs[i].byline.original);
        $("#article-" + i).append(
          "<h4>" + NYTData.response.docs[i].byline.original + "</h4>"
        );
      }
      // Attach article content to its respective div
      var betterdate = moment(NYTData.response.docs[i].pub_date).format(
        "MMMM Do YYYY, h:mm:ss a"
      );
      console.log(betterdate);
      $("#article-" + i).append(
        "<h5>" + NYTData.response.docs[i].section_name + "</h5>"
      );
      $("#article-" + i).append("<h5>" + betterdate + "</h5>");
      $("#article-" + i).append(
        "<a href=" +
          NYTData.response.docs[i].web_url +
          ">" +
          NYTData.response.docs[0].web_url +
          "</a>"
      );
    }
  });
}
//MAIN PROCESSES
//===============================================
$("#searchBtn").on("click", function() {
  $("#queryForm").parsley();
  //get search term to add to queryURLBase
  queryTerm = $("#search")
    .val()
    .trim();
  var newURL = queryURLBase + "&q=" + queryTerm;
  //Add in the number of reords to retrieve
  numResults = parseInt($("#numRecords").val(), 10);
  //Get the start year and the end year
  startYear = $("#startYear")
    .val()
    .trim();
  endYear = $("#endYear")
    .val()
    .trim();
  // Validate Input
  var todaysYear = moment().year();
  var intStartYear = parseInt(startYear);
  var intEndYear = parseInt(endYear);

  //validation
  if (startYear && endYear) {
    if (todaysYear < intStartYear || todaysYear < intEndYear) {
      console.log("start year less than end year");
      return false;
    }
  }
  if (startYear) {
    console.log("we have a start year");
    if (isNaN(startYear)) {
      console.log("start year not a num!");
      return false;
    }
  }
  if (endYear) {
    console.log("we have an end year");
    if (isNaN(endYear)) {
      console.log("end year not a num!");
      return false;
    }
  }
  if (intStartYear) {
    if (intStartYear < 1900) {
      console.log("start year too small!");
      return false;
    }
  }
  if (intEndYear) {
    if (intEndYear < 1900) {
      console.log("end year too small");
      return false;
    }
  }
  if (!queryTerm) {
    return false;
  }
  //Define URL
  if (intStartYear) {
    startYear = startYear + "0101";
    parseInt(startYear);
    //Add the date info to the URL
    newURL = newURL + "&begin_date=" + startYear;
  }
  if (intEndYear) {
    endYear = endYear + "0101";
    parseInt(endYear);
    //Add the date info to the URL
    newURL = newURL + "&end_date=" + endYear;
  }
  //Send the AJAX Call the URL
  runQuery(numResults, newURL);
  console.log("ran query");
  //prevents program from going to a new page
  return false;
});

$("#clear").on("click", function() {
  $(".clearThis").empty();
  $("#search").val("");
  $("#startYear").val("");
  $("#endYear").val("");
});
