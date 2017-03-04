//gregt disable til dom loaded
//gregt jslint
//gregt numeric formating (w/o screwing up sorting)
//1 review not reviews
//hide hdr avg review when nil reviews


//////try diff locales (should work for free)
//////try catch
//////cdn for jquery, with a fallback
//////mads kristensens tweet about low nbr of reviews
//////aria tags
//////minify the extension if large kb ?
//////use strict

$(function () {

    onLoadRequestDomFromVsmp();

    function onLoadRequestDomFromVsmp() {
        chrome.tabs.query(
            { active: true, currentWindow: true },
            function (tabs) {
                chrome.tabs.sendMessage(
                    tabs[0].id,
                    { action: "requestDomFromVsmmPopUp" },
                    popUpCallBack
                    );
            });
    };

    function popUpCallBack(vsmpDom) {

        if (vsmpDom.length == 0) {
            document.getElementById('nilSearchResults').removeAttribute("hidden");
        }
        else {
            if (vsmpDom[0]["URL"] == "notAllowed") {
                document.getElementById('dataUnavailable').removeAttribute("hidden");
            }
            else {

                document.getElementById('dataAvailable').removeAttribute("hidden");

                var totalInstallCount = 0;
                var totalReviewCount = 0;
                var numericAverageReviewSum = 0;
                var rowOpen = "<tr>";
                var rowClose = "</tr>";

                for (var i = 0; i < vsmpDom.length; i++) {

                    var numericInstallCount = parseInt(vsmpDom[i]["InstallCount"]);
                    var numericReviewCount = parseInt(vsmpDom[i]["ReviewCount"]);
                    var numericReviewsAsPercentageOfInstalls = (numericReviewCount / numericInstallCount) * 100;//gregt divide by zero ! //gregt dedupe
                    var numericAverageReview = parseInt(vsmpDom[i]["AverageReview"]);

                    totalInstallCount += numericInstallCount;
                    totalReviewCount += numericReviewCount;
                    numericAverageReviewSum += numericAverageReview;

                    var colInstallCount = "<td class='numeric'>" + numericInstallCount + "</td>";

                    var colItemTitle = "<td>"
                        + "<div title=\"" + vsmpDom[i]["FullDescription"] + "\">"
                        + "<a href=\"" + vsmpDom[i]["URL"] + "\" target=\"_blank\">"
                        + "<img src=\"" + vsmpDom[i]["Icon"] + "\" style=\"width: 18%; height: 18%;\">"
                        + "&nbsp;"
                        + vsmpDom[i]["ItemTitle"]
                        + "</a></div></td>";

                    var colReviewCount = "<td class='numeric'>" + numericReviewCount + "</td>";

                    var colReviewsAsPercentageOfInstalls = "<td class='numeric'><div title=\""
                       + numericReviewsAsPercentageOfInstalls.toFixed(9) + "\">"
                       + numericReviewsAsPercentageOfInstalls.toFixed(2) + "</div></td>";

                    var colPublisher = "<td>"
                        + "<a href=\""
                        + "https://marketplace.visualstudio.com/search?term=publisher%3A%22"
                        + vsmpDom[i]["Publisher"]
                        + "%22&target=VS&sortBy=Relevance"
                        + "\" target=\"_blank\">"
                        + vsmpDom[i]["Publisher"]
                        + "</a></td>";

                    var colPriceLower = vsmpDom[i]["Price"].toLowerCase();
                    var colPrice = "<td>"
                        + colPriceLower.charAt(0).toUpperCase()
                        + colPriceLower.slice(1)
                        + "</td>";

                    var colAverageReview = "<td class='numeric'>" + vsmpDom[i]["AverageReview"] + "</td>";//gregt to be trimmed

                    $("#DetailGridTableBody").append(
                        rowOpen +
                        colInstallCount +
                        colItemTitle +
                        colReviewCount +
                        colReviewsAsPercentageOfInstalls +
                        colPublisher +
                        colPrice +
                        colAverageReview +
                        rowClose);
                }

                var totalExtensionsCount = vsmpDom.length;
                var totalReviewsAsPercentageOfTotalInstalls = (totalReviewCount / totalInstallCount) * 100;//gregt divide by zero ! //gregt dedupe
                var overallAverageReview = (numericAverageReviewSum / totalExtensionsCount);//gregt divide by zero ! //gregt dedupe
                var totalOverallAverageReview = overallAverageReview.toFixed(2).toLocaleString();

                document.getElementById('TotalExtensionsCount').innerHTML = totalExtensionsCount.toLocaleString() + " extensions";
                document.getElementById('TotalInstallCount').innerHTML = totalInstallCount.toLocaleString() + " installs";
                document.getElementById('TotalReviewCount').innerHTML = totalReviewCount.toLocaleString() + " reviews";
                if (totalReviewsAsPercentageOfTotalInstalls > 0) {
                    document.getElementById('TotalReviewCount').innerHTML += " ("
                    + totalReviewsAsPercentageOfTotalInstalls.toFixed(3).toLocaleString()
                    + "% of installs)";
                };
                document.getElementById('TotalReviewCount').title = totalReviewCount + " divided by " + totalInstallCount;
                if (totalReviewCount > 0) {
                    document.getElementById('TotalOverallAverageReview').removeAttribute("hidden");
                    document.getElementById('TotalOverallAverageReview').innerHTML = totalOverallAverageReview + " average review score";
                };
                document.getElementById('FooterGridTotalInstallCount').innerHTML = totalInstallCount.toLocaleString();
                document.getElementById('FooterGridTotalReviewCount').innerHTML = totalReviewCount.toLocaleString();
                document.getElementById('FooterReviewsAsPercentageOfInstalls').innerHTML = totalReviewsAsPercentageOfTotalInstalls.toFixed(2).toLocaleString();
                document.getElementById('FooterOverallAverageReview').innerHTML = totalOverallAverageReview;
            }

            //Enable table sorting
            $(document).ready(function () {
                $("#DetailGridTable").tablesorter();
            });
        }
    }

    $('#CopyToClipboard').click(function (e) {
        selectElementContents(document.getElementById('ClipboardBuffer'));
    });

    function selectElementContents(element) {

        var body = document.body, range, sel;

        if (document.createRange && window.getSelection) {
            range = document.createRange();
            sel = window.getSelection();
            sel.removeAllRanges();
            try {
                range.selectNodeContents(element);
                sel.addRange(range);
            } catch (e) {
                range.selectNode(element);
                sel.addRange(range);
            }
        } else {
            if (body.createTextRange) {
                range = body.createTextRange();
                range.moveToElementText(element);
                range.select();
            }
        }

        document.execCommand('copy');

        document.getSelection().removeAllRanges();
    }
});
