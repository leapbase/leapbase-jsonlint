$().ready(function() {
  setup();
});

function setup() {
  console.log('in jsonlint index');
  $('.btn-convert').click(onConvert);
}

function onConvert() {
  console.log('in convert button click');
  var inputText = $('#inputTextarea').val();
  var jsonlintConvertUrl = '/jsonlint/convert';
  $.post(jsonlintConvertUrl, { input:inputText }, function(data) {
    console.log('jsonlint convert result:', data);
    if (data.error) {
      $('#outputTextarea').val('');
      $('#errorTextarea').val(data.error);
      $('#nav-error-tab').tab('show');
    } else {
      $('#outputTextarea').val(JSON.stringify(data.result, null, 4));
      $('#errorTextarea').val('');
      $('#nav-output-tab').tab('show');
    }
  });
}