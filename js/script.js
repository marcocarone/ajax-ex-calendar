// Creare un calendario dinamico con le festività. Partiamo dal gennaio 2018 dando la possibilità di cambiare mese, gestendo il caso in cui l’API non possa ritornare festività. Il calendario partirà da gennaio 2018 e si concluderà a dicembre 2018 (unici dati disponibili sull’API).
//
// Ogni volta che cambio mese dovrò:
// 1.	Controllare se il mese è valido (per ovviare al problema che l’API non carichi holiday non del 2018)
// 2.	Controllare quanti giorni ha il mese scelto formando così una lista
// 3.	Chiedere all’api quali sono le festività per il mese scelto
// 4.	Evidenziare le festività nella lista
$(document).ready(function() {

  var dataIniziale = moment("2018-01-01", "YYYY-MM-DD");
  // console.log(dataIniziale);
  var meseAnno = dataIniziale.format("MMMM YYYY");
  // console.log(meseAnno);
  var giorni = dataIniziale.daysInMonth();
  // console.log(giorni);

  $('.mese_anno').text(meseAnno);

  for (var i = 1; i <= giorni; i++) {
    var giorno = AggiungiZero(i);
    // console.log(giorno);
    var source = $("#entry-template").html();
    var template = Handlebars.compile(source);
    var context = {
      "giorno": giorno,
      "numeroGiorno": dataIniziale.format('YYYY-MM-') + AggiungiZero(i),
    };
    var html = template(context);
    $(".giorni-mese").append(html);
  }

  chiamataAjax()

});


function AggiungiZero(day) {
  if (day < 10) {
    return '0' + day
  }
  return day;
}


function chiamataAjax() {
  $.ajax({
    url: 'https://flynn.boolean.careers/exercises/api/holidays',
    method: 'GET',
    data: {
      year: 2018,
      month: 0
    },
    success: function(data) {

      var festivita = data.response;
      console.log(festivita);

      $('.giorni-mese li').each(function() {
        var data_giornoMese = $(this).attr('data-giorno');
        console.log("giorno mese " + data_giornoMese);

        for (var i = 0; i < festivita.length; i++) {
          if (festivita[i].date == data_giornoMese) {
            $(this).addClass('red');
            $(this).append(" " + festivita[i].name);
          }
        }
      });
    },
    error: function(richiesta, stato, errori) {
      console.log(errori);
    }
  });
}
