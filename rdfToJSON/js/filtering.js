function enableFilter() {
    if (document.getElementById('enable').checked) {
        document.getElementById('Company').checked = false;
        document.getElementById('Factory').checked = false;
        document.getElementById('Building').checked = false;
        document.getElementById('Others').checked = false;
        document.getElementById('Company').disabled= false;
        document.getElementById('Factory').disabled = false;
        document.getElementById('Building').disabled = false;
        document.getElementById('Others').disabled = false;

        // remove all and show selected items on the map
        removeAllElementsFromMap();

    } else {
        document.getElementById('Company').checked = false;
        document.getElementById('Factory').checked = false;
        document.getElementById('Building').checked = false;
        document.getElementById('Others').checked = false;
        document.getElementById('Company').disabled= true;
        document.getElementById('Factory').disabled = true;
        document.getElementById('Building').disabled = true;
        document.getElementById('Others').disabled = true;

        // show all the elements on the map
        showAllElementsOnMap();
    }
}