$(document).ready(function() {
  moment.locale("it")
  var mese = 1;
  chiamataAjax(mese)


  $('#successivo').on('click', function() {
    mese += 1;
    if (mese > 12) {
      alert('Il calendario del 2019 non è disponibile!');
    } else {
      $('.giorni-mese').text('');
      chiamataAjax(mese)
    }
  });

  $('#precedente').on('click', function() {
    mese -= 1;
    if (mese < 1) {
      alert('Il calendario del 2017 non è disponibile!');
    } else {
      $('.giorni-mese').text('');
      chiamataAjax(mese)
    }
  });
});


function AggiungiZero(day) {
  if (day < 10) {
    return '0' + day
  }
  return day;
}


function chiamataAjax(mese) {

  var dataIniziale = moment("2018-" + mese, "YYYY-MM");
  console.log("data iniziale :" + dataIniziale);
  // console.log(dataIniziale);
  var meseAnno = dataIniziale.format("MMMM YYYY");
  // console.log(meseAnno);
  $('.mese_anno').text(meseAnno);

  var giorni = dataIniziale.daysInMonth();
  console.log(giorni);

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

  var url = 'https://flynn.boolean.careers/exercises/api/holidays?year=2018&month=' + (mese - 1);

  $.ajax({
    url: url,
    method: 'GET',
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
