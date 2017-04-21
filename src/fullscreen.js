/* ========================================================================
 * Copyright 2016 Mälardalskartan
 * Licensed under BSD 2-Clause (https://github.com/malardalskartan/mdk/blob/master/LICENSE.txt)
 * ======================================================================== */
"use strict";

var $ = require('jquery');
var utils = require('./utils');
var permalink = require('./permalink/permalink');
var isEmbedded = require('./utils/isembedded');
var viewer = require('./viewer');

var tooltip;
var mapTarget;

function Init(opt_options) {
  var options = opt_options || {};
  var target = options.target || '#o-toolbar-navigation';
  mapTarget = viewer.getTarget();
  tooltip = options.tooltipText || 'Visa stor karta';

  render(target);
  bindUIActions();
}

function render(target) {
  var el = utils.createButton({
    id: 'o-fullscreen-button',
    cls: 'o-fullscreen-button',
    iconCls: 'o-icon-fa-expand',
    src: 'css/svg/fa-icons.svg#fa-expand',
    tooltipText: tooltip,
    tooltipPlacement: 'east'
  });
  if (isEmbedded(mapTarget)) {
    $(target).append(el);
  }
}

function bindUIActions() {
  $('#o-fullscreen-button button').click(function(e) {
    goFullScreen();
    $('#o-fullscreen-button button').blur();
    e.preventDefault();
  })
}

function goFullScreen() {
  var url = permalink.getPermalink();
  window.open(url);
}

module.exports.init = Init;
