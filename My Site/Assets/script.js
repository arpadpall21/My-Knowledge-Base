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
  fastingPeriodIndicator.style.position = 'fixed';
  fastingPeriodIndicator.style.top = '5px';
  fastingPeriodIndicator.style.right = '5px';
  fastingPeriodIndicator.style.backgroundColor = getPeriodColor()
  fastingPeriodIndicator.style.padding = '15px';
  fastingPeriodIndicator.style.border = '#666666 solid 2px';
  fastingPeriodIndicator.style.borderRadius = '30px';

  document.body.appendChild(fastingPeriodIndicator);
});