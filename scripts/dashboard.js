// let dash = false;
//
// const moveMapUp = () => {
//   let delta = window.innerHeight
//   // $('.settings').css({'top': -delta + parseInt($('.settings').css('top')), 'transition':'1s'})
//   $('.heading').css({'top': -delta + parseInt($('.heading').css('top')), 'transition':'1s'})
//   $('#wrapper').css({'top': -delta + parseInt($('#wrapper').css('top')), 'transition':'1s'})
//   $('#wrapper-2').css({'top': -delta + parseInt($('#wrapper-2').css('top')), 'transition':'1s'})
// }
//
// const moveMapDown = () => {
//   let delta = window.innerHeight
//   // $('.settings').css({'top': delta + parseInt($('.settings').css('top')), 'transition':'1s'})
//   $('.heading').css({'top': delta + parseInt($('.heading').css('top')), 'transition':'1s'})
//   $('#wrapper').css({'top': delta + parseInt($('#wrapper').css('top')), 'transition':'1s'})
//   $('#wrapper-2').css({'top': delta + parseInt($('#wrapper-2').css('top')), 'transition':'1s'})
// }
//
// const toggleDashMap = () => {
//   if (dash) {
//     $('#links-number').attr("disabled", false);
//     // $('#capitals-checkbox').attr("disabled", false);
//     $('#links-checkbox').attr("disabled", false);
//     moveMapDown()
//   } else {
//     $('#dash-map-button').text('Switch to Map View')
//     $('#dash-map-button').text('Switch to Dashboard')
//     $('#links-number').attr("disabled", true);
//     // $('#capitals-checkbox').attr("disabled", true);
//     $('#links-checkbox').attr("disabled", true);
//     moveMapUp()
//   }
//   dash = !dash
// }
//
// const initialzeDashboard = () => {
//   $('#wrapper-2').css({'top': window.innerHeight + parseInt($('#wrapper').css('top'))})
// }
