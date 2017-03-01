//gregt try catch
//gregt use strict
//gregt try diff locales (should work for free)
//gregt disable til dom loaded
//gregt sort icons overlapping col hdr text

$(function () {

    psuedoClick();

    function psuedoClick() {
        chrome.tabs.query(
            { active: true, currentWindow: true },
            function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { action: "sendTotalsToPopUp" }, domCallBack);
            });
    };

        
    function domCallBack(obj) {

        var totalInstallCount = 0;
        var totalReviewCount = 0;
        var rowOpen = "<tr>";
        var rowClose = "</tr>";

        //Data rows
        for (var i = 0; i < obj.length; i++)
        {
            var numericInstallCount = parseInt(obj[i]["InstallCount"]);
            var numericReviewCount = parseInt(obj[i]["ReviewCount"]);
            var numericReviewsAsPercentageOfInstalls = parseFloat(obj[i]["ReviewsAsPercentageOfInstalls"]).toFixed(2)

            totalInstallCount += numericInstallCount;
            totalReviewCount += numericReviewCount;

            var colInstallCount = "<td class='numeric'>" + numericInstallCount.toLocaleString() + "</td>";
            var colIcon = "<td><img src=\"" + obj[i]["Icon"] + "\" style=\"height: 18%\"></td>";
            var colItemTitle = "<td><div title=\"" + obj[i]["FullDescription"] + "\">"
                + "<a href=\"" + obj[i]["URL"] + "\" target=\"_blank\">"
                + obj[i]["ItemTitle"]
                + "</a></div></td>";

            var colReviewCount = "<td class='numeric'>" + numericReviewCount.toLocaleString() + "</td>";
            var colReviewsAsPercentageOfInstalls = "<td><div title=\"" + obj[i]["ReviewsAsPercentageOfInstalls"] + "\">" + numericReviewsAsPercentageOfInstalls + "</div></td>";
            var colPublisher = "<td>"
                + "<a href=\""
                + "https://marketplace.visualstudio.com/search?term=publisher%3A%22"
                + obj[i]["Publisher"]
                + "%22&target=VS&sortBy=Relevance"
                + "\" target=\"_blank\">"
                + obj[i]["Publisher"]
                + "</a></td>";
            
            var colPrice = "<td>" + obj[i]["Price"] + "</td>";
            var colAverageReview = "<td>" + obj[i]["AverageReview"] + "</td>";

            $("#DetailGridTableBody").append(
                rowOpen +
                colInstallCount +
                colIcon +
                colItemTitle +
                colReviewCount +
                colReviewsAsPercentageOfInstalls +
                colPublisher +
                colPrice +
                colAverageReview +
                rowClose);
        }

        //Set the totals
        document.getElementById('TotalInstallCount').innerHTML = totalInstallCount.toLocaleString();
        document.getElementById('TotalReviewCount').innerHTML = totalReviewCount.toLocaleString();
        document.getElementById('GridTotalInstallCount').innerHTML = totalInstallCount.toLocaleString();
        document.getElementById('GridTotalReviewCount').innerHTML = totalReviewCount.toLocaleString();

        //Enable table sorting
        $(document).ready(function () {
            $("#DetailGridTable").tablesorter();

        }); 

    }
});
