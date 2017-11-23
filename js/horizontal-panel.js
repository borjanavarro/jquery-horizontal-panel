/*
* An horizontal scroll panel plugin for jQuery
* by Borja Navarro
*
* MIT License
*
* Copyright (c) 2016 Borja Navarro
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*
*/
(function ( $ ) {

  var settings = {};
  var defaults = {
    duration: 10000,
    padding: 0,
    marquee_class: '.marquee',
    content_class: '.content',
    fixed_class: 0,
    hover: true,
    focus: true,
    stop: false
  };
/*
* Create the marquee and start it
*/
$.fn.hpanel = function( options ) {

  var id = this[0].id;

  settings[id] = [];
  settings[id] = $.extend( {}, defaults, options );

  if ( checkErrors( this, id )){ return; }
  initSettings( id );

  var newElem = newElement ( id );
  elementPush ( newElem, id );
  settings[id].current += 1;

  manager( newElem, id );
};
/*
* Switchs off the marquee
*/
$.fn.switchOff = function () {
  var id = this[0].id;
  settings[id].stop = true;
};
/*
* Pauses the marquee
*/
$.fn.pause = function () {
  var id = this[0].id;
  pause( id );
};
/*
* Resumes the marquee
*/
$.fn.resume = function () {
  var id = this[0].id;
  resume( id );
};
/*
* Pauses the marquee
*/
function pause ( id ) {
  var elems = getAllElements( id );
  elems.queue();
  elems.stop();
};
/*
* Resumes the marquee
*/
function resume ( id ) {
  var elems = getAllElements( id );
  elems.each( function(index, el) {
    manager( $(el), id );
  });
};
/*
* Checks for errors before start
*/
function checkErrors( obj, id ){

  try {
    if ( obj[0] === undefined || obj.length === 0 || obj.length > 1 ) {
      throw new Error ('FATAL: Selected element must be a single element');
    } else {
      // Getting JQuery selector
      settings[id].container_class = '#' + obj[0].id + '.' + obj[0].className;
    }
    if ( !(typeof (obj[0].id) != undefined || isset(obj[0].className != undefined ))){
      throw new Error ('FATAL: Selected element must have a class or id');
    }
    if( $(settings[id].container_class + ' ' + settings[id].marquee_class).length !== 1 ){
      throw new Error ('FATAL: marquee class empty or not valid');
    }
    if( $(settings[id].container_class + ' ' + settings[id].content_class).length !== 1 ){
      throw new Error ('FATAL: marquee content class empty or not valid');
    }
    if ( settings[id].fixed_class != 0 ){
      if( !($(settings[id].container_class + ' ' + settings[id].fixed_class).length === 1 )){
        throw new Error ('FATAL: sibling class container empty or class not valid');
      }
    }
  } catch (e) {
    console.error(e.message);
    return true;
  }
  return false;
};
/*
* Initializes all settings
*/
function initSettings ( id ) {

  // Setting classes
  settings[id].marquee_class = settings[id].container_class + ' ' + settings[id].marquee_class;
  settings[id].content_class = settings[id].container_class + ' ' + settings[id].content_class;

  // Getting elements width
  settings[id].containerWidth = $(settings[id].container_class).width();

  // Getting content
  settings[id].elements = {};
  settings[id].elements.item = [];
  settings[id].elements.num = $(settings[id].content_class + ' li').length;
  var items = $(settings[id].content_class + ' li').get();
  var maxWidth = 0;
  $(items).each( function( index, item ) {
    var content = $(item).html();
    var width = $(item).width();
    maxWidth = ( maxWidth < width ) ? width : maxWidth;
    settings[id].elements.item.push( {'content' : content, 'width' : width } );
  });
  settings[id].current = 1;
  settings[id].endPoint = - maxWidth - settings[id].padding;
  $(settings[id].content_class + ' li').remove();

  // Calculating velocity
  settings[id].velocity = (( settings[id].containerWidth + Math.abs( settings[id].endPoint )) / settings[id].duration ) * 5;

  // Fixed content stuff
  settings[id].fixed_class = settings[id].container_class + ' ' + settings[id].fixed_class;

  // Pause mode set up
  if ( settings[id].hover ){ mouseSetUp( id ); };
  if ( settings[id].focus ){ focusSetUp( id ); };
};
/*
* Creates a new element
*/
function newElement( id ) {

  var content = settings[id].elements.item[settings[id].current - 1].content;
  var newElem = $('<li class="marquee-item">' + content + '</li>');
  var startPos = settings[id].containerWidth;
  newElem.css( 'left', startPos + 'px' );

  return newElem;
};
/*
* Sets the focus configuration
*/
function focusSetUp ( id ) {

  var elem = $( window );

  elem.focusout( function(){
    pause( id );
  });
  elem.focusin( function (){
    resume( id );
  });
};
/*
* Sets the mouse configuration
*/
function mouseSetUp ( id ) {

  $( settings[id].container_class ).hover( function() {
    pause( id );
  }, function (){
    resume( id );
  });
};

function elementPush( elem, id ){
  $(settings[id].content_class).append(elem);
};

function destroyElement( elem ){
  $(elem).remove();
};

function getFirstElement( id ){
  return $(settings[id].marquee_class + ' li:first-child');
};

function getLastElement( id ){
  return $(settings[id].marquee_class + ' li:last-child');
};

function getAllElements( id ){
  return $(settings[id].marquee_class + ' li');
};
/*
* Animate function
*/
function manager( elem, id ) {

  var pos = parseInt( $(elem).css('left').replace(/[^-\d\.]/g, '') ) + parseInt( Math.abs ( settings[id].endPoint ));
  var duration = pos / settings[id].velocity;

  elem.animate(
    { 'left' : settings[id].endPoint + 'px' },
    duration,
    'linear',
    function () {
      destroyElement ( $(elem) );
    }
  );
  if ( !settings[id].stop ) {
      checkTime( id );
  }
};
/*
* Inserts another element when the previous have gone out completely
*/
function checkTime( id ) {

  setTimeout ( function(){
    var elem = getLastElement( id );
    var pos = parseInt( elem.css('left')) + parseInt ( elem.width() );

    if ( pos < settings[id].containerWidth ) {
      var newElem = newElement( id );
      elementPush( newElem, id );
      manager( newElem, id );
      settings[id].current = ( settings[id].current >= settings[id].elements.num ) ? 1 : settings[id].current + 1;
    } else {
      checkTime( id );
    }
  }, 100);
};
}( jQuery ));
