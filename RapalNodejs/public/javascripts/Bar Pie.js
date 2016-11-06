window.onload = function () {

    // Canvas gets same width as window
    resizeCanvas();

    // JSON loader
    var xmlhttp = new XMLHttpRequest();
    var url = "http://dev.hel.fi/stats/resources/aluesarjat_hginseutu_va_vr01_vakiluku_ika/jsonstat";

    // error handling
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            initCharts(xmlhttp.responseText);
            updateBar(xmlhttp.responseText);
            updatePie(xmlhttp.responseText);
        }
    }
    xmlhttp.open("GET", url, true);
    xmlhttp.send();

    function initCharts(response) {

        // array for charts
        var arr = JSON.parse(response);

        // gets title from json-file
        document.getElementById("header").innerHTML = "<h1>" + arr.dataset.label + "</h1>";

        var url;
        var tempVuosiKatekoriaValikko = "";
        var vuosiKatekoriaIndeksi = JSON.stringify(arr.dataset.dimension.size[1]);

        for (i = 0; i < vuosiKatekoriaIndeksi; i++) {
            url = window.location.href.split('?')[0];
            url += '?myParam=' + i; // add parameter of year

            tempVuosiKatekoriaValikko += '<a href="' + url + '">' + arr.dataset.dimension.vuosi.category.index[i] + '</a> ';
        }

        // list of links for years
        document.getElementById("refsVuosi").innerHTML = tempVuosiKatekoriaValikko;
    }
};

function updateBar(response) {

    var arr = JSON.parse(response);

    var TempKaupungit = [];
    for (i = 0; i < arr.dataset.dimension.alue.category.index.length; i++) {
        TempKaupungit.push(arr.dataset.dimension.alue.category.label[arr.dataset.dimension.alue.category.index[i]]);
    }

    var alueVali = arr.dataset.dimension.size[1] * arr.dataset.dimension.size[2] * arr.dataset.dimension.size[3];
    var vuosiVuodesta1976 = (parseInt(document.getElementById("omaTieto").innerHTML) || 0);
    var sukupuoletJaikaryhmat=arr.dataset.dimension.size[2] * arr.dataset.dimension.size[3];

    var TempKaupunginAsukasluku = [];
    for (i = 0; i < TempKaupungit.length; i++) {
        TempKaupunginAsukasluku.push(parseInt(arr.dataset.value[i * alueVali + vuosiVuodesta1976 * sukupuoletJaikaryhmat]));
    }

    // fork population and towns for sort
    var kaupunki = []
    for (var i = 0; i < TempKaupungit.length; i++) {
        kaupunki[i] = {};
        kaupunki[i]["asukasluku"] = TempKaupunginAsukasluku[i];
        kaupunki[i]["nimi"] = TempKaupungit[i];
    }
    
    // sort towns by population
    kaupunki.sort(function (a, b) {
        return a.asukasluku - b.asukasluku;
    });

    // merge population and town
    for (var i = 0; i < TempKaupungit.length; i++) {
        TempKaupunginAsukasluku[i] = kaupunki[i]["asukasluku"];
        TempKaupungit[i] = kaupunki[i]["nimi"];
    }

    // create a bar diagram
    var bar = new RGraph.Bar({

        id: 'cvs',
        data: TempKaupunginAsukasluku,
        options: {
            gutterTop: 15,
            gutterLeft: 35,
            gutterRight: 15,
            backgroundGridVlines: false,
            backgroundGridBorder: false,
            colors: ['Gradient(white:#f11:#f11)'],
            tooltips: TempKaupungit,
            highlightStroke: 'rgba(0,0,0,0.1)',
            strokestyle: 'rgba(0,0,0,0)',
            shadowOffsetx: -2,
            shadowOffsety: -2,
            shadowBlur: 15,
            ymax: 6000000,
            noyaxis: true,
            ylabels: false,
            labels: TempKaupungit,
            labelsAbove: true,
            linewidth: 2,
            hmargin: 15
        }
    }).draw();
}

function updatePie(response) {

    var arr = JSON.parse(response);
    
    var kaikkiValuet = arr.dataset.value.length;
    var ensimmainenSuomenVakiluku = kaikkiValuet - arr.dataset.dimension.size[1] *
            arr.dataset.dimension.size[2] * arr.dataset.dimension.size[3];

    var vuosiVuodesta1976 = (parseInt(document.getElementById("omaTieto").innerHTML) || 0);
    var ikaryhmia = arr.dataset.dimension.size[3];
    var sukupuolia = 3;

    var molempia = parseInt(arr.dataset.value[ensimmainenSuomenVakiluku + ikaryhmia * sukupuolia * vuosiVuodesta1976]);
    var miehia = parseInt(arr.dataset.value[ensimmainenSuomenVakiluku + ikaryhmia + ikaryhmia * sukupuolia * vuosiVuodesta1976]);
    var naisia = parseInt(arr.dataset.value[ensimmainenSuomenVakiluku + ikaryhmia * 2 + ikaryhmia * sukupuolia * vuosiVuodesta1976]);

    var pie = new RGraph.Pie({
        id: 'cvs',
        data: [miehia, naisia],
        options: {
            exploded: [7, 2, ],
            labels: [miehia, naisia],
            labelsSticks: [true],
            labelsSticksColor: 'black',
            centerx: 180,
            centery: 135,
            radius: 90,
            shadowBlur: 5,
            shadowOffsetx: 2,
            shadowOffsety: 2,
            shadowColor: '#aaa',
            colors: ['Gradient(white:#1cc:#1cc:#1cc)', 'Gradient(white:#c11:#c11:#c11)', 'Gradient(white:#cf1:#c11:#cf1)'],
            tooltips: ['Miehiä: '+miehia, 'Naisia: '+naisia],
            tooltipsEvent: 'mousemove',
            strokestyle: 'rgba(0,0,0,0)'
        }
    }).draw();
}

function resizeCanvas() {

    var canvas = document.getElementById("cvs");
    var ctx = canvas.getContext("2d");

    var img = new Image();
    img.onload = function () {
        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
    }
}