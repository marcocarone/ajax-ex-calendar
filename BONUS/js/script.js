$(document).ready(function() {
  //traduco momentjs in italiano
  moment.locale("it")
  var mese = 1;
  chiamataAjax(mese)
  $('.fa-chevron-left').hide();

  // click su mese successivo
  $('#successivo').on('click', function() {
    mese += 1;
    $('.fa-chevron-left').show();
    if (mese > 12) {
      $('.fa-chevron-right').hide();
    }  else {
      $('.giorni-mese').text('');
      chiamataAjax(mese)
    }
    if (mese == 12) {
      $('.fa-chevron-right').hide();
    }
  });

  // click su mese precedente
  $('#precedente').on('click', function() {
    mese -= 1;
    $('.fa-chevron-right').show();
    if (mese < 1) {
      $('.fa-chevron-left').hide();
    } else {
      $('.giorni-mese').text('');
      chiamataAjax(mese)
    }
    if (mese == 1) {
      $('.fa-chevron-left').hide();

    }
  });
});

// FUNZIONI DELLO SCRIPT
function AggiungiZero(day) {
  if (day < 10) {
    return '0' + day
  }
  return day;
}

function chiamataAjax(mese) {
  // stabilisco la data iniziale nel formato anno-mese
  var dataIniziale = moment("2018-" + AggiungiZero(mese), "YYYY-MM");
  //creo una variabile che contiene il mese e l'anno da inserire nel container__top
  var meseAnno = dataIniziale.format("MMMM YYYY");
  $('.mese_anno').text(meseAnno);
  // creo la var giorni che mi servirà, tramite un ciclo for per stabilire i giorni di ogni mese
  var giorni = dataIniziale.daysInMonth();
  // con il ciclo for e l'utilizzo di handlebars vado a popolare il container con i giorni esatti di ogni mese
  for (var i = 1; i <= giorni; i++) {
    var giorno = AggiungiZero(i);
    var source = $("#entry-template").html();
    var template = Handlebars.compile(source);
    var context = {
      "giorno": giorno,
      "numeroGiorno": dataIniziale.format('YYYY-MM-') + AggiungiZero(i),
    };
    var html = template(context);
    $(".giorni-mese").append(html);
  }
  // creo la var del link per la chiamata API - per ricercare il mese esatto in automatico aggiungo al link la var mese - 1, in quanto l'anno, cioè gennaio parte dal numero 0
  var url = 'https://flynn.boolean.careers/exercises/api/holidays?year=2018&month=' + (mese - 1);

  $.ajax({
    url: url,
    method: 'GET',
    success: function(data) {
      var festivita = data.response;
      // faccio un ciclo per ogni elemento - giorno del mese- utilizzando each
      $('.caselle').each(function() {
        var dataGiornoMese = $(this).attr('data-giorno');
        //con un ciclo for vado a vedere se la data indicata negli oggetti dell API è uguale a quella presente nei data-giorno del mese, se si aggiungo una classe per cambiare colore e infine aggiungo il nome della festività
        for (var i = 0; i < festivita.length; i++) {
          if (festivita[i].date == dataGiornoMese) {
            $(this).addClass('caselle__festivita');
            $(this).children().append(" " + festivita[i].name);
          }
        }
      });
    },
    error: function(richiesta, stato, errori) {
      console.log(errori);
    }
  });
}
