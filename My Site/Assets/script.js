jQuery(function(){
    $(".content h2").after("<br>"); 
});

// for personal fasting code (code does not handle overlapping days (ex: cannot specify hours from 23:00 to 03:00))
const fastingConfig = {
  statusColors: {
    green: '#7CFC00',
    yellow: '#FFD700',
    red: '#CD5C5C',
  },
  colorSwitch: {      // outside green or yellow periods the default period is red
    greenPeriodBetweenHours: [[13, 17]],
    yellowPeriodBetweenHours: [[11, 13], [17, 19]],
  }
}
const displayedMessage = "[Flow]"

function getPeriodColor() {
  const currentHour = new Date().getHours();

  for (let periodColor in fastingConfig.colorSwitch) {
    for (let period of fastingConfig.colorSwitch[periodColor]) {
      if (currentHour >= period[0] && currentHour < period[1]) {
        if (periodColor === 'greenPeriodBetweenHours') {
          return fastingConfig.statusColors.green
        } else {
          return fastingConfig.statusColors.yellow
        }
      }
    }
  }

  return fastingConfig.statusColors.red
}

$(document).ready(function(){
  const fastingPeriodIndicator = document.createElement('div');
  fastingPeriodIndicator.style.display = 'inline-block';
  fastingPeriodIndicator.style.backgroundColor = getPeriodColor()
  fastingPeriodIndicator.style.padding = '15px';
  fastingPeriodIndicator.style.margin = '0 5px';
  fastingPeriodIndicator.style.border = '#666666 solid 2px';
  fastingPeriodIndicator.style.borderRadius = '30px';
  fastingPeriodIndicator.style.verticalAlign = 'bottom';

  const fixedContainer = document.createElement('div');
  fixedContainer.innerHTML = displayedMessage;
  fixedContainer.style.padding = '0 0 1px 3px';
  fixedContainer.style.backgroundColor = 'darkgray';
  fixedContainer.style.fontSize = '20px';
  fixedContainer.style.position = 'fixed';
  fixedContainer.style.top = '0';
  fixedContainer.style.right = '0';
  fixedContainer.appendChild(fastingPeriodIndicator);
  

  document.body.appendChild(fixedContainer);
});